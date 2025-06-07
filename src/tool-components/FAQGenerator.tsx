import React, { useState } from 'react';
import { options } from "../tool-config/tone-options";
import BasicInput from "./BasicInput";
import BasicSelect from "./BasicSelect";
import BasicTextArea from "./BasicTextArea";
import Button from "./Button";
import { Sparkles, Link, FileText, Zap, LogIn } from 'lucide-react';
import TagsInput from "./TagsInput";
import FileUpload from "./FileUpload";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { supabase } from 'supabase/supabase';
import LoginModal from '@/components/LoginModal';
import { Dialog } from '@mui/material';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQGeneratorProps {
  onFaqsGenerated?: (faqs: FaqItem[]) => void;
}

function FAQGenerator({ onFaqsGenerated }: FAQGeneratorProps) {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'url' | 'file'>('url');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { creditsData, hasCredits, useCredit, isLoading: creditsLoading } = useCredits();

  const handleFileContentExtracted = (content: string, name: string) => {
    setFileContent(content);
    setFileName(name);
    toast({
      title: "Fichier traité",
      description: `Le contenu de "${name}" a été extrait avec succès`,
    });
  };

  const saveFaqToHistory = async (faqs: FaqItem[]) => {
    if (!user) {
      console.log('User not authenticated, skipping history save');
      return null;
    }

    try {
      let title = '';
      if (faqs.length > 0) {
        title = faqs[0].question.substring(0, 50) + (faqs[0].question.length > 50 ? '...' : '');
      } else if (fileName) {
        title = `FAQ pour ${fileName}`;
      } else if (url) {
        title = `FAQ pour ${url}`;
      } else if (description) {
        title = description.substring(0, 50) + (description.length > 50 ? '...' : '');
      } else {
        title = `FAQ générée le ${new Date().toLocaleDateString()}`;
      }

      const faqsJson = JSON.parse(JSON.stringify(faqs));

      // Prepare source data based on active tab
      const sourceData = {
        type: activeTab,
        url: activeTab === 'url' ? url : null,
        fileName: activeTab === 'file' ? fileName : null,
        fileContent: activeTab === 'file' ? fileContent : null,
        description,
        tone,
        keywords
      };

      const { data, error } = await supabase
        .from('faq_history')
        .insert({
          user_id: user.id,
          title,
          faqs: faqsJson,
          source_data: sourceData
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving FAQ to history:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder dans l'historique",
          variant: "destructive",
        });
        return null;
      } else {
        console.log('FAQ saved to history successfully');

        const currentHistory = user.user_metadata?.history || [];
        const updatedHistory = [...currentHistory, data.id];

        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            history: updatedHistory
          }
        });

        if (updateError) {
          console.error('Error updating user metadata:', updateError);
        } else {
          console.log('User metadata updated with new FAQ ID');
        }

        return data.id;
      }
    } catch (error) {
      console.error('Error saving FAQ to history:', error);
      return null;
    }
  };

  const generateFAQsWithFirebaseFunction = async () => {
    // Check if user has credits
    if (!hasCredits) {
      toast({
        title: "Crédits insuffisants",
        description: `Vous avez atteint votre limite quotidienne de ${creditsData?.daily_limit || 0} FAQs. ${
          creditsData?.daily_limit === 5 
            ? "Abonnez-vous pour obtenir 20 FAQs par jour." 
            : "Vos crédits se renouvellent demain."
        }`,
        variant: "destructive",
      });
      return;
    }

    if (activeTab === 'file' && !fileContent) {
      toast({
        title: "Fichier requis",
        description: "Veuillez sélectionner un fichier à analyser",
        variant: "destructive",
      });
      return;
    }

    if (activeTab === 'url' && !url && !description) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez entrer une URL ou une description",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use a credit before generating
      const creditUsed = await useCredit();
      if (!creditUsed) {
        toast({
          title: "Erreur de crédit",
          description: "Impossible d'utiliser un crédit. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        url,
        description,
        tone,
        keywords,
        fileContent,
        fileName,
      };

      const response = await fetch('https://us-central1-precise-truck-461210-m2.cloudfunctions.net/generateFaq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur API: ${response.status}`);
      }

      const data = await response.json();
      const faqs = data.faqs || [];

      const savedId = await saveFaqToHistory(faqs);

      if (onFaqsGenerated) {
        onFaqsGenerated(faqs);
      }

      const creditsRemaining = creditsData ? creditsData.credits_remaining - 1 : 0;

      toast({
        title: "FAQ générée avec succès",
        description: `${faqs.length} questions-réponses ont été créées. Crédits restants: ${creditsRemaining}`,
        variant: "success",
      });

    } catch (error: any) {
      toast({
        title: "Erreur lors de la génération",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if(!user){
        setIsLoginModalOpen(true);
        return;
      }
      await generateFAQsWithFirebaseFunction();
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading if credits are still loading
  if (!creditsData && creditsLoading) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-[50rem] bg-white rounded-md p-8 shadow-md">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-[35rem] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Dialog open={isLoginModalOpen} onClose={()=>setIsLoginModalOpen(false)}>
      <LoginModal title={"Créez votre compte, C'est rapide et gratuit"} Icon={LogIn}/>
    </Dialog>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-[50rem] bg-white rounded-md p-8 shadow-md">
      {/* Credits Display */}
      {creditsData && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-slate-300">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-gray-900">
              Crédits quotidiens: {creditsData.credits_remaining}/{creditsData.daily_limit}
            </span>
          </div>
          {creditsData.credits_remaining === 0 && (
            <p className="text-xs text-gray-600 mt-1">
              {creditsData.daily_limit === 5 
                ? "Limite atteinte. Abonnez-vous pour 20 FAQs/jour." 
                : "Vos crédits se renouvellent demain."}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-6 w-full">
        <div className="w-full flex gap-2">
          <Button
            type="button"
            style={{ width: "100%" }}
            Icon={Link}
            variant={activeTab === 'url' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('url')}
          >
            Depuis une URL
          </Button>
          <Button
            type="button"
            style={{ width: "100%" }}
            Icon={FileText}
            variant={activeTab === 'file' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('file')}
          >
            Depuis un fichier
          </Button>
        </div>

        {activeTab === 'url' ? (
          <BasicInput
            type="text"
            label="URL de votre site"
            helperText="Entrez l'URL du site web pour lequel vous souhaitez créer des FAQ"
            placeholder="https://exemple.com"
            value={url}
            onChange={setUrl}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Fichier à analyser
            </label>
            <FileUpload
              onFileContentExtracted={handleFileContentExtracted}
              disabled={isLoading}
            />
            {fileName && (
              <p className="text-sm text-green-600">
                Fichier "{fileName}" prêt à être analysé
              </p>
            )}
          </div>
        )}

        <BasicTextArea
          label="Description"
          placeholder="Expliquer ce que fait l'entreprise ou le produit"
          value={description}
          onChange={setDescription}
        />

        <BasicSelect
          options={options}
          label="Choix du ton"
          helperText="Choisissez le ton que vous souhaitez donner à votre FAQ"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        />

        <div>
          <TagsInput
            placeholder="Entrez les mots-clés à inclure dans la FAQ"
            tags={keywords}
            onTagsChange={setKeywords}
          />
        </div>
      </div>

      <Button
        Icon={Sparkles}
        type="submit"
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Génération en cours...' : 'Générer un FAQ'}
      </Button>
    </form>
    </>
  );
}

export default FAQGenerator;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/supabase';
import { useToast } from '@/hooks/use-toast';
import FaqSidebar from '../components/FaqSideBar';
import FaqHeader from '@/components/FaqHeader';
import FaqExportActions from '@/components/FaqExportActions';
import FaqContent from '@/components/FaqContent';
import Button from '../tool-components/Button';
import { FileText, Plus, Sparkles, Loader, Copy, Code } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import BasicTextArea from '../tool-components/BasicTextArea';
import FaqCustomization from '@/components/FaqCustomization';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqData {
  id: string;
  title: string;
  faqs: FaqItem[];
  created_at: string;
  user_id: string;
}

const FaqShowcase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [faqData, setFaqData] = useState<FaqData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [questionPrompt, setQuestionPrompt] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [htmlDialogOpen, setHtmlDialogOpen] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const printRef = useRef<HTMLDivElement>(null);
  const [customization, setCustomization] = useState({
    margin: '8px',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    borderColor: '#e5e7eb',
    borderRadius: '8px',
  });

  useEffect(() => {
    if (id) {
      loadFaqData(id);
    }
  }, [id]);

  const loadFaqData = async (faqId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('faq_history')
        .select('*')
        .eq('id', faqId)
        .single();

      if (error) {
        console.error('Error loading FAQ data:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger la FAQ",
          variant: "destructive",
        });
        navigate('/dashboard');
      } else {
        const typedData: FaqData = {
          ...data,
          faqs: data.faqs as unknown as FaqItem[]
        };
        setFaqData(typedData);
      }
    } catch (error) {
      console.error('Error loading FAQ data:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = (faqId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedItems(newExpanded);
  };

  const deleteFaqItem = async (faqItemId: string) => {
    if (!faqData) return;

    try {
      setDeletingId(faqItemId);

      const updatedFaqs = faqData.faqs.filter(faq => faq.id !== faqItemId);
      const updatedFaqData = { ...faqData, faqs: updatedFaqs };

      const { error } = await supabase
        .from('faq_history')
        .update({ faqs: JSON.parse(JSON.stringify(updatedFaqs)) })
        .eq('id', id);

      if (error) {
        console.error('Error deleting FAQ item:', error);
        toast({
          title: "Erreur de suppression",
          description: "Impossible de supprimer la question",
          variant: "destructive",
        });
        return;
      }

      setFaqData(updatedFaqData);
      
      const newExpandedItems = new Set(expandedItems);
      newExpandedItems.delete(faqItemId);
      setExpandedItems(newExpandedItems);

      toast({
        title: "Question supprimée",
        description: "La question a été supprimée avec succès",
      });
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
      toast({
        title: "Erreur lors de la suppression",
        description: "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const generateNewQuestion = async () => {
    if (!questionPrompt.trim()) {
      toast({
        title: "Sujet manquant",
        description: "Veuillez décrire le sujet de la nouvelle question",
        variant: "destructive",
      });
      return;
    }

    if (!faqData) return;

    try {
      setIsAddingQuestion(true);

      const existingContext = faqData.faqs
        .map((faq) => `Q: ${faq.question}\nR: ${faq.answer}`)
        .join('\n\n');

      const prompt = `Vous devez générer UNE nouvelle question-réponse pour cette FAQ existante.

Contexte de la FAQ existante "${faqData.title}":
${existingContext}

Nouvelle question à créer: ${questionPrompt}

Générez une question pertinente et sa réponse détaillée qui s'intègre bien avec le contexte existant. La réponse doit être informative et cohérente avec le ton des autres réponses.

Répondez uniquement avec un JSON valide dans ce format exact:
{
  "question": "Votre question ici",
  "answer": "Votre réponse détaillée ici"
}`;

      const response = await fetch('https://us-central1-precise-truck-461210-m2.cloudfunctions.net/generateNewQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Limite de requêtes atteinte. Veuillez attendre quelques minutes avant de réessayer.');
        }
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();

      if (!data.question || !data.answer) {
        throw new Error("Réponse incomplète de l'IA");
      }

      const newFaqItem: FaqItem = {
        id: `faq-${Date.now()}`,
        question: data.question,
        answer: data.answer,
      };

      const updatedFaqs = [...faqData.faqs, newFaqItem];
      const updatedFaqData = { ...faqData, faqs: updatedFaqs };

      const { error } = await supabase
        .from('faq_history')
        .update({ faqs: JSON.parse(JSON.stringify(updatedFaqs)) })
        .eq('id', id);

      if (error) {
        console.error('Error updating FAQ:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder la nouvelle question",
          variant: "destructive",
        });
        return;
      }

      setFaqData(updatedFaqData);
      setExpandedItems((prev) => new Set([...prev, newFaqItem.id]));
      setQuestionPrompt('');

      toast({
        title: "Question ajoutée avec succès",
        description: "La nouvelle question a été générée et ajoutée à votre FAQ",
      });
    } catch (error) {
      console.error('Error generating new question:', error);
      toast({
        title: "Erreur lors de la génération",
        description: error instanceof Error ? error.message : "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsAddingQuestion(false);
    }
  };

  const copyFaqUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiée",
      description: "L'URL de la FAQ a été copiée dans le presse-papiers",
    });
  };

  const copyFaqText = () => {
    if (!faqData) return;

    const faqText = `${faqData.title}\n\nCréé le ${new Date(faqData.created_at).toLocaleDateString()}\n\n${faqData.faqs.map((faq, index) => `${index + 1}. ${faq.question}\n\n${faq.answer}\n\n`).join('')}`;
    
    navigator.clipboard.writeText(faqText);
    toast({
      title: "FAQ copiée",
      description: "Le contenu de la FAQ a été copié dans le presse-papiers",
    });
  };

  const generateHtmlCode = () => {
    if (!faqData) return '';

    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${faqData.title}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #f9fafb;
        }
        .faq-container {
            margin-bottom: 20px;
        }
        .faq-item { 
            margin: ${customization.margin}; 
            border: 1px solid ${customization.borderColor}; 
            border-radius: ${customization.borderRadius}; 
            background-color: ${customization.backgroundColor};
            color: ${customization.textColor};
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        details {
            margin: 0;
        }
        summary { 
            background-color: ${customization.backgroundColor}dd; 
            color: ${customization.textColor};
            padding: 15px; 
            font-weight: bold; 
            border-bottom: 1px solid ${customization.borderColor};
            cursor: pointer;
            list-style: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        summary::-webkit-details-marker {
            display: none;
        }
        summary::after {
            content: '+';
            font-size: 18px;
            font-weight: bold;
        }
        details[open] summary::after {
            content: '−';
        }
        .answer { 
            padding: 15px; 
            background-color: ${customization.backgroundColor};
            color: ${customization.textColor};
            line-height: 1.6;
            white-space: pre-line;
        }
        h1 { 
            color: #333; 
            text-align: center; 
            margin-bottom: 10px;
        }
        .header-info {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
        }
        summary:hover {
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <h1>${faqData.title}</h1>
    <div class="faq-container">
        ${faqData.faqs.map((faq, index) => `
            <div class="faq-item">
                <details>
                    <summary>${index + 1}. ${faq.question}</summary>
                    <div class="answer">${faq.answer}</div>
                </details>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  };

  const showHtmlCode = () => {
    const code = generateHtmlCode();
    setHtmlCode(code);
    setHtmlDialogOpen(true);
  };

  const copyHtmlCode = () => {
    navigator.clipboard.writeText(htmlCode);
    setHtmlDialogOpen(false);
    toast({
      title: "Code HTML copié",
      description: "Le code HTML a été copié dans le presse-papiers",
    });
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: faqData?.title || 'FAQ',
    onAfterPrint: () => {
      toast({
        title: "Export PDF",
        description: "La FAQ a été exportée en PDF",
      });
    }
  });

  const handleNewFaq = () => {
    navigate('/tool');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <FaqSidebar onNewFaq={handleNewFaq} className="flex-shrink-0" />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <Loader className="animate-spin h-16 w-16 mx-auto mb-4" />
            <p className="text-gray-600 text-xl">Chargement de la FAQ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!faqData) {
    return (
      <div className="flex min-h-screen">
        <FaqSidebar onNewFaq={handleNewFaq} className="flex-shrink-0" />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">FAQ introuvable</h2>
            <p className="text-gray-500 mb-4">Cette FAQ n'existe pas ou a été supprimée.</p>
            <Button onClick={() => navigate('/dashboard')}>
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <FaqSidebar onNewFaq={handleNewFaq} className="flex-shrink-0" />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">
          <FaqHeader 
            title={faqData.title}
            createdAt={faqData.created_at}
            faqCount={faqData.faqs.length}
          />
          
          <FaqExportActions
            faqData={faqData}
            onCopyUrl={copyFaqUrl}
            onCopyText={copyFaqText}
            onExportHTML={showHtmlCode}
            onPrint={handlePrint}
          />

          <FaqContent
            ref={printRef}
            faqs={faqData.faqs}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
            onDeleteFaq={deleteFaqItem}
            deletingId={deletingId}
            title={faqData.title}
            createdAt={faqData.created_at}
            customization={customization}
          />

          <FaqCustomization
            customization={customization}
            onCustomizationChange={setCustomization}
          />

          <div className="mt-8 p-6 bg-white rounded-lg print:hidden shadow-md">
            
            <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="h-8 w-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Ajouter une nouvelle question</h1>
                  </div>
                </div>
            
            <div className="space-y-4">
              <div>
                <BasicTextArea
                  label="Sujet de la nouvelle question"
                  placeholder="Décrivez le sujet de la question à générer"
                  value={questionPrompt}
                  onChange={setQuestionPrompt}
                  rows={3}
                />
              </div>

              <Button
                onClick={generateNewQuestion}
                disabled={isAddingQuestion}
                style={{width:"100%"}}
              >
                {isAddingQuestion ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Générer et ajouter la question
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* HTML Code Dialog */}
          <Dialog
            open={htmlDialogOpen}
            onClose={() => setHtmlDialogOpen(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{
              sx: { height: '80vh' }
            }}
          >
            <DialogTitle>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <Code />
                  <Typography variant="h6">Code HTML de la FAQ</Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <SyntaxHighlighter
                language="html"
                style={tomorrow}
                showLineNumbers
                wrapLines
                customStyle={{
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}
              >
                {htmlCode}
              </SyntaxHighlighter>
            </DialogContent>
            <DialogActions>
              <Button variant='secondary' onClick={() => setHtmlDialogOpen(false)}>
                Fermer
              </Button>
              <Button onClick={copyHtmlCode} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Copy size={16} />
                Copier le code
              </Button>
            </DialogActions>
          </Dialog>

        </div>
      </div>
    </div>
  );
};

export default FaqShowcase;
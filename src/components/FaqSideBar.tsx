import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Trash2, Eye, Lock, History, Star, HistoryIcon, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../tool-components/Button';
import BasicInput from '../tool-components/BasicInput'; 
import { Cancel, CancelOutlined, Close, Dashboard } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from 'supabase/supabase';
import { useToast } from '@/hooks/use-toast';
import LoginModal from './LoginModal';
import { IconButton } from '@mui/material';

interface FaqItem {
  id: string;
  title: string;
  description: string;
  created_at?: string;
}

interface FaqSidebarProps {
  className?: string;
  toggle?: any;
}

const FaqSidebar: React.FC<FaqSidebarProps> = ({
  className = "",
  toggle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentFaqs, setRecentFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      loadUserFaqs();
    }
  }, [user]);

  const loadUserFaqs = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('faq_history')
        .select('id, title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading FAQ history:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger l'historique des FAQs",
          variant: "destructive",
        });
      } else {
        const formattedFaqs = data.map(faq => ({
          id: faq.id,
          title: faq.title,
          description: `Créée le ${new Date(faq.created_at).toLocaleDateString()}`,
          created_at: faq.created_at
        }));
        setRecentFaqs(formattedFaqs);
      }
    } catch (error) {
      console.error('Error loading FAQ history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewFaq = () => {
      navigate("/");
      if(toggle) toggle()
  };

  const handleSelectFaq = (faq: FaqItem) => {
    // Navigate to the FAQ showcase page
    navigate(`/faq/${faq.id}`);
    if(toggle) toggle()
  };

  const handleViewFaq = (e: React.MouseEvent, faq: FaqItem) => {
    e.stopPropagation();
    navigate(`/faq/${faq.id}`);
    if(toggle) toggle()
  };

  const handleDeleteFaq = async (e: React.MouseEvent, faqId: string) => {
    e.stopPropagation();
    
    if (!user) return;

    try {
      const { error } = await supabase
        .from('faq_history')
        .delete()
        .eq('id', faqId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting FAQ:', error);
        toast({
          title: "Erreur de suppression",
          description: "Impossible de supprimer la FAQ",
          variant: "destructive",
        });
      } else {
        setRecentFaqs(prev => prev.filter(faq => faq.id !== faqId));
        
        // Update user metadata to remove the FAQ ID
        const currentHistory = user.user_metadata?.history || [];
        const updatedHistory = currentHistory.filter((id: string) => id !== faqId);
        
        await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            history: updatedHistory
          }
        });

        toast({
          title: "FAQ supprimée",
          description: "La FAQ a été supprimée avec succès",
        });
        if(toggle) toggle()
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  const handleShowAll = () => {
    loadUserFaqs();
  };

    const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
    if(toggle) toggle()
  };


  const handleClearHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('faq_history')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing FAQ history:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'effacer l'historique",
          variant: "destructive",
        });
      } else {
        setRecentFaqs([]);
        
        // Clear history from user metadata
        await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            history: []
          }
        });

        toast({
          title: "Historique effacé",
          description: "L'historique des FAQs a été effacé",
        });
      }
    } catch (error) {
      console.error('Error clearing FAQ history:', error);
    }
  };

  const filteredFaqs = recentFaqs.filter(faq =>
    faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if a FAQ is currently selected based on URL
  const isSelectedFaq = (faqId: string) => {
    return location.pathname === `/faq/${faqId}`;
  };

  // If user is not authenticated, show login encouragement
  if (!user) {
    return (
      <div className={`w-full md:min-w-[25rem] h-full bg-white border-r border-gray-200 flex flex-col py-6 ${className}`}>
        <div className='block lg:hidden flex justify-end'><IconButton onClick={()=>toggle()}><Close fontSize='large'/></IconButton></div>
        {/* Header with New FAQ button - still accessible */}
        <div className="p-4 border-b border-gray-200">
          <Button 
            onClick={handleNewFaq}
            style={{width:"100%"}}
            variant='primary-2'
          >
            <Plus className="h-6 w-6" />
            Nouveau FAQ
          </Button>
        </div>

        {/* Login Encouragement Section */}
        <LoginModal Icon={Lock} title={"Débloquez l'historique"}/>
      </div>
    );
  }

  return (
    <div className={`w-full md:min-w-[25rem] bg-white h-full border-r border-gray-200 flex flex-col md:py-6 ${className}`}>
      <div className='block lg:hidden flex justify-end'><IconButton onClick={()=>toggle()}><Close fontSize='large'/></IconButton></div>
      {user &&<div className="p-4 lg:hidden border-b border-gray-200 flex-row flex gap-2">
      <Link to="/dashboard" style={{width:"100%"}}>
                <Button Icon={Dashboard} variant="primary" style={{width:"100%"}}>
                  <span className='w-max'>Tableau de bord</span>
                </Button>
              </Link>
              <Button 
                onClick={handleSignOut}
                variant="secondary"
                style={{width:"100%"}}
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
      </div>}
      {/* Header with New FAQ button */}
        <div className="p-4 border-b border-gray-200">
          <Button 
            onClick={handleNewFaq}
            style={{width:"100%"}}
            variant='primary-2'
          >
            <Plus className="h-6 w-6" />
            Nouveau FAQ
          </Button>
      </div>

      {/* Search Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Search className="h-4 w-4" />
            HISTORIQUE DE RECHERCHE
          </div>
          
          <div className="relative">
            <BasicInput
              type="text"
              label=''
              placeholder="Rechercher des FAQ"
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
        </div>
      </div>

      {/* Recent FAQs List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              FAQ RÉCENTES ({filteredFaqs.length})
            </span>
            <Button
              onClick={handleShowAll}
              variant='secondary'
              loading={isLoading}
              Icon={HistoryIcon}
            >
              Actualiser
            </Button>
          </div>

          {!recentFaqs.length &&isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Chargement...</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelectedFaq(faq.id) 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectFaq(faq)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm line-clamp-2 leading-relaxed ${
                          isSelectedFaq(faq.id) ? 'text-white' : 'text-gray-900'
                        }`}>
                          {faq.title}
                        </p>
                        <p className={`text-xs mt-1 ${
                          isSelectedFaq(faq.id) ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {faq.description}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='neutral'
                            onClick={(e) => e.stopPropagation()}
                            style={{marginLeft:"1rem", padding:0, marginTop:"0.3rem"}}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={(e) => handleViewFaq(e, faq)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => handleDeleteFaq(e, faq.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && !isLoading && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">
                    {recentFaqs.length === 0 ? "Aucune FAQ dans l'historique" : "Aucune FAQ trouvée"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer with Clear History */}
      {recentFaqs.length > 0 && (
        <div className="p-4 border-t border-gray-200">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                        <Button
                         variant='error'
                         style={{width:"100%"}}
                         Icon={Trash2}
                         onClick={(e) => e.stopPropagation()}
                         >
                         Effacer l'historique
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer l'historique des FAQs ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer l'historique des FAQs ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleClearHistory}
                            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default FaqSidebar;
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
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

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqContentProps {
  faqs: FaqItem[];
  expandedItems: Set<string>;
  onToggleExpanded: (faqId: string) => void;
  onDeleteFaq?: (faqId: string) => void;
  deletingId?: string | null;
  title: string;
  createdAt: string;
  customization?: {
    margin: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    borderRadius: string;
  };
}

const FaqContent = React.forwardRef<HTMLDivElement, FaqContentProps>(
  ({ faqs, expandedItems, onToggleExpanded, onDeleteFaq, deletingId, title, createdAt, customization }, ref) => {
    const defaultCustomization = {
      margin: '0px',
      backgroundColor: '#ffffff',
      textColor: '#111827',
      borderColor: '#e5e7eb',
      borderRadius: '8px',
    };

    const styles = customization || defaultCustomization;

    return (
      <div ref={ref} className="space-y-4">
        {/* Print header (only visible when printing) */}
        <div className="print:block hidden mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">{title}</h1>
          <p className="text-gray-600 text-center">
            Créé le {new Date(createdAt).toLocaleDateString()} • {faqs.length} questions
          </p>
        </div>

        {faqs.map((faq, index) => (
          <div 
            key={faq.id} 
            className="border shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border print:border-gray-300"
            style={{
              marginInline: styles.margin,
              marginBlock: '8px',
              backgroundColor: styles.backgroundColor,
              borderColor: styles.borderColor,
              borderRadius: styles.borderRadius,
              color: styles.textColor,
            }}
          >
            <button
              onClick={() => onToggleExpanded(faq.id)}
              className="w-full cursor-pointer text-left p-6 bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-2 focus:outline-purple-main print:bg-gray-100 print:hover:bg-gray-100"
              style={{
                backgroundColor: `${styles.backgroundColor}dd`,
                color: styles.textColor,
                borderTopLeftRadius: styles.borderRadius,
                borderTopRightRadius: styles.borderRadius,
              }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold pr-4" style={{ color: styles.textColor }}>
                  {index + 1}. {faq.question}
                </h3>
                <div className="flex items-center gap-2 print:hidden">
                  {onDeleteFaq && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                          disabled={deletingId === faq.id}
                        >
                          {deletingId === faq.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cette question ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteFaq(faq.id)}
                            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <div className={`transform transition-transform duration-200 ${expandedItems.has(faq.id) ? 'rotate-180' : ''}`}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: styles.textColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
            
            {(expandedItems.has(faq.id) || true) && (
              <div 
                className={`p-6 border-t print:block ${expandedItems.has(faq.id) ? 'block' : 'hidden print:block'}`}
                style={{
                  backgroundColor: styles.backgroundColor,
                  borderTopColor: styles.borderColor,
                  color: styles.textColor,
                }}
              >
                <p className="leading-relaxed whitespace-pre-line" style={{ color: styles.textColor }}>
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
);

FaqContent.displayName = 'FaqContent';

export default FaqContent;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Copy, Edit, Check, X } from 'lucide-react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqResultProps {
  faqs: FaqItem[];
  onUpdateFaqs: (faqs: FaqItem[]) => void;
}

const FaqResult: React.FC<FaqResultProps> = ({ faqs, onUpdateFaqs }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const { toast } = useToast();

  const handleEdit = (faq: FaqItem) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    
    const updatedFaqs = faqs.map(faq => 
      faq.id === editingId 
        ? { ...faq, question: editQuestion, answer: editAnswer } 
        : faq
    );
    
    onUpdateFaqs(updatedFaqs);
    setEditingId(null);
    
    toast({
      title: "FAQ Updated",
      description: "Your changes have been saved",
      duration: 3000,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updatedFaqs = faqs.filter(faq => faq.id !== id);
    onUpdateFaqs(updatedFaqs);
    
    toast({
      title: "FAQ Deleted",
      description: "The FAQ has been removed",
      duration: 3000,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  const copyAllToClipboard = () => {
    const allText = faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');
    navigator.clipboard.writeText(allText);
    toast({
      title: "All FAQs copied to clipboard",
      duration: 2000,
    });
  };

  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Generated FAQs</h2>
        <Button 
          variant="outline" 
          onClick={copyAllToClipboard}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy All
        </Button>
      </div>
      
      <div className="space-y-6">
        {faqs.map((faq) => (
          <div key={faq.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            {editingId === faq.id ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor={`edit-q-${faq.id}`} className="block text-sm font-medium mb-1">Question</label>
                  <Textarea
                    id={`edit-q-${faq.id}`}
                    value={editQuestion}
                    onChange={(e:any) => setEditQuestion(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor={`edit-a-${faq.id}`} className="block text-sm font-medium mb-1">Answer</label>
                  <Textarea
                    id={`edit-a-${faq.id}`}
                    value={editAnswer}
                    onChange={(e:any) => setEditAnswer(e.target.value)}
                    className="w-full min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-3 w-3" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{faq.question}</h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(`Q: ${faq.question}\nA: ${faq.answer}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(faq)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline" 
          className="text-primary hover:bg-primary/10"
          onClick={copyAllToClipboard}
        >
          Export FAQs
        </Button>
      </div>
    </div>
  );
};

export default FaqResult;
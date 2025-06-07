import React from 'react';
import { Sparkles } from 'lucide-react';

interface FaqHeaderProps {
  title: string;
  createdAt: string;
  faqCount: number;
}

const FaqHeader: React.FC<FaqHeaderProps> = ({ title, createdAt, faqCount }) => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center gap-4 mb-4">
        <Sparkles className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>
      <p className="text-gray-600 mb-6">
        Créé le {new Date(createdAt).toLocaleDateString()} • {faqCount} questions
      </p>
    </div>
  );
};

export default FaqHeader;
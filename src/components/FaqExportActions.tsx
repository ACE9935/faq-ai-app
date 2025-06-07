
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Copy, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FaqData {
  id: string;
  title: string;
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  created_at: string;
  user_id: string;
}

interface FaqExportActionsProps {
  faqData: FaqData;
  onCopyUrl: () => void;
  onCopyText: () => void;
  onExportHTML: () => void;
  onPrint: () => void;
}

const FaqExportActions: React.FC<FaqExportActionsProps> = ({
  onCopyUrl,
  onCopyText,
  onExportHTML,
  onPrint
}) => {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <Button onClick={onCopyUrl} variant="outline" className="cursor-pointer border-slate-200 border-2 bg-slate-100 hover:bg-purple-main/50 hover:text-white">
        <Eye className="h-4 w-4 mr-2" />
        Partager l'URL
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer border-slate-200 border-2 bg-slate-100 hover:bg-purple-main/50 hover:text-white">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48">
          <DropdownMenuItem onClick={onCopyText}>
            <Copy className="h-4 w-4 mr-2" />
            Copier le texte
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportHTML}>
            <FileText className="h-4 w-4 mr-2" />
            Exporter en HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onPrint}>
            <FileText className="h-4 w-4 mr-2" />
            Exporter en PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FaqExportActions;
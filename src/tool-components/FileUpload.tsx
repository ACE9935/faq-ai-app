import React, { useRef, useState } from 'react';
import { Upload, X, FileText, File } from 'lucide-react';
import pdfToText from "react-pdftotext";

interface FileUploadProps {
  onFileContentExtracted: (content: string, fileName: string) => void;
  accept?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileContentExtracted,
  accept = ".txt,.pdf,.doc,.docx",
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const text = await pdfToText(file);
      return text.trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Impossible de lire le fichier PDF');
    }
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    try {
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value.trim();
    } catch (error) {
      console.error('DOCX extraction error:', error);
      throw new Error('Impossible de lire le fichier Word');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      let content = '';

      if (file.type === 'text/plain') {
        content = await file.text();
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        content = await extractTextFromPDF(file);
      } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        content = await extractTextFromDocx(file);
      } else {
        throw new Error("Format de fichier non supporté.");
      }

      if (content.length < 10) {
        throw new Error("Le contenu du fichier semble vide ou illisible.");
      }

      onFileContentExtracted(content, file.name);
      console.log('Extracted content:', content.substring(0, 200) + '...');
    } catch (error) {
      console.error("Erreur lors de l'extraction du fichier:", error);
      alert("Erreur lors de la lecture du fichier. Essayez un fichier texte, PDF ou DOCX valide.");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type === 'text/plain') return <FileText className="h-4 w-4" />;
    if (type === 'application/pdf') return <File className="h-4 w-4" />;
    if (type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) return <File className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isProcessing}
      />

      {!selectedFile ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isProcessing}
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50"
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isProcessing ? 'Traitement du fichier...' : 'Cliquez pour sélectionner un fichier'}
            </p>
            <p className="text-xs text-gray-400">
              Formats supportés: TXT, PDF, DOC, DOCX
            </p>
          </div>
        </button>
      ) : (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2">
            {getFileIcon(selectedFile)}
            <span className="text-sm text-gray-700">{selectedFile.name}</span>
            {isProcessing && <span className="text-xs text-blue-600">Traitement...</span>}
          </div>
          <button
            type="button"
            onClick={removeFile}
            disabled={isProcessing}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
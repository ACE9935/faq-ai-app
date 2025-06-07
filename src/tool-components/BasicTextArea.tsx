
import React from 'react';

interface BasicTextAreaProps {
  label?: string;
  helperText?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

const BasicTextArea: React.FC<BasicTextAreaProps> = ({
  label,
  helperText,
  value,
  onChange,
  placeholder = "Entrez votre texte",
  required = false,
  disabled = false,
  rows = 4,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-start font-semibold">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="border-1 border-grayish placeholder-secondary focus:bg-purple-main/5 rounded-md min-h-[8rem] max-h-[15rem] px-2 py-[0.6rem] focus:outline-2 focus:outline-purple-main outline-0"
      />
      
      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default BasicTextArea;

import React, { useState, KeyboardEvent, useRef } from 'react';

export interface TagsInputProps {
  tags?: string[];
  helperText?: string;
  onTagsChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  disabled?: boolean;
  className?: string;
}

const TagsInput: React.FC<TagsInputProps> = ({
  tags: externalTags,
  onTagsChange,
  placeholder = "Add a tag and press Enter",
  maxTags,
  helperText,
  allowDuplicates = false,
  disabled = false,
  className = "",
}) => {
  const [internalTags, setInternalTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Use external tags if provided, otherwise use internal state
  const tags = externalTags || internalTags;

  const updateTags = (newTags: string[]) => {
    if (onTagsChange) {
      onTagsChange(newTags);
    } else {
      setInternalTags(newTags);
    }
  };

  const addTag = (tagToAdd: string) => {
    const trimmedTag = tagToAdd.trim();
    
    if (!trimmedTag) return;
    if (maxTags && tags.length >= maxTags) return;
    if (!allowDuplicates && tags.includes(trimmedTag)) return;
    
    updateTags([...tags, trimmedTag]);
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    updateTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2 p-2 border-1 border-grayish rounded-md focus-within:bg-purple-main/5 bg-white focus-within:outline-2 focus-within:outline-purple-main ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={() => !disabled && inputRef.current?.focus()}
    >
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-2 px-2 bg-grayish text-black rounded-sm text-sm font-medium"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="text-lg text-gray-400 cursor-pointer hover:text-blue-800 focus:outline-none"
            >
              ×
            </button>
          )}
        </span>
      ))}
      
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        disabled={disabled || (maxTags !== undefined && tags.length >= maxTags)}
        className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-gray-400"
      />
      {helperText&&<p className="text-xs text-secondary text-start">{helperText}</p>}
    </div>
  );
};

export default TagsInput;
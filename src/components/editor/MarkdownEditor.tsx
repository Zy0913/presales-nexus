"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  content: string;
  readOnly?: boolean;
  placeholder?: string;
  onChange: (content: string) => void;
  onSelectionChange?: (selection: { text: string; start: number; end: number } | null) => void;
}

export function MarkdownEditor({
  content,
  readOnly = false,
  placeholder = '开始编写内容...',
  onChange,
  onSelectionChange,
}: MarkdownEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleSelect = () => {
    if (!textareaRef.current || !onSelectionChange) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;

    const selectedText = content.substring(start, end);
    onSelectionChange({ text: selectedText, start, end });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newContent =
        content.substring(0, start) + '  ' + content.substring(end);
      onChange(newContent);

      // Move cursor after the tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        placeholder={placeholder}
        className={cn(
          'flex-1 w-full resize-none p-4 font-mono text-sm leading-relaxed',
          'bg-white text-zinc-900 placeholder:text-zinc-400',
          'focus:outline-none',
          'markdown-editor'
        )}
        spellCheck={false}
      />
    </div>
  );
}

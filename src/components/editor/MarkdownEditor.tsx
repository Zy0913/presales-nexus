"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FloatingAIMenu } from './FloatingAIMenu';

interface MarkdownEditorProps {
  content: string;
  readOnly?: boolean;
  placeholder?: string;
  onChange: (content: string) => void;
  onSelectionChange?: (selection: { text: string; start: number; end: number } | null) => void;
  onAIAction?: (action: string, text: string) => void;
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;
}

export const MarkdownEditor = React.forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(({
  content,
  readOnly = false,
  placeholder = '开始编写内容...',
  onChange,
  onSelectionChange,
  onAIAction,
  onScroll,
}, ref) => {
  const internalRef = React.useRef<HTMLTextAreaElement>(null);

  // Helper to handle both refs
  const setRef = (element: HTMLTextAreaElement | null) => {
    internalRef.current = element;
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      // @ts-ignore
      ref.current = element;
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setMenuOpen(false);
  };

  const handleSelect = () => {
    if (!internalRef.current || !onSelectionChange) return;
    const start = internalRef.current.selectionStart;
    const end = internalRef.current.selectionEnd;
    const text = content.substring(start, end);
    onSelectionChange({ text, start, end });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (readOnly) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    setTimeout(() => {
      const textarea = internalRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (start !== end) {
        const text = content.substring(start, end);
        if (text.trim().length > 0) {
          setSelectedText(text);
          setMenuPos({ x: currentX, y: currentY - 10 });
          setMenuOpen(true);
          return;
        }
      }
      setMenuOpen(false);
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setMenuOpen(false);

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = internalRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      onChange(newContent);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        // Manually trigger select because programmatic change doesn't fire it
        if (onSelectionChange) {
           onSelectionChange({ text: '', start: start + 2, end: start + 2 });
        }
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <textarea
        ref={setRef}
        value={content}
        onChange={handleChange}
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
        onMouseUp={handleMouseUp}
        onScroll={onScroll}
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

      <FloatingAIMenu
        isOpen={menuOpen}
        position={menuPos}
        onAction={(action) => {
          onAIAction?.(action, selectedText);
          setMenuOpen(false);
        }}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  );
});

MarkdownEditor.displayName = 'MarkdownEditor';

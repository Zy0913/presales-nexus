"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SplitEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSelectionChange?: (selection: { text: string; start: number; end: number } | null) => void;
  defaultSplitRatio?: number; // 0-1, default 0.5
  minRatio?: number;
  maxRatio?: number;
}

export function SplitEditor({
  content,
  onChange,
  onSelectionChange,
  defaultSplitRatio = 0.5,
  minRatio = 0.25,
  maxRatio = 0.75,
}: SplitEditorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<HTMLTextAreaElement>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);

  const [splitRatio, setSplitRatio] = React.useState(defaultSplitRatio);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isSyncingScroll, setIsSyncingScroll] = React.useState(false);

  // Handle selection change
  const handleSelect = () => {
    if (!editorRef.current || !onSelectionChange) return;

    const start = editorRef.current.selectionStart;
    const end = editorRef.current.selectionEnd;

    const selectedText = content.substring(start, end);
    onSelectionChange({ text: selectedText, start, end });
  };

  // Handle key down (e.g. Tab)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = editorRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      onChange(newContent);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        // Trigger selection update
        handleSelect();
      }, 0);
    }
  };

  // Handle drag to resize
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newRatio = (e.clientX - rect.left) / rect.width;

      setSplitRatio(Math.max(minRatio, Math.min(maxRatio, newRatio)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minRatio, maxRatio]);

  // Sync scroll between editor and preview
  const handleEditorScroll = () => {
    if (isSyncingScroll || !editorRef.current || !previewRef.current) return;

    setIsSyncingScroll(true);

    const editor = editorRef.current;
    const preview = previewRef.current;

    const editorScrollRatio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight || 1);
    const previewMaxScroll = preview.scrollHeight - preview.clientHeight;

    preview.scrollTop = editorScrollRatio * previewMaxScroll;

    requestAnimationFrame(() => setIsSyncingScroll(false));
  };

  const handlePreviewScroll = () => {
    if (isSyncingScroll || !editorRef.current || !previewRef.current) return;

    setIsSyncingScroll(true);

    const editor = editorRef.current;
    const preview = previewRef.current;

    const previewScrollRatio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight || 1);
    const editorMaxScroll = editor.scrollHeight - editor.clientHeight;

    editor.scrollTop = previewScrollRatio * editorMaxScroll;

    requestAnimationFrame(() => setIsSyncingScroll(false));
  };

  // Markdown rendering
  const renderMarkdown = (text: string): string => {
    const codeBlocks: string[] = [];
    let html = text;

    // Extract and protect code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim();
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(
        `<pre style="background-color: #18181b; color: #f4f4f5; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem; overflow-x: auto;"><code style="font-size: 0.875rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #f4f4f5; white-space: pre;">${escapedCode}</code></pre>`
      );
      return placeholder;
    });

    // Extract inline code
    const inlineCodes: string[] = [];
    html = html.replace(/`([^`]+)`/g, (_, code) => {
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
      inlineCodes.push(
        `<code style="background-color: #f4f4f5; color: #27272a; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875rem; font-family: ui-monospace, monospace;">${escapedCode}</code>`
      );
      return placeholder;
    });

    // Escape HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mb-2 mt-4 text-zinc-900">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mb-3 mt-6 text-zinc-900">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4 pb-2 border-b border-zinc-200 text-zinc-900">$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Blockquote
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-zinc-300 pl-4 py-1 mb-4 bg-zinc-50 italic text-zinc-700">$1</blockquote>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr class="border-t border-zinc-200 my-6" />');

    // Lists
    html = html.replace(/^- \[ \] (.+)$/gm, '<li class="flex items-center gap-2 mb-1"><input type="checkbox" disabled class="rounded" /> $1</li>');
    html = html.replace(/^- \[x\] (.+)$/gm, '<li class="flex items-center gap-2 mb-1"><input type="checkbox" checked disabled class="rounded" /> $1</li>');
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc mb-1">$1</li>');

    html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => {
      return `<ul class="mb-4">${match}</ul>`;
    });

    // Tables
    html = html.replace(/^\|(.+)\|$/gm, (match, content) => {
      const cells = content.split('|').map((cell: string) => cell.trim());
      const isHeader = cells.every((cell: string) => /^-+$/.test(cell));
      if (isHeader) return '';
      const cellHtml = cells.map((cell: string) => `<td class="border border-zinc-200 px-4 py-2">${cell}</td>`).join('');
      return `<tr>${cellHtml}</tr>`;
    });

    html = html.replace(/(<tr>.*<\/tr>\n?)+/g, (match) => {
      return `<table class="w-full mb-4 border-collapse"><tbody>${match}</tbody></table>`;
    });

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-zinc-700 hover:text-zinc-900 underline">$1</a>');

    // Paragraphs
    html = html.replace(/^(?!<[hupoltb]|<li|<blockquote|<hr|__CODE_BLOCK_|__INLINE_CODE_)(.+)$/gm, '<p class="mb-4 leading-relaxed text-zinc-700">$1</p>');

    // Clean up
    html = html.replace(/<p class="[^"]*"><\/p>/g, '');

    // Restore code blocks and inline codes
    codeBlocks.forEach((block, i) => {
      html = html.replace(`__CODE_BLOCK_${i}__`, block);
    });
    inlineCodes.forEach((code, i) => {
      html = html.replace(`__INLINE_CODE_${i}__`, code);
    });

    return html;
  };

  return (
    <div ref={containerRef} className="flex-1 w-full h-full flex overflow-hidden relative">
      {/* Editor panel */}
      <div
        className="h-full flex flex-col overflow-hidden flex-shrink-0 border-r border-zinc-200"
        style={{ width: `calc(${splitRatio * 100}% - 3px)` }}
      >
        <textarea
          ref={editorRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onSelect={handleSelect}
          onKeyDown={handleKeyDown}
          onScroll={handleEditorScroll}
          placeholder="开始编写内容..."
          className={cn(
            'flex-1 w-full resize-none p-4 font-mono text-sm leading-relaxed',
            'bg-white text-zinc-900 placeholder:text-zinc-400',
            'focus:outline-none',
            'markdown-editor'
          )}
          spellCheck={false}
        />
      </div>

      {/* Draggable divider */}
      <div
        className={cn(
          'w-1.5 bg-zinc-100 border-x border-zinc-200 cursor-col-resize hover:bg-zinc-200 transition-colors flex-shrink-0 relative group',
          isDragging && 'bg-zinc-300'
        )}
        onMouseDown={handleMouseDown}
      >
        {/* Drag handle indicator */}
        <div className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'w-1 h-8 rounded-full',
          isDragging ? 'bg-zinc-500' : 'bg-zinc-300 group-hover:bg-zinc-400',
          'transition-colors'
        )} />
      </div>

      {/* Preview panel */}
      <div
        className="h-full overflow-hidden bg-white flex-1 min-w-0"
      >
        <div
          ref={previewRef}
          className="h-full overflow-auto p-6"
          onScroll={handlePreviewScroll}
        >
          <div
            className="markdown-preview max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        </div>
      </div>

      {/* Overlay during drag to prevent text selection */}
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
    </div>
  );
}

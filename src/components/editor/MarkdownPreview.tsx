"use client";

import React from 'react';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const renderMarkdown = (text: string): string => {
    // Store code blocks first to protect them from other transformations
    const codeBlocks: string[] = [];
    let html = text;

    // Extract and protect code blocks BEFORE escaping HTML
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

    // Now escape HTML for the rest of the content
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

    // Unordered lists
    html = html.replace(/^- \[ \] (.+)$/gm, '<li class="flex items-center gap-2 mb-1"><input type="checkbox" disabled class="rounded" /> $1</li>');
    html = html.replace(/^- \[x\] (.+)$/gm, '<li class="flex items-center gap-2 mb-1"><input type="checkbox" checked disabled class="rounded" /> $1</li>');
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc mb-1">$1</li>');

    // Wrap consecutive list items
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

    // Wrap table rows
    html = html.replace(/(<tr>.*<\/tr>\n?)+/g, (match) => {
      return `<table class="w-full mb-4 border-collapse"><tbody>${match}</tbody></table>`;
    });

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-zinc-700 hover:text-zinc-900 underline">$1</a>');

    // Paragraphs (lines that don't start with special characters or placeholders)
    html = html.replace(/^(?!<[hupoltb]|<li|<blockquote|<hr|__CODE_BLOCK_|__INLINE_CODE_)(.+)$/gm, '<p class="mb-4 leading-relaxed text-zinc-700">$1</p>');

    // Clean up empty paragraphs
    html = html.replace(/<p class="[^"]*"><\/p>/g, '');

    // Restore code blocks
    codeBlocks.forEach((block, i) => {
      html = html.replace(`__CODE_BLOCK_${i}__`, block);
    });

    // Restore inline codes
    inlineCodes.forEach((code, i) => {
      html = html.replace(`__INLINE_CODE_${i}__`, code);
    });

    return html;
  };

  return (
    <div className="h-full overflow-auto p-6">
      <div
        className="markdown-preview max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
    </div>
  );
}

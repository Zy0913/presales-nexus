"use client";

import React, { useRef, useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DiffEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSelectionChange?: (selection: { text: string; start: number; end: number } | null) => void;
}

export function DiffEditor({
  content,
  onChange,
  onSelectionChange,
}: DiffEditorProps) {
  const leftRef = useRef<HTMLTextAreaElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [isSyncingLeft, setIsSyncingLeft] = useState(false);
  const [isSyncingRight, setIsSyncingRight] = useState(false);

  // Mock remote content logic
  const remoteExtra = "\n\n## 补充说明 (来自李经理)\n\n这里需要补充关于安全合规的具体要求，请注意修改。\n\n- 数据本地化存储\n- 传输加密标准\n- 访问日志审计";

  // Quick fix for prototype: Right side is just a static string for demo.
  const [remoteContent] = useState(content + remoteExtra);

  // Handle scroll sync
  const handleLeftScroll = () => {
    if (isSyncingRight) return;
    setIsSyncingLeft(true);
    if (rightRef.current && leftRef.current) {
      rightRef.current.scrollTop = leftRef.current.scrollTop;
    }
    requestAnimationFrame(() => setIsSyncingLeft(false));
  };

  const handleRightScroll = () => {
    if (isSyncingLeft) return;
    setIsSyncingRight(true);
    if (leftRef.current && rightRef.current) {
      leftRef.current.scrollTop = rightRef.current.scrollTop;
    }
    requestAnimationFrame(() => setIsSyncingRight(false));
  };

  // Selection for Toolbar support
  const handleSelect = () => {
    if (!leftRef.current || !onSelectionChange) return;
    const start = leftRef.current.selectionStart;
    const end = leftRef.current.selectionEnd;
    const selectedText = content.substring(start, end);
    onSelectionChange({ text: selectedText, start, end });
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-white animate-in fade-in duration-300">
      {/* LEFT: Editable Local Version */}
      <div className="flex-1 flex flex-col border-r border-zinc-200 min-w-0 bg-white">
        <div className="h-8 bg-blue-50/30 border-b border-zinc-200 flex items-center justify-between px-4 flex-shrink-0">
          <span className="text-xs font-medium text-blue-700 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            您的版本 (可编辑)
          </span>
        </div>

        <div className="flex-1 relative">
          <textarea
            ref={leftRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onSelect={handleSelect}
            onScroll={handleLeftScroll}
            className={cn(
              "w-full h-full resize-none p-8 font-mono text-sm leading-relaxed",
              "focus:outline-none text-zinc-900 selection:bg-blue-100",
              "scrollbar-thin scrollbar-thumb-zinc-200"
            )}
            spellCheck={false}
          />
        </div>
      </div>

      {/* RIGHT: Read-only Remote Version */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50/30">
        <div className="h-8 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between px-4 flex-shrink-0">
          <span className="text-xs font-medium text-zinc-600 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            云端版本 (只读)
          </span>
        </div>

        <div
          ref={rightRef}
          onScroll={handleRightScroll}
          className="flex-1 overflow-y-auto p-8 font-mono text-sm leading-relaxed text-zinc-500 scrollbar-thin scrollbar-thumb-zinc-200"
        >
          {/* Visualizing the "Static" remote content slightly differently for demo */}
          <div className="whitespace-pre-wrap opacity-70 mb-2">
             {/* Show start of content */}
             {remoteContent.slice(0, 100)}...
             <div className="select-none border-b border-dashed border-zinc-200 py-4 my-2 text-zinc-400 italic text-xs">
                --- 中间 1200 字相同，已折叠 ---
             </div>
             {/* Show end of content before diff */}
             {remoteContent.slice(remoteContent.length - remoteExtra.length - 200, remoteContent.length - remoteExtra.length)}
          </div>

          {/* Diff Block */}
          <div className="relative group cursor-pointer" onClick={() => onChange(content + remoteExtra)}>
            {/* Git-like Added Block Style */}
            <div className="absolute -inset-x-8 -inset-y-2 bg-green-100/50 border-y border-green-200/50 -z-10 transition-colors group-hover:bg-green-100" />
            <div className="absolute -left-8 top-[-8px] bottom-[-8px] w-1 bg-green-500" />

            <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <div className="bg-white shadow-sm border border-zinc-200 rounded px-2 py-1 text-[10px] text-zinc-500 flex items-center gap-1">
                <Copy className="w-3 h-3" />
                点击复制
              </div>
            </div>

            <div className="whitespace-pre-wrap text-green-900 font-medium">
              {remoteExtra}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

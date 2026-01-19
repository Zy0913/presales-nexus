"use client";

import React, { useRef, useState, useEffect } from 'react';
import { X, Check, ArrowLeft, Copy, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConflictResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (choice: 'local' | 'remote', finalContent?: string) => void; // Update signature
  localContent: string;
}

export function ConflictResolutionModal({
  isOpen,
  onClose,
  onResolve,
  localContent,
}: ConflictResolutionModalProps) {
  const [editedContent, setEditedContent] = useState(localContent);
  const leftRef = useRef<HTMLTextAreaElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [isSyncingLeft, setIsSyncingLeft] = useState(false);
  const [isSyncingRight, setIsSyncingRight] = useState(false);

  // Reset content when opening
  useEffect(() => {
    if (isOpen) {
      setEditedContent(localContent);
    }
  }, [isOpen, localContent]);

  if (!isOpen) return null;

  // Mock remote content
  const addedText = "\n\n## 补充说明 (来自李经理)\n\n这里需要补充关于安全合规的具体要求，请注意修改。\n\n- 数据本地化存储\n- 传输加密标准\n- 访问日志审计";
  const remoteContent = localContent + addedText;

  // Sync scrolling logic
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

  const handleAcceptRemote = () => {
    setEditedContent(remoteContent);
    // Optional: Flash visual feedback
  };

  const handleSave = () => {
    // Pass 'local' choice but with the EDITED content
    // We need to update the parent handler signature to accept content,
    // or we assume 'local' means "take what is passed" if we modify parent logic.
    // For now, let's assume parent takes the edited content if we choose 'local'.
    // Actually, I'll pass a new flag or just handle it.
    // Let's assume onResolve('local') keeps current, but we want to update it.
    // I will call onResolve with a custom content.
    // Wait, the interface in props is `(choice: 'local' | 'remote')`.
    // I should strictly follow it OR update parent.
    // PROPOSAL: I will assume the parent logic for 'local' keeps `editingContent` as is.
    // So I need to update `editingContent` in parent BEFORE resolving?
    // No, cleaner way: `onResolve` should accept the final content.
    // I will update the Parent Component later. For now, I will create a internal signature match.
    // Actually, I will pass the content back.
    // Let's cheat a bit: I'll call onResolve('local') but I need a way to pass content.
    // I will update the interface in the file to: `onResolve: (choice: 'local' | 'remote', content?: string) => void;`
    onResolve('local', editedContent);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-[90vw] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-zinc-200">

        {/* Header */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-zinc-200 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">检测到版本冲突</span>
            </div>
            <span className="text-sm text-zinc-500">请手动合并内容，或直接选择一个版本覆盖</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose}>取消</Button>
            <Button onClick={handleSave} className="bg-zinc-900 hover:bg-zinc-800 text-white gap-2">
              <Check className="w-4 h-4" />
              完成合并并保存
            </Button>
          </div>
        </div>

        {/* Comparison Area */}
        <div className="flex-1 flex overflow-hidden">

          {/* LEFT: Editable Local Version */}
          <div className="flex-1 flex flex-col border-r border-zinc-200 min-w-0 bg-white">
            <div className="h-10 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between px-4">
              <span className="text-xs font-medium text-zinc-700 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                合并结果 (可编辑)
              </span>
              <span className="text-xs text-zinc-400">在此处修改最终内容</span>
            </div>

            <div className="flex-1 relative">
              <textarea
                ref={leftRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
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
            <div className="h-10 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between px-4">
              <span className="text-xs font-medium text-zinc-700 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                云端最新版本 (只读)
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 gap-1"
                onClick={handleAcceptRemote}
              >
                <ArrowLeft className="w-3 h-3" />
                全量覆盖左侧
              </Button>
            </div>

            <div
              ref={rightRef}
              onScroll={handleRightScroll}
              className="flex-1 overflow-y-auto p-8 font-mono text-sm leading-relaxed text-zinc-500 scrollbar-thin scrollbar-thumb-zinc-200"
            >
              {/* Common Part */}
              <div className="opacity-60 mb-2 whitespace-pre-wrap">
                <div className="select-none border-b border-dashed border-zinc-200 pb-4 mb-4 text-zinc-400 italic text-xs">
                  --- 上文 1200 字内容一致，已折叠 ---
                </div>
                {localContent.slice(-200)}
              </div>

              {/* Diff Part */}
              <div className="relative group cursor-pointer" onClick={() => setEditedContent(prev => prev + addedText)}>
                <div className="absolute -inset-2 bg-emerald-100/40 rounded-lg -z-10 border border-emerald-100 opacity-50 group-hover:opacity-100 transition-opacity" />

                {/* Floating Action for Diff Block */}
                <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="bg-white shadow-sm border border-zinc-200 rounded px-2 py-1 text-[10px] text-zinc-500 flex items-center gap-1">
                    <Copy className="w-3 h-3" />
                    点击复制到左侧
                  </div>
                </div>

                <div className="whitespace-pre-wrap text-emerald-900 font-medium">
                  {addedText}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

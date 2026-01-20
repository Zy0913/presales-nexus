"use client";

import React from 'react';
import { X, Clock, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document } from '@/types';
import { cn } from '@/lib/utils';

interface HistoryModalProps {
  isOpen: boolean;
  document: Document | null;
  onClose: () => void;
  onRestore: (content: string) => void;
}

export function HistoryModal({
  isOpen,
  document,
  onClose,
  onRestore,
}: HistoryModalProps) {
  const [selectedVersion, setSelectedVersion] = React.useState<number | null>(null);

  // Generate mock history based on current version
  const versions = React.useMemo(() => {
    if (!document) return [];
    return Array.from({ length: document.version }, (_, i) => {
      const ver = document.version - i;
      const date = new Date(document.updatedAt);
      date.setDate(date.getDate() - i * 2); // Spread out dates

      return {
        version: ver,
        updatedAt: date.toISOString(),
        updatedBy: i === 0 ? document.updatedBy : i % 2 === 0 ? 'user_003' : 'user_002',
        content: i === 0 ? document.content : `这是版本 v${ver} 的历史内容快照...\n\n# 历史版本 ${ver}\n\n此处模拟展示该版本的具体文档内容。\n\n- 变更点 1\n- 变更点 2\n\n(真实系统中这里会加载服务器存档)`,
        summary: i === 0 ? '当前版本' : `修订了第 ${ver} 版的内容细节`
      };
    });
  }, [document]);

  if (!isOpen || !document) return null;

  const activeVersion = selectedVersion ? versions.find(v => v.version === selectedVersion) || versions[0] : versions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[900px] h-[600px] flex flex-col animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-500" />
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">版本历史</h2>
              <p className="text-sm text-zinc-500">《{document.title}》</p>
            </div>
          </div>
          <button
            className="p-1 rounded hover:bg-zinc-100 transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Timeline List */}
          <div className="w-72 border-r border-zinc-100 overflow-y-auto bg-zinc-50/50">
            <div className="p-4 space-y-4">
              {versions.map((ver, index) => {
                const isSelected = activeVersion.version === ver.version;
                return (
                  <div
                    key={ver.version}
                    className={cn(
                      "relative pl-4 border-l-2 transition-colors cursor-pointer p-2 rounded-r-md",
                      isSelected ? "border-blue-500 bg-blue-50/50" : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/50"
                    )}
                    onClick={() => setSelectedVersion(ver.version)}
                  >
                    <div className={cn(
                      "absolute -left-[5px] top-3 w-2.5 h-2.5 rounded-full border-2 border-white",
                      index === 0 ? "bg-green-500" : isSelected ? "bg-blue-500" : "bg-zinc-300"
                    )} />
                    <div className="mb-1 flex items-center gap-2">
                      <span className={cn("text-sm font-medium", isSelected ? "text-blue-700" : "text-zinc-900")}>
                        v{ver.version}.0
                      </span>
                      {index === 0 && (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-medium">
                          当前
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 mb-1">
                      {new Date(ver.updatedAt).toLocaleDateString()} {new Date(ver.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="text-xs text-zinc-600 truncate">
                      {ver.updatedBy === 'user_003' ? '王文渊' : '李晓燕'} • {ver.summary}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 bg-zinc-50 p-6 overflow-y-auto flex flex-col">
            <div className="bg-white shadow-sm border border-zinc-200 rounded-lg min-h-0 flex-1 flex flex-col">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">v{activeVersion.version}.0 版本预览</h1>
                  <p className="text-sm text-zinc-500 mt-1">
                    修改人: {activeVersion.updatedBy === 'user_003' ? '王文渊' : '李晓燕'}
                  </p>
                </div>
                {activeVersion.version !== versions[0].version && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => {
                      if (confirm(`确定要回滚到版本 v${activeVersion.version} 吗？`)) {
                        onRestore(activeVersion.content);
                        onClose();
                      }
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    恢复至此版本
                  </Button>
                )}
              </div>

              <div className="p-8 overflow-y-auto flex-1">
                <div className="prose max-w-none font-mono text-sm text-zinc-700 whitespace-pre-wrap">
                  {activeVersion.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

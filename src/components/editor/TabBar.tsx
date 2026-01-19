"use client";

import React from 'react';
import { X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditorTab as EditorTabType } from '@/types';

interface TabBarProps {
  tabs: EditorTabType[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export function TabBar({ tabs, activeTabId, onTabSelect, onTabClose }: TabBarProps) {
  if (tabs.length === 0) return null;

  return (
    <div className="h-9 bg-zinc-100 border-b border-zinc-200 flex items-end px-1">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            'group flex items-center gap-1.5 px-3 py-1.5 text-[13px] cursor-pointer rounded-t-md transition-colors mr-0.5',
            activeTabId === tab.id
              ? 'bg-white text-zinc-900 border border-b-0 border-zinc-200 -mb-px'
              : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
          )}
          onClick={() => onTabSelect(tab.id)}
        >
          <FileText className="w-3.5 h-3.5 text-zinc-400" />
          <span className="truncate max-w-[140px]">{tab.title}</span>
          {tab.isModified && (
            <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full" title="未保存的修改" />
          )}
          <button
            className={cn(
              'w-4 h-4 flex items-center justify-center rounded hover:bg-zinc-200 transition-colors ml-1',
              activeTabId === tab.id ? 'opacity-60 hover:opacity-100' : 'opacity-0 group-hover:opacity-60 hover:opacity-100'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

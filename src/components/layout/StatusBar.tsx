"use client";

import React from 'react';
import { FileText, Cloud, CloudOff, AlertCircle, Users } from 'lucide-react';
import { Document, SyncStatus, User } from '@/types';
import { formatDateTime } from '@/lib/utils';

interface StatusBarProps {
  currentDocument: Document | null;
  cursorPosition: { line: number; column: number };
  wordCount: number;
  syncStatus: SyncStatus;
  lastSavedAt: string | null;
  collaborators: User[];
}

export function StatusBar({
  currentDocument,
  cursorPosition,
  wordCount,
  syncStatus,
  lastSavedAt,
  collaborators,
}: StatusBarProps) {
  const getSyncStatusDisplay = () => {
    switch (syncStatus) {
      case 'synced':
        return (
          <span className="flex items-center gap-1 text-emerald-600">
            <Cloud className="w-3 h-3" />
            已同步
          </span>
        );
      case 'syncing':
        return (
          <span className="flex items-center gap-1 text-amber-600">
            <Cloud className="w-3 h-3 animate-pulse" />
            同步中...
          </span>
        );
      case 'offline':
        return (
          <span className="flex items-center gap-1 text-zinc-400">
            <CloudOff className="w-3 h-3" />
            离线
          </span>
        );
      case 'conflict':
        return (
          <span className="flex items-center gap-1 text-red-600">
            <AlertCircle className="w-3 h-3" />
            有冲突
          </span>
        );
    }
  };

  return (
    <div className="h-6 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between px-3 text-[11px] text-zinc-500">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {currentDocument && (
          <>
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {currentDocument.title}
            </span>
            <span className="text-zinc-400">|</span>
            <span>字数: {wordCount.toLocaleString()}</span>
            <span className="text-zinc-400">|</span>
            <span>
              Ln {cursorPosition.line}, Col {cursorPosition.column}
            </span>
          </>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {lastSavedAt && (
          <span className="text-zinc-400">
            保存于 {formatDateTime(lastSavedAt)}
          </span>
        )}

        {getSyncStatusDisplay()}

        {currentDocument && (
          <span className="text-zinc-400">v{currentDocument.version}</span>
        )}

        {collaborators.length > 0 && (
          <div className="flex items-center gap-1 text-zinc-500">
            <Users className="w-3 h-3" />
            <span>{collaborators.length} 人在线</span>
          </div>
        )}
      </div>
    </div>
  );
}

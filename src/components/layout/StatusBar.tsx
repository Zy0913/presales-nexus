"use client";

import React from 'react';
import { FileText, Cloud, CloudOff, AlertCircle, Users, AlertTriangle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Document, SyncStatus, User, DocumentStatus } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface StatusBarProps {
  currentDocument: Document | null;
  cursorPosition: { line: number; column: number };
  wordCount: number;
  syncStatus: SyncStatus;
  lastSavedAt: string | null;
  collaborators: User[];
  onSimulateConflict?: () => void;
  // New props for status management
  docStatus?: DocumentStatus;
  isConflictMode?: boolean;
  onResolveStart?: () => void;
  onSimulateApproval?: () => void;
  onSimulateRejection?: () => void;
  onReEdit?: () => void;
}

export function StatusBar({
  currentDocument,
  cursorPosition,
  wordCount,
  syncStatus,
  lastSavedAt,
  collaborators,
  onSimulateConflict,
  docStatus = 'draft',
  isConflictMode = false,
  onResolveStart,
  onSimulateApproval,
  onSimulateRejection,
  onReEdit,
}: StatusBarProps) {
  const getSyncStatusDisplay = () => {
    const content = (() => {
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
            <span className="flex items-center gap-1 text-red-600 font-medium">
              <AlertCircle className="w-3 h-3" />
              版本冲突
            </span>
          );
      }
    })();

    return (
      <button
        className="hover:bg-zinc-100 px-2 py-0.5 rounded cursor-pointer transition-colors"
        onClick={onSimulateConflict}
        title="点击模拟版本冲突 (演示用)"
      >
        {content}
      </button>
    );
  };

  // Determine if we need to show urgent status message instead of file info
  const isUrgent = docStatus !== 'draft' || (syncStatus === 'conflict' && !isConflictMode);

  return (
    <div className="h-6 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between px-3 text-[11px] text-zinc-500 transition-all duration-300">

      {/* LEFT: Urgent Status OR Document Info */}
      <div className="flex items-center gap-4 flex-1">
        {isUrgent ? (
          <div className="flex items-center gap-3 animate-in slide-in-from-bottom-1 fade-in duration-300">
            {/* Status Icon & Text */}
            <div className="flex items-center gap-1.5">
              {syncStatus === 'conflict' ? (
                <span className="flex items-center gap-1 text-red-600 font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  检测到版本冲突
                </span>
              ) : docStatus === 'pending_review' ? (
                <span className="flex items-center gap-1 text-amber-600 font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  审核中 (已锁定)
                </span>
              ) : docStatus === 'approved' ? (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle className="w-3 h-3" />
                  审核通过 (已归档)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600 font-medium">
                  <XCircle className="w-3 h-3" />
                  审核驳回
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              {syncStatus === 'conflict' && !isConflictMode && (
                <button
                  className="px-1.5 py-0.5 bg-white border border-red-200 text-red-700 hover:bg-red-50 rounded-[3px] text-[10px] transition-colors leading-none"
                  onClick={onResolveStart}
                >
                  解决冲突
                </button>
              )}

              {docStatus === 'pending_review' && (
                <>
                  <button className="px-1.5 py-0.5 text-emerald-600 hover:bg-emerald-50 rounded-[3px] text-[10px] transition-colors leading-none" onClick={onSimulateApproval}>
                    [模拟] 通过
                  </button>
                  <button className="px-1.5 py-0.5 text-red-600 hover:bg-red-50 rounded-[3px] text-[10px] transition-colors leading-none" onClick={onSimulateRejection}>
                    [模拟] 驳回
                  </button>
                </>
              )}

              {docStatus === 'rejected' && (
                <button
                  className="px-1.5 py-0.5 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-[3px] text-[10px] transition-colors flex items-center gap-1 leading-none"
                  onClick={onReEdit}
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  重新编辑
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Normal Document Info */
          currentDocument && (
            <>
              <span className="flex items-center gap-1.5 text-zinc-700 font-medium">
                <FileText className="w-3.5 h-3.5" />
                {currentDocument.title}
              </span>
              <span className="text-zinc-300">|</span>
              <span>{wordCount.toLocaleString()} 字</span>
              <span className="text-zinc-300">|</span>
              <span className="font-mono">
                Ln {cursorPosition.line}, Col {cursorPosition.column}
              </span>
            </>
          )
        )}
      </div>

      {/* RIGHT: System Status (Always visible) */}
      <div className="flex items-center gap-3">
        {lastSavedAt && (
          <span className="hidden sm:inline text-zinc-400">
            {formatDateTime(lastSavedAt)}
          </span>
        )}

        {getSyncStatusDisplay()}

        {collaborators.length > 0 && (
          <div className="flex items-center gap-1 text-zinc-600">
            <Users className="w-3.5 h-3.5" />
            <span>{collaborators.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}

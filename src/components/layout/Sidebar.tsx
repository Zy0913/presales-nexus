"use client";

import React from 'react';
import {
  PanelLeftClose,
  PanelLeft,
  Plus,
  Upload,
  Search,
  Clock,
  Users,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileTreeNode, Document, ProjectMember } from '@/types';
import { FileTree } from '@/components/file-tree/FileTree';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  fileTree: FileTreeNode[];
  selectedNodeId: string | null;
  expandedFolderIds: Set<string>;
  recentDocuments: Document[];
  projectMembers: ProjectMember[];
  onToggleCollapse: () => void;
  onNodeSelect: (node: FileTreeNode) => void;
  onFolderToggle: (folderId: string) => void;
  onCreateDocument?: () => void;
}

export function Sidebar({
  isCollapsed,
  fileTree,
  selectedNodeId,
  expandedFolderIds,
  recentDocuments,
  projectMembers,
  onToggleCollapse,
  onNodeSelect,
  onFolderToggle,
  onCreateDocument,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isRecentExpanded, setIsRecentExpanded] = React.useState(true);
  const [isMembersExpanded, setIsMembersExpanded] = React.useState(true);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-zinc-50 border-r border-zinc-200 flex flex-col items-center py-3 gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8">
          <PanelLeft className="w-4 h-4 text-zinc-500" />
        </Button>
        <div className="w-6 h-px bg-zinc-200 my-1" />
        <Button variant="ghost" size="icon" onClick={onCreateDocument} className="h-8 w-8">
          <Plus className="w-4 h-4 text-zinc-500" />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-50 border-r border-zinc-200 flex flex-col">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-zinc-100">
        <span className="text-[13px] font-medium text-zinc-700">资料库</span>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-7 w-7">
          <PanelLeftClose className="w-4 h-4 text-zinc-400" />
        </Button>
      </div>

      {/* Actions */}
      <div className="p-2 flex gap-1.5">
        <Button size="sm" className="flex-1 h-8 text-xs" onClick={onCreateDocument}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          新建
        </Button>
        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
          <Upload className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Search */}
      <div className="px-2 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-[13px] bg-white border border-zinc-200 rounded-md placeholder:text-zinc-400 focus:border-blue-500"
          />
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="px-1.5 pb-2">
          <FileTree
            nodes={fileTree}
            selectedId={selectedNodeId}
            expandedIds={expandedFolderIds}
            onSelect={onNodeSelect}
            onToggle={onFolderToggle}
          />
        </div>
      </ScrollArea>

      {/* Recent Documents - Collapsible */}
      {recentDocuments.length > 0 && (
        <div className="border-t border-zinc-100">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-100 transition-colors"
            onClick={() => setIsRecentExpanded(!isRecentExpanded)}
          >
            {isRecentExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            <Clock className="w-3.5 h-3.5" />
            <span>最近编辑</span>
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-150',
              isRecentExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="px-2 pb-2 space-y-0.5">
              {recentDocuments.slice(0, 3).map((doc) => (
                <button
                  key={doc.id}
                  className="w-full text-left px-2 py-1.5 text-[13px] text-zinc-600 hover:bg-zinc-100 rounded-md truncate transition-colors"
                  onClick={() => onNodeSelect({
                    id: doc.id,
                    type: 'document',
                    name: doc.title,
                    parentId: doc.folderId,
                    order: 0,
                    status: doc.status,
                    syncStatus: doc.syncStatus,
                  })}
                >
                  {doc.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Project Members - Collapsible */}
      <div className="border-t border-zinc-100">
        <button
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-100 transition-colors"
          onClick={() => setIsMembersExpanded(!isMembersExpanded)}
        >
          <div className="flex items-center gap-2">
            {isMembersExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            <Users className="w-3.5 h-3.5" />
            <span>项目成员</span>
          </div>
          <span className="text-zinc-400">{projectMembers.length}</span>
        </button>
        <div
          className={cn(
            'overflow-hidden transition-all duration-150',
            isMembersExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="px-3 pb-3">
            <div className="flex -space-x-1.5">
              {projectMembers.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="w-7 h-7 bg-zinc-200 rounded-full border-2 border-zinc-50 flex items-center justify-center"
                  title={member.user.name}
                >
                  <span className="text-[10px] font-medium text-zinc-600">
                    {member.user.name.slice(0, 1)}
                  </span>
                </div>
              ))}
              {projectMembers.length > 5 && (
                <div className="w-7 h-7 bg-zinc-300 rounded-full border-2 border-zinc-50 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-zinc-600">
                    +{projectMembers.length - 5}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

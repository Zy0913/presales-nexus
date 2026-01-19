"use client";

import React from 'react';
import Link from 'next/link';
import {
  PanelLeftClose,
  PanelLeft,
  Search,
  Clock,
  Users,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileTreeNode, Document, ProjectMember, Project } from '@/types';
import { FileTree } from '@/components/file-tree/FileTree';
import { cn } from '@/lib/utils';
import { mockProjects } from '@/lib/mock-data';

interface SidebarProps {
  isCollapsed: boolean;
  fileTree: FileTreeNode[];
  selectedNodeId: string | null;
  expandedFolderIds: Set<string>;
  recentDocuments: Document[];
  projectMembers: ProjectMember[];
  currentProject?: Project | null;
  onToggleCollapse: () => void;
  onNodeSelect: (node: FileTreeNode) => void;
  onFolderToggle: (folderId: string) => void;
  onProjectChange?: (projectId: string) => void;
  onCreateDocument?: (parentId?: string) => void;
  onCreateFolder?: (parentId?: string) => void;
  onUploadFile?: (parentId?: string) => void;
  onDeleteNode?: (node: FileTreeNode) => void;
  onMoveNode?: (node: FileTreeNode) => void;
  onCopyNode?: (node: FileTreeNode) => void;
}

export function Sidebar({
  isCollapsed,
  fileTree,
  selectedNodeId,
  expandedFolderIds,
  recentDocuments,
  projectMembers,
  currentProject,
  onToggleCollapse,
  onNodeSelect,
  onFolderToggle,
  onProjectChange,
  onCreateDocument,
  onCreateFolder,
  onUploadFile,
  onDeleteNode,
  onMoveNode,
  onCopyNode,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isRecentExpanded, setIsRecentExpanded] = React.useState(false);
  const [isMembersExpanded, setIsMembersExpanded] = React.useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = React.useState(false);
  const [projectSearchQuery, setProjectSearchQuery] = React.useState('');
  const projectMenuRef = React.useRef<HTMLDivElement>(null);

  // Close project menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectMenuRef.current && !projectMenuRef.current.contains(event.target as Node)) {
        setIsProjectMenuOpen(false);
        setProjectSearchQuery('');
      }
    };

    if (isProjectMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProjectMenuOpen]);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-zinc-50 border-r border-zinc-200 flex flex-col items-center py-3 gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8">
          <PanelLeft className="w-4 h-4 text-zinc-500" />
        </Button>
      </div>
    );
  }

  const filteredProjects = mockProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(projectSearchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-zinc-50 border-r border-zinc-200 flex flex-col">
      {/* Project Selector Header */}
      <div className="border-b border-zinc-100">
        <div className="h-12 flex items-center justify-between px-3">
          <div className="relative flex-1" ref={projectMenuRef}>
            <button
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-100 transition-colors w-full"
              onClick={(e) => {
                e.stopPropagation();
                setIsProjectMenuOpen(!isProjectMenuOpen);
              }}
            >
              <div className="w-6 h-6 bg-zinc-200 rounded flex items-center justify-center flex-shrink-0">
                <FolderKanban className="w-3.5 h-3.5 text-zinc-600" />
              </div>
              <span className="text-[13px] font-medium text-zinc-700 truncate flex-1 text-left">
                {currentProject?.name || '选择项目'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            </button>

            {/* Project dropdown */}
            {isProjectMenuOpen && (
              <div className="absolute left-0 top-full mt-1 w-72 bg-white rounded-lg shadow-lg border border-zinc-200 z-50">
                <div className="p-2 border-b border-zinc-100">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="搜索项目..."
                      value={projectSearchQuery}
                      onChange={(e) => setProjectSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-8 pr-3 py-1.5 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </div>
                </div>

                <div className="py-1 max-h-60 overflow-y-auto">
                  {filteredProjects.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-zinc-400">
                      未找到匹配的项目
                    </div>
                  ) : (
                    filteredProjects.map((project) => (
                      <button
                        key={project.id}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 transition-colors',
                          currentProject?.id === project.id && 'bg-zinc-50'
                        )}
                        onClick={() => {
                          onProjectChange?.(project.id);
                          setIsProjectMenuOpen(false);
                          setProjectSearchQuery('');
                        }}
                      >
                        <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FolderKanban className="w-4 h-4 text-zinc-500" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <span className="text-sm font-medium text-zinc-900 truncate block">{project.name}</span>
                          <span className="text-xs text-zinc-500 truncate block">{project.customerName}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-zinc-100">
                  <Link
                    href="/projects"
                    className="flex items-center justify-center gap-1.5 w-full px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-md transition-colors"
                  >
                    <FolderKanban className="w-4 h-4" />
                    查看全部项目
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-7 w-7 flex-shrink-0">
            <PanelLeftClose className="w-4 h-4 text-zinc-400" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-2 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="搜索文档..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-[13px] bg-white border border-zinc-200 rounded-md placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
          />
        </div>
      </div>

      {/* File Tree with hover actions */}
      <ScrollArea className="flex-1">
        <div className="px-1.5 pb-2">
          <FileTree
            nodes={fileTree}
            selectedId={selectedNodeId}
            expandedIds={expandedFolderIds}
            onSelect={onNodeSelect}
            onToggle={onFolderToggle}
            onCreateDocument={onCreateDocument}
            onCreateFolder={onCreateFolder}
            onUploadFile={onUploadFile}
            onDelete={onDeleteNode}
            onMove={onMoveNode}
            onCopy={onCopyNode}
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

"use client";

import React from 'react';
import {
  X,
  Search,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  FolderKanban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileTreeNode, Project } from '@/types';

interface MoveDocumentModalProps {
  isOpen: boolean;
  mode: 'move' | 'copy';
  sourceNode: FileTreeNode | null;
  projects: Project[];
  currentProjectId: string;
  fileTree: FileTreeNode[];
  recentLocations?: { projectId: string; projectName: string; folderId?: string; folderName: string }[];
  onClose: () => void;
  onConfirm: (targetProjectId: string, targetFolderId: string | null) => void;
}

export function MoveDocumentModal({
  isOpen,
  mode,
  sourceNode,
  projects,
  currentProjectId,
  fileTree,
  recentLocations = [],
  onClose,
  onConfirm,
}: MoveDocumentModalProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProjectId, setSelectedProjectId] = React.useState(currentProjectId);
  const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(null);
  const [expandedFolderIds, setExpandedFolderIds] = React.useState<Set<string>>(new Set());

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedProjectId(currentProjectId);
      setSelectedFolderId(null);
      setExpandedFolderIds(new Set());
      setSearchQuery('');
    }
  }, [isOpen, currentProjectId]);

  if (!isOpen || !sourceNode) return null;

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Get file tree for selected project (in real app, this would fetch from API)
  // For now, we use the current project's file tree for demo
  const projectFileTree = selectedProjectId === currentProjectId ? fileTree : [];

  const handleFolderToggle = (folderId: string) => {
    const newExpanded = new Set(expandedFolderIds);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolderIds(newExpanded);
  };

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId);
  };

  const handleConfirm = () => {
    onConfirm(selectedProjectId, selectedFolderId);
    onClose();
  };

  const actionText = mode === 'move' ? '移动' : '复制';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[720px] max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-base font-medium text-zinc-900">
            从 <span className="text-blue-600">{sourceNode.name}</span> {actionText}到
          </h2>
          <button
            className="p-1 rounded hover:bg-zinc-100 transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Recent locations */}
        {recentLocations.length > 0 && (
          <div className="px-6 py-3 border-b border-zinc-100">
            <div className="text-xs text-zinc-500 mb-2">最近使用位置</div>
            <div className="flex flex-wrap gap-2">
              {recentLocations.slice(0, 4).map((loc, index) => (
                <button
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 rounded-md text-sm text-zinc-700 transition-colors"
                  onClick={() => {
                    setSelectedProjectId(loc.projectId);
                    setSelectedFolderId(loc.folderId || null);
                  }}
                >
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  {loc.folderName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex min-h-0">
          {/* Left: Project list */}
          <div className="w-56 border-r border-zinc-100 flex flex-col">
            {/* Search */}
            <div className="p-3 border-b border-zinc-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="搜索目标位置"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Project list */}
            <div className="flex-1 overflow-y-auto py-2">
              <div className="px-3 py-1.5 text-xs text-zinc-400">全部项目</div>
              {projects
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((project) => (
                  <button
                    key={project.id}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                      selectedProjectId === project.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-zinc-700 hover:bg-zinc-50'
                    )}
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setSelectedFolderId(null);
                      setExpandedFolderIds(new Set());
                    }}
                  >
                    <FolderKanban className={cn(
                      'w-4 h-4',
                      selectedProjectId === project.id ? 'text-blue-500' : 'text-zinc-400'
                    )} />
                    <span className="truncate">{project.name}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* Right: Folder tree */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Selected project header */}
            {selectedProject && (
              <div className="px-4 py-3 border-b border-zinc-100 bg-blue-50">
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">{selectedProject.name}</span>
                </div>
              </div>
            )}

            {/* Folder tree */}
            <div className="flex-1 overflow-y-auto p-3">
              {/* Root level option */}
              <button
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors mb-1',
                  selectedFolderId === null
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-zinc-700 hover:bg-zinc-50'
                )}
                onClick={() => handleFolderSelect(null)}
              >
                <Folder className={cn(
                  'w-4 h-4',
                  selectedFolderId === null ? 'text-blue-500' : 'text-amber-500'
                )} />
                <span>根目录</span>
              </button>

              {/* Folder tree nodes */}
              <FolderTreeView
                nodes={projectFileTree}
                selectedFolderId={selectedFolderId}
                expandedFolderIds={expandedFolderIds}
                sourceNodeId={sourceNode.id}
                onSelect={handleFolderSelect}
                onToggle={handleFolderToggle}
                depth={0}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleConfirm}>
            确定
          </Button>
        </div>
      </div>
    </div>
  );
}

// Folder tree view component
interface FolderTreeViewProps {
  nodes: FileTreeNode[];
  selectedFolderId: string | null;
  expandedFolderIds: Set<string>;
  sourceNodeId: string;
  onSelect: (folderId: string) => void;
  onToggle: (folderId: string) => void;
  depth: number;
}

function FolderTreeView({
  nodes,
  selectedFolderId,
  expandedFolderIds,
  sourceNodeId,
  onSelect,
  onToggle,
  depth,
}: FolderTreeViewProps) {
  const folders = nodes.filter(n => n.type === 'folder');

  return (
    <div className="space-y-0.5">
      {folders.map((folder) => {
        const isExpanded = expandedFolderIds.has(folder.id);
        const isSelected = selectedFolderId === folder.id;
        const isSourceNode = folder.id === sourceNodeId;
        const hasChildren = folder.children && folder.children.filter(c => c.type === 'folder').length > 0;

        // Don't allow selecting the source node as target
        if (isSourceNode) return null;

        return (
          <div key={folder.id}>
            <div
              className={cn(
                'flex items-center gap-1 rounded-md transition-colors',
                isSelected ? 'bg-blue-50' : 'hover:bg-zinc-50'
              )}
              style={{ paddingLeft: `${depth * 16 + 8}px` }}
            >
              {/* Expand/collapse button */}
              <button
                className="p-1 rounded hover:bg-zinc-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(folder.id);
                }}
              >
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                  )
                ) : (
                  <span className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Folder button */}
              <button
                className={cn(
                  'flex-1 flex items-center gap-2 py-1.5 pr-3 text-sm',
                  isSelected ? 'text-blue-700' : 'text-zinc-700'
                )}
                onClick={() => onSelect(folder.id)}
              >
                {isExpanded ? (
                  <FolderOpen className={cn(
                    'w-4 h-4',
                    isSelected ? 'text-blue-500' : 'text-amber-500'
                  )} />
                ) : (
                  <Folder className={cn(
                    'w-4 h-4',
                    isSelected ? 'text-blue-500' : 'text-amber-500'
                  )} />
                )}
                <span className="truncate">{folder.name}</span>
              </button>
            </div>

            {/* Children */}
            {isExpanded && folder.children && (
              <FolderTreeView
                nodes={folder.children}
                selectedFolderId={selectedFolderId}
                expandedFolderIds={expandedFolderIds}
                sourceNodeId={sourceNodeId}
                onSelect={onSelect}
                onToggle={onToggle}
                depth={depth + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

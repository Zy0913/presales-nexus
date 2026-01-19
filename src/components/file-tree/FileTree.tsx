"use client";

import React from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  FileCheck,
  FileCheck2,
  FileClock,
  FileWarning,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileTreeNode, DocumentStatus } from '@/types';

interface FileTreeProps {
  nodes: FileTreeNode[];
  selectedId: string | null;
  expandedIds: Set<string>;
  onSelect: (node: FileTreeNode) => void;
  onToggle: (folderId: string) => void;
  depth?: number;
}

export function FileTree({
  nodes,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  depth = 0,
}: FileTreeProps) {
  return (
    <div className="space-y-0.5">
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggle={onToggle}
          depth={depth}
        />
      ))}
    </div>
  );
}

interface TreeNodeProps {
  node: FileTreeNode;
  selectedId: string | null;
  expandedIds: Set<string>;
  onSelect: (node: FileTreeNode) => void;
  onToggle: (folderId: string) => void;
  depth: number;
}

function TreeNode({
  node,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  depth,
}: TreeNodeProps) {
  const isFolder = node.type === 'folder';
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  const getDocumentIcon = (status?: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return <FileCheck2 className="w-4 h-4 text-emerald-500" />;
      case 'pending_review':
        return <FileClock className="w-4 h-4 text-amber-500" />;
      case 'rejected':
        return <FileWarning className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-zinc-400" />;
    }
  };

  const handleClick = () => {
    if (isFolder) {
      onToggle(node.id);
    } else {
      onSelect(node);
    }
  };

  const handleDoubleClick = () => {
    if (!isFolder) {
      onSelect(node);
    }
  };

  return (
    <div>
      <button
        className={cn(
          'w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm transition-colors file-tree-node',
          'hover:bg-zinc-100',
          isSelected && 'bg-zinc-200/70 text-zinc-900'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {/* Expand/Collapse icon for folders */}
        {isFolder ? (
          <span className="w-4 h-4 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </span>
        ) : (
          <span className="w-4" />
        )}

        {/* Icon */}
        {isFolder ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 text-amber-500" />
          ) : (
            <Folder className="w-4 h-4 text-amber-500" />
          )
        ) : (
          getDocumentIcon(node.status)
        )}

        {/* Name */}
        <span className="truncate flex-1 text-left">{node.name}</span>

        {/* Status indicator for documents */}
        {!isFolder && node.syncStatus === 'conflict' && (
          <span className="w-2 h-2 bg-red-500 rounded-full" title="有冲突" />
        )}
      </button>

      {/* Children */}
      {isFolder && isExpanded && node.children && node.children.length > 0 && (
        <FileTree
          nodes={node.children}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggle={onToggle}
          depth={depth + 1}
        />
      )}
    </div>
  );
}

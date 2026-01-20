"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  FileCheck2,
  FileClock,
  FileWarning,
  Plus,
  FolderPlus,
  Trash2,
  Upload,
  Move,
  Copy,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileTreeNode, DocumentStatus } from '@/types';

interface FileTreeProps {
  nodes: FileTreeNode[];
  selectedId: string | null;
  expandedIds: Set<string>;
  onSelect: (node: FileTreeNode) => void;
  onToggle: (folderId: string) => void;
  onCreateDocument?: (parentId?: string) => void;
  onCreateFolder?: (parentId?: string) => void;
  onUploadFile?: (parentId?: string) => void;
  onDelete?: (node: FileTreeNode) => void;
  onMove?: (node: FileTreeNode) => void;
  onCopy?: (node: FileTreeNode) => void;
  onOpenSearch?: () => void;
  depth?: number;
  isRoot?: boolean;
}

export function FileTree({
  nodes,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  onCreateDocument,
  onCreateFolder,
  onUploadFile,
  onDelete,
  onMove,
  onCopy,
  onOpenSearch,
  depth = 0,
  isRoot = true,
}: FileTreeProps) {
  const [showCreateMenu, setShowCreateMenu] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClick = () => setShowCreateMenu(false);
    if (showCreateMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showCreateMenu]);

  // Calculate menu position
  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 144, // 144px = w-36
      });
    }
    setShowCreateMenu(!showCreateMenu);
  };

  return (
    <div className="space-y-0.5 relative">
      {/* Root level header with always visible actions */}
      {isRoot && depth === 0 && (
        <div className="flex items-center justify-between px-2 py-1.5 mb-1">
          <span className="text-xs font-medium text-zinc-400">文档目录</span>
          <div className="flex items-center gap-0.5">
            <button
              className="p-1 rounded hover:bg-zinc-200 transition-colors"
              onClick={onOpenSearch}
              title="搜索文档"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            <button
              ref={buttonRef}
              className="p-1 rounded hover:bg-zinc-200 transition-colors"
              onClick={handleOpenMenu}
              title="新建"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {/* Create menu dropdown - rendered via portal */}
            {showCreateMenu && typeof window !== 'undefined' && createPortal(
              <div
                className="fixed w-36 bg-white rounded-lg shadow-xl border border-zinc-200 py-1"
                style={{
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                  zIndex: 9999,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
                  onClick={() => {
                    onCreateDocument?.();
                    setShowCreateMenu(false);
                  }}
                >
                  <FileText className="w-4 h-4 text-zinc-400" />
                  新建文档
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
                  onClick={() => {
                    onCreateFolder?.();
                    setShowCreateMenu(false);
                  }}
                >
                  <FolderPlus className="w-4 h-4 text-zinc-400" />
                  新建文件夹
                </button>
                <div className="my-1 border-t border-zinc-100" />
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
                  onClick={() => {
                    onUploadFile?.();
                    setShowCreateMenu(false);
                  }}
                >
                  <Upload className="w-4 h-4 text-zinc-400" />
                  上传文件
                </button>
              </div>,
              document.body
            )}
          </div>
        </div>
      )}
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggle={onToggle}
          onCreateDocument={onCreateDocument}
          onCreateFolder={onCreateFolder}
          onUploadFile={onUploadFile}
          onDelete={onDelete}
          onMove={onMove}
          onCopy={onCopy}
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
  onCreateDocument?: (parentId?: string) => void;
  onCreateFolder?: (parentId?: string) => void;
  onUploadFile?: (parentId?: string) => void;
  onDelete?: (node: FileTreeNode) => void;
  onMove?: (node: FileTreeNode) => void;
  onCopy?: (node: FileTreeNode) => void;
  depth: number;
}

function TreeNode({
  node,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  onCreateDocument,
  onCreateFolder,
  onUploadFile,
  onDelete,
  onMove,
  onCopy,
  depth,
}: TreeNodeProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [showCreateMenu, setShowCreateMenu] = React.useState(false);
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  const [createMenuPosition, setCreateMenuPosition] = React.useState({ top: 0, left: 0 });
  const [moreMenuPosition, setMoreMenuPosition] = React.useState({ top: 0, left: 0 });
  const createButtonRef = React.useRef<HTMLButtonElement>(null);
  const moreButtonRef = React.useRef<HTMLButtonElement>(null);

  const isFolder = node.type === 'folder';
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClick = () => {
      setShowCreateMenu(false);
      setShowMoreMenu(false);
    };
    if (showCreateMenu || showMoreMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showCreateMenu, showMoreMenu]);

  const handleOpenCreateMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (createButtonRef.current) {
      const rect = createButtonRef.current.getBoundingClientRect();
      setCreateMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 144, // 144px = w-36
      });
    }
    setShowCreateMenu(!showCreateMenu);
    setShowMoreMenu(false);
  };

  const handleOpenMoreMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (moreButtonRef.current) {
      const rect = moreButtonRef.current.getBoundingClientRect();
      setMoreMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 128, // 128px = w-32
      });
    }
    setShowMoreMenu(!showMoreMenu);
    setShowCreateMenu(false);
  };

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
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          // Don't close menus on mouse leave if they're open
        }}
      >
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

        {/* Hover actions - simplified to + and ... buttons */}
        <div
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 transition-opacity duration-100",
            (isHovered || showCreateMenu || showMoreMenu) ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Create button (for folders only) */}
          {isFolder && (
            <>
              <button
                ref={createButtonRef}
                className="p-1 rounded bg-white hover:bg-zinc-100 shadow-sm border border-zinc-200 transition-colors"
                onClick={handleOpenCreateMenu}
                title="新建"
              >
                <Plus className="w-3 h-3 text-zinc-600" />
              </button>

              {/* Create menu dropdown - rendered via portal */}
              {showCreateMenu && typeof window !== 'undefined' && createPortal(
                <div
                  className="fixed w-36 bg-white rounded-lg shadow-xl border border-zinc-200 py-1"
                  style={{
                    top: `${createMenuPosition.top}px`,
                    left: `${createMenuPosition.left}px`,
                    zIndex: 9999,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
                    onClick={() => {
                      onCreateDocument?.(node.id);
                      setShowCreateMenu(false);
                    }}
                  >
                    <FileText className="w-4 h-4 text-zinc-400" />
                    新建文档
                  </button>
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
                    onClick={() => {
                      onCreateFolder?.(node.id);
                      setShowCreateMenu(false);
                    }}
                  >
                    <FolderPlus className="w-4 h-4 text-zinc-400" />
                    新建文件夹
                  </button>
                  <div className="my-1 border-t border-zinc-100" />
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
                    onClick={() => {
                      onUploadFile?.(node.id);
                      setShowCreateMenu(false);
                    }}
                  >
                    <Upload className="w-4 h-4 text-zinc-400" />
                    上传文件
                  </button>
                </div>,
                document.body
              )}
            </>
          )}

          {/* More actions button */}
          <>
            <button
              ref={moreButtonRef}
              className="p-1 rounded bg-white hover:bg-zinc-100 shadow-sm border border-zinc-200 transition-colors"
              onClick={handleOpenMoreMenu}
              title="更多操作"
            >
              <MoreHorizontal className="w-3 h-3 text-zinc-600" />
            </button>

            {/* More menu dropdown - rendered via portal */}
            {showMoreMenu && typeof window !== 'undefined' && createPortal(
              <div
                className="fixed w-32 bg-white rounded-lg shadow-xl border border-zinc-200 py-1"
                style={{
                  top: `${moreMenuPosition.top}px`,
                  left: `${moreMenuPosition.left}px`,
                  zIndex: 9999,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
                  onClick={() => {
                    onMove?.(node);
                    setShowMoreMenu(false);
                  }}
                >
                  <Move className="w-4 h-4 text-zinc-400" />
                  移动
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
                  onClick={() => {
                    onCopy?.(node);
                    setShowMoreMenu(false);
                  }}
                >
                  <Copy className="w-4 h-4 text-zinc-400" />
                  复制
                </button>
                <div className="my-1 border-t border-zinc-100" />
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  onClick={() => {
                    onDelete?.(node);
                    setShowMoreMenu(false);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>,
              document.body
            )}
          </>
        </div>
      </div>

      {/* Children */}
      {isFolder && isExpanded && node.children && node.children.length > 0 && (
        <FileTree
          nodes={node.children}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggle={onToggle}
          onCreateDocument={onCreateDocument}
          onCreateFolder={onCreateFolder}
          onUploadFile={onUploadFile}
          onDelete={onDelete}
          onMove={onMove}
          onCopy={onCopy}
          depth={depth + 1}
          isRoot={false}
        />
      )}
    </div>
  );
}

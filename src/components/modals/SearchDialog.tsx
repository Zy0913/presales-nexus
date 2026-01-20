"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  FileText,
  Folder as FolderIcon,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Document, Project, Folder } from '@/types';

// 搜索结果项，包含层级信息
interface SearchResultItem {
  id: string;
  type: 'document' | 'folder';
  name: string;
  depth: number;
  folderId: string | null;
  isFolder: boolean;
  children?: SearchResultItem[];
}

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  projects: Project[];
  folders?: Folder[];
  onSelectDocument?: (docId: string) => void;
  onSelectProject?: (projectId: string) => void;
}

export function SearchDialog({
  isOpen,
  onClose,
  documents,
  projects,
  folders = [],
  onSelectDocument,
  onSelectProject,
}: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // 构建文件夹路径数组的辅助函数
  const getFolderPathArray = useCallback((folderId: string | null): Folder[] => {
    if (!folderId) return [];
    const pathFolders: Folder[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        pathFolders.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }

    return pathFolders;
  }, [folders]);

  // 搜索结果 - 构建层级树形结构
  const searchResults = React.useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();

    // 获取匹配的文档
    const matchedDocs = lowerQuery
      ? documents.filter(doc => doc.title.toLowerCase().includes(lowerQuery))
      : documents.slice(0, 5); // 无搜索时显示最近文档

    if (matchedDocs.length === 0) return [];

    // 构建层级结构
    // 收集所有需要显示的文件夹路径
    const folderMap = new Map<string, { folder: Folder; docs: Document[] }>();
    const rootDocs: Document[] = [];

    matchedDocs.forEach(doc => {
      if (!doc.folderId) {
        rootDocs.push(doc);
      } else {
        const pathFolders = getFolderPathArray(doc.folderId);
        if (pathFolders.length > 0) {
          // 将文档添加到其直接父文件夹
          const parentFolder = pathFolders[pathFolders.length - 1];
          if (!folderMap.has(parentFolder.id)) {
            folderMap.set(parentFolder.id, { folder: parentFolder, docs: [] });
          }
          folderMap.get(parentFolder.id)!.docs.push(doc);

          // 确保所有祖先文件夹也在map中（为了构建完整路径）
          pathFolders.forEach(f => {
            if (!folderMap.has(f.id)) {
              folderMap.set(f.id, { folder: f, docs: [] });
            }
          });
        }
      }
    });

    // 构建树形渲染列表
    type TreeItem = {
      id: string;
      type: 'folder' | 'document';
      name: string;
      depth: number;
      docId?: string;
    };

    const renderList: TreeItem[] = [];

    // 递归添加文件夹及其文档
    const addFolderWithDocs = (folderId: string, depth: number, addedFolders: Set<string>) => {
      if (addedFolders.has(folderId)) return;

      const folderData = folderMap.get(folderId);
      if (!folderData) return;

      // 先添加父文件夹（如果有）
      const parentFolders = getFolderPathArray(folderId);
      parentFolders.forEach((pf, idx) => {
        if (!addedFolders.has(pf.id)) {
          renderList.push({
            id: pf.id,
            type: 'folder',
            name: pf.name,
            depth: idx,
          });
          addedFolders.add(pf.id);
        }
      });

      // 添加该文件夹下的文档
      folderData.docs.forEach(doc => {
        renderList.push({
          id: `doc_${doc.id}`,
          type: 'document',
          name: doc.title,
          depth: parentFolders.length,
          docId: doc.id,
        });
      });
    };

    const addedFolders = new Set<string>();

    // 按文件夹路径排序处理
    const sortedFolderIds = Array.from(folderMap.keys()).sort((a, b) => {
      const pathA = getFolderPathArray(a);
      const pathB = getFolderPathArray(b);
      // 先按路径长度排序，再按名称排序
      if (pathA.length !== pathB.length) return pathA.length - pathB.length;
      return pathA.map(f => f.name).join('/').localeCompare(pathB.map(f => f.name).join('/'));
    });

    sortedFolderIds.forEach(folderId => {
      addFolderWithDocs(folderId, 0, addedFolders);
    });

    // 添加根目录文档
    rootDocs.forEach(doc => {
      renderList.push({
        id: `doc_${doc.id}`,
        type: 'document',
        name: doc.title,
        depth: 0,
        docId: doc.id,
      });
    });

    return renderList;
  }, [query, documents, getFolderPathArray]);

  // 只选择文档项（用于键盘导航）
  const selectableItems = searchResults.filter(item => item.type === 'document');

  // 键盘导航
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, selectableItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = selectableItems[selectedIndex];
      if (selected?.docId) {
        onSelectDocument?.(selected.docId);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [selectableItems, selectedIndex, onClose, onSelectDocument]);

  const handleSelectItem = (item: typeof searchResults[0]) => {
    if (item.type === 'document' && item.docId) {
      onSelectDocument?.(item.docId);
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl">
        <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100">
            <Search className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="搜索文档、项目..."
              className="flex-1 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none bg-transparent"
            />
            {query && (
              <button
                className="p-1 hover:bg-zinc-100 rounded"
                onClick={() => setQuery('')}
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="py-12 text-center">
                <Search className="w-8 h-8 text-zinc-200 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">未找到匹配结果</p>
              </div>
            ) : (
              <div className="py-2">
                {!query && (
                  <div className="px-3 py-1.5">
                    <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                      最近访问
                    </span>
                  </div>
                )}
                {searchResults.map((item) => {
                  const isDocument = item.type === 'document';
                  const docIndex = isDocument ? selectableItems.findIndex(s => s.id === item.id) : -1;
                  const isSelected = isDocument && docIndex === selectedIndex;

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-2 py-1.5 pr-3 transition-colors",
                        isDocument && "cursor-pointer",
                        isDocument && isSelected && "bg-zinc-100",
                        isDocument && !isSelected && "hover:bg-zinc-50"
                      )}
                      style={{ paddingLeft: `${12 + item.depth * 16}px` }}
                      onClick={() => isDocument && handleSelectItem(item)}
                      onMouseEnter={() => isDocument && setSelectedIndex(docIndex)}
                    >
                      {item.type === 'folder' ? (
                        <>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <FolderIcon className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="text-xs font-medium text-zinc-500 truncate">{item.name}</span>
                        </>
                      ) : (
                        <>
                          <div className="w-3.5 shrink-0" /> {/* spacer for alignment */}
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="text-sm text-zinc-900 truncate">{item.name}</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-zinc-100 bg-zinc-50 flex items-center justify-end">
            <span className="text-[11px] text-zinc-400">
              {selectableItems.length} 个文档
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

"use client";

import React from 'react';
import {
  Eye,
  Edit3,
  Columns,
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Table,
  Code,
  Image,
  Link,
  Save,
  History,
  Send,
  Undo,
  Redo,
  Download,
  FileText,
  FileType,
  FileCode,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EditorViewMode, User } from '@/types';

interface EditorToolbarProps {
  viewMode: EditorViewMode;
  canUndo?: boolean;
  canRedo?: boolean;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  onViewModeChange: (mode: EditorViewMode) => void;
  onFormat?: (format: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onViewHistory?: () => void;
  onSubmitReview?: () => void;
  onExport?: (type: string) => void;
  collaborators?: User[];
  currentUser?: User;
  readOnly?: boolean;
  isConflictMode?: boolean;
  onResolveConflict?: (choice: 'local' | 'remote' | 'manual') => void;
}

export function EditorToolbar({
  viewMode,
  canUndo = false,
  canRedo = false,
  isSaving = false,
  hasUnsavedChanges = false,
  onViewModeChange,
  onFormat,
  onUndo,
  onRedo,
  onSave,
  onViewHistory,
  onSubmitReview,
  onExport,
  collaborators = [],
  currentUser,
  readOnly = false,
  isConflictMode = false,
  onResolveConflict,
}: EditorToolbarProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-col border-b border-zinc-200 bg-white">
        {/* Row 1: System & View Controls */}
        <div className="h-10 flex items-center justify-between px-3 border-b border-zinc-100">
          {/* Left: View mode toggle */}
          <div className={`flex items-center gap-2 ${isConflictMode ? 'opacity-50 pointer-events-none' : ''}`}>
            <span className="text-xs font-medium text-zinc-400 mr-1">视图</span>
            <div className="flex items-center bg-zinc-100 rounded-md p-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'edit' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => onViewModeChange('edit')}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>编辑模式</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'preview' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => onViewModeChange('preview')}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>预览模式</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'split' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => onViewModeChange('split')}
                  >
                    <Columns className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>分屏模式</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Right: Actions OR Conflict Controls */}
          <div className="flex items-center gap-2">
            {/* Collaborators Stack (Always show unless in conflict?) Keep it shown */}
            {collaborators.length > 0 && !isConflictMode && (
              <div className="flex items-center mr-2 border-r border-zinc-200 pr-3 h-5">
                <div className="flex items-center -space-x-2">
                  {collaborators.map((user) => {
                    const isCurrentUser = currentUser && user.id === currentUser.id;
                    return (
                      <Tooltip key={user.id}>
                        <TooltipTrigger asChild>
                          <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-medium cursor-default ring-1 ring-white ${
                            isCurrentUser
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {user.name.slice(0, 1)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{isCurrentUser ? '我' : user.name} 正在编辑</TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
                <span className="text-[10px] text-zinc-400 ml-2">{collaborators.length} 人在线</span>
              </div>
            )}

            {isConflictMode ? (
              // Conflict Resolution Controls
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <span className="text-xs text-zinc-500 font-medium mr-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  冲突解决模式
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-zinc-600 hover:text-zinc-900"
                  onClick={() => onResolveConflict?.('local')}
                >
                  保留本地
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-zinc-600 hover:text-zinc-900"
                  onClick={() => onResolveConflict?.('remote')}
                >
                  保留云端
                </Button>
                <div className="w-px h-4 bg-zinc-200 mx-1" />
                <Button
                  size="sm"
                  className="h-8 bg-zinc-900 hover:bg-zinc-800 text-white border-none"
                  onClick={() => onResolveConflict?.('manual')}
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  完成合并
                </Button>
              </div>
            ) : (
              // Normal System Actions
              <div className={`flex items-center gap-2 ${readOnly ? 'opacity-50 pointer-events-none' : ''}`}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Download className="w-4 h-4 mr-1.5" />
                      导出
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-1" align="end">
                    <div className="flex flex-col gap-0.5">
                      <button
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-md text-left transition-colors"
                        onClick={() => onExport?.('pdf')}
                      >
                        <FileText className="w-4 h-4 text-red-500" />
                        导出 PDF
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-md text-left transition-colors"
                        onClick={() => onExport?.('word')}
                      >
                        <FileType className="w-4 h-4 text-blue-500" />
                        导出 Word
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-md text-left transition-colors"
                        onClick={() => onExport?.('markdown')}
                      >
                        <FileCode className="w-4 h-4 text-zinc-500" />
                        导出 Markdown
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8" onClick={onViewHistory}>
                      <History className="w-4 h-4 mr-1.5" />
                      历史
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>版本历史</TooltipContent>
                </Tooltip>

                <div className="w-px h-4 bg-zinc-200 mx-1" />

                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8"
                  onClick={onSave}
                  disabled={isSaving || !hasUnsavedChanges}
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  {isSaving ? '保存中...' : '保存'}
                </Button>

                <Button size="sm" className="h-8" onClick={onSubmitReview}>
                  <Send className="w-4 h-4 mr-1.5" />
                  提交审核
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Formatting Tools */}
        <div className="h-10 flex items-center px-3 gap-1 bg-zinc-50/50 overflow-x-auto">
          {/* Undo/Redo */}
          <div className="flex items-center mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-zinc-500"
                  disabled={!canUndo}
                  onClick={onUndo}
                >
                  <Undo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>撤销</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-zinc-500"
                  disabled={!canRedo}
                  onClick={onRedo}
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>重做</TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-4 bg-zinc-200 mx-1" />

          {/* Headings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => onFormat?.('h1')}
              >
                <Heading1 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>一级标题</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => onFormat?.('h2')}
              >
                <Heading2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>二级标题</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-zinc-200 mx-1" />

          {/* Text Style */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => onFormat?.('bold')}
              >
                <Bold className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>加粗</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => onFormat?.('italic')}
              >
                <Italic className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>斜体</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => onFormat?.('strikethrough')}
              >
                <Strikethrough className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>删除线</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-zinc-200 mx-1" />

          {/* Lists */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => onFormat?.('ul')}
              >
                <List className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>无序列表</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => onFormat?.('ol')}
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>有序列表</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-zinc-200 mx-1" />

          {/* Insert */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => onFormat?.('table')}
              >
                <Table className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>表格</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => onFormat?.('code')}
              >
                <Code className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>代码块</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => onFormat?.('image')}
              >
                <Image className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>图片</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => onFormat?.('link')}
              >
                <Link className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>链接</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

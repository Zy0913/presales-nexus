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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { EditorViewMode } from '@/types';

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
}: EditorToolbarProps) {
  return (
    <TooltipProvider>
      <div className="h-10 bg-white border-b border-zinc-200 flex items-center justify-between px-2">
        {/* Left: View mode toggle */}
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-zinc-100 rounded-md p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'edit' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => onViewModeChange('edit')}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>编辑模式</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => onViewModeChange('preview')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>预览模式</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => onViewModeChange('split')}
                >
                  <Columns className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>分屏模式</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Undo/Redo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
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
                className="h-7 px-2"
                disabled={!canRedo}
                onClick={onRedo}
              >
                <Redo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>重做</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Format buttons */}
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

          <Separator orientation="vertical" className="h-6 mx-2" />

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

          <Separator orientation="vertical" className="h-6 mx-2" />

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

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onViewHistory}>
                <History className="w-4 h-4 mr-1" />
                历史
              </Button>
            </TooltipTrigger>
            <TooltipContent>版本历史</TooltipContent>
          </Tooltip>

          <Button
            variant="secondary"
            size="sm"
            onClick={onSave}
            disabled={isSaving || !hasUnsavedChanges}
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? '保存中...' : '保存'}
          </Button>

          <Button size="sm" onClick={onSubmitReview}>
            <Send className="w-4 h-4 mr-1" />
            提交审核
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}

"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  Languages,
  PenTool,
  BookOpen,
  MessageCircle,
  Send,
  X,
  Wand2,
  GripHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingAIMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  selectedText?: string;
  onAction: (action: 'explain' | 'polish' | 'continue' | 'translate' | 'ask', customQuestion?: string) => void;
  onClose: () => void;
}

export function FloatingAIMenu({ isOpen, position, selectedText, onAction, onClose }: FloatingAIMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [question, setQuestion] = useState('');

  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [hasBeenDragged, setHasBeenDragged] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 当 isOpen 变化时，重置位置
  useEffect(() => {
    if (isOpen) {
      // 计算初始位置（考虑边界）
      const menuWidth = 320;
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
      const adjustedX = Math.max(menuWidth / 2 + 8, Math.min(position.x, viewportWidth - menuWidth / 2 - 8));
      const adjustedY = Math.max(50, Math.min(position.y - 40, viewportHeight - 200));

      setMenuPosition({ x: adjustedX, y: adjustedY });
      setHasBeenDragged(false);
    } else {
      setShowInput(false);
      setQuestion('');
    }
  }, [isOpen, position]);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && !isDragging) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, isDragging]);

  // 拖拽逻辑
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const menuWidth = showInput ? 280 : 320;

      const newX = Math.max(menuWidth / 2, Math.min(e.clientX - dragOffset.x, viewportWidth - menuWidth / 2));
      const newY = Math.max(10, Math.min(e.clientY - dragOffset.y, viewportHeight - 50));

      setMenuPosition({ x: newX, y: newY });
      setHasBeenDragged(true);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, showInput]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = menuRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - (rect.left + rect.width / 2),
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleAsk = useCallback(() => {
    if (question.trim()) {
      onAction('ask', question.trim());
      setQuestion('');
      setShowInput(false);
    }
  }, [question, onAction]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
    if (e.key === 'Escape') {
      if (showInput) {
        setShowInput(false);
        setQuestion('');
      } else {
        onClose();
      }
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      ref={menuRef}
      className={cn(
        "fixed z-[9999] bg-white rounded-xl shadow-floating border border-zinc-200",
        !hasBeenDragged && "animate-in fade-in zoom-in-95 duration-150",
        isDragging && "shadow-xl cursor-grabbing"
      )}
      style={{
        left: menuPosition.x,
        top: menuPosition.y,
        transform: 'translateX(-50%)',
        width: showInput ? 280 : 'auto',
      }}
    >
      {/* 拖拽手柄 */}
      <div
        className={cn(
          "flex items-center justify-center py-1 cursor-grab border-b border-zinc-100 rounded-t-xl",
          isDragging && "cursor-grabbing bg-zinc-50"
        )}
        onMouseDown={handleDragStart}
      >
        <GripHorizontal className="w-4 h-4 text-zinc-300" />
      </div>

      <div className={showInput ? "p-2" : "p-1"}>
        {showInput ? (
          // Expanded input mode
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-medium text-zinc-700">快速问答</span>
              </div>
              <button
                className="p-0.5 hover:bg-zinc-100 rounded"
                onClick={() => {
                  setShowInput(false);
                  setQuestion('');
                }}
              >
                <X className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>

            {selectedText && (
              <div className="px-2 py-1.5 bg-zinc-50 rounded-lg border border-zinc-100">
                <p className="text-[10px] text-zinc-400 mb-0.5">已选中文本</p>
                <p className="text-xs text-zinc-600 line-clamp-2">{selectedText}</p>
              </div>
            )}

            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入问题，回车发送..."
                className="w-full px-3 py-2 pr-9 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
              />
              <button
                className={cn(
                  "absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors",
                  question.trim()
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-zinc-100 text-zinc-400"
                )}
                onClick={handleAsk}
                disabled={!question.trim()}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {[
                { label: '这是什么意思？', icon: BookOpen },
                { label: '如何改进？', icon: Wand2 },
                { label: '有什么问题？', icon: MessageCircle },
              ].map((suggestion) => (
                <button
                  key={suggestion.label}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] text-zinc-600 bg-zinc-50 hover:bg-zinc-100 rounded-md transition-colors"
                  onClick={() => {
                    onAction('ask', suggestion.label);
                    setShowInput(false);
                    setQuestion('');
                  }}
                >
                  <suggestion.icon className="w-3 h-3" />
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Collapsed quick actions mode
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => setShowInput(true)}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              问答
            </Button>

            <div className="w-px h-4 bg-zinc-200" />

            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => onAction('explain')}
            >
              <BookOpen className="w-3.5 h-3.5" />
              解释
            </Button>

            <div className="w-px h-4 bg-zinc-200" />

            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => onAction('polish')}
            >
              <PenTool className="w-3.5 h-3.5" />
              润色
            </Button>

            <div className="w-px h-4 bg-zinc-200" />

            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => onAction('continue')}
            >
              <Sparkles className="w-3.5 h-3.5" />
              续写
            </Button>

            <div className="w-px h-4 bg-zinc-200" />

            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => onAction('translate')}
            >
              <Languages className="w-3.5 h-3.5" />
              翻译
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

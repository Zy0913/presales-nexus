"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Languages, PenTool, BookOpen, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingAIMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onAction: (action: 'explain' | 'polish' | 'continue' | 'translate') => void;
  onClose: () => void;
}

export function FloatingAIMenu({ isOpen, position, onAction, onClose }: FloatingAIMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] flex items-center gap-1 p-1 bg-white rounded-lg shadow-floating border border-zinc-200 animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: position.x,
        top: position.y - 40, // Position above the selection
        transform: 'translateX(-50%)',
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs gap-1.5 hover:bg-indigo-50 hover:text-indigo-600"
        onClick={() => onAction('explain')}
      >
        <BookOpen className="w-3.5 h-3.5" />
        解释
      </Button>

      <div className="w-px h-3 bg-zinc-200" />

      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs gap-1.5 hover:bg-indigo-50 hover:text-indigo-600"
        onClick={() => onAction('polish')}
      >
        <PenTool className="w-3.5 h-3.5" />
        润色
      </Button>

      <div className="w-px h-3 bg-zinc-200" />

      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs gap-1.5 hover:bg-indigo-50 hover:text-indigo-600"
        onClick={() => onAction('continue')}
      >
        <Sparkles className="w-3.5 h-3.5" />
        续写
      </Button>

      <div className="w-px h-3 bg-zinc-200" />

      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs gap-1.5 hover:bg-indigo-50 hover:text-indigo-600"
        onClick={() => onAction('translate')}
      >
        <Languages className="w-3.5 h-3.5" />
        翻译
      </Button>

      <div className="w-px h-3 bg-zinc-200" />

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 hover:bg-zinc-100"
      >
        <MoreHorizontal className="w-3.5 h-3.5 text-zinc-400" />
      </Button>
    </div>,
    document.body
  );
}

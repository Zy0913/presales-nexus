"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  direction: 'left' | 'right';
  onWidthChange?: (width: number) => void;
  className?: string;
  isCollapsed?: boolean;
}

export function ResizablePanel({
  children,
  defaultWidth,
  minWidth,
  maxWidth,
  direction,
  onWidthChange,
  className,
  isCollapsed = false,
}: ResizablePanelProps) {
  const [width, setWidth] = React.useState(defaultWidth);
  const [isResizing, setIsResizing] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !panelRef.current) return;

      const rect = panelRef.current.getBoundingClientRect();
      let newWidth: number;

      if (direction === 'left') {
        newWidth = e.clientX - rect.left;
      } else {
        newWidth = rect.right - e.clientX;
      }

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setWidth(newWidth);
      onWidthChange?.(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, direction, minWidth, maxWidth, onWidthChange]);

  if (isCollapsed) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className={cn('relative flex-shrink-0', className)}
      style={{ width }}
    >
      {children}

      {/* 拖拽手柄 */}
      <div
        className={cn(
          'absolute top-0 bottom-0 w-1 cursor-col-resize group z-20',
          direction === 'left' ? 'right-0' : 'left-0'
        )}
        onMouseDown={handleMouseDown}
      >
        <div
          className={cn(
            'absolute top-0 bottom-0 w-[3px] transition-colors duration-150',
            direction === 'left' ? 'right-0' : 'left-0',
            isResizing ? 'bg-zinc-400' : 'bg-transparent group-hover:bg-zinc-300'
          )}
        />
      </div>
    </div>
  );
}

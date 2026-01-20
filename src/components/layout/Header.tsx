"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project, User, Notification, Document, Folder } from '@/types';
import { cn } from '@/lib/utils';
import { SearchDialog } from '@/components/modals/SearchDialog';

interface HeaderProps {
  currentProject: Project | null;
  currentPath: string[];
  user: User;
  notifications: Notification[];
  unreadCount: number;
  documents?: Document[];
  projects?: Project[];
  folders?: Folder[];
  onProjectChange?: (projectId: string) => void;
  onSelectDocument?: (docId: string) => void;
  onSelectProject?: (projectId: string) => void;
  isSearchOpen?: boolean;
  onSearchOpenChange?: (open: boolean) => void;
}

export function Header({
  currentPath,
  user,
  notifications,
  unreadCount,
  documents = [],
  projects = [],
  folders = [],
  onSelectDocument,
  onSelectProject,
  isSearchOpen: externalIsSearchOpen,
  onSearchOpenChange,
}: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [internalIsSearchOpen, setInternalIsSearchOpen] = React.useState(false);

  // 支持受控和非受控模式
  const isSearchOpen = externalIsSearchOpen !== undefined ? externalIsSearchOpen : internalIsSearchOpen;
  const setIsSearchOpen = (open: boolean) => {
    if (onSearchOpenChange) {
      onSearchOpenChange(open);
    } else {
      setInternalIsSearchOpen(open);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClick = () => {
      setIsUserMenuOpen(false);
      setIsNotificationsOpen(false);
    };
    if (isUserMenuOpen || isNotificationsOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isUserMenuOpen, isNotificationsOpen]);

  return (
    <header className="h-12 bg-white border-b border-zinc-200 flex items-center justify-between px-3">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <button 
          onClick={() => window.location.href = window.location.origin + (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/'}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden bg-white">
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon.ico`} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-zinc-900 text-sm hidden sm:block">售前协作平台</span>
        </button>

        {/* Breadcrumb - 只在有路径时显示分割线和面包屑 */}
        {currentPath.length > 0 && (
          <>
            <div className="w-px h-5 bg-zinc-200" />
            <nav className="flex items-center gap-1 text-[13px] text-zinc-500">
              {currentPath.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="mx-1 text-zinc-300">/</span>}
                  <span className={cn(
                    'hover:text-zinc-700 cursor-pointer transition-colors',
                    index === currentPath.length - 1 && 'text-zinc-700 font-medium'
                  )}>
                    {item}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <button
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[13px] text-zinc-500">搜索文档...</span>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="w-4 h-4 text-zinc-500" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsUserMenuOpen(false);
            }}
          >
            <Bell className="w-4 h-4 text-zinc-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-zinc-900 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {/* Notifications dropdown */}
          {isNotificationsOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-80 bg-white rounded-lg shadow-floating border border-zinc-200 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 border-b border-zinc-100">
                <h3 className="font-medium text-sm text-zinc-900">通知</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-zinc-400 text-sm">
                    暂无通知
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'p-3 border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer transition-colors',
                        !notif.isRead && 'bg-zinc-50'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full mt-2 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-zinc-900">{notif.title}</p>
                          <p className="text-xs text-zinc-500 truncate mt-0.5">{notif.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-zinc-100">
                <Button variant="ghost" size="sm" className="w-full text-zinc-600 hover:text-zinc-900 text-xs">
                  查看全部
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            className="flex items-center gap-1.5 p-1 rounded-md hover:bg-zinc-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotificationsOpen(false);
            }}
          >
            <div className="w-7 h-7 bg-zinc-900 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {user.name.slice(0, 1)}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-400 hidden sm:block" />
          </button>

          {/* User dropdown */}
          {isUserMenuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-floating border border-zinc-200 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 border-b border-zinc-100">
                <p className="font-medium text-sm text-zinc-900">{user.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-medium rounded">
                  {user.role === 'manager' ? '经理' : user.role === 'supervisor' ? '主管' : '员工'}
                </span>
              </div>
              <div className="p-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors">
                  <UserIcon className="w-4 h-4 text-zinc-400" />
                  个人资料
                </button>
                <Link href="/admin/users" className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors">
                  <Users className="w-4 h-4 text-zinc-400" />
                  用户管理
                </Link>
                <div className="my-1 border-t border-zinc-100" />
                <button className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Dialog */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        documents={documents}
        projects={projects}
        folders={folders}
        onSelectDocument={onSelectDocument}
        onSelectProject={onSelectProject}
      />
    </header>
  );
}

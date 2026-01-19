"use client";

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  User as UserIcon,
  Command,
  FolderKanban,
  Star,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project, User, Notification } from '@/types';
import { cn } from '@/lib/utils';

// Mock projects for dropdown
const recentProjects = [
  { id: 'proj_001', name: '智慧园区综合管理平台', customer: '深圳前海科技园', isStarred: true, status: 'active' },
  { id: 'proj_002', name: '企业数字化转型咨询', customer: '华南制造集团', isStarred: false, status: 'active' },
  { id: 'proj_003', name: '金融风控系统升级', customer: '南方银行', isStarred: true, status: 'pending' },
];

interface HeaderProps {
  currentProject: Project | null;
  currentPath: string[];
  user: User;
  notifications: Notification[];
  unreadCount: number;
  onProjectChange?: (projectId: string) => void;
  onSearch?: (query: string) => void;
}

export function Header({
  currentProject,
  currentPath,
  user,
  notifications,
  unreadCount,
}: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = React.useState(false);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClick = () => {
      setIsUserMenuOpen(false);
      setIsNotificationsOpen(false);
      setIsProjectMenuOpen(false);
    };
    if (isUserMenuOpen || isNotificationsOpen || isProjectMenuOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isUserMenuOpen, isNotificationsOpen, isProjectMenuOpen]);

  return (
    <header className="h-12 bg-white border-b border-zinc-200 flex items-center justify-between px-3">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <Link href="/projects" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-xs">PN</span>
          </div>
          <span className="font-semibold text-zinc-900 text-sm hidden sm:block">售前协作平台</span>
        </Link>

        <div className="w-px h-5 bg-zinc-200" />

        {/* Project Selector */}
        {currentProject && (
          <div className="relative">
            <button
              className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-zinc-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsProjectMenuOpen(!isProjectMenuOpen);
                setIsUserMenuOpen(false);
                setIsNotificationsOpen(false);
              }}
            >
              <span className="text-[13px] font-medium text-zinc-700">{currentProject.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Project dropdown */}
            {isProjectMenuOpen && (
              <div
                className="absolute left-0 top-full mt-1 w-80 bg-white rounded-lg shadow-floating border border-zinc-200 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2 border-b border-zinc-100">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="搜索项目..."
                      className="w-full pl-8 pr-3 py-1.5 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </div>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1.5 text-xs font-medium text-zinc-400 uppercase">最近项目</div>
                  {recentProjects.map((project) => (
                    <button
                      key={project.id}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 transition-colors',
                        currentProject.id === project.id && 'bg-zinc-50'
                      )}
                    >
                      <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FolderKanban className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-zinc-900 truncate">{project.name}</span>
                          {project.isStarred && <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
                        </div>
                        <div className="text-xs text-zinc-500 truncate">{project.customer}</div>
                      </div>
                      <div className="flex-shrink-0">
                        {project.status === 'active' ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-600">
                            <Clock className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-amber-600">
                            <Clock className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-2 border-t border-zinc-100">
                  <Link
                    href="/projects"
                    className="flex items-center justify-center gap-1.5 w-full px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-md transition-colors"
                  >
                    <FolderKanban className="w-4 h-4" />
                    查看全部项目
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Breadcrumb */}
        {currentPath.length > 0 && (
          <>
            <div className="w-px h-5 bg-zinc-200 hidden md:block" />
            <nav className="hidden md:flex items-center gap-1 text-[13px] text-zinc-500">
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
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors">
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[13px] text-zinc-500">搜索...</span>
          <div className="flex items-center gap-0.5 ml-4">
            <kbd className="px-1.5 py-0.5 bg-white rounded text-[10px] text-zinc-400 border border-zinc-200">
              <Command className="w-2.5 h-2.5 inline" />
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-white rounded text-[10px] text-zinc-400 border border-zinc-200">K</kbd>
          </div>
        </button>
        <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
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
              setIsProjectMenuOpen(false);
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
              setIsProjectMenuOpen(false);
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
                <button className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors">
                  <Settings className="w-4 h-4 text-zinc-400" />
                  设置
                </button>
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
    </header>
  );
}

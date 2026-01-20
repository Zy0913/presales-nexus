"use client";

import React from 'react';
import { Notification, NotificationType } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  CheckCircle,
  FileCheck,
  Target,
  AlertTriangle,
  Clock,
  FolderOpen,
  Check,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface NotificationCenterProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (notificationId: string) => void;
}

type FilterType = 'all' | 'approval' | 'task' | 'project' | 'read';

export function NotificationCenter({
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
}: NotificationCenterProps) {
  const [filter, setFilter] = React.useState<FilterType>('all');

  // 获取通知图标
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'approval_request':
      case 'approval_result':
        return <FileCheck className="w-4 h-4" />;
      case 'task_assigned':
      case 'task_update':
        return <Target className="w-4 h-4" />;
      case 'task_blocked':
        return <AlertTriangle className="w-4 h-4" />;
      case 'task_deadline':
      case 'project_deadline':
        return <Clock className="w-4 h-4" />;
      case 'document_moved':
        return <FolderOpen className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  // 筛选通知
  const filteredNotifications = React.useMemo(() => {
    switch (filter) {
      case 'approval':
        return notifications.filter(n =>
          n.type === 'approval_request' || n.type === 'approval_result'
        );
      case 'task':
        return notifications.filter(n =>
          n.type.startsWith('task_')
        );
      case 'project':
        return notifications.filter(n =>
          n.type === 'project_deadline'
        );
      case 'read':
        return notifications.filter(n => n.isRead);
      default:
        return notifications.filter(n => !n.isRead);
    }
  }, [notifications, filter]);

  // 统计各类通知数量
  const counts = React.useMemo(() => {
    return {
      all: notifications.filter(n => !n.isRead).length,
      approval: notifications.filter(n =>
        !n.isRead && (n.type === 'approval_request' || n.type === 'approval_result')
      ).length,
      task: notifications.filter(n =>
        !n.isRead && n.type.startsWith('task_')
      ).length,
      project: notifications.filter(n =>
        !n.isRead && n.type === 'project_deadline'
      ).length,
      read: notifications.filter(n => n.isRead).length,
    };
  }, [notifications]);

  return (
    <div className="h-full flex flex-col bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-zinc-900">消息中心</h1>
            {counts.all > 0 && (
              <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 border-0 rounded-full">
                {counts.all} 条未读
              </Badge>
            )}
          </div>
          {counts.all > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 h-8"
            >
              <Check className="w-4 h-4 mr-1.5" />
              全部标为已读
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-white border-r border-zinc-200 p-4 flex-shrink-0">
          <nav className="space-y-1">
            <button
              onClick={() => setFilter('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                全部未读
              </span>
              {counts.all > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-zinc-200 text-zinc-700 text-xs font-medium rounded">
                  {counts.all}
                </span>
              )}
            </button>

            <button
              onClick={() => setFilter('approval')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'approval'
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                审批相关
              </span>
              {counts.approval > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-zinc-200 text-zinc-700 text-xs font-medium rounded">
                  {counts.approval}
                </span>
              )}
            </button>

            <button
              onClick={() => setFilter('task')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'task'
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                任务相关
              </span>
              {counts.task > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-zinc-200 text-zinc-700 text-xs font-medium rounded">
                  {counts.task}
                </span>
              )}
            </button>

            <button
              onClick={() => setFilter('project')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'project'
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                项目动态
              </span>
              {counts.project > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-zinc-200 text-zinc-700 text-xs font-medium rounded">
                  {counts.project}
                </span>
              )}
            </button>

            <div className="my-2 border-t border-zinc-200" />

            <button
              onClick={() => setFilter('read')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'read'
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                已读消息
              </span>
              {counts.read > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-zinc-200 text-zinc-700 text-xs font-medium rounded">
                  {counts.read}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto bg-zinc-50">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-base font-medium text-zinc-900 mb-1">
                暂无消息
              </h3>
              <p className="text-sm text-zinc-500">
                {filter === 'read' ? '还没有已读消息' : '您已查看所有消息'}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-1">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg border transition-all hover:shadow-sm cursor-pointer group ${
                    notification.isRead
                      ? 'border-zinc-200'
                      : 'border-zinc-300 shadow-sm'
                  }`}
                  onClick={() => onNotificationClick(notification)}
                >
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 text-zinc-600 group-hover:bg-zinc-200 transition-colors">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content - 横向紧凑布局 */}
                      <div className="flex-1 min-w-0 flex items-center gap-4">
                        {/* 左侧：标题和发送者 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {!notification.isRead && (
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                            )}
                            <h3 className="text-sm font-semibold text-zinc-900 truncate">
                              {notification.title}
                            </h3>
                            {notification.senderName && (
                              <>
                                <span className="text-zinc-300">·</span>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <div className="w-4 h-4 bg-zinc-200 rounded-full flex items-center justify-center text-[9px] font-medium text-zinc-700">
                                    {notification.senderName.charAt(0)}
                                  </div>
                                  <span className="text-xs text-zinc-600">
                                    {notification.senderName}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-zinc-600 truncate">
                            {notification.content}
                          </p>
                        </div>

                        {/* 中间：项目名称 */}
                        {notification.projectName && (
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <FolderOpen className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="text-xs text-zinc-500 max-w-[120px] truncate">
                              {notification.projectName}
                            </span>
                          </div>
                        )}

                        {/* 右侧：时间和操作 */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-zinc-500 whitespace-nowrap w-16 text-right">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: zhCN,
                            })}
                          </span>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {notification.actionLabel && (
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-zinc-900 hover:bg-zinc-800 w-20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNotificationClick(notification);
                                }}
                              >
                                {notification.actionLabel}
                              </Button>
                            )}
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkAsRead(notification.id);
                                }}
                                title="标为已读"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteNotification(notification.id);
                              }}
                              title="删除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

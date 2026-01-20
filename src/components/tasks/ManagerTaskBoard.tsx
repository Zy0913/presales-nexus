'use client';

import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority, User } from '@/types';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  TrendingUp,
  ArrowUpDown,
  XCircle,
  Filter,
  Users2,
  Folder,
  CheckSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

interface ManagerTaskBoardProps {
  tasks: Task[];
  users: User[];
  currentUser: User;
  onOpenDocument: (documentId: string, documentName: string) => void;
  onUpdateProgress: (taskId: string, progress: number) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus, note?: string) => void;
}

// 优先级配置
const priorityConfig = {
  urgent: { label: '紧急', icon: AlertCircle, color: 'text-red-600' },
  high: { label: '高', icon: TrendingUp, color: 'text-orange-600' },
  normal: { label: '普通', icon: Circle, color: 'text-blue-600' },
  low: { label: '低', icon: ArrowUpDown, color: 'text-zinc-400' },
};

// 状态配置
const statusConfig = {
  todo: { label: '待办', icon: Circle, color: 'text-zinc-400' },
  in_progress: { label: '进行中', icon: Clock, color: 'text-blue-600' },
  completed: { label: '已完成', icon: CheckCircle2, color: 'text-emerald-600' },
  blocked: { label: '受阻', icon: XCircle, color: 'text-red-600' },
};

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `逾期 ${Math.abs(diffDays)} 天`;
  } else if (diffDays === 0) {
    return '今天';
  } else if (diffDays === 1) {
    return '明天';
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
  }
};

const isOverdue = (dueDate?: string): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

// 只读任务行组件（其他人的任务）
const ReadOnlyTaskRow: React.FC<{
  task: Task;
  onOpenDocument: (documentId: string, documentName: string) => void;
}> = ({ task, onOpenDocument }) => {
  const StatusIcon = statusConfig[task.status].icon;
  const PriorityIcon = priorityConfig[task.priority].icon;
  const overdue = isOverdue(task.dueDate);

  return (
    <div
      className="group grid grid-cols-[20px_20px_1fr_180px_80px] gap-4 px-4 py-3 cursor-pointer text-sm items-center border-b border-zinc-100 last:border-none bg-white transition-colors hover:bg-zinc-50/50"
      onClick={() => onOpenDocument(task.documentId, task.documentName)}
    >
      {/* 1. 状态列 */}
      <div className="flex items-center justify-center w-5 h-5 shrink-0" title={statusConfig[task.status].label}>
        <StatusIcon className={cn("w-4 h-4", statusConfig[task.status].color)} />
      </div>

      {/* 2. 优先级列 */}
      <div className="flex items-center justify-center w-5 h-5 shrink-0" title={`优先级: ${priorityConfig[task.priority].label}`}>
        <PriorityIcon className={cn("w-3.5 h-3.5", priorityConfig[task.priority].color)} />
      </div>

      {/* 3. 标题与项目 */}
      <div className="flex items-center gap-3 min-w-0 overflow-hidden">
        <span className={cn(
          "font-medium text-zinc-900 truncate",
          task.status === 'completed' && "text-zinc-500 line-through decoration-zinc-300"
        )}>
          {task.title}
        </span>
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 text-zinc-500 truncate max-w-[120px] shrink-0 border border-zinc-200">
          {task.projectName}
        </span>
      </div>

      {/* 4. 进度条 */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", task.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500')}
            style={{ width: `${task.progress}%` }}
          />
        </div>
        <span className="text-[10px] w-8 text-right text-zinc-500 font-mono">{task.progress}%</span>
      </div>

      {/* 5. 截止时间 */}
      <div className={cn("text-right truncate text-xs text-zinc-500", overdue && task.status !== 'completed' ? "text-red-600 font-medium" : "")}>
        {task.dueDate ? formatDate(task.dueDate) : '-'}
      </div>
    </div>
  );
};

// 可编辑任务行组件（当前用户的任务）
const EditableTaskRow: React.FC<{
  task: Task;
  onOpenDocument: (documentId: string, documentName: string) => void;
  onUpdateProgress: (taskId: string, progress: number) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus, note?: string) => void;
}> = ({ task, onOpenDocument, onUpdateProgress, onUpdateStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [progressValue, setProgressValue] = useState(task.progress);

  const StatusIcon = statusConfig[task.status].icon;
  const PriorityIcon = priorityConfig[task.priority].icon;
  const overdue = isOverdue(task.dueDate);

  React.useEffect(() => {
    setProgressValue(task.progress);
  }, [task.progress]);

  const handleProgressChange = (vals: number[]) => {
    setProgressValue(vals[0]);
  };

  const handleProgressCommit = () => {
    onUpdateProgress(task.id, progressValue);
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStatus(task.id, 'completed');
  };

  const handleBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    const note = prompt('请说明受阻原因：');
    if (note) {
      onUpdateStatus(task.id, 'blocked', note);
    }
  };

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStatus(task.id, 'in_progress');
  };

  const reversedTimeline = useMemo(() => {
    return [...task.timeline].reverse();
  }, [task.timeline]);

  return (
    <div className="group border-b border-zinc-100 last:border-none bg-white transition-colors hover:bg-zinc-50/50">
      {/* 紧凑行内容 */}
      <div
        className={cn(
          "grid grid-cols-[20px_20px_1fr_180px_80px_24px] gap-4 px-4 py-3 cursor-pointer text-sm items-center",
          isExpanded && "bg-zinc-50"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* 1. 状态列 */}
        <div className="flex items-center justify-center w-5 h-5 shrink-0" title={statusConfig[task.status].label}>
          <StatusIcon className={cn("w-4 h-4", statusConfig[task.status].color)} />
        </div>

        {/* 2. 优先级列 */}
        <div className="flex items-center justify-center w-5 h-5 shrink-0" title={`优先级: ${priorityConfig[task.priority].label}`}>
          <PriorityIcon className={cn("w-3.5 h-3.5", priorityConfig[task.priority].color)} />
        </div>

        {/* 3. 标题与项目 */}
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          <span className={cn(
            "font-medium text-zinc-900 truncate",
            task.status === 'completed' && "text-zinc-500 line-through decoration-zinc-300"
          )}>
            {task.title}
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 text-zinc-500 truncate max-w-[120px] shrink-0 border border-zinc-200">
            {task.projectName}
          </span>
        </div>

        {/* 4. 进度条 */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", task.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500')}
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <span className="text-[10px] w-8 text-right text-zinc-500 font-mono">{task.progress}%</span>
        </div>

        {/* 5. 截止时间 */}
        <div className={cn("text-right truncate text-xs text-zinc-500", overdue && task.status !== 'completed' ? "text-red-600 font-medium" : "")}>
          {task.dueDate ? formatDate(task.dueDate) : '-'}
        </div>

        {/* 6. 头像 */}
        <div className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-medium text-zinc-600 shrink-0">
          {task.assigneeName.slice(0, 1)}
        </div>
      </div>

      {/* 展开详情 */}
      {isExpanded && (
        <div className="px-12 pb-6 pt-2 bg-zinc-50 border-t border-zinc-100/50">
          <div className="flex gap-8">
            {/* 左侧：详情与操作 */}
            <div className="flex-1 min-w-0 flex flex-col h-full">
              {/* 路径信息 */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-4">
                <Folder className="w-3.5 h-3.5" />
                <span className="truncate">{task.documentPath}</span>
              </div>

              {/* 描述 */}
              {task.description && (
                <div className="text-sm text-zinc-700 mb-6 leading-relaxed bg-white p-4 rounded-lg border border-zinc-200/60 shadow-sm">
                  {task.description}
                </div>
              )}

              {/* 进度控制 */}
              <div className="mb-6 bg-white p-4 rounded-lg border border-zinc-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-zinc-500">当前进度</span>
                  <span className="text-xs font-bold text-zinc-900 font-mono">{progressValue}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    defaultValue={[progressValue]}
                    value={[progressValue]}
                    max={100}
                    step={5}
                    className="flex-1"
                    onValueChange={handleProgressChange}
                  />
                  <Button
                    size="sm"
                    variant={progressValue !== task.progress ? "default" : "secondary"}
                    disabled={progressValue === task.progress}
                    onClick={handleProgressCommit}
                    className={cn(
                      "h-6 text-xs px-3 transition-all",
                      progressValue !== task.progress ? "opacity-100" : "opacity-50"
                    )}
                  >
                    保存
                  </Button>
                </div>
              </div>

              {/* 底部操作栏 */}
              <div className="mt-auto pt-4 border-t border-zinc-200/60 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => { e.stopPropagation(); onOpenDocument(task.documentId, task.documentName); }}
                  className="h-8 text-xs bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
                  打开文档
                </Button>

                <div className="flex items-center gap-2">
                  {task.status === 'todo' && (
                    <Button size="sm" onClick={handleStart} className="h-8 text-xs bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm">
                      开始工作
                    </Button>
                  )}
                  {task.status === 'in_progress' && (
                    <>
                      <Button size="sm" variant="ghost" onClick={handleBlock} className="h-8 text-xs text-red-600 hover:bg-red-50 hover:text-red-700">
                        标记受阻
                      </Button>
                      <Button size="sm" onClick={handleComplete} className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-transparent">
                        <CheckSquare className="w-3.5 h-3.5 mr-1.5" />
                        完成任务
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 右侧：时间线 */}
            <div className="w-72 pt-1 border-l border-zinc-200/60 pl-8 flex-shrink-0">
              <h4 className="text-xs font-semibold text-zinc-900 mb-4 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                动态记录
              </h4>
              <div className="space-y-5 relative before:absolute before:left-[3px] before:top-1.5 before:bottom-0 before:w-px before:bg-zinc-200">
                {reversedTimeline.map((event, index) => (
                  <div key={index} className="relative pl-4 group/timeline">
                    <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 ring-4 ring-zinc-50 group-hover/timeline:bg-blue-500 transition-colors" />
                    <div className="text-xs">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-medium text-zinc-900">{event.userName}</span>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(event.timestamp).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                        </span>
                      </div>
                      <div className="text-zinc-500">
                        {event.type === 'assigned' && '分配了任务'}
                        {event.type === 'started' && '开始工作'}
                        {event.type === 'progress_updated' && '更新进度'}
                        {event.type === 'completed' && '完成任务'}
                        {event.type === 'blocked' && '标记受阻'}
                        {event.type === 'status_changed' && '更新状态'}
                      </div>
                      {event.note && (
                        <div className="mt-1.5 text-zinc-600 bg-white p-2 rounded border border-zinc-100 text-[11px] leading-snug shadow-sm">
                          {event.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 人员分组组件
const PersonGroup: React.FC<{
  user: User;
  tasks: Task[];
  isCurrentUser: boolean;
  onOpenDocument: (documentId: string, documentName: string) => void;
  onUpdateProgress: (taskId: string, progress: number) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus, note?: string) => void;
}> = ({ user, tasks, isCurrentUser, onOpenDocument, onUpdateProgress, onUpdateStatus }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      overdue: tasks.filter(t => t.status !== 'completed' && isOverdue(t.dueDate)).length,
    };
  }, [tasks]);

  const roleLabel = {
    manager: '经理',
    supervisor: '主管',
    employee: '员工',
  }[user.role];

  return (
    <div className="border-b border-zinc-200 last:border-none">
      {/* 人员头部 */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-zinc-50/80 cursor-pointer hover:bg-zinc-100/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-zinc-200"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-zinc-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            )}
          </Button>

          {/* 头像 */}
          <div className="w-7 h-7 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-700">
            {user.name.slice(0, 1)}
          </div>

          {/* 姓名和角色 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-900">{user.name}</span>
            {isCurrentUser && (
              <Badge variant="primary" className="text-[10px] px-1.5 py-0 h-4 bg-blue-100 text-blue-700 border-0">
                我
              </Badge>
            )}
            <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 bg-zinc-200 text-zinc-600 border-0">
              {roleLabel}
            </Badge>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">总计</span>
            <span className="font-semibold text-zinc-900">{stats.total}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-medium text-zinc-700">{stats.inProgress}</span>
          </div>
          {stats.overdue > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-medium text-red-600">{stats.overdue}</span>
            </div>
          )}
        </div>
      </div>

      {/* 任务列表 */}
      {isExpanded && (
        <div>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-zinc-400 text-sm bg-white">
              暂无任务
            </div>
          ) : (
            tasks.map(task => (
              isCurrentUser ? (
                <EditableTaskRow
                  key={task.id}
                  task={task}
                  onOpenDocument={onOpenDocument}
                  onUpdateProgress={onUpdateProgress}
                  onUpdateStatus={onUpdateStatus}
                />
              ) : (
                <ReadOnlyTaskRow
                  key={task.id}
                  task={task}
                  onOpenDocument={onOpenDocument}
                />
              )
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default function ManagerTaskBoard({
  tasks,
  users,
  currentUser,
  onOpenDocument,
  onUpdateProgress,
  onUpdateStatus,
}: ManagerTaskBoardProps) {
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'taskCount' | 'overdue'>('taskCount');

  const { visibleTasks, visibleUsers } = useMemo(() => {
    let filteredTasks = tasks;
    let filteredUsers = users;

    if (currentUser.role === 'manager') {
      filteredTasks = tasks;
      filteredUsers = users;
    } else if (currentUser.role === 'supervisor') {
      const employeeIds = users.filter(u => u.role === 'employee').map(u => u.id);
      filteredTasks = tasks.filter(t => employeeIds.includes(t.assigneeId));
      filteredUsers = users.filter(u => u.role === 'employee');
    } else {
      filteredTasks = tasks.filter(t => t.assigneeId === currentUser.id);
      filteredUsers = [currentUser];
    }

    return { visibleTasks: filteredTasks, visibleUsers: filteredUsers };
  }, [tasks, users, currentUser]);

  const tasksByUser = useMemo(() => {
    const grouped = new Map<string, Task[]>();

    visibleUsers.forEach(user => {
      let userTasks = visibleTasks.filter(t => t.assigneeId === user.id);

      if (filterStatus !== 'all') {
        userTasks = userTasks.filter(t => t.status === filterStatus);
      }
      if (filterPriority !== 'all') {
        userTasks = userTasks.filter(t => t.priority === filterPriority);
      }

      grouped.set(user.id, userTasks);
    });

    return grouped;
  }, [visibleTasks, visibleUsers, filterStatus, filterPriority]);

  const sortedUsers = useMemo(() => {
    const currentUserObj = visibleUsers.find(u => u.id === currentUser.id);
    const otherUsers = visibleUsers.filter(u => u.id !== currentUser.id);

    const usersWithStats = otherUsers.map(user => {
      const userTasks = tasksByUser.get(user.id) || [];
      return {
        user,
        taskCount: userTasks.length,
        overdueCount: userTasks.filter(t => t.status !== 'completed' && isOverdue(t.dueDate)).length,
      };
    });

    usersWithStats.sort((a, b) => {
      if (sortBy === 'name') {
        return a.user.name.localeCompare(b.user.name, 'zh-CN');
      } else if (sortBy === 'taskCount') {
        return b.taskCount - a.taskCount;
      } else {
        return b.overdueCount - a.overdueCount;
      }
    });

    const sortedOthers = usersWithStats.map(item => item.user);
    return currentUserObj ? [currentUserObj, ...sortedOthers] : sortedOthers;
  }, [visibleUsers, tasksByUser, sortBy, currentUser.id]);

  const overallStats = useMemo(() => {
    return {
      totalTasks: visibleTasks.length,
      totalUsers: visibleUsers.length,
      inProgress: visibleTasks.filter(t => t.status === 'in_progress').length,
      overdue: visibleTasks.filter(t => t.status !== 'completed' && isOverdue(t.dueDate)).length,
      todo: visibleTasks.filter(t => t.status === 'todo').length,
    };
  }, [visibleTasks, visibleUsers]);

  const viewTitle = currentUser.role === 'manager' ? '团队任务总览' : '团队任务看板';

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-shrink-0 border-b border-zinc-200 px-6 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
            {viewTitle}
            <Badge variant="default" className="bg-zinc-100 text-zinc-600 font-normal rounded-full px-2">
              {overallStats.totalUsers} 人
            </Badge>
          </h1>
          <div className="h-4 w-px bg-zinc-200" />
          <div className="flex items-center gap-2">
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as TaskStatus | 'all')}>
              <SelectTrigger className="w-[120px] h-8 text-xs border-transparent bg-transparent hover:bg-zinc-100 text-zinc-600 shadow-none px-2">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Filter className="w-3.5 h-3.5 flex-shrink-0" />
                  <SelectValue placeholder="状态" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="todo">待办</SelectItem>
                <SelectItem value="in_progress">进行中</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="blocked">受阻</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as TaskPriority | 'all')}>
              <SelectTrigger className="w-[120px] h-8 text-xs border-transparent bg-transparent hover:bg-zinc-100 text-zinc-600 shadow-none px-2">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <SelectValue placeholder="优先级" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部优先级</SelectItem>
                <SelectItem value="urgent">紧急</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="normal">普通</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'name' | 'taskCount' | 'overdue')}>
              <SelectTrigger className="w-[120px] h-8 text-xs border-transparent bg-transparent hover:bg-zinc-100 text-zinc-600 shadow-none px-2">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <ArrowUpDown className="w-3.5 h-3.5 flex-shrink-0" />
                  <SelectValue placeholder="排序" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="taskCount">任务数量</SelectItem>
                <SelectItem value="overdue">逾期数量</SelectItem>
                <SelectItem value="name">姓名</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-medium text-zinc-700">{overallStats.inProgress}</span> 进行中
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-medium text-zinc-700">{overallStats.overdue}</span> 逾期
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-300" />
            <span>{overallStats.todo} 待办</span>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 bg-white">
        {sortedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
            <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3">
              <Users2 className="w-5 h-5 text-zinc-300" />
            </div>
            <p className="text-sm">暂无团队成员</p>
          </div>
        ) : (
          <div>
            {sortedUsers.map(user => (
              <PersonGroup
                key={user.id}
                user={user}
                tasks={tasksByUser.get(user.id) || []}
                isCurrentUser={user.id === currentUser.id}
                onOpenDocument={onOpenDocument}
                onUpdateProgress={onUpdateProgress}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}


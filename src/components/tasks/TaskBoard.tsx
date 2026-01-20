'use client';

import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  TrendingUp,
  CheckSquare,
  AlertTriangle,
  Folder,
  Calendar,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  XCircle
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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from '@/components/ui/badge';
import { Slider } from "@/components/ui/slider";

interface TaskBoardProps {
  tasks: Task[];
  currentUserId: string;
  onOpenDocument: (documentId: string, documentName: string) => void;
  onUpdateProgress: (taskId: string, progress: number) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus, note?: string) => void;
}

// 优先级配置
const priorityConfig = {
  urgent: { label: '紧急', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  high: { label: '高', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  normal: { label: '普通', icon: Circle, color: 'text-blue-600', bg: 'bg-blue-100' },
  low: { label: '低', icon: ArrowUpDown, color: 'text-zinc-400', bg: 'bg-zinc-100' },
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

// 单行任务组件
const TaskRow: React.FC<{
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

  // 当任务本身的进度更新时（可能由其他地方更新），同步本地状态
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
      {/* 紧凑行内容 - 使用 Grid 布局保证对齐 */}
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

        {/* 3. 标题与项目 - 关键：使用 min-w-0 和 flex 布局 */}
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          <span className={cn(
            "font-medium text-zinc-900 truncate",
            task.status === 'completed' && "text-zinc-500 line-through decoration-zinc-300"
          )}>
            {task.title}
          </span>
          {/* 项目标签 - 设为 shrink-0 防止被压缩，或者允许被压缩 */}
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 text-zinc-500 truncate max-w-[120px] shrink-0 border border-zinc-200">
            {task.projectName}
          </span>
        </div>

        {/* 4. 进度条 - 固定宽度 120px */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", task.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500')}
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <span className="text-[10px] w-8 text-right text-zinc-500 font-mono">{task.progress}%</span>
        </div>

        {/* 5. 截止时间 - 固定宽度 80px */}
        <div className={cn("text-right truncate text-xs text-zinc-500", overdue && task.status !== 'completed' ? "text-red-600 font-medium" : "")}>
          {task.dueDate ? formatDate(task.dueDate) : '-'}
        </div>

        {/* 6. 头像 - 固定宽度 24px */}
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

              {/* 进度控制 (Slider) */}
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

              {/* 底部操作栏 - 使用 mt-auto 确保到底部 */}
              <div className="mt-auto pt-4 border-t border-zinc-200/60 flex items-center justify-between">
                {/* 左侧：查看文档 */}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => { e.stopPropagation(); onOpenDocument(task.documentId, task.documentName); }}
                  className="h-8 text-xs bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
                  打开文档
                </Button>

                {/* 右侧：状态操作 */}
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

export default function TaskBoard({
  tasks,
  currentUserId,
  onOpenDocument,
  onUpdateProgress,
  onUpdateStatus,
}: TaskBoardProps) {
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter((task) => task.assigneeId === currentUserId);
    if (filterStatus !== 'all') filtered = filtered.filter((task) => task.status === filterStatus);
    if (filterPriority !== 'all') filtered = filtered.filter((task) => task.priority === filterPriority);

    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return filtered;
  }, [tasks, currentUserId, filterStatus, filterPriority, sortBy]);

  const stats = useMemo(() => {
    const myTasks = tasks.filter((task) => task.assigneeId === currentUserId);
    return {
      total: myTasks.length,
      todo: myTasks.filter((t) => t.status === 'todo').length,
      inProgress: myTasks.filter((t) => t.status === 'in_progress').length,
      completed: myTasks.filter((t) => t.status === 'completed').length,
      overdue: myTasks.filter((t) => t.status !== 'completed' && isOverdue(t.dueDate)).length,
    };
  }, [tasks, currentUserId]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 极简头部 */}
      <div className="flex-shrink-0 border-b border-zinc-200 px-6 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
            我的任务
            <Badge variant="default" className="bg-zinc-100 text-zinc-600 font-normal rounded-full px-2">
              {stats.total}
            </Badge>
          </h1>

          <div className="h-4 w-px bg-zinc-200" />

          {/* 筛选器组 */}
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

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'dueDate' | 'priority' | 'createdAt')}>
              <SelectTrigger className="w-[120px] h-8 text-xs border-transparent bg-transparent hover:bg-zinc-100 text-zinc-600 shadow-none px-2">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <ArrowUpDown className="w-3.5 h-3.5 flex-shrink-0" />
                  <SelectValue placeholder="排序" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">截止时间</SelectItem>
                <SelectItem value="priority">优先级</SelectItem>
                <SelectItem value="createdAt">创建时间</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 统计摘要文本 */}
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-medium text-zinc-700">{stats.inProgress}</span> 进行中
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-medium text-zinc-700">{stats.overdue}</span> 逾期
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-300" />
            <span>{stats.todo} 待办</span>
          </div>
        </div>
      </div>

      {/* 清单表头 - 更新 Grid 布局 */}
      <div className="grid grid-cols-[20px_20px_1fr_180px_80px_24px] gap-4 px-6 py-2 bg-zinc-50/80 border-b border-zinc-200 text-[11px] font-medium text-zinc-500 select-none">
        <div className="text-center"></div> {/* 状态 */}
        <div className="text-center"></div> {/* 优先 */}
        <div className="pl-1">任务名称</div>
        <div className="pl-1">进度</div>
        <div className="text-right">截止时间</div>
        <div></div> {/* 头像 */}
      </div>

      {/* 任务列表 */}
      <ScrollArea className="flex-1 bg-white">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
            <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3">
              <CheckSquare className="w-5 h-5 text-zinc-300" />
            </div>
            <p className="text-sm">暂无匹配任务</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {filteredAndSortedTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
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

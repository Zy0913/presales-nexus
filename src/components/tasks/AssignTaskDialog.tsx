'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, User, Document } from '@/types';
import { X, Calendar as CalendarIcon, User as UserIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
// Assuming DatePicker is available and follows standard pattern
import { DatePicker } from '@/components/ui/date-picker';

interface AssignTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
  documentPath: string;
  projectName: string;
  projectId: string;
  teamMembers: User[];
  currentUser: User;
  onAssign: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => void;
}

// 优化后的优先级配置
const priorityOptions: { value: TaskPriority; label: string; color: string; bg: string; border: string }[] = [
  { value: 'urgent', label: '紧急', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  { value: 'high', label: '高', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { value: 'normal', label: '普通', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { value: 'low', label: '低', color: 'text-zinc-600', bg: 'bg-zinc-100', border: 'border-zinc-200' },
];

export default function AssignTaskDialog({
  isOpen,
  onClose,
  document,
  documentPath,
  projectName,
  projectId,
  teamMembers,
  currentUser,
  onAssign,
}: AssignTaskDialogProps) {
  const [title, setTitle] = useState(`编写《${document.title}》`);
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState('');

  // 只显示员工角色的成员
  const availableMembers = teamMembers.filter((member) => member.role === 'employee');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!assigneeId) {
      // In a real app, use toast here
      return;
    }

    const assignee = teamMembers.find((m) => m.id === assigneeId);
    if (!assignee) return;

    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'timeline'> = {
      projectId,
      projectName,
      title,
      description: description || undefined,
      assignerId: currentUser.id,
      assignerName: currentUser.name,
      assigneeId,
      assigneeName: assignee.name,
      assignedAt: new Date().toISOString(),
      status: 'todo',
      priority,
      // Convert Date object to ISO string if it exists
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      progress: 0,
      documentId: document.id,
      documentName: document.title,
      documentPath,
    };

    onAssign(newTask);
    handleClose();
  };

  const handleClose = () => {
    setTitle(`编写《${document.title}》`);
    setAssigneeId('');
    setPriority('normal');
    setDueDate(undefined);
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-zinc-200 scale-100 animate-in zoom-in-95 duration-200">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">分配任务</h2>
            <p className="text-xs text-zinc-500 mt-0.5">将当前文档分配给团队成员</p>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1.5 rounded-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* 关联文档卡片 */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 flex items-start gap-3">
              <div className="p-2 bg-white rounded-md border border-zinc-100 shadow-sm">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <div className="font-medium text-sm text-zinc-900 truncate">{document.title}</div>
                <div className="text-xs text-zinc-500 mt-0.5 truncate">{documentPath}</div>
              </div>
            </div>

            {/* 任务标题 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">
                任务标题 <span className="text-red-500">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入任务标题"
                className="bg-white"
                required
              />
            </div>

            {/* 分配给 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">
                分配给 <span className="text-red-500">*</span>
              </label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger className="w-full bg-white">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <UserIcon className="w-4 h-4 text-zinc-400" />
                    <SelectValue placeholder="请选择成员" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {availableMembers.length === 0 ? (
                    <div className="p-2 text-sm text-zinc-500 text-center">暂无员工成员</div>
                  ) : (
                    availableMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {availableMembers.length === 0 && (
                <p className="text-xs text-red-600 mt-1">当前项目没有可分配的员工成员</p>
              )}
            </div>

            {/* 优先级 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">
                优先级 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPriority(option.value)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-lg border transition-all duration-200",
                      priority === option.value
                        ? cn(option.bg, option.border, "ring-1 ring-offset-1 ring-blue-500/30")
                        : "border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-600"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full", priority === option.value ? option.color.replace('text-', 'bg-') : "bg-zinc-300")} />
                    <span className={cn("text-xs font-medium", priority === option.value ? option.color : "")}>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 截止时间 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">
                截止时间 <span className="text-zinc-400 font-normal">(可选)</span>
              </label>
              <div className="relative">
                <DatePicker
                  date={dueDate}
                  setDate={setDueDate}
                  className="w-full"
                />
              </div>
            </div>

            {/* 任务说明 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">
                任务说明 <span className="text-zinc-400 font-normal">(可选)</span>
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] resize-none"
                placeholder="请描述任务的具体要求、注意事项等..."
              />
            </div>
          </div>
        </form>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="text-zinc-600 border-zinc-200 hover:bg-zinc-100 h-9"
          >
            取消
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!assigneeId || availableMembers.length === 0}
            className="bg-zinc-900 hover:bg-zinc-800 text-white h-9 shadow-sm"
          >
            确认分配
          </Button>
        </div>
      </div>
    </div>
  );
}

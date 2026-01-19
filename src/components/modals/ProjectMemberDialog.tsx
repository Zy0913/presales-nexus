"use client";

import React, { useState } from 'react';
import { X, Search, UserPlus, Trash2, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMockData } from '@/hooks/use-mock-data';
import { ProjectMember } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast, ToastContainer } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

interface ProjectMemberDialogProps {
  isOpen: boolean;
  projectId: string;
  projectName: string;
  onClose: () => void;
}

export function ProjectMemberDialog({
  isOpen,
  projectId,
  projectName,
  onClose,
}: ProjectMemberDialogProps) {
  const {
    users,
    getProjectMembers,
    addProjectMember,
    updateProjectMemberRole,
    removeProjectMember
  } = useMockData();

  const { toasts, showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteSearchQuery, setInviteSearchQuery] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  if (!isOpen) return null;

  const currentMembers = getProjectMembers(projectId);
  const currentMemberUserIds = new Set(currentMembers.map(m => m.userId));

  // Users available to add
  const availableUsers = users.filter(u =>
    !currentMemberUserIds.has(u.id) &&
    (u.name.toLowerCase().includes(inviteSearchQuery.toLowerCase()) ||
     u.email.toLowerCase().includes(inviteSearchQuery.toLowerCase()))
  );

  const filteredMembers = currentMembers.filter(m =>
    m.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = (userId: string) => {
    addProjectMember(projectId, userId, 'viewer');
    showToast('成员已添加', 'success');
    // Don't close popover to allow multiple adds
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[600px] max-h-[600px] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <ToastContainer toasts={toasts} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">项目成员管理</h2>
            <p className="text-sm text-zinc-500">{projectName}</p>
          </div>
          <button
            className="p-1 rounded hover:bg-zinc-100 transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Actions Bar */}
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="搜索成员..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <Popover open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <PopoverTrigger asChild>
                <Button size="sm" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  添加成员
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="end">
                <div className="p-2 border-b border-zinc-100">
                  <Input
                    placeholder="搜索用户邀请..."
                    className="h-8 text-xs border-none focus-visible:ring-0 px-2 bg-zinc-50"
                    value={inviteSearchQuery}
                    onChange={(e) => setInviteSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-60 overflow-y-auto p-1">
                  {availableUsers.length === 0 ? (
                    <div className="p-3 text-center text-xs text-zinc-400">
                      没有可邀请的用户
                    </div>
                  ) : (
                    availableUsers.map(user => (
                      <button
                        key={user.id}
                        className="w-full flex items-center justify-between p-2 rounded hover:bg-zinc-100 transition-colors group text-left"
                        onClick={() => handleAddMember(user.id)}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] shrink-0">
                            {user.name.slice(0, 1)}
                          </div>
                          <div className="truncate">
                            <div className="text-sm text-zinc-700 font-medium">{user.name}</div>
                            <div className="text-[10px] text-zinc-400 truncate">{user.email}</div>
                          </div>
                        </div>
                        <Plus className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600" />
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-1">
              {filteredMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium text-sm">
                      {member.user.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-900">{member.user.name}</div>
                      <div className="text-xs text-zinc-500">{member.user.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      defaultValue={member.role}
                      onValueChange={(val) => {
                        updateProjectMemberRole(member.id, val as ProjectMember['role']);
                        showToast('权限已更新', 'success');
                      }}
                    >
                      <SelectTrigger className="h-8 w-24 border-zinc-100 bg-white text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">负责人</SelectItem>
                        <SelectItem value="editor">编辑者</SelectItem>
                        <SelectItem value="viewer">查看者</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        if (confirm(`确定要将 ${member.user.name} 移出项目吗？`)) {
                          removeProjectMember(member.id);
                          showToast('成员已移除', 'success');
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredMembers.length === 0 && (
                <div className="text-center py-8 text-zinc-500 text-sm">
                  没有找到匹配的成员
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

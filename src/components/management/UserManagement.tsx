"use client";

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMockData } from '@/hooks/use-mock-data';
import { UserRole } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/toast';

export function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { showToast } = useToast();

  // Filter users
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该用户吗？此操作无法撤销。')) {
      deleteUser(id);
      showToast('用户已删除', 'success');
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-50 overflow-hidden">
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-zinc-200 m-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">用户管理</h2>
            <p className="text-sm text-zinc-500 mt-0.5">管理企业所有成员及其系统权限</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            添加用户
          </Button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 flex items-center gap-4 bg-zinc-50/50 border-b border-zinc-100 flex-shrink-0">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="搜索姓名、邮箱或部门..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white h-9"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-zinc-50 border-b border-zinc-200 z-10">
              <tr>
                <th className="px-6 py-3 font-medium text-zinc-500">成员信息</th>
                <th className="px-6 py-3 font-medium text-zinc-500">角色</th>
                <th className="px-6 py-3 font-medium text-zinc-500">部门</th>
                <th className="px-6 py-3 font-medium text-zinc-500">加入时间</th>
                <th className="px-6 py-3 font-medium text-zinc-500 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                        {user.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="font-medium text-zinc-900">{user.name}</div>
                        <div className="text-xs text-zinc-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Select
                      defaultValue={user.role}
                      onValueChange={(val) => {
                        updateUser(user.id, { role: val as UserRole });
                        showToast('角色已更新', 'success');
                      }}
                    >
                      <SelectTrigger className="h-8 w-32 border-zinc-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">经理</SelectItem>
                        <SelectItem value="supervisor">主管</SelectItem>
                        <SelectItem value="employee">员工</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    未找到匹配的用户
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-[480px] p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">添加新用户</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 p-1 hover:bg-zinc-100 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addUser({
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                department: formData.get('department') as string,
                role: 'employee',
                avatar: ''
              });
              setIsAddModalOpen(false);
              showToast('用户已添加', 'success');
            }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">姓名</label>
                <Input name="name" required placeholder="例如：张三" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">邮箱</label>
                <Input name="email" type="email" required placeholder="zhangsan@company.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">部门</label>
                <Input name="department" required placeholder="例如：产品部" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>取消</Button>
                <Button type="submit">添加用户</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

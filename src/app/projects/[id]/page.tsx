"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  MoreHorizontal,
  Building2,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Clock,
  Star,
  Edit3,
  Trash2,
  UserPlus,
  FolderOpen,
  Activity,
  Target,
  DollarSign,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TabType = 'overview' | 'documents' | 'members';

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'member';
  avatar?: string;
  joinedAt: string;
}

interface ProjectActivity {
  id: string;
  type: 'document' | 'member' | 'status' | 'comment';
  content: string;
  user: string;
  createdAt: string;
}

// Mock project data
const mockProject = {
  id: 'proj_001',
  name: '智慧园区综合管理平台',
  customer: '深圳前海科技园',
  customerContact: '张经理',
  customerPhone: '138-0000-0000',
  customerEmail: 'zhang@qianhai.com',
  customerAddress: '深圳市南山区前海科技园A栋',
  industry: '智慧城市',
  status: 'active' as const,
  progress: 65,
  description: '为前海科技园打造一体化智慧园区管理平台，包含物联网、能耗管理、安防监控、访客管理、停车管理等核心模块，实现园区运营的数字化、智能化、可视化。',
  expectedAmount: '¥ 380万',
  createdAt: '2024-01-10',
  updatedAt: '2024-01-19',
  startDate: '2024-02-01',
  expectedEndDate: '2024-06-30',
  isStarred: true,
  tags: ['物联网', '智慧园区', '大数据'],
};

const mockMembers: ProjectMember[] = [
  { id: 'm1', name: '李明', email: 'liming@company.com', role: 'owner', joinedAt: '2024-01-10' },
  { id: 'm2', name: '王芳', email: 'wangfang@company.com', role: 'manager', joinedAt: '2024-01-10' },
  { id: 'm3', name: '陈强', email: 'chenqiang@company.com', role: 'member', joinedAt: '2024-01-12' },
  { id: 'm4', name: '赵丽', email: 'zhaoli@company.com', role: 'member', joinedAt: '2024-01-15' },
  { id: 'm5', name: '刘伟', email: 'liuwei@company.com', role: 'member', joinedAt: '2024-01-18' },
];

const mockActivities: ProjectActivity[] = [
  { id: 'a1', type: 'document', content: '创建了文档「系统架构设计」', user: '李明', createdAt: '2024-01-19 14:30' },
  { id: 'a2', type: 'member', content: '添加了成员 刘伟', user: '王芳', createdAt: '2024-01-18 10:15' },
  { id: 'a3', type: 'document', content: '更新了文档「客户需求调研报告」', user: '陈强', createdAt: '2024-01-17 16:45' },
  { id: 'a4', type: 'status', content: '将项目状态更改为「进行中」', user: '李明', createdAt: '2024-01-15 09:00' },
  { id: 'a5', type: 'document', content: '上传了文档「竞品分析报告」', user: '赵丽', createdAt: '2024-01-14 11:20' },
];

const roleLabels: Record<string, { label: string; color: string }> = {
  owner: { label: '负责人', color: 'bg-zinc-900 text-white' },
  manager: { label: '管理员', color: 'bg-zinc-200 text-zinc-700' },
  member: { label: '成员', color: 'bg-zinc-100 text-zinc-600' },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = React.useState<TabType>('overview');
  const [showAddMemberModal, setShowAddMemberModal] = React.useState(false);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: '概览', icon: <Target className="w-4 h-4" /> },
    { id: 'documents', label: '资料库', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'members', label: '成员', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/projects" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-700">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">返回项目列表</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                设置
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Project title section */}
          <div className="py-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-zinc-900">{mockProject.name}</h1>
                  {mockProject.isStarred && <Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-md">
                    进行中
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {mockProject.customer}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    创建于 {mockProject.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {mockProject.expectedAmount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/">
                  <Button size="sm">
                    <Edit3 className="w-4 h-4 mr-1" />
                    进入编辑
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors',
                  activeTab === tab.id
                    ? 'bg-zinc-50 text-zinc-900 border-t border-x border-zinc-200 -mb-px'
                    : 'text-zinc-500 hover:text-zinc-700'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'overview' && <OverviewTab project={mockProject} activities={mockActivities} />}
        {activeTab === 'documents' && <DocumentsTab />}
        {activeTab === 'members' && (
          <MembersTab members={mockMembers} onAddMember={() => setShowAddMemberModal(true)} />
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && <AddMemberModal onClose={() => setShowAddMemberModal(false)} />}
    </div>
  );
}

// Overview Tab
function OverviewTab({ project, activities }: { project: typeof mockProject; activities: ProjectActivity[] }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left column - Project info */}
      <div className="col-span-2 space-y-6">
        {/* Progress card */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h3 className="font-semibold text-zinc-900 mb-4">项目进度</h3>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-zinc-500">整体进度</span>
            <span className="font-medium text-zinc-900">{project.progress}%</span>
          </div>
          <div className="h-3 bg-zinc-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-zinc-900 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-zinc-50 rounded-lg">
              <div className="text-zinc-500 mb-1">开始日期</div>
              <div className="font-medium text-zinc-900">{project.startDate}</div>
            </div>
            <div className="p-3 bg-zinc-50 rounded-lg">
              <div className="text-zinc-500 mb-1">预计结束</div>
              <div className="font-medium text-zinc-900">{project.expectedEndDate}</div>
            </div>
            <div className="p-3 bg-zinc-50 rounded-lg">
              <div className="text-zinc-500 mb-1">最后更新</div>
              <div className="font-medium text-zinc-900">{project.updatedAt}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h3 className="font-semibold text-zinc-900 mb-3">项目描述</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">{project.description}</p>
          <div className="flex items-center gap-2 mt-4">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Customer info */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h3 className="font-semibold text-zinc-900 mb-4">客户信息</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-zinc-500" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">客户名称</div>
                <div className="text-sm font-medium text-zinc-900">{project.customer}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-zinc-500" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">联系人</div>
                <div className="text-sm font-medium text-zinc-900">{project.customerContact}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-zinc-500" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">联系电话</div>
                <div className="text-sm font-medium text-zinc-900">{project.customerPhone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-zinc-500" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">邮箱</div>
                <div className="text-sm font-medium text-zinc-900">{project.customerEmail}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right column - Activity */}
      <div className="space-y-6">
        {/* Quick stats */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h3 className="font-semibold text-zinc-900 mb-4">项目统计</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                文档数量
              </span>
              <span className="font-semibold text-zinc-900">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500 flex items-center gap-2">
                <Users className="w-4 h-4" />
                项目成员
              </span>
              <span className="font-semibold text-zinc-900">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                本周活动
              </span>
              <span className="font-semibold text-zinc-900">12</span>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h3 className="font-semibold text-zinc-900 mb-4">最近动态</h3>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-zinc-600">{activity.user.slice(0, 1)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-700">
                    <span className="font-medium">{activity.user}</span> {activity.content}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">{activity.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Documents Tab - Redirect to main editor
function DocumentsTab() {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
      <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FolderOpen className="w-8 h-8 text-zinc-400" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 mb-2">项目资料库</h3>
      <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto">
        在资料库中管理项目的所有文档，支持多级目录、Markdown编辑、AI辅助写作等功能
      </p>
      <Link href="/">
        <Button>
          <Edit3 className="w-4 h-4 mr-2" />
          进入资料库
        </Button>
      </Link>
    </div>
  );
}

// Members Tab
function MembersTab({ members, onAddMember }: { members: ProjectMember[]; onAddMember: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <h3 className="font-semibold text-zinc-900">项目成员 ({members.length})</h3>
        <Button size="sm" onClick={onAddMember}>
          <UserPlus className="w-4 h-4 mr-1" />
          添加成员
        </Button>
      </div>
      <div className="divide-y divide-zinc-100">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">{member.name.slice(0, 1)}</span>
              </div>
              <div>
                <div className="font-medium text-zinc-900">{member.name}</div>
                <div className="text-sm text-zinc-500">{member.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn('px-2 py-1 text-xs font-medium rounded-md', roleLabels[member.role].color)}>
                {roleLabels[member.role].label}
              </span>
              <span className="text-xs text-zinc-400">加入于 {member.joinedAt}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Add Member Modal
function AddMemberModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('member');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('成员添加成功！（原型演示）');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">添加成员</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 text-xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">成员邮箱</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入成员邮箱地址"
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">角色</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
            >
              <option value="member">成员</option>
              <option value="manager">管理员</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" className="flex-1">
              添加
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

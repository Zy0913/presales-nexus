"use client";

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  StarOff,
  RefreshCw,
  Settings2,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast, ToastContainer } from '@/components/ui/toast';

// Project status types
type ProjectStatus = 'active' | 'pending' | 'negotiating' | 'won' | 'lost' | 'archived';

interface Project {
  id: string;
  projectNo: string;
  name: string;
  customer: string;
  category: string;
  status: ProjectStatus;
  salesPerson: string;
  salesRegion: string;
  region: string;
  budgetAmount: number;
  contractAmount: number;
  currency: string;
  source: string;
  contractNo: string;
  expectedCloseDate: string;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
  responsible: string;
}

// Mock projects data
const mockProjects: Project[] = [
  {
    id: 'proj_001',
    projectNo: 'PRJ-2024-001',
    name: '智慧园区综合管理平台',
    customer: '深圳前海科技园',
    category: '智慧城市',
    status: 'active',
    salesPerson: '张伟',
    salesRegion: '华南区',
    region: '广东省',
    budgetAmount: 3800000,
    contractAmount: 0,
    currency: 'CNY',
    source: 'CRM同步',
    contractNo: '',
    expectedCloseDate: '2024-03-15',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-19',
    isStarred: true,
    responsible: '李明',
  },
  {
    id: 'proj_002',
    projectNo: 'PRJ-2024-002',
    name: '企业数字化转型咨询',
    customer: '华南制造集团',
    category: '咨询服务',
    status: 'negotiating',
    salesPerson: '王芳',
    salesRegion: '华南区',
    region: '广东省',
    budgetAmount: 1500000,
    contractAmount: 0,
    currency: 'CNY',
    source: '主动开发',
    contractNo: '',
    expectedCloseDate: '2024-02-28',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-18',
    isStarred: false,
    responsible: '王芳',
  },
  {
    id: 'proj_003',
    projectNo: 'PRJ-2024-003',
    name: '金融风控系统升级',
    customer: '南方银行',
    category: '金融科技',
    status: 'pending',
    salesPerson: '陈强',
    salesRegion: '华南区',
    region: '广东省',
    budgetAmount: 5200000,
    contractAmount: 0,
    currency: 'CNY',
    source: '老客户推荐',
    contractNo: '',
    expectedCloseDate: '2024-04-30',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-17',
    isStarred: true,
    responsible: '陈强',
  },
  {
    id: 'proj_004',
    projectNo: 'PRJ-2023-045',
    name: '医疗信息化平台',
    customer: '省人民医院',
    category: '医疗健康',
    status: 'won',
    salesPerson: '赵丽',
    salesRegion: '华东区',
    region: '浙江省',
    budgetAmount: 2800000,
    contractAmount: 2650000,
    currency: 'CNY',
    source: '招投标',
    contractNo: 'HT-2024-0012',
    expectedCloseDate: '2024-01-10',
    createdAt: '2023-10-20',
    updatedAt: '2024-01-10',
    isStarred: false,
    responsible: '赵丽',
  },
  {
    id: 'proj_005',
    projectNo: 'PRJ-2024-004',
    name: '供应链管理系统',
    customer: '东方物流',
    category: '物流供应链',
    status: 'active',
    salesPerson: '刘伟',
    salesRegion: '华北区',
    region: '北京市',
    budgetAmount: 2000000,
    contractAmount: 0,
    currency: 'CNY',
    source: '展会获客',
    contractNo: '',
    expectedCloseDate: '2024-03-20',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-19',
    isStarred: false,
    responsible: '刘伟',
  },
  {
    id: 'proj_006',
    projectNo: 'PRJ-2023-038',
    name: '智慧校园建设项目',
    customer: '深圳大学',
    category: '智慧教育',
    status: 'won',
    salesPerson: '张伟',
    salesRegion: '华南区',
    region: '广东省',
    budgetAmount: 4500000,
    contractAmount: 4200000,
    currency: 'CNY',
    source: '招投标',
    contractNo: 'HT-2023-0089',
    expectedCloseDate: '2023-12-15',
    createdAt: '2023-06-15',
    updatedAt: '2023-12-20',
    isStarred: false,
    responsible: '张伟',
  },
  {
    id: 'proj_007',
    projectNo: 'PRJ-2024-005',
    name: '零售数据中台建设',
    customer: '优选超市连锁',
    category: '零售电商',
    status: 'lost',
    salesPerson: '王芳',
    salesRegion: '华东区',
    region: '上海市',
    budgetAmount: 1800000,
    contractAmount: 0,
    currency: 'CNY',
    source: '主动开发',
    contractNo: '',
    expectedCloseDate: '2024-01-20',
    createdAt: '2023-11-10',
    updatedAt: '2024-01-15',
    isStarred: false,
    responsible: '王芳',
  },
  {
    id: 'proj_008',
    projectNo: 'PRJ-2024-006',
    name: '新能源车联网平台',
    customer: '绿动汽车',
    category: '智能制造',
    status: 'negotiating',
    salesPerson: '陈强',
    salesRegion: '华东区',
    region: '江苏省',
    budgetAmount: 6500000,
    contractAmount: 0,
    currency: 'CNY',
    source: '老客户推荐',
    contractNo: '',
    expectedCloseDate: '2024-05-15',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-18',
    isStarred: true,
    responsible: '陈强',
  },
];

const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  active: { label: '跟进中', color: 'bg-blue-50 text-blue-700' },
  pending: { label: '待跟进', color: 'bg-amber-50 text-amber-700' },
  negotiating: { label: '谈判中', color: 'bg-purple-50 text-purple-700' },
  won: { label: '已成交', color: 'bg-emerald-50 text-emerald-700' },
  lost: { label: '已丢单', color: 'bg-zinc-100 text-zinc-500' },
  archived: { label: '已归档', color: 'bg-zinc-100 text-zinc-500' },
};

const categories = ['全部类别', '智慧城市', '咨询服务', '金融科技', '医疗健康', '物流供应链', '智慧教育', '零售电商', '智能制造'];
const statuses = ['全部状态', '跟进中', '待跟进', '谈判中', '已成交', '已丢单', '已归档'];
const regions = ['全部区域', '华南区', '华东区', '华北区', '西南区', '西北区'];

function formatCurrency(amount: number, currency: string = 'CNY'): string {
  if (amount === 0) return '-';
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('全部类别');
  const [selectedStatus, setSelectedStatus] = React.useState('全部状态');
  const [selectedRegion, setSelectedRegion] = React.useState('全部区域');
  const [showNewProjectModal, setShowNewProjectModal] = React.useState(false);
  const [projects, setProjects] = React.useState(mockProjects);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = React.useState<Project | null>(null);
  const { toasts, showToast } = useToast();
  const pageSize = 10;

  // Filter projects
  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.projectNo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '全部类别' || project.category === selectedCategory;
      const matchesStatus =
        selectedStatus === '全部状态' || statusConfig[project.status].label === selectedStatus;
      const matchesRegion = selectedRegion === '全部区域' || project.salesRegion === selectedRegion;
      return matchesSearch && matchesCategory && matchesStatus && matchesRegion;
    });
  }, [projects, searchQuery, selectedCategory, selectedStatus, selectedRegion]);

  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleStar = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const project = projects.find(p => p.id === projectId);
    setProjects(projects.map((p) => (p.id === projectId ? { ...p, isStarred: !p.isStarred } : p)));
    if (project) {
      showToast(project.isStarred ? '已取消星标' : '已添加星标', 'success');
    }
  };

  const toggleRowSelection = (projectId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedRows.size === paginatedProjects.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedProjects.map((p) => p.id)));
    }
  };

  const handleDeleteProject = () => {
    if (deletingProject) {
      setProjects(projects.filter(p => p.id !== deletingProject.id));
      showToast(`项目「${deletingProject.name}」已删除`, 'success');
      setDeletingProject(null);
    }
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    showToast(`项目「${updatedProject.name}」已更新`, 'success');
    setEditingProject(null);
  };

  // Stats
  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === 'active' || p.status === 'negotiating').length,
    pending: projects.filter((p) => p.status === 'pending').length,
    won: projects.filter((p) => p.status === 'won').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budgetAmount, 0),
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">PN</span>
            </div>
            <span className="font-semibold text-zinc-900">售前协作平台</span>
          </Link>
          <div className="w-px h-6 bg-zinc-200" />
          <h1 className="text-lg font-medium text-zinc-900">项目管理</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowNewProjectModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            新建项目
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="p-6">
        {/* Stats cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-4">
            <div className="text-sm text-zinc-500 mb-1">全部项目</div>
            <div className="text-2xl font-semibold text-zinc-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-xl border border-zinc-200 p-4">
            <div className="text-sm text-zinc-500 mb-1">进行中</div>
            <div className="text-2xl font-semibold text-blue-600">{stats.active}</div>
          </div>
          <div className="bg-white rounded-xl border border-zinc-200 p-4">
            <div className="text-sm text-zinc-500 mb-1">待跟进</div>
            <div className="text-2xl font-semibold text-amber-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-xl border border-zinc-200 p-4">
            <div className="text-sm text-zinc-500 mb-1">已成交</div>
            <div className="text-2xl font-semibold text-emerald-600">{stats.won}</div>
          </div>
          <div className="bg-white rounded-xl border border-zinc-200 p-4">
            <div className="text-sm text-zinc-500 mb-1">总预算金额</div>
            <div className="text-2xl font-semibold text-zinc-900">{formatCurrency(stats.totalBudget)}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-zinc-200 mb-4">
          <div className="p-4 flex items-center justify-between gap-4 border-b border-zinc-100">
            {/* Search */}
            <div className="flex-1 max-w-sm relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="搜索项目名称、客户、项目号..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>

              <Button variant="ghost" size="sm" onClick={() => showToast('正在刷新...', 'info')}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                  <th className="w-10 px-3 py-3">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === paginatedProjects.length && paginatedProjects.length > 0}
                        onChange={toggleAllSelection}
                        className="rounded border-zinc-300"
                      />
                    </div>
                  </th>
                  <th className="w-8 px-2 py-3"></th>
                  <th className="text-left text-xs font-medium text-zinc-500 px-3 py-3 whitespace-nowrap w-[240px]">项目信息</th>
                  <th className="text-left text-xs font-medium text-zinc-500 px-3 py-3 whitespace-nowrap w-[120px]">客户</th>
                  <th className="text-left text-xs font-medium text-zinc-500 px-3 py-3 whitespace-nowrap w-[70px]">状态</th>
                  <th className="text-right text-xs font-medium text-zinc-500 px-3 py-3 whitespace-nowrap w-[100px]">预算金额</th>
                  <th className="text-right text-xs font-medium text-zinc-500 px-3 py-3 whitespace-nowrap w-[100px]">合同金额</th>
                  <th className="text-left text-xs font-medium text-zinc-500 px-3 py-3 whitespace-nowrap w-[80px]">销售</th>
                  <th className="text-left text-xs font-medium text-zinc-500 px-3 py-3 whitespace-nowrap w-[80px]">责任人</th>
                  <th className="text-left text-xs font-medium text-zinc-500 px-3 py-3 whitespace-nowrap w-[80px]">来源</th>
                  <th className="text-left text-xs font-medium text-zinc-500 px-3 py-3 whitespace-nowrap w-[90px]">预计成交</th>
                  <th className="text-left text-xs font-medium text-zinc-500 px-3 py-3 whitespace-nowrap w-[80px]">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProjects.map((project) => (
                  <tr
                    key={project.id}
                    className={cn(
                      'border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors',
                      selectedRows.has(project.id) && 'bg-zinc-50'
                    )}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(project.id)}
                          onChange={() => toggleRowSelection(project.id)}
                          className="rounded border-zinc-300"
                        />
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <button onClick={(e) => toggleStar(project.id, e)} className="hover:scale-110 transition-transform">
                        {project.isStarred ? (
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ) : (
                          <StarOff className="w-4 h-4 text-zinc-300 hover:text-zinc-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col">
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-sm font-medium text-zinc-900 hover:text-zinc-700 hover:underline truncate max-w-[220px]"
                        >
                          {project.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-zinc-400 font-mono">{project.projectNo}</span>
                          <span className="text-xs text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">{project.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm text-zinc-700 truncate max-w-[110px]">{project.customer}</span>
                        <span className="text-xs text-zinc-400">{project.salesRegion}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn('text-xs font-medium px-2 py-1 rounded whitespace-nowrap', statusConfig[project.status].color)}>
                        {statusConfig[project.status].label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-sm text-zinc-900 font-medium whitespace-nowrap">
                        {formatCurrency(project.budgetAmount, project.currency)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-sm text-zinc-600 whitespace-nowrap">
                        {formatCurrency(project.contractAmount, project.currency)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-sm text-zinc-700">{project.salesPerson}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-sm text-zinc-700">{project.responsible}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-zinc-500 whitespace-nowrap">{project.source}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-sm text-zinc-500 whitespace-nowrap">{project.expectedCloseDate}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                          title="编辑项目"
                          onClick={() => setEditingProject(project)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                          title="删除项目"
                          onClick={() => setDeletingProject(project)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100">
            <div className="text-sm text-zinc-500">
              共 {filteredProjects.length} 条记录，第 {currentPage} / {totalPages || 1} 页
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'secondary'}
                    size="sm"
                    className="w-8"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 && (
          <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-base font-medium text-zinc-900 mb-1">没有找到项目</h3>
            <p className="text-sm text-zinc-500">尝试调整筛选条件或搜索关键词</p>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onSuccess={(project) => {
            setProjects([project, ...projects]);
            showToast(`项目「${project.name}」创建成功`, 'success');
          }}
        />
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleUpdateProject}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <DeleteConfirmModal
          project={deletingProject}
          onClose={() => setDeletingProject(null)}
          onConfirm={handleDeleteProject}
        />
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// New Project Modal
function NewProjectModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (project: Project) => void }) {
  const [formData, setFormData] = React.useState({
    name: '',
    customer: '',
    category: '',
    budgetAmount: '',
    salesPerson: '',
    salesRegion: '',
    responsible: '',
    expectedCloseDate: '',
    source: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newProject: Project = {
        id: `proj_${Date.now()}`,
        projectNo: `PRJ-2024-${String(Math.floor(Math.random() * 900) + 100)}`,
        name: formData.name,
        customer: formData.customer,
        category: formData.category || '智慧城市',
        status: 'pending',
        salesPerson: formData.salesPerson || '待分配',
        salesRegion: formData.salesRegion || '华南区',
        region: '广东省',
        budgetAmount: parseInt(formData.budgetAmount) || 0,
        contractAmount: 0,
        currency: 'CNY',
        source: formData.source || '主动开发',
        contractNo: '',
        expectedCloseDate: formData.expectedCloseDate || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        isStarred: false,
        responsible: formData.responsible || formData.salesPerson || '待分配',
      };

      onSuccess(newProject);
      onClose();
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-zinc-900">新建项目</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 p-1 hover:bg-zinc-100 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-1">项目名称 *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="输入项目名称"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">客户名称 *</label>
              <input
                type="text"
                required
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder="输入客户名称"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">项目类别</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
              >
                <option value="">选择类别</option>
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">预算金额</label>
              <input
                type="text"
                value={formData.budgetAmount}
                onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
                placeholder="例如：1000000"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">预计成交日期</label>
              <input
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">销售人员</label>
              <input
                type="text"
                value={formData.salesPerson}
                onChange={(e) => setFormData({ ...formData, salesPerson: e.target.value })}
                placeholder="输入销售人员"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">责任人</label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                placeholder="输入责任人"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">销售区域</label>
              <select
                value={formData.salesRegion}
                onChange={(e) => setFormData({ ...formData, salesRegion: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
              >
                <option value="">选择区域</option>
                {regions.slice(1).map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">项目来源</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
              >
                <option value="">选择来源</option>
                <option value="CRM同步">CRM同步</option>
                <option value="主动开发">主动开发</option>
                <option value="老客户推荐">老客户推荐</option>
                <option value="招投标">招投标</option>
                <option value="展会获客">展会获客</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-1">项目描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="简要描述项目背景和目标..."
                rows={3}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? '创建中...' : '创建项目'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Project Modal
function EditProjectModal({ project, onClose, onSave }: { project: Project; onClose: () => void; onSave: (project: Project) => void }) {
  const [formData, setFormData] = React.useState({
    name: project.name,
    customer: project.customer,
    category: project.category,
    budgetAmount: String(project.budgetAmount),
    salesPerson: project.salesPerson,
    salesRegion: project.salesRegion,
    responsible: project.responsible,
    expectedCloseDate: project.expectedCloseDate,
    source: project.source,
    status: project.status,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const updatedProject: Project = {
        ...project,
        name: formData.name,
        customer: formData.customer,
        category: formData.category,
        budgetAmount: parseInt(formData.budgetAmount) || 0,
        salesPerson: formData.salesPerson,
        salesRegion: formData.salesRegion,
        responsible: formData.responsible,
        expectedCloseDate: formData.expectedCloseDate,
        source: formData.source,
        status: formData.status as ProjectStatus,
        updatedAt: new Date().toISOString().split('T')[0],
      };

      onSave(updatedProject);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-zinc-900">编辑项目</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 p-1 hover:bg-zinc-100 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-1">项目名称 *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">客户名称 *</label>
              <input
                type="text"
                required
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">项目状态</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
              >
                <option value="pending">待跟进</option>
                <option value="active">跟进中</option>
                <option value="negotiating">谈判中</option>
                <option value="won">已成交</option>
                <option value="lost">已丢单</option>
                <option value="archived">已归档</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">项目类别</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
              >
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">预算金额</label>
              <input
                type="text"
                value={formData.budgetAmount}
                onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">预计成交日期</label>
              <input
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">销售人员</label>
              <input
                type="text"
                value={formData.salesPerson}
                onChange={(e) => setFormData({ ...formData, salesPerson: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">责任人</label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">销售区域</label>
              <select
                value={formData.salesRegion}
                onChange={(e) => setFormData({ ...formData, salesRegion: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
              >
                {regions.slice(1).map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">项目来源</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
              >
                <option value="CRM同步">CRM同步</option>
                <option value="主动开发">主动开发</option>
                <option value="老客户推荐">老客户推荐</option>
                <option value="招投标">招投标</option>
                <option value="展会获客">展会获客</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : '保存修改'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({ project, onClose, onConfirm }: { project: Project; onClose: () => void; onConfirm: () => void }) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onConfirm();
      setIsDeleting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">确认删除项目</h3>
              <p className="text-sm text-zinc-500 mt-1">此操作无法撤销</p>
            </div>
          </div>

          <div className="bg-zinc-50 rounded-lg p-4 mb-6">
            <div className="text-sm font-medium text-zinc-900">{project.name}</div>
            <div className="text-xs text-zinc-500 mt-1">{project.projectNo} · {project.customer}</div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              取消
            </Button>
            <Button
              variant="destructive"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '删除中...' : '确认删除'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

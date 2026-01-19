"use client";

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Settings2,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';
import { useToast, ToastContainer } from '@/components/ui/toast';
import { mockNotifications, currentUser } from '@/lib/mock-data';

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
  responsible: string;
}

// Mock projects data
const mockProjectsData: Project[] = [
  {
    id: 'proj_001',
    projectNo: 'PRJ-2024-001',
    name: '深圳湾口岸智慧通关系统',
    customer: '深圳海关',
    category: '海关/口岸',
    status: 'active',
    salesPerson: '李朋飞',
    salesRegion: '华南区',
    region: '广东省',
    budgetAmount: 29620000,
    contractAmount: 0,
    currency: 'CNY',
    source: '招投标',
    contractNo: '',
    expectedCloseDate: '2025-02-28',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-19',
    responsible: '李朋飞',
  },
  {
    id: 'proj_002',
    projectNo: 'PRJ-2024-002',
    name: '拱北海关监管仓库系统',
    customer: '拱北海关',
    category: '海关/口岸',
    status: 'active',
    salesPerson: '张明远',
    salesRegion: '华南区',
    region: '广东省',
    budgetAmount: 18500000,
    contractAmount: 0,
    currency: 'CNY',
    source: '老客户推荐',
    contractNo: '',
    expectedCloseDate: '2025-03-15',
    createdAt: '2024-11-15',
    updatedAt: '2025-01-18',
    responsible: '张明远',
  },
  {
    id: 'proj_003',
    projectNo: 'PRJ-2024-003',
    name: '广州白云机场海关查验系统',
    customer: '广州海关',
    category: '海关/口岸',
    status: 'pending',
    salesPerson: '王文渊',
    salesRegion: '华南区',
    region: '广东省',
    budgetAmount: 22000000,
    contractAmount: 0,
    currency: 'CNY',
    source: '招投标',
    contractNo: '',
    expectedCloseDate: '2025-04-30',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-18',
    responsible: '王文渊',
  },
  {
    id: 'proj_004',
    projectNo: 'PRJ-2024-004',
    name: '横琴口岸智慧监管平台',
    customer: '珠海海关',
    category: '海关/口岸',
    status: 'negotiating',
    salesPerson: '陈雨婷',
    salesRegion: '华南区',
    region: '广东省',
    budgetAmount: 15800000,
    contractAmount: 0,
    currency: 'CNY',
    source: '主动开发',
    contractNo: '',
    expectedCloseDate: '2025-05-20',
    createdAt: '2024-12-20',
    updatedAt: '2025-01-17',
    responsible: '陈雨婷',
  },
  {
    id: 'proj_005',
    projectNo: 'PRJ-2023-045',
    name: '上海浦东机场海关系统升级',
    customer: '上海海关',
    category: '海关/口岸',
    status: 'won',
    salesPerson: '赵凯文',
    salesRegion: '华东区',
    region: '上海市',
    budgetAmount: 32000000,
    contractAmount: 30500000,
    currency: 'CNY',
    source: '招投标',
    contractNo: 'HT-2024-0012',
    expectedCloseDate: '2024-12-15',
    createdAt: '2023-10-20',
    updatedAt: '2024-12-20',
    responsible: '赵凯文',
  },
  {
    id: 'proj_006',
    projectNo: 'PRJ-2024-005',
    name: '福州港智慧口岸建设',
    customer: '福州海关',
    category: '海关/口岸',
    status: 'active',
    salesPerson: '李朋飞',
    salesRegion: '华东区',
    region: '福建省',
    budgetAmount: 19500000,
    contractAmount: 0,
    currency: 'CNY',
    source: '展会获客',
    contractNo: '',
    expectedCloseDate: '2025-06-30',
    createdAt: '2024-12-28',
    updatedAt: '2025-01-19',
    responsible: '李朋飞',
  },
  {
    id: 'proj_007',
    projectNo: 'PRJ-2023-038',
    name: '南京禄口机场海关查验',
    customer: '南京海关',
    category: '海关/口岸',
    status: 'won',
    salesPerson: '张明远',
    salesRegion: '华东区',
    region: '江苏省',
    budgetAmount: 16800000,
    contractAmount: 16200000,
    currency: 'CNY',
    source: '招投标',
    contractNo: 'HT-2023-0089',
    expectedCloseDate: '2023-11-30',
    createdAt: '2023-06-15',
    updatedAt: '2023-12-05',
    responsible: '张明远',
  },
  {
    id: 'proj_008',
    projectNo: 'PRJ-2024-006',
    name: '厦门海沧港智能监管系统',
    customer: '厦门海关',
    category: '海关/口岸',
    status: 'lost',
    salesPerson: '王文渊',
    salesRegion: '华东区',
    region: '福建省',
    budgetAmount: 14500000,
    contractAmount: 0,
    currency: 'CNY',
    source: '主动开发',
    contractNo: '',
    expectedCloseDate: '2024-12-31',
    createdAt: '2024-09-10',
    updatedAt: '2025-01-05',
    responsible: '王文渊',
  },
  {
    id: 'proj_009',
    projectNo: 'PRJ-2024-007',
    name: '天津港保税区监管平台',
    customer: '天津海关',
    category: '海关/口岸',
    status: 'negotiating',
    salesPerson: '陈雨婷',
    salesRegion: '华北区',
    region: '天津市',
    budgetAmount: 25000000,
    contractAmount: 0,
    currency: 'CNY',
    source: '老客户推荐',
    contractNo: '',
    expectedCloseDate: '2025-07-15',
    createdAt: '2024-12-15',
    updatedAt: '2025-01-16',
    responsible: '陈雨婷',
  },
  {
    id: 'proj_010',
    projectNo: 'PRJ-2024-008',
    name: '青岛港智慧通关系统',
    customer: '青岛海关',
    category: '海关/口岸',
    status: 'pending',
    salesPerson: '赵凯文',
    salesRegion: '华北区',
    region: '山东省',
    budgetAmount: 21000000,
    contractAmount: 0,
    currency: 'CNY',
    source: '招投标',
    contractNo: '',
    expectedCloseDate: '2025-08-31',
    createdAt: '2025-01-05',
    updatedAt: '2025-01-15',
    responsible: '赵凯文',
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

const categories = ['全部类别', '海关/口岸', '边检系统', '机场海关', '港口海关', '保税监管', '跨境电商'];
const statuses = ['全部状态', '跟进中', '待跟进', '谈判中', '已成交', '已丢单', '已归档'];
const regions = ['全部区域', '华南区', '华东区', '华北区', '西南区', '西北区', '东北区'];
const sources = ['全部来源', '招投标', '老客户推荐', '主动开发', '展会获客', 'CRM同步'];

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
  const [projects, setProjects] = React.useState(mockProjectsData);
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
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <Header
        currentProject={null}
        currentPath={['项目资料库']}
        user={currentUser}
        notifications={mockNotifications}
        unreadCount={mockNotifications.filter(n => !n.isRead).length}
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-zinc-50">
        <div className="p-6">
        {/* Projects table */}
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="ghost" size="sm" onClick={() => showToast('正在刷新...', 'info')}>
                <RefreshCw className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-zinc-200" />

              <Button size="sm" onClick={() => setShowNewProjectModal(true)}>
                <Plus className="w-4 h-4 mr-1" />
                新建项目
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
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择类别" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <DatePicker
                value={formData.expectedCloseDate}
                onChange={(date) => setFormData({ ...formData, expectedCloseDate: date })}
                placeholder="选择预计成交日期"
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
              <Select value={formData.salesRegion} onValueChange={(value) => setFormData({ ...formData, salesRegion: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择区域" />
                </SelectTrigger>
                <SelectContent>
                  {regions.slice(1).map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">项目来源</label>
              <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择来源" />
                </SelectTrigger>
                <SelectContent>
                  {sources.slice(1).map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">待跟进</SelectItem>
                  <SelectItem value="active">跟进中</SelectItem>
                  <SelectItem value="negotiating">谈判中</SelectItem>
                  <SelectItem value="won">已成交</SelectItem>
                  <SelectItem value="lost">已丢单</SelectItem>
                  <SelectItem value="archived">已归档</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">项目类别</label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <DatePicker
                value={formData.expectedCloseDate}
                onChange={(date) => setFormData({ ...formData, expectedCloseDate: date })}
                placeholder="选择预计成交日期"
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
              <Select value={formData.salesRegion} onValueChange={(value) => setFormData({ ...formData, salesRegion: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.slice(1).map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">项目来源</label>
              <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sources.slice(1).map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

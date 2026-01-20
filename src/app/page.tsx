"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatusBar } from '@/components/layout/StatusBar';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { TabBar } from '@/components/editor/TabBar';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { MarkdownPreview } from '@/components/editor/MarkdownPreview';
import { SplitEditor } from '@/components/editor/SplitEditor';
import { ResizablePanel } from '@/components/ui/resizable-panel';
import { useToast, ToastContainer } from '@/components/ui/toast';
import { MoveDocumentModal } from '@/components/modals/MoveDocumentModal';
import { HistoryModal } from '@/components/modals/HistoryModal';
import { DiffEditor } from '@/components/editor/DiffEditor';
import {
  mockProjects,
  mockProjectMembers,
  mockFileTree,
  mockDocuments,
  mockChatSessions,
  mockNotifications,
  currentUser,
  mockUsers,
  mockFolders,
  getDocumentById,
  mockTasks,
  mockReviewRecords,
} from '@/lib/mock-data';
import { countWords, generateId } from '@/lib/utils';
import {
  FileTreeNode,
  EditorTab,
  EditorViewMode,
  Document,
  ChatSession,
  ChatMessage,
  User,
  DocumentStatus,
  SyncStatus,
  Task,
  TaskStatus,
  Tab,
  TabType,
  ReviewRecord,
} from '@/types';
import { FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import TaskBoard from '@/components/tasks/TaskBoard';
import ManagerTaskBoard from '@/components/tasks/ManagerTaskBoard';
import AssignTaskDialog from '@/components/tasks/AssignTaskDialog';
import { ReviewCenter } from '@/components/review/ReviewCenter';
import { SubmitReviewModal } from '@/components/review/SubmitReviewModal';
import { ReviewDetailModal } from '@/components/review/ReviewDetailModal';
import { ProjectManagement } from '@/components/management/ProjectManagement';
import { UserManagement } from '@/components/management/UserManagement';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

export default function Home() {
  // Project state
  const [currentProject, setCurrentProject] = React.useState(mockProjects[0]);
  const [fileTree, setFileTree] = React.useState(mockFileTree);

  // Sidebar state
  const [sidebarWidth, setSidebarWidth] = React.useState(260);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>('doc_001');
  const [expandedFolderIds, setExpandedFolderIds] = React.useState<Set<string>>(
    new Set(['folder_001', 'folder_002', 'folder_004'])
  );

  // Editor state
  const [tabs, setTabs] = React.useState<EditorTab[]>([
    { id: 'tab_001', documentId: 'doc_001', title: '客户需求调研报告', type: 'document', isModified: false },
  ]);
  const [activeTabId, setActiveTabId] = React.useState<string | null>('tab_001');
  const [viewMode, setViewMode] = React.useState<EditorViewMode>('split');
  const [editingContent, setEditingContent] = React.useState(
    mockDocuments[0]?.content || ''
  );
  const [originalContent, setOriginalContent] = React.useState(
    mockDocuments[0]?.content || ''
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<string | null>(new Date().toISOString());

  // AI Assistant state
  const [isAIPanelOpen, setIsAIPanelOpen] = React.useState(true);
  const [aiPanelWidth, setAIPanelWidth] = React.useState(340);
  const [chatSessions, setChatSessions] = React.useState<ChatSession[]>(mockChatSessions);
  const [currentSessionId, setCurrentSessionId] = React.useState<string | null>(
    mockChatSessions[0]?.id || null
  );
  const [isAILoading, setIsAILoading] = React.useState(false);

  // Move/Copy modal state
  const [isMoveModalOpen, setIsMoveModalOpen] = React.useState(false);
  const [moveModalMode, setMoveModalMode] = React.useState<'move' | 'copy'>('move');
  const [nodeToMove, setNodeToMove] = React.useState<FileTreeNode | null>(null);

  // History state
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);

  // Conflict state
  const [isConflictMode, setIsConflictMode] = React.useState(false);
  const [syncStatus, setSyncStatus] = React.useState<SyncStatus>('synced');

  // Document Status State
  const [docStatus, setDocStatus] = React.useState<DocumentStatus>('draft');

  // Editor selection state
  const [selection, setSelection] = React.useState<{ text: string; start: number; end: number } | null>(null);

  // Collaborators state
  const [collaborators, setCollaborators] = React.useState<User[]>([]);

  // Search dialog state
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  // Task state
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [isAssignTaskDialogOpen, setIsAssignTaskDialogOpen] = React.useState(false);
  const [documentToAssign, setDocumentToAssign] = React.useState<Document | null>(null);
  const [documentPathToAssign, setDocumentPathToAssign] = React.useState<string>('');

  // Review state
  const [reviewRecords, setReviewRecords] = React.useState<ReviewRecord[]>(mockReviewRecords);
  const [isSubmitReviewModalOpen, setIsSubmitReviewModalOpen] = React.useState(false);
  const [documentToReview, setDocumentToReview] = React.useState<Document | null>(null);
  const [selectedReviewRecord, setSelectedReviewRecord] = React.useState<ReviewRecord | null>(null);
  const [isReviewDetailModalOpen, setIsReviewDetailModalOpen] = React.useState(false);

  // Notification state
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);

  // Toast
  const { toasts, showToast } = useToast();

  // Simulate collaborators joining
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Mock other users joining - 包含当前用户自己
      const otherUsers = mockUsers.filter(u => u.id !== currentUser.id).slice(0, 2);
      setCollaborators([currentUser, ...otherUsers]);
      showToast(`${otherUsers[0].name} 等 ${otherUsers.length} 人加入协同编辑`, 'info');
    }, 1500);
    return () => clearTimeout(timer);
  }, [showToast]);

  // Derived state
  const currentDocument = React.useMemo(() => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab || !activeTab.documentId) return null;
    return getDocumentById(activeTab.documentId) || null;
  }, [activeTabId, tabs]);

  const currentSession = React.useMemo(() => {
    return chatSessions.find(s => s.id === currentSessionId) || null;
  }, [chatSessions, currentSessionId]);

  const contextDocs = React.useMemo(() => {
    return currentDocument ? [currentDocument] : [];
  }, [currentDocument]);

  const hasUnsavedChanges = editingContent !== originalContent;
  const isReadOnly = docStatus === 'pending_review' || docStatus === 'approved';

  // 计算未完成任务数量
  const unfinishedTaskCount = React.useMemo(() => {
    return tasks.filter(
      (task) => task.assigneeId === currentUser.id && task.status !== 'completed'
    ).length;
  }, [tasks]);

  // 计算待审核数量
  const pendingReviewCount = React.useMemo(() => {
    return reviewRecords.filter(r => {
      if (r.finalStatus !== 'pending') return false;

      // 主管只能看到分配给自己且待审核的记录
      if (currentUser.role === 'supervisor' && r.currentStage === 'supervisor_review') {
        return r.supervisor?.id === currentUser.id && r.supervisor?.decision === 'pending';
      }

      // 经理只能看到已经流转到经理审核阶段的记录
      if (currentUser.role === 'manager' && r.currentStage === 'manager_review') {
        return r.manager?.id === currentUser.id && r.manager?.decision === 'pending';
      }

      return false;
    }).length;
  }, [reviewRecords]);

  // 判断当前是否显示任务看板 (已废弃，使用标签页代替)
  // const [isTaskBoardOpen, setIsTaskBoardOpen] = React.useState(false);

  // Handlers
  const handleNodeSelect = (node: FileTreeNode) => {
    if (node.type === 'document') {
      setSelectedNodeId(node.id);

      // Check if already open
      const existingTab = tabs.find(t => t.documentId === node.id);
      if (existingTab) {
        setActiveTabId(existingTab.id);
        // Also update content when switching to existing tab
        const doc = getDocumentById(node.id);
        if (doc) {
          setEditingContent(doc.content);
          setOriginalContent(doc.content);
        }
      } else {
        // Open new tab
        const doc = getDocumentById(node.id);
        if (doc) {
          const newTab: EditorTab = {
            id: `tab_${generateId()}`,
            documentId: node.id,
            title: doc.title,
            type: 'document',
            isModified: false,
          };
          setTabs([...tabs, newTab]);
          setActiveTabId(newTab.id);
          setEditingContent(doc.content);
          setOriginalContent(doc.content);
        }
      }
    }
  };

  const handleFolderToggle = (folderId: string) => {
    const newExpanded = new Set(expandedFolderIds);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolderIds(newExpanded);
  };

  // Open document by ID (for search results)
  const openDocumentById = (docId: string) => {
    const doc = getDocumentById(docId);
    if (!doc) return;

    setSelectedNodeId(docId);

    // Check if already open
    const existingTab = tabs.find(t => t.documentId === docId);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      setEditingContent(doc.content);
      setOriginalContent(doc.content);
    } else {
      // Open new tab
      const newTab: EditorTab = {
        id: `tab_${generateId()}`,
        documentId: docId,
        title: doc.title,
        type: 'document',
        isModified: false,
      };
      setTabs([...tabs, newTab]);
      setActiveTabId(newTab.id);
      setEditingContent(doc.content);
      setOriginalContent(doc.content);
    }
  };

  const handleProjectChange = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      showToast(`已切换到项目: ${project.name}`, 'info');
    }
  };

  const handleCreateDocument = (parentId?: string) => {
    const newDocId = `doc_${generateId()}`;
    const newDoc: FileTreeNode = {
      id: newDocId,
      type: 'document',
      name: '新建文档',
      parentId: parentId || null,
      order: 0,
      status: 'draft',
      syncStatus: 'synced',
    };

    if (parentId) {
      // Add to specific folder
      const addToFolder = (nodes: FileTreeNode[]): FileTreeNode[] => {
        return nodes.map(node => {
          if (node.id === parentId && node.type === 'folder') {
            return {
              ...node,
              children: [...(node.children || []), newDoc],
            };
          }
          if (node.children) {
            return {
              ...node,
              children: addToFolder(node.children),
            };
          }
          return node;
        });
      };
      setFileTree(addToFolder(fileTree));
      // Expand the parent folder
      setExpandedFolderIds(new Set([...expandedFolderIds, parentId]));
    } else {
      // Add to root
      setFileTree([...fileTree, newDoc]);
    }
    showToast('已创建新文档', 'success');
  };

  const handleCreateFolder = (parentId?: string) => {
    const newFolderId = `folder_${generateId()}`;
    const newFolder: FileTreeNode = {
      id: newFolderId,
      type: 'folder',
      name: '新建文件夹',
      parentId: parentId || null,
      order: 0,
      children: [],
    };

    if (parentId) {
      // Add to specific folder
      const addToFolder = (nodes: FileTreeNode[]): FileTreeNode[] => {
        return nodes.map(node => {
          if (node.id === parentId && node.type === 'folder') {
            return {
              ...node,
              children: [...(node.children || []), newFolder],
            };
          }
          if (node.children) {
            return {
              ...node,
              children: addToFolder(node.children),
            };
          }
          return node;
        });
      };
      setFileTree(addToFolder(fileTree));
      // Expand the parent folder
      setExpandedFolderIds(new Set([...expandedFolderIds, parentId]));
    } else {
      // Add to root
      setFileTree([...fileTree, newFolder]);
    }
    showToast('已创建新文件夹', 'success');
  };

  const handleDeleteNode = (node: FileTreeNode) => {
    const deleteFromTree = (nodes: FileTreeNode[]): FileTreeNode[] => {
      return nodes
        .filter(n => n.id !== node.id)
        .map(n => ({
          ...n,
          children: n.children ? deleteFromTree(n.children) : undefined,
        }));
    };
    setFileTree(deleteFromTree(fileTree));

    // If deleted node was selected, clear selection
    if (selectedNodeId === node.id) {
      setSelectedNodeId(null);
    }

    // Close tab if document is open
    if (node.type === 'document') {
      const tabToClose = tabs.find(t => t.documentId === node.id);
      if (tabToClose) {
        handleTabClose(tabToClose.id);
      }
    }

    showToast(`已删除: ${node.name}`, 'success');
  };

  const handleMoveNode = (node: FileTreeNode) => {
    setNodeToMove(node);
    setMoveModalMode('move');
    setIsMoveModalOpen(true);
  };

  const handleCopyNode = (node: FileTreeNode) => {
    setNodeToMove(node);
    setMoveModalMode('copy');
    setIsMoveModalOpen(true);
  };

  const handleUploadFile = (parentId?: string) => {
    // In a real app, this would open a file picker
    showToast(`上传文件到: ${parentId || '根目录'}`, 'info');
  };

  const handleMoveConfirm = (targetProjectId: string, targetFolderId: string | null) => {
    if (!nodeToMove) return;

    const actionText = moveModalMode === 'move' ? '移动' : '复制';

    if (moveModalMode === 'move') {
      // Remove from current location
      const removeFromTree = (nodes: FileTreeNode[]): FileTreeNode[] => {
        return nodes
          .filter(n => n.id !== nodeToMove.id)
          .map(n => ({
            ...n,
            children: n.children ? removeFromTree(n.children) : undefined,
          }));
      };

      // Add to target location
      const addToTarget = (nodes: FileTreeNode[]): FileTreeNode[] => {
        if (targetFolderId === null) {
          // Add to root
          return [...nodes, { ...nodeToMove, parentId: null }];
        }
        return nodes.map(node => {
          if (node.id === targetFolderId && node.type === 'folder') {
            return {
              ...node,
              children: [...(node.children || []), { ...nodeToMove, parentId: targetFolderId }],
            };
          }
          if (node.children) {
            return {
              ...node,
              children: addToTarget(node.children),
            };
          }
          return node;
        });
      };

      // Only handle same project for now
      if (targetProjectId === currentProject.id) {
        const treeWithoutNode = removeFromTree(fileTree);
        const newTree = addToTarget(treeWithoutNode);
        setFileTree(newTree);
        if (targetFolderId) {
          setExpandedFolderIds(new Set([...expandedFolderIds, targetFolderId]));
        }
      }
    } else {
      // Copy: create a duplicate with new ID
      const copiedNode: FileTreeNode = {
        ...nodeToMove,
        id: `${nodeToMove.type}_${generateId()}`,
        name: `${nodeToMove.name} (副本)`,
        parentId: targetFolderId,
      };

      const addToTarget = (nodes: FileTreeNode[]): FileTreeNode[] => {
        if (targetFolderId === null) {
          return [...nodes, copiedNode];
        }
        return nodes.map(node => {
          if (node.id === targetFolderId && node.type === 'folder') {
            return {
              ...node,
              children: [...(node.children || []), copiedNode],
            };
          }
          if (node.children) {
            return {
              ...node,
              children: addToTarget(node.children),
            };
          }
          return node;
        });
      };

      if (targetProjectId === currentProject.id) {
        setFileTree(addToTarget(fileTree));
        if (targetFolderId) {
          setExpandedFolderIds(new Set([...expandedFolderIds, targetFolderId]));
        }
      }
    }

    showToast(`${actionText}成功: ${nodeToMove.name}`, 'success');
    setNodeToMove(null);
  };

  const handleTabSelect = (tabId: string) => {
    setActiveTabId(tabId);
    const tab = tabs.find(t => t.id === tabId);

    // 如果切换到管理类标签页，收起 AI 助手
    if (tab && (
      tab.type === 'task_board' ||
      tab.type === 'manager_task_board' ||
      tab.type === 'review_center' ||
      tab.type === 'project_management' ||
      tab.type === 'user_management' ||
      tab.type === 'notification_center'
    )) {
      setIsAIPanelOpen(false);
    }

    if (tab && tab.documentId) {
      const doc = getDocumentById(tab.documentId);
      if (doc) {
        setEditingContent(doc.content);
        setOriginalContent(doc.content);
        setSelectedNodeId(tab.documentId);
      }
    }
  };

  const handleTabClose = (tabId: string) => {
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      if (newTabs.length > 0) {
        const newActiveTab = newTabs[newTabs.length - 1];
        setActiveTabId(newActiveTab.id);
        if (newActiveTab.documentId) {
          const doc = getDocumentById(newActiveTab.documentId);
          if (doc) {
            setEditingContent(doc.content);
            setOriginalContent(doc.content);
            setSelectedNodeId(newActiveTab.documentId);
          }
        }
      } else {
        setActiveTabId(null);
        setEditingContent('');
        setOriginalContent('');
        setSelectedNodeId(null);
      }
    }
  };

  const handleContentChange = (content: string) => {
    setEditingContent(content);
    // Mark tab as modified
    setTabs(tabs.map(t =>
      t.id === activeTabId ? { ...t, isModified: content !== originalContent } : t
    ));
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;

    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 500));

    setOriginalContent(editingContent);
    setLastSavedAt(new Date().toISOString());
    setTabs(tabs.map(t =>
      t.id === activeTabId ? { ...t, isModified: false } : t
    ));
    setIsSaving(false);
    showToast('文档已保存', 'success');
  };

  const handleFormat = (format: string) => {
    // If no selection tracking or textarea ref, we can't easily format.
    // We rely on the selection state updated by MarkdownEditor

    // Default to appending if no selection (or handle differently)
    // But MarkdownEditor should keep us updated.

    let newContent = editingContent;
    let newCursorPos = 0;

    const start = selection?.start || editingContent.length;
    const end = selection?.end || editingContent.length;
    const selectedText = selection?.text || '';

    const before = editingContent.substring(0, start);
    const after = editingContent.substring(end);

    switch (format) {
      case 'bold':
        newContent = `${before}**${selectedText || '加粗文本'}**${after}`;
        break;
      case 'italic':
        newContent = `${before}*${selectedText || '斜体文本'}*${after}`;
        break;
      case 'strikethrough':
        newContent = `${before}~~${selectedText || '删除文本'}~~${after}`;
        break;
      case 'h1':
        newContent = `${before}# ${selectedText || '标题'}\n${after}`;
        break;
      case 'h2':
        newContent = `${before}## ${selectedText || '标题'}\n${after}`;
        break;
      case 'ul':
        newContent = `${before}- ${selectedText || '列表项'}\n${after}`;
        break;
      case 'ol':
        newContent = `${before}1. ${selectedText || '列表项'}\n${after}`;
        break;
      case 'code':
        if (selectedText.includes('\n')) {
          newContent = `${before}\`\`\`\n${selectedText || '代码块'}\n\`\`\`\n${after}`;
        } else {
          newContent = `${before}\`${selectedText || '代码'}\`${after}`;
        }
        break;
      case 'link':
        newContent = `${before}[${selectedText || '链接文本'}](url)${after}`;
        break;
      case 'image':
        newContent = `${before}![${selectedText || '图片描述'}](url)${after}`;
        break;
      case 'table':
        newContent = `${before}\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n${after}`;
        break;
    }

    setEditingContent(newContent);
    // Note: In a real app we would set selection back to the inserted text
    // But for this prototype, just updating content is enough visual feedback.
  };

  const handleExport = (type: string) => {
    showToast(`正在导出为 ${type.toUpperCase()}...`, 'info');
    setTimeout(() => {
      showToast('导出成功', 'success');
    }, 1500);
  };

  const handleViewHistory = () => {
    setIsHistoryOpen(true);
  };

  const handleRestoreHistory = (content: string) => {
    setEditingContent(content);
    setOriginalContent(content); // Assume restored version is saved or needs save? Let's treat as unsaved change or saved.
    // Treat as unsaved change so user can decide to save over current
    showToast('已回滚到历史版本', 'success');
  };

  const handleSubmitReview = () => {
    setDocStatus('pending_review');
    showToast('文档已提交审核，编辑已锁定', 'success');
  };

  // Conflict & Status Simulation Handlers
  const handleSimulateConflict = () => {
    // If already in conflict, open resolver
    if (syncStatus === 'conflict') {
      setIsConflictMode(true);
      return;
    }
    // Otherwise trigger conflict
    setSyncStatus('conflict');
    showToast('检测到版本冲突，请点击状态栏红字解决', 'error');
  };

  const handleResolveConflict = (choice: 'local' | 'remote' | 'manual', finalContent?: string) => {
    if (choice === 'manual' && finalContent) {
      setEditingContent(finalContent);
      setOriginalContent(finalContent);
      showToast('手动合并完成，文档已更新', 'success');
    } else if (choice === 'remote') {
      // Reconstruct mock remote content
      const remoteContent = editingContent.split('\n\n## 补充说明')[0] + "\n\n## 补充说明 (来自李经理)\n\n这里需要补充关于安全合规的具体要求，请注意修改。\n\n- 数据本地化存储\n- 传输加密标准\n- 访问日志审计";
      setEditingContent(remoteContent);
      setOriginalContent(remoteContent);
      showToast('已覆盖为云端版本', 'success');
    } else {
      // Local choice
      setOriginalContent(editingContent);
      showToast('已保留本地版本 (忽略云端变更)', 'success');
    }
    setSyncStatus('synced');
    setIsConflictMode(false);
  };

  const handleSimulateApproval = () => {
    setDocStatus('approved');
    showToast('审核通过！文档已发布', 'success');
  };

  const handleSimulateRejection = () => {
    setDocStatus('rejected');
    showToast('审核驳回，请修改', 'error');
  };

  // Task handlers
  const handleOpenTaskBoard = () => {
    // 收起 AI 助手面板
    setIsAIPanelOpen(false);
    
    // 根据用户角色决定打开哪个看板
    if (currentUser.role === 'manager' || currentUser.role === 'supervisor') {
      // 管理层打开团队任务看板
      const existingTab = tabs.find(t => t.type === 'manager_task_board');
      if (existingTab) {
        setActiveTabId(existingTab.id);
      } else {
        const newTab: EditorTab = {
          id: `tab_manager_tasks_${generateId()}`,
          title: currentUser.role === 'manager' ? '团队任务总览' : '团队任务看板',
          type: 'manager_task_board',
          isModified: false,
        };
        setTabs([...tabs, newTab]);
        setActiveTabId(newTab.id);
      }
    } else {
      // 员工打开个人任务看板
      const existingTab = tabs.find(t => t.type === 'task_board');
      if (existingTab) {
        setActiveTabId(existingTab.id);
      } else {
        const newTab: EditorTab = {
          id: `tab_tasks_${generateId()}`,
          title: '我的任务',
          type: 'task_board',
          isModified: false,
        };
        setTabs([...tabs, newTab]);
        setActiveTabId(newTab.id);
      }
    }
  };

  // Review handlers
  const handleOpenReviewCenter = () => {
    // 收起 AI 助手面板
    setIsAIPanelOpen(false);
    
    const existingTab = tabs.find(t => t.type === 'review_center');
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: EditorTab = {
        id: `tab_review_${generateId()}`,
        title: '审核中心',
        type: 'review_center',
        isModified: false,
      };
      setTabs([...tabs, newTab]);
      setActiveTabId(newTab.id);
    }
  };

  // Project Management handlers
  const handleOpenProjectManagement = () => {
    // 收起 AI 助手面板
    setIsAIPanelOpen(false);
    
    const existingTab = tabs.find(t => t.type === 'project_management');
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: EditorTab = {
        id: `tab_project_mgmt_${generateId()}`,
        title: '项目管理',
        type: 'project_management',
        isModified: false,
      };
      setTabs([...tabs, newTab]);
      setActiveTabId(newTab.id);
    }
  };

  // User Management handlers
  const handleOpenUserManagement = () => {
    // 收起 AI 助手面板
    setIsAIPanelOpen(false);

    const existingTab = tabs.find(t => t.type === 'user_management');
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: EditorTab = {
        id: `tab_user_mgmt_${generateId()}`,
        title: '用户管理',
        type: 'user_management',
        isModified: false,
      };
      setTabs([...tabs, newTab]);
      setActiveTabId(newTab.id);
    }
  };

  // Notification Center handlers
  const handleOpenNotificationCenter = () => {
    // 收起 AI 助手面板
    setIsAIPanelOpen(false);

    const existingTab = tabs.find(t => t.type === 'notification_center');
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: EditorTab = {
        id: `tab_notifications_${generateId()}`,
        title: '消息中心',
        type: 'notification_center',
        isModified: false,
      };
      setTabs([...tabs, newTab]);
      setActiveTabId(newTab.id);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // 标记为已读
    setNotifications(notifications.map(n =>
      n.id === notification.id ? { ...n, isRead: true } : n
    ));

    // 根据 targetType 跳转
    switch (notification.targetType) {
      case 'document':
        if (notification.documentId) {
          openDocumentById(notification.documentId);
        }
        break;

      case 'review_center':
        handleOpenReviewCenter();
        // 延迟打开审核详情弹窗
        setTimeout(() => {
          const review = reviewRecords.find(r => r.id === notification.reviewId);
          if (review) {
            setSelectedReviewRecord(review);
            setIsReviewDetailModalOpen(true);
          }
        }, 300);
        break;

      case 'task_board':
        handleOpenTaskBoard();
        // TODO: 高亮对应任务卡片
        break;

      case 'project':
        // 跳转到项目详情页
        if (notification.projectId) {
          window.location.href = `/projects/${notification.projectId}`;
        }
        break;
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
    showToast('已标记为已读', 'success');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    showToast('已全部标记为已读', 'success');
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    showToast('已删除通知', 'success');
  };

  const handleOpenReviewDetail = (review: ReviewRecord) => {
    setSelectedReviewRecord(review);
    setIsReviewDetailModalOpen(true);
  };

  const handleApproveReview = (comment: string) => {
    if (!selectedReviewRecord) return;

    const now = new Date().toISOString();
    setReviewRecords(records =>
      records.map(r => {
        if (r.id !== selectedReviewRecord.id) return r;

        if (r.currentStage === 'supervisor_review') {
          // 主管通过，流转到经理
          return {
            ...r,
            currentStage: 'manager_review' as const,
            supervisor: {
              ...r.supervisor!,
              decision: 'approved' as const,
              comment,
              reviewedAt: now,
            },
            manager: {
              id: 'user_001', // 李明经理
              name: '张明远',
              decision: 'pending' as const,
            },
            updatedAt: now,
          };
        } else if (r.currentStage === 'manager_review') {
          // 经理通过，审核完成
          return {
            ...r,
            manager: {
              ...r.manager!,
              decision: 'approved' as const,
              comment,
              reviewedAt: now,
            },
            finalStatus: 'approved' as const,
            completedAt: now,
            updatedAt: now,
          };
        }
        return r;
      })
    );

    // 🆕 生成通知给提交人
    const submitterNotification: Notification = {
      id: `notif_${generateId()}`,
      type: 'approval_result',
      priority: 'normal',
      title: '审批通过',
      content: `您的文档《${selectedReviewRecord.documentTitle}》已通过${currentUser.name}的审核`,
      isRead: false,
      createdAt: now,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      projectId: selectedReviewRecord.projectId,
      projectName: selectedReviewRecord.projectName,
      documentId: selectedReviewRecord.documentId,
      documentTitle: selectedReviewRecord.documentTitle,
      targetType: 'document',
      targetId: selectedReviewRecord.documentId,
      actionLabel: '查看文档',
    };

    setNotifications([submitterNotification, ...notifications]);

    // 🆕 如果是主管审核通过，还要通知经理
    if (selectedReviewRecord.currentStage === 'supervisor_review') {
      const managerNotification: Notification = {
        id: `notif_${generateId()}`,
        type: 'approval_request',
        priority: 'high',
        title: '审批请求',
        content: `${currentUser.name} 已初审通过《${selectedReviewRecord.documentTitle}》，等待您的终审`,
        isRead: false,
        createdAt: now,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        projectId: selectedReviewRecord.projectId,
        projectName: selectedReviewRecord.projectName,
        documentId: selectedReviewRecord.documentId,
        documentTitle: selectedReviewRecord.documentTitle,
        reviewId: selectedReviewRecord.id,
        targetType: 'review_center',
        targetId: selectedReviewRecord.id,
        actionLabel: '去审批',
      };
      setNotifications([managerNotification, submitterNotification, ...notifications]);
    }

    const stageText = selectedReviewRecord.currentStage === 'supervisor_review' ? '初审通过，已流转至经理终审' : '审核通过，文档已发布';
    showToast(stageText, 'success');
    setIsReviewDetailModalOpen(false);
    setSelectedReviewRecord(null);
  };

  const handleRejectReview = (comment: string) => {
    if (!selectedReviewRecord) return;

    const now = new Date().toISOString();
    setReviewRecords(records =>
      records.map(r => {
        if (r.id !== selectedReviewRecord.id) return r;

        if (r.currentStage === 'supervisor_review') {
          return {
            ...r,
            supervisor: {
              ...r.supervisor!,
              decision: 'rejected' as const,
              comment,
              reviewedAt: now,
            },
            finalStatus: 'rejected' as const,
            completedAt: now,
            updatedAt: now,
          };
        } else if (r.currentStage === 'manager_review') {
          return {
            ...r,
            manager: {
              ...r.manager!,
              decision: 'rejected' as const,
              comment,
              reviewedAt: now,
            },
            finalStatus: 'rejected' as const,
            completedAt: now,
            updatedAt: now,
          };
        }
        return r;
      })
    );

    // 🆕 生成通知给提交人
    const notification: Notification = {
      id: `notif_${generateId()}`,
      type: 'approval_result',
      priority: 'high',
      title: '审批驳回',
      content: `您的文档《${selectedReviewRecord.documentTitle}》被${currentUser.name}驳回，请修改后重新提交`,
      isRead: false,
      createdAt: now,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      projectId: selectedReviewRecord.projectId,
      projectName: selectedReviewRecord.projectName,
      documentId: selectedReviewRecord.documentId,
      documentTitle: selectedReviewRecord.documentTitle,
      targetType: 'document',
      targetId: selectedReviewRecord.documentId,
      actionLabel: '查看文档',
    };

    setNotifications([notification, ...notifications]);
    showToast('审核已驳回', 'info');
    setIsReviewDetailModalOpen(false);
    setSelectedReviewRecord(null);
  };

  const handleTransferReview = (targetUserId: string, comment: string) => {
    // 转审逻辑（简化处理）
    showToast('已转交审核', 'success');
    setIsReviewDetailModalOpen(false);
    setSelectedReviewRecord(null);
  };

  const handleSubmitDocumentReview = (reviewerId: string, comment: string) => {
    if (!documentToReview) return;

    const now = new Date().toISOString();
    const reviewer = mockUsers.find(u => u.id === reviewerId);

    const newReview: ReviewRecord = {
      id: `review_${generateId()}`,
      documentId: documentToReview.id,
      documentTitle: documentToReview.title,
      projectId: currentProject.id,
      projectName: currentProject.name,
      submitterId: currentUser.id,
      submitterName: currentUser.name,
      submittedAt: now,
      submitComment: comment || undefined,
      currentStage: 'supervisor_review',
      supervisor: {
        id: reviewerId,
        name: reviewer?.name || '',
        decision: 'pending',
      },
      aiCheck: {
        score: Math.floor(85 + Math.random() * 15),
        checkedAt: now,
        summary: '文档质量良好，可以提交审核',
        issues: [],
      },
      finalStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    setReviewRecords([newReview, ...reviewRecords]);

    // 🆕 生成通知给审核人
    const newNotification: Notification = {
      id: `notif_${generateId()}`,
      type: 'approval_request',
      priority: 'high',
      title: '审批请求',
      content: `${currentUser.name} 提交了《${documentToReview.title}》等待您的审批`,
      isRead: false,
      createdAt: now,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      projectId: currentProject.id,
      projectName: currentProject.name,
      documentId: documentToReview.id,
      documentTitle: documentToReview.title,
      reviewId: newReview.id,
      targetType: 'review_center',
      targetId: newReview.id,
      actionLabel: '去审批',
    };

    setNotifications([newNotification, ...notifications]);
    showToast(`文档已提交审核，已通知 ${reviewer?.name}`, 'success');
    setIsSubmitReviewModalOpen(false);
    setDocumentToReview(null);
  };

  // 获取可用的审核人列表（主管和经理）
  const getReviewers = React.useMemo(() => {
    return mockUsers.filter(u => u.role === 'supervisor' || u.role === 'manager');
  }, []);

  const handleAssignTask = (node: FileTreeNode) => {
    const doc = getDocumentById(node.id);
    if (!doc) return;

    // 构建文档路径
    const buildPath = (nodeId: string, tree: FileTreeNode[]): string => {
      for (const n of tree) {
        if (n.id === nodeId) {
          return n.name;
        }
        if (n.children) {
          const childPath = buildPath(nodeId, n.children);
          if (childPath) {
            return `${n.name}/${childPath}`;
          }
        }
      }
      return '';
    };

    const path = buildPath(node.id, fileTree);
    setDocumentToAssign(doc);
    setDocumentPathToAssign(`/${path}`);
    setIsAssignTaskDialogOpen(true);
  };

  const handleTaskAssign = (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => {
    const now = new Date().toISOString();
    const task: Task = {
      ...newTask,
      id: `task_${generateId()}`,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          type: 'assigned',
          userId: newTask.assignerId,
          userName: newTask.assignerName,
          timestamp: now,
        },
      ],
    };

    setTasks([...tasks, task]);

    // 🆕 生成通知给任务执行人
    const notification: Notification = {
      id: `notif_${generateId()}`,
      type: 'task_assigned',
      priority: newTask.priority === 'urgent' ? 'urgent' : 'high',
      title: '新任务分配',
      content: `${newTask.assignerName} 分配给您任务：${newTask.title}`,
      isRead: false,
      createdAt: now,
      senderId: newTask.assignerId,
      senderName: newTask.assignerName,
      senderAvatar: mockUsers.find(u => u.id === newTask.assignerId)?.avatar,
      projectId: newTask.projectId,
      projectName: newTask.projectName,
      taskId: task.id,
      targetType: 'task_board',
      targetId: task.id,
      actionLabel: '查看任务',
    };

    setNotifications([notification, ...notifications]);
    showToast(`已将任务分配给 ${newTask.assigneeName}`, 'success');
  };

  const handleUpdateTaskProgress = (taskId: string, progress: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            progress,
            timeline: [
              ...task.timeline,
              {
                type: 'progress_updated',
                userId: currentUser.id,
                userName: currentUser.name,
                timestamp: new Date().toISOString(),
                note: `更新进度至 ${progress}%`,
              },
            ],
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
    showToast(`进度已更新至 ${progress}%`, 'success');
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus, note?: string) => {
    const now = new Date().toISOString();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const updatedTask: Task = {
            ...t,
            status,
            timeline: [
              ...t.timeline,
              {
                type: status === 'completed' ? 'completed' : status === 'blocked' ? 'blocked' : 'status_changed',
                userId: currentUser.id,
                userName: currentUser.name,
                timestamp: now,
                note,
              },
            ],
            updatedAt: now,
          };

          if (status === 'completed') {
            updatedTask.completedAt = now;
            updatedTask.progress = 100;
          }

          return updatedTask;
        }
        return t;
      })
    );

    // 🆕 生成通知（仅当状态改为 completed 或 blocked 时通知分配人）
    if ((status === 'completed' || status === 'blocked') && task.assignerId !== currentUser.id) {
      const statusText = status === 'completed' ? '已完成' : '被阻塞';
      const notification: Notification = {
        id: `notif_${generateId()}`,
        type: status === 'blocked' ? 'task_blocked' : 'task_update',
        priority: status === 'blocked' ? 'high' : 'normal',
        title: '任务状态更新',
        content: `${currentUser.name} 将任务《${task.title}》标记为${statusText}`,
        isRead: false,
        createdAt: now,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        projectId: task.projectId,
        projectName: task.projectName,
        taskId: task.id,
        targetType: 'task_board',
        targetId: task.id,
        actionLabel: '查看任务',
      };

      setNotifications([notification, ...notifications]);
    }

    const statusText = {
      todo: '待办',
      in_progress: '进行中',
      completed: '已完成',
      blocked: '受阻',
    };

    showToast(`任务状态已更新为：${statusText[status]}`, 'success');
  };

  const handleOpenDocumentFromTask = (documentId: string, documentName: string) => {
    // Open document
    openDocumentById(documentId);
  };

  const handleAIAction = (action: string, text: string, customQuestion?: string) => {
    if (!isAIPanelOpen) setIsAIPanelOpen(true);

    const prompts: Record<string, string> = {
      explain: `请解释这段内容：\n\n> ${text}`,
      polish: `请润色这段文字，使其更专业：\n\n> ${text}`,
      continue: `请根据以下内容进行续写：\n\n> ${text}`,
      translate: `请将这段文字翻译成英文：\n\n> ${text}`,
    };

    let message: string;
    if (action === 'ask' && customQuestion) {
      message = `关于以下内容：\n\n> ${text}\n\n${customQuestion}`;
    } else {
      message = prompts[action] || `请处理：${text}`;
    }
    handleSendMessage(message);
  };

  const handleSendMessage = (message: string) => {
    setIsAILoading(true);

    const userMessage: ChatMessage = {
      id: `msg_${generateId()}`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };

    if (!currentSession) {
      // Create new session
      const newSession: ChatSession = {
        id: `session_${generateId()}`,
        projectId: currentProject.id,
        title: message.slice(0, 20) + '...',
        messages: [userMessage],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setChatSessions([newSession, ...chatSessions]);
      setCurrentSessionId(newSession.id);
    } else {
      // Add to existing session
      setChatSessions(sessions =>
        sessions.map(s =>
          s.id === currentSessionId
            ? {
                ...s,
                messages: [...s.messages, userMessage],
                updatedAt: new Date().toISOString(),
              }
            : s
        )
      );
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        '润色': `好的，我来帮您润色这段内容。\n\n优化后的版本：\n\n> 本系统采用云原生微服务架构，以领域驱动设计（DDD）为指导原则进行服务边界划分。技术栈选用成熟的 Spring Cloud Alibaba 生态，具备良好的可扩展性和可维护性。\n\n主要优化点：\n1. 引入了"云原生"概念，更具现代感\n2. 强调了 DDD 设计思想，体现专业性\n3. 突出了技术选型的成熟度和优势`,
        '大纲': `根据文档内容，我为您生成了以下大纲：\n\n## 智慧园区综合管理平台 - 方案大纲\n\n### 第一章 项目概述\n1.1 项目背景\n1.2 建设目标\n1.3 建设范围\n\n### 第二章 需求分析\n2.1 业务需求\n2.2 功能需求\n2.3 非功能需求\n\n### 第三章 系统设计\n3.1 总体架构\n3.2 技术选型\n3.3 数据设计\n\n### 第四章 实施方案\n4.1 项目计划\n4.2 资源配置\n4.3 风险管理`,
        '格式': `文档格式检查完成，发现以下问题：\n\n✅ 标题层级：符合规范\n✅ 段落结构：清晰合理\n⚠️ 表格格式：建议统一对齐方式\n⚠️ 代码块：建议添加语言标识\n✅ 列表格式：符合规范\n\n总体评分：85/100\n\n建议修改：\n1. 第二章的表格添加表头\n2. 代码块指定语言类型便于高亮显示`,
        '资料': `根据当前文档内容，我找到了以下相关资料：\n\n📚 **参考文档**\n1. 《智慧园区建设指南》- 住建部 2024版\n2. 《物联网平台技术规范》- 工信部标准\n\n🔗 **技术参考**\n1. Spring Cloud Alibaba 官方文档\n2. TDengine 时序数据库最佳实践\n\n💡 **案例参考**\n1. 深圳前海智慧园区项目\n2. 杭州未来科技城智慧化改造\n\n需要我详细展开其中某项资料吗？`,
      };

      let responseContent = '好的，我来帮您处理这个请求。请稍等...';

      for (const [key, value] of Object.entries(aiResponses)) {
        if (message.includes(key)) {
          responseContent = value;
          break;
        }
      }

      const aiMessage: ChatMessage = {
        id: `msg_${generateId()}`,
        role: 'assistant',
        content: responseContent,
        createdAt: new Date().toISOString(),
        agentType: 'document',
      };

      setChatSessions(sessions =>
        sessions.map(s =>
          s.id === currentSessionId || (currentSession === null && s === sessions[0])
            ? {
                ...s,
                messages: [...s.messages, aiMessage],
                updatedAt: new Date().toISOString(),
              }
            : s
        )
      );

      setIsAILoading(false);
    }, 1500);
  };

  const recentDocuments = mockDocuments.slice(0, 3);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <Header
        currentProject={currentProject}
        currentPath={currentDocument ? ['技术方案', currentDocument.title] : []}
        user={currentUser}
        notifications={notifications}
        unreadCount={notifications.filter(n => !n.isRead).length}
        unfinishedTaskCount={unfinishedTaskCount}
        pendingReviewCount={pendingReviewCount}
        documents={mockDocuments}
        projects={mockProjects}
        folders={mockFolders}
        onSelectDocument={(docId) => {
          openDocumentById(docId);
        }}
        onOpenTaskBoard={handleOpenTaskBoard}
        onOpenReviewCenter={handleOpenReviewCenter}
        onOpenProjectManagement={handleOpenProjectManagement}
        onOpenUserManagement={handleOpenUserManagement}
        onOpenNotificationCenter={handleOpenNotificationCenter}
        onMarkAllAsRead={handleMarkAllAsRead}
        isSearchOpen={isSearchOpen}
        onSearchOpenChange={setIsSearchOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with resizable panel */}
        {isSidebarCollapsed ? (
          <Sidebar
            isCollapsed={true}
            fileTree={fileTree}
            selectedNodeId={selectedNodeId}
            expandedFolderIds={expandedFolderIds}
            recentDocuments={recentDocuments}
            projectMembers={mockProjectMembers}
            currentProject={currentProject}
            onToggleCollapse={() => setIsSidebarCollapsed(false)}
            onNodeSelect={handleNodeSelect}
            onFolderToggle={handleFolderToggle}
            onProjectChange={handleProjectChange}
            onCreateDocument={handleCreateDocument}
            onCreateFolder={handleCreateFolder}
            onUploadFile={handleUploadFile}
            onDeleteNode={handleDeleteNode}
            onMoveNode={handleMoveNode}
            onCopyNode={handleCopyNode}
            onAssignTask={handleAssignTask}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenProjectManagement={handleOpenProjectManagement}
          />
        ) : (
          <ResizablePanel
            defaultWidth={sidebarWidth}
            minWidth={200}
            maxWidth={400}
            direction="left"
            onWidthChange={setSidebarWidth}
            className="h-full"
          >
            <Sidebar
              isCollapsed={false}
              fileTree={fileTree}
              selectedNodeId={selectedNodeId}
              expandedFolderIds={expandedFolderIds}
              recentDocuments={recentDocuments}
              projectMembers={mockProjectMembers}
              currentProject={currentProject}
              onToggleCollapse={() => setIsSidebarCollapsed(true)}
              onNodeSelect={handleNodeSelect}
              onFolderToggle={handleFolderToggle}
              onProjectChange={handleProjectChange}
              onCreateDocument={handleCreateDocument}
              onCreateFolder={handleCreateFolder}
              onUploadFile={handleUploadFile}
              onDeleteNode={handleDeleteNode}
              onMoveNode={handleMoveNode}
              onCopyNode={handleCopyNode}
              onAssignTask={handleAssignTask}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenProjectManagement={handleOpenProjectManagement}
            />
          </ResizablePanel>
        )}

        {/* Editor area */}
        <div className="flex-1 flex flex-col min-w-0">
          {tabs.length > 0 ? (
            <>
              <TabBar
                tabs={tabs}
                activeTabId={activeTabId}
                onTabSelect={handleTabSelect}
                onTabClose={handleTabClose}
              />
              {tabs.find(t => t.id === activeTabId)?.type === 'task_board' ? (
                // 个人任务看板
                <TaskBoard
                  tasks={tasks}
                  currentUserId={currentUser.id}
                  onOpenDocument={handleOpenDocumentFromTask}
                  onUpdateProgress={handleUpdateTaskProgress}
                  onUpdateStatus={handleUpdateTaskStatus}
                />
              ) : tabs.find(t => t.id === activeTabId)?.type === 'manager_task_board' ? (
                // 管理层任务看板
                <ManagerTaskBoard
                  tasks={tasks}
                  users={mockUsers}
                  currentUser={currentUser}
                  onOpenDocument={handleOpenDocumentFromTask}
                  onUpdateProgress={handleUpdateTaskProgress}
                  onUpdateStatus={handleUpdateTaskStatus}
                />
              ) : tabs.find(t => t.id === activeTabId)?.type === 'review_center' ? (
                // 审核中心
                <ReviewCenter
                  reviews={reviewRecords}
                  currentUser={currentUser}
                  onOpenDetail={handleOpenReviewDetail}
                  onOpenDocument={(documentId) => openDocumentById(documentId)}
                />
              ) : tabs.find(t => t.id === activeTabId)?.type === 'project_management' ? (
                // 项目管理
                <ProjectManagement />
              ) : tabs.find(t => t.id === activeTabId)?.type === 'user_management' ? (
                // 用户管理
                <UserManagement />
              ) : tabs.find(t => t.id === activeTabId)?.type === 'notification_center' ? (
                // 消息中心
                <NotificationCenter
                  notifications={notifications}
                  onNotificationClick={handleNotificationClick}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onDeleteNotification={handleDeleteNotification}
                />
              ) : (
                <>
                  <EditorToolbar
                    viewMode={viewMode}
                    hasUnsavedChanges={hasUnsavedChanges}
                    isSaving={isSaving}
                    onViewModeChange={setViewMode}
                    onSave={handleSave}
                    onFormat={handleFormat}
                    onViewHistory={handleViewHistory}
                    onSubmitReview={handleSubmitReview}
                    onExport={handleExport}
                    collaborators={collaborators}
                    currentUser={currentUser}
                    readOnly={isConflictMode}
                    isConflictMode={isConflictMode}
                    onResolveConflict={(choice) => {
                      if (choice === 'manual') handleResolveConflict('manual', editingContent);
                      else handleResolveConflict(choice);
                    }}
                  />
                  <div className="flex-1 flex overflow-hidden">
                    {isConflictMode ? (
                      <DiffEditor
                        content={editingContent}
                        onChange={handleContentChange}
                        onSelectionChange={setSelection}
                      />
                    ) : (
                      <>
                        {viewMode === 'edit' && (
                          <div className="flex-1">
                            <MarkdownEditor
                              content={editingContent}
                              onChange={handleContentChange}
                              onSelectionChange={setSelection}
                              readOnly={isReadOnly}
                              onAIAction={handleAIAction}
                            />
                          </div>
                        )}
                        {viewMode === 'preview' && (
                          <div className="flex-1 bg-white">
                            <MarkdownPreview content={editingContent} />
                          </div>
                        )}
                        {viewMode === 'split' && (
                          <SplitEditor
                            key={activeTabId}
                            content={editingContent}
                            onChange={handleContentChange}
                            onSelectionChange={setSelection}
                            onAIAction={handleAIAction}
                          />
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            // Empty state
            <div className="flex-1 flex items-center justify-center bg-zinc-50">
              <div className="text-center">
                <div className="w-14 h-14 bg-zinc-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-zinc-400" />
                </div>
                <h3 className="text-base font-medium text-zinc-900 mb-1">
                  选择或创建文档
                </h3>
                <p className="text-sm text-zinc-500">
                  从左侧文件树选择文档开始编辑
                </p>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant with resizable panel */}
        {isAIPanelOpen ? (
          <ResizablePanel
            defaultWidth={aiPanelWidth}
            minWidth={280}
            maxWidth={480}
            direction="right"
            onWidthChange={setAIPanelWidth}
            className="h-full"
          >
            <AIAssistant
              isOpen={true}
              width={aiPanelWidth}
              sessions={chatSessions}
              currentSession={currentSession}
              contextDocs={contextDocs}
              isLoading={isAILoading}
              projectName={currentProject.name}
              onToggle={() => setIsAIPanelOpen(false)}
              onSendMessage={handleSendMessage}
              onSessionSelect={setCurrentSessionId}
              onNewSession={() => {
                setCurrentSessionId(null);
              }}
            />
          </ResizablePanel>
        ) : (
          <AIAssistant
            isOpen={false}
            width={0}
            sessions={chatSessions}
            currentSession={currentSession}
            contextDocs={contextDocs}
            isLoading={isAILoading}
            projectName={currentProject.name}
            onToggle={() => setIsAIPanelOpen(true)}
            onSendMessage={handleSendMessage}
            onSessionSelect={setCurrentSessionId}
            onNewSession={() => {
              setCurrentSessionId(null);
            }}
          />
        )}
      </div>

      {/* Status bar */}
      <StatusBar
        currentDocument={currentDocument}
        cursorPosition={{ line: 1, column: 1 }}
        wordCount={countWords(editingContent)}
        syncStatus={syncStatus}
        lastSavedAt={lastSavedAt}
        collaborators={collaborators}
        onSimulateConflict={handleSimulateConflict}
        docStatus={docStatus}
        isConflictMode={isConflictMode}
        onResolveStart={() => setIsConflictMode(true)}
        onSimulateApproval={handleSimulateApproval}
        onSimulateRejection={handleSimulateRejection}
        onReEdit={() => setDocStatus('draft')}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />

      {/* Move/Copy Document Modal */}
      <MoveDocumentModal
        isOpen={isMoveModalOpen}
        mode={moveModalMode}
        sourceNode={nodeToMove}
        projects={mockProjects}
        currentProjectId={currentProject.id}
        fileTree={fileTree}
        recentLocations={[
          { projectId: currentProject.id, projectName: currentProject.name, folderId: 'folder_001', folderName: '技术方案' },
          { projectId: currentProject.id, projectName: currentProject.name, folderId: 'folder_002', folderName: '商务文档' },
        ]}
        onClose={() => {
          setIsMoveModalOpen(false);
          setNodeToMove(null);
        }}
        onConfirm={handleMoveConfirm}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        document={currentDocument}
        onClose={() => setIsHistoryOpen(false)}
        onRestore={handleRestoreHistory}
      />

      {/* Assign Task Dialog */}
      {documentToAssign && (
        <AssignTaskDialog
          isOpen={isAssignTaskDialogOpen}
          onClose={() => {
            setIsAssignTaskDialogOpen(false);
            setDocumentToAssign(null);
            setDocumentPathToAssign('');
          }}
          document={documentToAssign}
          documentPath={documentPathToAssign}
          projectName={currentProject.name}
          projectId={currentProject.id}
          teamMembers={mockUsers}
          currentUser={currentUser}
          onAssign={handleTaskAssign}
        />
      )}

      {/* Submit Review Modal */}
      <SubmitReviewModal
        isOpen={isSubmitReviewModalOpen}
        document={documentToReview}
        reviewers={getReviewers}
        currentUser={currentUser}
        onClose={() => {
          setIsSubmitReviewModalOpen(false);
          setDocumentToReview(null);
        }}
        onSubmit={handleSubmitDocumentReview}
      />

      {/* Review Detail Modal */}
      <ReviewDetailModal
        isOpen={isReviewDetailModalOpen}
        review={selectedReviewRecord}
        currentUser={currentUser}
        onClose={() => {
          setIsReviewDetailModalOpen(false);
          setSelectedReviewRecord(null);
        }}
        onApprove={handleApproveReview}
        onReject={handleRejectReview}
        onTransfer={handleTransferReview}
        onOpenDocument={(documentId) => openDocumentById(documentId)}
      />
    </div>
  );
}

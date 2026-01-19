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
import {
  mockProjects,
  mockProjectMembers,
  mockFileTree,
  mockDocuments,
  mockChatSessions,
  mockNotifications,
  currentUser,
  getDocumentById,
} from '@/lib/mock-data';
import { countWords, generateId } from '@/lib/utils';
import {
  FileTreeNode,
  EditorTab,
  EditorViewMode,
  Document,
  ChatSession,
  ChatMessage,
} from '@/types';
import { FileText } from 'lucide-react';

export default function Home() {
  // Project state
  const [currentProject] = React.useState(mockProjects[0]);
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
    { id: 'tab_001', documentId: 'doc_001', title: '客户需求调研报告', isModified: false },
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

  // Toast
  const { toasts, showToast } = useToast();

  // Derived state
  const currentDocument = React.useMemo(() => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab) return null;
    return getDocumentById(activeTab.documentId) || null;
  }, [activeTabId, tabs]);

  const currentSession = React.useMemo(() => {
    return chatSessions.find(s => s.id === currentSessionId) || null;
  }, [chatSessions, currentSessionId]);

  const contextDocs = React.useMemo(() => {
    return currentDocument ? [currentDocument] : [];
  }, [currentDocument]);

  const hasUnsavedChanges = editingContent !== originalContent;

  // Handlers
  const handleNodeSelect = (node: FileTreeNode) => {
    if (node.type === 'document') {
      setSelectedNodeId(node.id);

      // Check if already open
      const existingTab = tabs.find(t => t.documentId === node.id);
      if (existingTab) {
        setActiveTabId(existingTab.id);
      } else {
        // Open new tab
        const doc = getDocumentById(node.id);
        if (doc) {
          const newTab: EditorTab = {
            id: `tab_${generateId()}`,
            documentId: node.id,
            title: doc.title,
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

  const handleTabSelect = (tabId: string) => {
    setActiveTabId(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
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
        const doc = getDocumentById(newActiveTab.documentId);
        if (doc) {
          setEditingContent(doc.content);
          setOriginalContent(doc.content);
          setSelectedNodeId(newActiveTab.documentId);
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
    const formatLabels: Record<string, string> = {
      h1: '一级标题',
      h2: '二级标题',
      bold: '加粗',
      italic: '斜体',
      strikethrough: '删除线',
      ul: '无序列表',
      ol: '有序列表',
      table: '表格',
      code: '代码块',
      image: '图片',
      link: '链接',
    };
    showToast(`已插入${formatLabels[format] || format}格式`, 'info');
  };

  const handleViewHistory = () => {
    showToast('版本历史功能开发中...', 'info');
  };

  const handleSubmitReview = () => {
    showToast('文档已提交审核', 'success');
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
        '润色': `好的，我来帮您润色这段内容。

优化后的版本：

> 本系统采用云原生微服务架构，以领域驱动设计（DDD）为指导原则进行服务边界划分。技术栈选用成熟的 Spring Cloud Alibaba 生态，具备良好的可扩展性和可维护性。

主要优化点：
1. 引入了"云原生"概念，更具现代感
2. 强调了 DDD 设计思想，体现专业性
3. 突出了技术选型的成熟度和优势`,
        '大纲': `根据文档内容，我为您生成了以下大纲：

## 智慧园区综合管理平台 - 方案大纲

### 第一章 项目概述
1.1 项目背景
1.2 建设目标
1.3 建设范围

### 第二章 需求分析
2.1 业务需求
2.2 功能需求
2.3 非功能需求

### 第三章 系统设计
3.1 总体架构
3.2 技术选型
3.3 数据设计

### 第四章 实施方案
4.1 项目计划
4.2 资源配置
4.3 风险管理`,
        '格式': `文档格式检查完成，发现以下问题：

✅ 标题层级：符合规范
✅ 段落结构：清晰合理
⚠️ 表格格式：建议统一对齐方式
⚠️ 代码块：建议添加语言标识
✅ 列表格式：符合规范

总体评分：85/100

建议修改：
1. 第二章的表格添加表头
2. 代码块指定语言类型便于高亮显示`,
        '资料': `根据当前文档内容，我找到了以下相关资料：

📚 **参考文档**
1. 《智慧园区建设指南》- 住建部 2024版
2. 《物联网平台技术规范》- 工信部标准

🔗 **技术参考**
1. Spring Cloud Alibaba 官方文档
2. TDengine 时序数据库最佳实践

💡 **案例参考**
1. 深圳前海智慧园区项目
2. 杭州未来科技城智慧化改造

需要我详细展开其中某项资料吗？`,
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
        notifications={mockNotifications}
        unreadCount={mockNotifications.filter(n => !n.isRead).length}
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
            onToggleCollapse={() => setIsSidebarCollapsed(false)}
            onNodeSelect={handleNodeSelect}
            onFolderToggle={handleFolderToggle}
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
              onToggleCollapse={() => setIsSidebarCollapsed(true)}
              onNodeSelect={handleNodeSelect}
              onFolderToggle={handleFolderToggle}
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
              <EditorToolbar
                viewMode={viewMode}
                hasUnsavedChanges={hasUnsavedChanges}
                isSaving={isSaving}
                onViewModeChange={setViewMode}
                onSave={handleSave}
                onFormat={handleFormat}
                onViewHistory={handleViewHistory}
                onSubmitReview={handleSubmitReview}
              />
              <div className="flex-1 flex overflow-hidden">
                {viewMode === 'edit' && (
                  <div className="flex-1">
                    <MarkdownEditor
                      content={editingContent}
                      onChange={handleContentChange}
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
                    content={editingContent}
                    onChange={handleContentChange}
                  />
                )}
              </div>
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
        syncStatus="synced"
        lastSavedAt={lastSavedAt}
        collaborators={[]}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

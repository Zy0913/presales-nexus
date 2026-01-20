// 用户角色
export type UserRole = 'manager' | 'supervisor' | 'employee';

// 用户信息
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  department: string;
  createdAt: string;
  lastActiveAt: string;
}

// 项目状态
export type ProjectStatus = 'active' | 'pending' | 'completed' | 'archived';

// 项目信息
export interface Project {
  id: string;
  name: string;
  description: string;
  customerId: string;
  customerName: string;
  industry: string;
  status: ProjectStatus;
  priority: 'high' | 'medium' | 'low';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  deadline: string | null;
  tags: string[];
}

// 项目成员
export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  user: User;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
}

// 文件夹
export interface Folder {
  id: string;
  projectId: string;
  parentId: string | null;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// 文档状态
export type DocumentStatus =
  | 'draft'
  | 'editing'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'published';

// 文档同步状态
export type SyncStatus = 'synced' | 'syncing' | 'conflict' | 'offline';

// 文档
export interface Document {
  id: string;
  projectId: string;
  folderId: string | null;
  title: string;
  content: string;
  status: DocumentStatus;
  syncStatus: SyncStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  wordCount: number;
  version: number;
  lockedBy: string | null;
  lockedAt: string | null;
}

// 文件树节点类型
export type FileTreeNodeType = 'folder' | 'document';

// 文件树节点
export interface FileTreeNode {
  id: string;
  type: FileTreeNodeType;
  name: string;
  parentId: string | null;
  order: number;
  isExpanded?: boolean;
  children?: FileTreeNode[];
  status?: DocumentStatus;
  syncStatus?: SyncStatus;
  updatedAt?: string;
  updatedBy?: string;
}

// 编辑器视图模式
export type EditorViewMode = 'edit' | 'preview' | 'split';

// 编辑器标签页
export interface EditorTab {
  id: string;
  type?: 'document' | 'task_board' | 'manager_task_board' | 'review_center' | 'project_management' | 'user_management' | 'notification_center';
  documentId?: string; // Optional for task_board, manager_task_board, review_center, project_management, user_management, and notification_center
  title: string;
  isModified: boolean;
}

// AI 智能体类型
export type AgentType = 'document' | 'validator' | 'resource' | 'bidding';

// 对话消息
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  attachedText?: string;
  attachedDocIds?: string[];
  agentType?: AgentType;
  isStreaming?: boolean;
}

// 对话会话
export interface ChatSession {
  id: string;
  projectId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// 通知类型
export type NotificationType =
  | 'approval_request'      // 审批请求
  | 'approval_result'       // 审批结果
  | 'task_assigned'         // 任务分配
  | 'task_update'           // 任务状态更新
  | 'task_blocked'          // 任务被阻塞
  | 'task_deadline'         // 任务即将逾期
  | 'project_deadline'      // 项目截止
  | 'document_moved'        // 文档被移动
  | 'mention'               // @提及
  | 'comment'               // 评论
  | 'conflict'              // 冲突
  | 'system';               // 系统通知

// 通知优先级
export type NotificationPriority = 'urgent' | 'high' | 'normal' | 'low';

// 通知目标类型
export type NotificationTargetType = 'document' | 'task_board' | 'review_center' | 'project' | 'notification_center';

// 通知
export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;

  // 发送人信息
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;

  // 关联数据
  projectId?: string;
  projectName?: string;
  documentId?: string;
  documentTitle?: string;
  taskId?: string;
  reviewId?: string;

  // 跳转目标
  targetType?: NotificationTargetType;
  targetId?: string;

  // 操作按钮文字
  actionLabel?: string;
}

// 任务状态
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'blocked';

// 任务优先级
export type TaskPriority = 'urgent' | 'high' | 'normal' | 'low';

// 任务时间线事件类型
export type TaskTimelineEventType =
  | 'assigned'
  | 'started'
  | 'progress_updated'
  | 'completed'
  | 'blocked'
  | 'status_changed';

// 任务时间线事件
export interface TaskTimelineEvent {
  type: TaskTimelineEventType;
  userId: string;
  userName: string;
  timestamp: string;
  note?: string;
}

// 任务
export interface Task {
  id: string;
  projectId: string;
  projectName: string;

  // 基本信息
  title: string;
  description?: string;

  // 分配信息
  assignerId: string;
  assignerName: string;
  assigneeId: string;
  assigneeName: string;
  assignedAt: string;

  // 状态与优先级
  status: TaskStatus;
  priority: TaskPriority;

  // 时间
  dueDate?: string;

  // 进度
  progress: number; // 0-100

  // 关联文档
  documentId: string;
  documentName: string;
  documentPath: string;

  // 时间线
  timeline: TaskTimelineEvent[];

  // 元数据
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// 标签页类型
export type TabType = 'document' | 'task_board';

// 标签页
export interface Tab {
  id: string;
  type: TabType;
  title: string;
  icon?: string;

  // 文档标签页特有
  documentId?: string;

  // 任务标签页特有
  taskBoardType?: 'my_tasks';

  // 状态
  isActive: boolean;
  isDirty?: boolean;
  canClose: boolean;
}

// ==================== 审核相关类型 ====================

// 审核环节
export type ReviewStage = 'ai_check' | 'supervisor_review' | 'manager_review';

// 审核结果
export type ReviewDecision = 'pending' | 'approved' | 'rejected' | 'transferred';

// AI 检查问题
export interface AICheckIssue {
  id: string;
  type: 'format' | 'content' | 'completeness' | 'consistency' | 'security';
  severity: 'error' | 'warning' | 'suggestion';
  title: string;
  description: string;
  location?: string;
  suggestion?: string;
}

// AI 检查结果
export interface AICheckResult {
  score: number;
  checkedAt: string;
  issues: AICheckIssue[];
  summary: string;
}

// 审核人信息
export interface ReviewerInfo {
  id: string;
  name: string;
  decision: ReviewDecision;
  comment?: string;
  reviewedAt?: string;
}

// 审核记录
export interface ReviewRecord {
  id: string;

  // 关联信息
  documentId: string;
  documentTitle: string;
  projectId: string;
  projectName: string;

  // 提交信息
  submitterId: string;
  submitterName: string;
  submittedAt: string;
  submitComment?: string;

  // 当前流程状态
  currentStage: ReviewStage;

  // 主管审核
  supervisor?: ReviewerInfo;

  // 经理审核
  manager?: ReviewerInfo;

  // AI 预检结果
  aiCheck?: AICheckResult;

  // 最终状态
  finalStatus: 'pending' | 'approved' | 'rejected' | 'published';

  // 元信息
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

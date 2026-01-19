import { User, Project, ProjectMember, Document, FileTreeNode, ChatSession, Notification } from '@/types';

// Mock 用户
export const mockUsers: User[] = [
  {
    id: 'user_001',
    name: '张明远',
    email: 'zhangmy@company.com',
    avatar: '',
    role: 'manager',
    department: '售前解决方案部',
    createdAt: '2023-01-15T08:00:00Z',
    lastActiveAt: '2025-01-19T10:30:00Z',
  },
  {
    id: 'user_002',
    name: '李晓燕',
    email: 'lixy@company.com',
    avatar: '',
    role: 'supervisor',
    department: '售前解决方案部',
    createdAt: '2023-03-20T08:00:00Z',
    lastActiveAt: '2025-01-19T09:45:00Z',
  },
  {
    id: 'user_003',
    name: '王思聪',
    email: 'wangsc@company.com',
    avatar: '',
    role: 'employee',
    department: '售前解决方案部',
    createdAt: '2023-06-10T08:00:00Z',
    lastActiveAt: '2025-01-19T11:00:00Z',
  },
  {
    id: 'user_004',
    name: '陈雨婷',
    email: 'chenyt@company.com',
    avatar: '',
    role: 'employee',
    department: '售前解决方案部',
    createdAt: '2023-08-15T08:00:00Z',
    lastActiveAt: '2025-01-18T17:30:00Z',
  },
  {
    id: 'user_005',
    name: '赵凯文',
    email: 'zhaokw@company.com',
    avatar: '',
    role: 'employee',
    department: '售前解决方案部',
    createdAt: '2024-02-01T08:00:00Z',
    lastActiveAt: '2025-01-19T08:20:00Z',
  },
];

export const currentUser = mockUsers[2];

// Mock 项目
export const mockProjects: Project[] = [
  {
    id: 'proj_001',
    name: '智慧园区综合管理平台',
    description: '为某科技园区提供一站式智慧管理解决方案',
    customerId: 'cust_001',
    customerName: '深圳湾科技园',
    industry: '园区/物业',
    status: 'active',
    priority: 'high',
    ownerId: 'user_002',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2025-01-19T09:30:00Z',
    deadline: '2025-02-15T18:00:00Z',
    tags: ['智慧园区', 'IoT', '能耗管理'],
  },
  {
    id: 'proj_002',
    name: '医疗信息化系统升级',
    description: '某三甲医院信息系统现代化改造',
    customerId: 'cust_002',
    customerName: '市第一人民医院',
    industry: '医疗健康',
    status: 'active',
    priority: 'high',
    ownerId: 'user_002',
    createdAt: '2024-11-15T14:00:00Z',
    updatedAt: '2025-01-18T16:45:00Z',
    deadline: '2025-03-01T18:00:00Z',
    tags: ['医疗', 'HIS', '信息化'],
  },
];

// Mock 项目成员
export const mockProjectMembers: ProjectMember[] = [
  {
    id: 'pm_001',
    projectId: 'proj_001',
    userId: 'user_002',
    user: mockUsers[1],
    role: 'owner',
    joinedAt: '2024-12-01T10:00:00Z',
  },
  {
    id: 'pm_002',
    projectId: 'proj_001',
    userId: 'user_003',
    user: mockUsers[2],
    role: 'editor',
    joinedAt: '2024-12-02T09:00:00Z',
  },
  {
    id: 'pm_003',
    projectId: 'proj_001',
    userId: 'user_004',
    user: mockUsers[3],
    role: 'editor',
    joinedAt: '2024-12-05T14:00:00Z',
  },
  {
    id: 'pm_004',
    projectId: 'proj_001',
    userId: 'user_005',
    user: mockUsers[4],
    role: 'viewer',
    joinedAt: '2024-12-10T11:00:00Z',
  },
];

// Mock 文档
export const mockDocuments: Document[] = [
  {
    id: 'doc_001',
    projectId: 'proj_001',
    folderId: 'folder_001',
    title: '客户需求调研报告',
    content: `# 客户需求调研报告

## 一、项目背景

深圳湾科技园是深圳市重点高新技术产业园区，占地面积约 120 万平方米，入驻企业超过 500 家。当前园区管理面临以下挑战：

1. **能耗监控不透明**：各楼宇能耗数据分散，无法进行统一分析
2. **访客管理效率低**：依赖人工登记，高峰期排队严重
3. **车辆管理混乱**：停车位利用率低，找车难

## 二、核心需求

### 2.1 能耗管理系统

- 实时采集各楼宇水电气数据
- 自动生成能耗报表
- 异常用能预警

### 2.2 访客管理系统

- 微信小程序预约
- 人脸识别快速通行
- 访客轨迹追踪

### 2.3 车辆管理系统

- 车牌识别自动计费
- 车位引导系统
- 月卡/临停灵活管理

## 三、预期目标

| 指标 | 当前值 | 目标值 |
|------|--------|--------|
| 能耗降低 | - | 15% |
| 访客通行效率 | 3分钟/人 | 30秒/人 |
| 车位利用率 | 65% | 85% |

## 四、项目时间表

- **需求确认**：2024年12月
- **方案设计**：2025年1月
- **投标截止**：2025年2月15日
`,
    status: 'approved',
    syncStatus: 'synced',
    createdBy: 'user_003',
    createdAt: '2024-12-05T10:00:00Z',
    updatedAt: '2024-12-20T15:30:00Z',
    updatedBy: 'user_003',
    wordCount: 486,
    version: 3,
    lockedBy: null,
    lockedAt: null,
  },
  {
    id: 'doc_002',
    projectId: 'proj_001',
    folderId: 'folder_001',
    title: '功能清单 v2.0',
    content: `# 智慧园区综合管理平台 - 功能清单

## 版本信息

- **版本号**: v2.0
- **更新日期**: 2025-01-15
- **编写人**: 王思聪

---

## 一、能耗监控模块

### 1.1 数据采集
- [ ] 支持 Modbus/MQTT 协议
- [ ] 5 分钟采集频率
- [ ] 断点续传

### 1.2 数据分析
- [ ] 同比/环比分析
- [ ] 分项计量
- [ ] 用能预测

### 1.3 报表导出
- [ ] 日报/周报/月报
- [ ] PDF/Excel 格式
- [ ] 定时发送邮件

---

## 二、访客管理模块

### 2.1 预约功能
- [ ] 小程序预约
- [ ] 邮件邀请
- [ ] 批量导入

### 2.2 通行验证
- [ ] 人脸识别
- [ ] 二维码通行
- [ ] 身份证验证
`,
    status: 'draft',
    syncStatus: 'synced',
    createdBy: 'user_003',
    createdAt: '2024-12-10T09:00:00Z',
    updatedAt: '2025-01-15T11:20:00Z',
    updatedBy: 'user_003',
    wordCount: 312,
    version: 5,
    lockedBy: null,
    lockedAt: null,
  },
  {
    id: 'doc_003',
    projectId: 'proj_001',
    folderId: 'folder_004',
    title: '系统架构设计',
    content: `# 智慧园区综合管理平台 - 系统架构设计

## 一、架构概述

本系统采用微服务架构，基于 Spring Cloud 技术栈构建，支持高可用、易扩展的部署模式。

## 二、技术选型

| 层级 | 技术栈 | 说明 |
|------|--------|------|
| 前端 | React + TypeScript | 管理后台 |
| 移动端 | 微信小程序 | 访客预约 |
| API 网关 | Spring Cloud Gateway | 统一入口 |
| 服务注册 | Nacos | 服务发现与配置 |
| 微服务 | Spring Boot 3.x | 业务服务 |
| 消息队列 | RocketMQ | 异步解耦 |
| 缓存 | Redis Cluster | 高性能缓存 |
| 数据库 | MySQL 8.0 + TiDB | 混合存储 |
| 时序数据 | TDengine | 能耗数据存储 |

## 三、服务划分

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                          │
└─────────────────────────────────────────────────────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│  用户服务  │  │ 能耗服务  │  │ 访客服务  │  │ 车辆服务  │
│ user-svc  │  │energy-svc │  │visitor-svc│  │vehicle-svc│
└───────────┘  └───────────┘  └───────────┘  └───────────┘
\`\`\`

## 四、部署架构

采用 Kubernetes 容器化部署，支持自动扩缩容：

- **生产环境**: 3 节点 K8s 集群
- **数据库**: 主从复制 + 读写分离
- **Redis**: 6 节点 Cluster
- **对象存储**: MinIO 或阿里云 OSS
`,
    status: 'pending_review',
    syncStatus: 'synced',
    createdBy: 'user_003',
    createdAt: '2024-12-15T14:00:00Z',
    updatedAt: '2025-01-18T10:30:00Z',
    updatedBy: 'user_003',
    wordCount: 423,
    version: 8,
    lockedBy: null,
    lockedAt: null,
  },
  {
    id: 'doc_004',
    projectId: 'proj_001',
    folderId: 'folder_005',
    title: 'API 接口设计规范',
    content: `# API 接口设计规范

## 一、接口规范

### 1.1 URL 规范

\`\`\`
https://api.smartpark.com/v1/{module}/{resource}
\`\`\`

### 1.2 请求方法

| 方法 | 用途 |
|------|------|
| GET | 查询资源 |
| POST | 创建资源 |
| PUT | 更新资源（全量） |
| PATCH | 更新资源（部分） |
| DELETE | 删除资源 |

### 1.3 响应格式

\`\`\`json
{
  "code": 0,
  "message": "success",
  "data": {},
  "timestamp": 1705651200000
}
\`\`\`
`,
    status: 'draft',
    syncStatus: 'synced',
    createdBy: 'user_004',
    createdAt: '2024-12-20T16:00:00Z',
    updatedAt: '2025-01-10T09:00:00Z',
    updatedBy: 'user_004',
    wordCount: 285,
    version: 2,
    lockedBy: null,
    lockedAt: null,
  },
  {
    id: 'doc_005',
    projectId: 'proj_001',
    folderId: 'folder_003',
    title: '商务报价单',
    content: `# 智慧园区综合管理平台 - 商务报价单

## 一、项目信息

- **项目名称**: 智慧园区综合管理平台
- **客户名称**: 深圳湾科技园
- **报价日期**: 2025-01-15
- **报价有效期**: 30 天

## 二、费用明细

### 2.1 软件费用

| 模块 | 单价 (万元) | 数量 | 小计 (万元) |
|------|------------|------|-------------|
| 能耗监控系统 | 35 | 1 | 35 |
| 访客管理系统 | 25 | 1 | 25 |
| 车辆管理系统 | 30 | 1 | 30 |
| 统一管理平台 | 20 | 1 | 20 |
| **软件小计** | | | **110** |

### 2.2 硬件费用

| 设备 | 单价 (万元) | 数量 | 小计 (万元) |
|------|------------|------|-------------|
| 服务器 | 8 | 4 | 32 |
| 人脸识别终端 | 0.5 | 20 | 10 |
| 车牌识别设备 | 0.8 | 10 | 8 |
| **硬件小计** | | | **50** |

## 三、费用汇总

| 项目 | 费用 (万元) |
|------|-------------|
| 软件费用 | 110 |
| 硬件费用 | 50 |
| 服务费用 | 30 |
| **合计** | **190** |
`,
    status: 'draft',
    syncStatus: 'synced',
    createdBy: 'user_003',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-15T16:00:00Z',
    updatedBy: 'user_003',
    wordCount: 356,
    version: 3,
    lockedBy: null,
    lockedAt: null,
  },
];

// Mock 文件树
export const mockFileTree: FileTreeNode[] = [
  {
    id: 'folder_001',
    type: 'folder',
    name: '需求文档',
    parentId: null,
    order: 1,
    isExpanded: true,
    children: [
      {
        id: 'doc_001',
        type: 'document',
        name: '客户需求调研报告',
        parentId: 'folder_001',
        order: 1,
        status: 'approved',
        syncStatus: 'synced',
        updatedAt: '2024-12-20T15:30:00Z',
        updatedBy: 'user_003',
      },
      {
        id: 'doc_002',
        type: 'document',
        name: '功能清单 v2.0',
        parentId: 'folder_001',
        order: 2,
        status: 'draft',
        syncStatus: 'synced',
        updatedAt: '2025-01-15T11:20:00Z',
        updatedBy: 'user_003',
      },
    ],
  },
  {
    id: 'folder_002',
    type: 'folder',
    name: '技术方案',
    parentId: null,
    order: 2,
    isExpanded: true,
    children: [
      {
        id: 'folder_004',
        type: 'folder',
        name: '系统架构',
        parentId: 'folder_002',
        order: 1,
        isExpanded: true,
        children: [
          {
            id: 'doc_003',
            type: 'document',
            name: '系统架构设计',
            parentId: 'folder_004',
            order: 1,
            status: 'pending_review',
            syncStatus: 'synced',
            updatedAt: '2025-01-18T10:30:00Z',
            updatedBy: 'user_003',
          },
        ],
      },
      {
        id: 'folder_005',
        type: 'folder',
        name: '接口设计',
        parentId: 'folder_002',
        order: 2,
        isExpanded: false,
        children: [
          {
            id: 'doc_004',
            type: 'document',
            name: 'API 接口设计规范',
            parentId: 'folder_005',
            order: 1,
            status: 'draft',
            syncStatus: 'synced',
            updatedAt: '2025-01-10T09:00:00Z',
            updatedBy: 'user_004',
          },
        ],
      },
    ],
  },
  {
    id: 'folder_003',
    type: 'folder',
    name: '投标文件',
    parentId: null,
    order: 3,
    isExpanded: false,
    children: [
      {
        id: 'doc_005',
        type: 'document',
        name: '商务报价单',
        parentId: 'folder_003',
        order: 1,
        status: 'draft',
        syncStatus: 'synced',
        updatedAt: '2025-01-15T16:00:00Z',
        updatedBy: 'user_003',
      },
    ],
  },
];

// Mock AI 对话
export const mockChatSessions: ChatSession[] = [
  {
    id: 'session_001',
    projectId: 'proj_001',
    title: '架构设计优化建议',
    createdAt: '2025-01-18T10:00:00Z',
    updatedAt: '2025-01-18T10:30:00Z',
    messages: [
      {
        id: 'msg_001',
        role: 'user',
        content: '帮我优化一下系统架构设计中关于微服务划分的描述，让它更专业一些',
        createdAt: '2025-01-18T10:00:00Z',
        attachedText: '本系统采用微服务架构，基于 Spring Cloud 技术栈构建',
      },
      {
        id: 'msg_002',
        role: 'assistant',
        content: `好的，我注意到您选中的内容是关于微服务架构的描述。我建议将其优化为：

> 本系统采用云原生微服务架构，以 Spring Cloud Alibaba 为技术底座，遵循领域驱动设计（DDD）原则进行服务划分。通过 Kubernetes 容器编排实现服务的自动化部署与弹性伸缩，确保系统具备高可用性与可扩展性。

这样的修改有以下优点：

1. **突出云原生特性** - 强调了现代化的部署方式
2. **引入 DDD 概念** - 体现专业的架构设计思想
3. **明确弹性能力** - 强调了系统的高可用保障`,
        createdAt: '2025-01-18T10:01:00Z',
        agentType: 'document',
      },
    ],
  },
];

// Mock 通知
export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'approval_request',
    title: '审批请求',
    content: '王思聪 提交了《系统架构设计》等待您的审批',
    isRead: false,
    createdAt: '2025-01-18T10:30:00Z',
    projectId: 'proj_001',
    documentId: 'doc_003',
    actionUrl: '/approvals?id=approval_001',
    actionLabel: '去审批',
  },
  {
    id: 'notif_002',
    type: 'comment',
    title: '新评论',
    content: '李晓燕 在《客户需求调研报告》中评论了您',
    isRead: false,
    createdAt: '2025-01-17T15:20:00Z',
    projectId: 'proj_001',
    documentId: 'doc_001',
  },
  {
    id: 'notif_003',
    type: 'approval_result',
    title: '审批通过',
    content: '您提交的《客户需求调研报告》已通过审批',
    isRead: true,
    createdAt: '2025-01-16T11:00:00Z',
    projectId: 'proj_001',
    documentId: 'doc_001',
  },
];

// 便捷方法
export const getDocumentById = (docId: string): Document | undefined => {
  return mockDocuments.find(d => d.id === docId);
};

export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(u => u.id === userId);
};

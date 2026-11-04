export type PageMode = 'workspace' | 'skills' | 'project-settings' | 'admin' | 'settings' | 'login';

export type WorkspaceType = 'personal' | 'project';

export interface UserProfile {
  id: string;
  name: string;
  avatarChar: string;
  email: string;
  department: string;
  role: '平台管理员' | '项目负责人' | '高级工程师' | '运营专家';
  feishuLinked: boolean;
  feishuOpenId: string;
  feishuTenant: string;
  lastLogin: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  subtitle: string;
  avatarIcon: string;
  model: string;
  description: string;
  isPersonal: boolean;
  activeSkillIds: string[];
  systemPrompt: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: '飞书协同' | '研发与代码' | '文档与报告' | '自动化与集成';
  description: string;
  iconName: string;
  enabled: boolean;
  callCount: number;
  author: '系统内置' | '企业私有定制';
}

export interface DepartmentNode {
  id: string;
  name: string;
  memberCount: number;
  members: ProjectMember[];
}

export interface ProjectConversation {
  id: string;
  projectId: string;
  title: string;
  updatedAt: string;
  messageCount: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  owner: string;
  isPersonal: boolean;
  memberCount: number;
  docCount: number;
  lastUpdated: string;
  status: 'active' | 'archived';
  members: ProjectMember[];
  docs: FeishuDocument[];
  conversations: ProjectConversation[];
}

export interface ProjectMember {
  id: string;
  name: string;
  avatarChar: string;
  email?: string;
  role: '负责人' | '成员' | '只读访客';
  department: string;
  joinedAt: string;
  feishuOpenId?: string;
}

export interface FeishuDocument {
  id: string;
  token: string;
  title: string;
  type: 'doc' | 'sheet' | 'bitable' | 'wiki';
  updateTime: string;
  creator: string;
  permission: '可阅读' | '可编辑' | '项目公开';
  synced: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  status: 'uploading' | 'parsing' | 'indexed' | 'failed';
  progress: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  agentName?: string;
  thinkingSteps?: string[];
  toolInvocations?: {
    toolName: string;
    input: string;
    status: 'running' | 'completed' | 'failed';
    outputPreview?: string;
  }[];
  attachments?: {
    title: string;
    type: string;
    id: string;
  }[];
}

export interface AgentTask {
  id: string;
  title: string;
  type: '周报生成' | '文档索引' | '数据比对' | '通知派发';
  creator: string;
  project: string;
  status: 'pending_approval' | 'running' | 'completed' | 'failed';
  startedAt: string;
  duration?: string;
  detail: string;
}

export interface AuditRecord {
  id: string;
  operator: string;
  operatorId: string;
  action: string;
  targetResource: string;
  targetId: string;
  timestamp: string;
  ip: string;
  status: '成功' | '已拦截' | '需复核';
}

export interface ModelGatewayStatus {
  id: string;
  name: string;
  provider: string;
  latencyMs: number;
  successRate: number;
  status: 'normal' | 'degraded' | 'offline';
  todayTokens: number;
  maxTokensPerMinute: number;
}

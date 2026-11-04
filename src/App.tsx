import React, { useState } from 'react';
import {
  PageMode,
  ChatMessage,
  FeishuDocument,
  ProjectMember,
  ProjectItem,
  AgentProfile,
  SkillItem,
  UploadedFile,
  ProjectConversation,
} from './types';
import {
  currentUser as initialUser,
  projectList as initialProjects,
  feishuDocuments as initialDocs,
  initialAgentTasks,
  mockAuditLogs,
  modelGatewayList,
  availableAgents as initialAgents,
  enterpriseSkills as initialSkills,
  feishuDepartments,
  initialUploadedFiles,
} from './data/mockData';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AgentChatView } from './components/chat/AgentChatView';
import { ResourceDrawer } from './components/drawer/ResourceDrawer';
import { ApprovalsModal } from './components/drawer/ApprovalsModal';
import { ProjectManagement } from './components/projects/ProjectManagement';
import { AdminConsole } from './components/admin/AdminConsole';
import { UserSettings } from './components/settings/UserSettings';
import { LoginPage } from './components/auth/LoginPage';
import { VueExportModal } from './components/vue-guide/VueExportModal';
import { SkillsMarketplace } from './components/skills/SkillsMarketplace';
import { FeishuOrgModal } from './components/organization/FeishuOrgModal';
import { CreateProjectModal } from './components/projects/CreateProjectModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageMode>('workspace');
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [projects, setProjects] = useState(initialProjects);
  const [documents, setDocuments] = useState(initialDocs);
  const [tasks, setTasks] = useState(initialAgentTasks);
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs);
  const [models, setModels] = useState(modelGatewayList);
  const [availableAgentsList, setAvailableAgentsList] = useState(initialAgents);
  const [currentAgent, setCurrentAgent] = useState<AgentProfile>(initialAgents[0]);
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(initialUploadedFiles);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('proj-01');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [isVueGuideOpen, setIsVueGuideOpen] = useState(false);
  const [isFeishuOrgOpen, setIsFeishuOrgOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const [selectedModel, setSelectedModel] = useState('Claude 3.5 Sonnet (高思考推理)');
  const [activeChatTitle, setActiveChatTitle] = useState('第44周研发进展与要点提炼');

  // Messages state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'user',
      content: '帮我检索飞书中与当前工作相关的文档，提取第44周研发进展并列出核心要点。',
      timestamp: '10:02:15',
      attachments: [
        {
          id: 'doc-01',
          title: 'AI 开发部周报-2026年第44周 (10.26-10.30)',
          type: 'doc',
        },
      ],
    },
    {
      id: 'msg-init-2',
      sender: 'agent',
      agentName: currentAgent.name,
      content: `已为您完成文档检索与关键要点提取。基于绑定的飞书文档《AI 开发部周报-2026年第44周 (10.26-10.30)》，核心进展汇总如下：

1. 核心架构与网关演进
   • 企业 Agent 网关 v2.4 灰度上线，多模型冷启动延迟降低 42%，支持 Claude 3.5 与 DeepSeek V3 动态路由与降级熔断。
   • 针对飞书 OpenAPI 鉴权链条完成单向凭证脱敏，实现组织架构权限实时继承。

2. 重点业务落地
   • 智能协同工作台完成基础交互重构，重构后界面符合企业级 SaaS 统一视觉规范。
   • 完成飞书云文档知识库增量向量同步测试，检索命中率提升至 94.6%。

3. 下周待推进与关键风险
   • [需关注] 跨部门长周期异步任务执行需建立人机协同二次确认流，防范未授权的数据外发。
   • 全面接入生产级安全审计管道与敏感词合规阻断。`,
      timestamp: '10:02:38',
      thinkingSteps: [
        '解析用户意图：提取关联飞书文档的关键业务线与研发进展',
        '校验飞书权限：当前用户（董平）具备 doc:readonly 与项目负责人权限',
        '检索云文档 Token: QlXxdIBLDoof4Qx7bc3c0QyAnYg，切片召回 18 个核心段落',
        '结构化提炼：分为架构演进、业务落地、风险同步三个维度输出',
      ],
      toolInvocations: [
        {
          toolName: 'FeishuDocReadTool',
          input: '{"doc_token": "QlXxdIBLDoof4Qx7bc3c0QyAnYg", "fetch_mode": "full"}',
          status: 'completed',
          outputPreview: '成功提取 4,820 字符正文内容，已过滤敏感凭证',
        },
      ],
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  // Send message handler with simulated streaming agent intelligence
  const handleSendMessage = (text: string, attachments?: FeishuDocument[]) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toTimeString().slice(0, 8),
      attachments: attachments?.map((d) => ({ id: d.id, title: d.title, type: d.type })),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    // Simulate Agent Thinking and Response
    setTimeout(() => {
      const isWeekReport = text.includes('周报') || text.includes('进展');
      const isEmail = text.includes('邮件');

      let replyContent = '';
      let thinkingSteps: string[] = [];
      let toolName = 'FeishuWorkspaceQuery';
      let outputPreview = '查询成功，知识库上下文匹配度 96.2%';

      if (isWeekReport) {
        thinkingSteps = [
          '分析任务：生成结构化周报草稿',
          '读取项目资料与关联飞书文档中的任务交付物',
          '根据个人偏好格式套用：重点攻坚、关键交付、风险预警与下周规划',
        ];
        toolName = 'ReportGeneratorAgent';
        outputPreview = '已完成排期对齐，已提取本周 4 项交付物';
        replyContent = `已根据当前工作进展为您生成结构化周报草稿：

【本周重点攻坚】
• 完成企业智能 Agent 系统前端统一视觉与交互规范重构，包括登录、操作工作台、项目管理与后台。
• 优化飞书 OpenAPI 鉴权机制，实现成员权限无缝继承与数据沙箱隔离。

【关键交付成果】
• 统一设计色彩体系与紧凑布局规范，去除低质胶囊与无意义边框，符合企业级 SaaS 标准。
• 完成 Agent 思考过程可视化与长周期人机审批二次确认流。

【风险预警与协调】
• 需确认下周跨部门协同推送的时间节点，已在后台生成【待人工确认】事项。

【下周工作规划】
1. 推进各业务线模型调度网关指标监控联调。
2. 完善飞书群卡片即时推送与消息卡片交互。`;
      } else if (isEmail) {
        thinkingSteps = [
          '任务类型：拟写跨部门商务协同邮件',
          '融入个人设置记忆：保持严谨商务语气，固定标准签名',
          '明确收件人角色、协同目的与交付时间线',
        ];
        toolName = 'CorporateEmailAssistant';
        outputPreview = '合规检查通过，语气符合企业商务礼仪标准';
        replyContent = `为您拟写的协同工作邮件草稿如下：

主题：【协同推进】关于企业智能 Agent 网关安全合规联调与上线排期的沟通

各位架构师、项目负责人好：

针对我司企业智能 Agent 协同系统近期推进的私有化模型网关接入与飞书安全沙箱联调，为保障各部门数据资产合规与平稳过渡，特就核心里程碑与大家进行同步：

1. 核心进度：目前网关 v2.4 鉴权协议与飞书 OpenAPI 细粒度权限校验已通过内测，可支撑高并发推理与知识库召回。
2. 协同诉求：烦请各业务线于本周五（11月6日）17:00 前完成接口幂等性自查。
3. 联调窗口：拟定于下周二上午 10:00 组织跨团队线上联合推演。

如有任何排期冲突或技术疑问，请随时与我联系。

祝好，

董平 | 平台管理员
AI 架构与企业平台部
成都智行创新科技有限公司`;
      } else {
        thinkingSteps = [
          `解析意图：针对用户提出的任务调用 ${currentAgent.name} 进行拆解与上下文联想`,
          '检索当前项目（' + (selectedProjectId ? '测试项目1' : '个人空间') + '）绑定的知识资料',
          '结合企业调度网关生成专业解答',
        ];
        replyContent = `已收到您的任务指令：“${text}”。\n\n${currentAgent.name} 已通过企业统一网关结合项目上下文完成评估。针对本项任务，建议从以下两个方面切入执行：\n\n1. 知识库对齐：已自动索引相关飞书文档，各成员将基于各自原有访问权限读取。\n2. 执行跟踪：如涉及批量派发或跨系统修改，系统将在后台自动生成【待确认】任务卡片以保障合规。`;
      }

      const agentReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        agentName: currentAgent.name,
        content: replyContent,
        timestamp: new Date().toTimeString().slice(0, 8),
        thinkingSteps,
        toolInvocations: [
          {
            toolName,
            input: `{"query": "${text.slice(0, 30)}..."}`,
            status: 'completed',
            outputPreview,
          },
        ],
      };

      setMessages((prev) => [...prev, agentReply]);
      setIsGenerating(false);

      // Record audit log
      const newAudit: any = {
        id: `aud-${Date.now()}`,
        operator: currentUser.name,
        operatorId: currentUser.id,
        action: `Agent执行任务: ${text.slice(0, 16)}`,
        targetResource: '对话与知识库',
        targetId: 'ctx_agent_session',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        ip: '10.24.180.12',
        status: '成功',
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }, 1200);
  };

  const handleOpenNewChat = () => {
    setMessages([]);
    setActiveChatTitle('新对话');
  };

  const handleSelectHistoryChat = (title: string) => {
    setActiveChatTitle(title);
    if (title === '新对话') {
      setMessages([]);
    }
  };

  // Switch to a conversation under a specific project
  const handleSelectProjectConversation = (projectId: string, conv: ProjectConversation) => {
    setSelectedProjectId(projectId);
    setActiveChatTitle(conv.title);

    // Mock specific messages for the conversation
    if (conv.id === 'conv-t2') {
      setMessages([
        {
          id: 'msg-t2-1',
          sender: 'user',
          content: '请根据接入白皮书评估网关 v2.4 鉴权协议中，OAuth 2.0 刷新令牌超时处理策略。',
          timestamp: '09:15:22',
        },
        {
          id: 'msg-t2-2',
          sender: 'agent',
          agentName: currentAgent.name,
          content: '根据《企业智能 Agent 网关接入规范与鉴权协议 v2.4》，OAuth 2.0 Refresh Token 采用双周滑动窗口续期机制：\n\n1. 每次有效调用顺延 7 天生命周期，最大绝对有效期 90 天。\n2. 若网关检测到跨机房异地访问（基于飞书审计指纹），强制触发二次 MFA 挑战，避免凭证泄露风险。',
          timestamp: '09:15:40',
        },
      ]);
    } else {
      setMessages([
        {
          id: 'msg-conv-init',
          sender: 'user',
          content: `进入对话：${conv.title}，请列出与当前主题相关的待办与核心资料。`,
          timestamp: '10:00:00',
        },
        {
          id: 'msg-conv-agent',
          sender: 'agent',
          agentName: currentAgent.name,
          content: `已为您定位至项目协同对话【${conv.title}】。\n\n当前已挂载本项目的知识库文档与飞书团队权限。您可以直接发出指令，或在右侧引用更多资料。`,
          timestamp: '10:00:15',
        },
      ]);
    }
  };

  // Create a new conversation under a specific project
  const onCreateProjectConversation = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    const newTitle = `新会话 #${(proj?.conversations?.length || 0) + 1}`;
    const newConv: ProjectConversation = {
      id: `conv-${Date.now()}`,
      projectId,
      title: newTitle,
      updatedAt: '刚刚',
      messageCount: 0,
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, conversations: [newConv, ...(p.conversations || [])] }
          : p
      )
    );

    setSelectedProjectId(projectId);
    setActiveChatTitle(newTitle);
    setMessages([]);
    setCurrentPage('workspace');
  };

  const handleApproveTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'completed' as const } : t))
    );
  };

  const handleRejectTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'failed' as const } : t))
    );
  };

  const handleToggleSkill = (skillId: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === skillId ? { ...s, enabled: !s.enabled } : s))
    );
  };

  // Handle local file upload
  const handleUploadNewFile = (file: File) => {
    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;

    const newUploaded: UploadedFile = {
      id: `up-${Date.now()}`,
      name: file.name,
      size: sizeStr,
      type: file.name.split('.').pop() || 'file',
      uploadedAt: new Date().toTimeString().slice(0, 5),
      status: 'indexed',
      progress: 100,
    };

    setUploadedFiles((prev) => [newUploaded, ...prev]);

    // Also register in documents so it can be cited
    const newDoc: FeishuDocument = {
      id: newUploaded.id,
      token: newUploaded.id,
      title: file.name,
      type: 'doc',
      updateTime: '刚刚',
      creator: currentUser.name,
      permission: '可阅读',
      synced: true,
    };
    setDocuments((prev) => [newDoc, ...prev]);

    alert(`文件「${file.name}」已成功上传至知识沙箱，并完成向量切片索引！`);
  };

  const handleDeleteUploadedFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddFeishuToken = (title: string, token: string) => {
    const newDoc: FeishuDocument = {
      id: `doc-${Date.now()}`,
      token,
      title,
      type: 'doc',
      updateTime: '刚刚',
      creator: currentUser.name,
      permission: '可阅读',
      synced: true,
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleAddProjectMember = (projectId: string, member: Partial<ProjectMember>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const newM: ProjectMember = {
            id: `m-${Date.now()}`,
            name: member.name || '新成员',
            avatarChar: (member.name || '新').slice(0, 1),
            email: member.email || 'user@company.internal',
            role: member.role || '成员',
            department: member.department || '技术部',
            joinedAt: '今日',
          };
          return {
            ...p,
            members: [...p.members, newM],
            memberCount: p.memberCount + 1,
          };
        }
        return p;
      })
    );
  };

  const handleCreateProject = (newProj: ProjectItem) => {
    setProjects([newProj, ...projects]);
    setSelectedProjectId(newProj.id);
    setActiveChatTitle(newProj.name);
    setCurrentPage('workspace');
  };

  const currentProjectObj = projects.find((p) => p.id === selectedProjectId) || null;
  const pendingApprovalsCount = tasks.filter((t) => t.status === 'pending_approval').length;
  const enabledSkillsCount = skills.filter((s) => s.enabled).length;

  // Render Login Page if page is 'login'
  if (currentPage === 'login') {
    return <LoginPage onLoginSuccess={() => setCurrentPage('workspace')} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-800 text-sm">
      {/* 1. Left Persistent Sidebar with project conversation tree */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(p) => setCurrentPage(p)}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => {
          setSelectedProjectId(id);
          const p = projects.find((proj) => proj.id === id);
          if (p) {
            const firstConv = p.conversations?.[0];
            setActiveChatTitle(firstConv ? firstConv.title : `${p.name} · 会话`);
          } else {
            setActiveChatTitle('个人空间 · 私密对话');
          }
        }}
        projects={projects}
        currentUser={currentUser}
        onOpenNewChat={handleOpenNewChat}
        activeChatTitle={activeChatTitle}
        onSelectHistoryChat={handleSelectHistoryChat}
        pendingTasksCount={pendingApprovalsCount}
        currentAgent={currentAgent}
        availableAgents={availableAgentsList}
        onSelectAgent={(ag) => {
          setCurrentAgent(ag);
          setSelectedModel(ag.model);
        }}
        enabledSkillsCount={enabledSkillsCount}
        onOpenFeishuOrg={() => setIsFeishuOrgOpen(true)}
        onOpenCreateProject={() => setIsCreateProjectOpen(true)}
        onSelectProjectConversation={handleSelectProjectConversation}
        onCreateProjectConversation={onCreateProjectConversation}
      />

      {/* 2. Main Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top 3-Zone Header Contract */}
        <Header
          currentPage={currentPage}
          projectName={currentProjectObj?.name}
          onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
          isDrawerOpen={isDrawerOpen}
          onOpenApprovals={() => setIsApprovalsOpen(true)}
          pendingApprovalsCount={pendingApprovalsCount}
          onOpenVueGuide={() => setIsVueGuideOpen(true)}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />

        {/* Content Body based on currentPage */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {currentPage === 'workspace' && (
            <AgentChatView
              currentProject={currentProjectObj}
              messages={messages}
              onSendMessage={handleSendMessage}
              onOpenResourceDrawer={() => setIsDrawerOpen(true)}
              availableDocs={documents}
              isGenerating={isGenerating}
              selectedModel={selectedModel}
              currentAgent={currentAgent}
              skills={skills}
              onOpenInviteMembers={() => setIsCreateProjectOpen(true)}
              onUploadFile={handleUploadNewFile}
            />
          )}

          {currentPage === 'skills' && (
            <SkillsMarketplace
              skills={skills}
              onToggleSkill={handleToggleSkill}
              currentAgent={currentAgent}
              onOpenNewChatWithSkill={() => setCurrentPage('workspace')}
            />
          )}

          {currentPage === 'project-settings' && (
            <ProjectManagement
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onOpenProjectChat={(id, conv) => {
                setSelectedProjectId(id);
                if (conv) {
                  handleSelectProjectConversation(id, conv);
                }
                setCurrentPage('workspace');
              }}
              onAddMember={handleAddProjectMember}
              onAddDocument={() => {}}
              departments={feishuDepartments}
              onOpenCreateProjectModal={() => setIsCreateProjectOpen(true)}
              onCreateProjectConversation={onCreateProjectConversation}
              onUploadFile={handleUploadNewFile}
            />
          )}

          {currentPage === 'admin' && (
            <AdminConsole
              tasks={tasks}
              auditLogs={auditLogs}
              models={models}
              onRefresh={() => {
                setTasks([...tasks]);
              }}
              onApproveTask={handleApproveTask}
              onCancelTask={handleRejectTask}
            />
          )}

          {currentPage === 'settings' && (
            <UserSettings
              user={currentUser}
              onLogout={() => setCurrentPage('login')}
              onUpdateUser={(updated) => setCurrentUser({ ...currentUser, ...updated })}
              uploadedFiles={uploadedFiles}
              onUploadNewFile={handleUploadNewFile}
              onDeleteUploadedFile={handleDeleteUploadedFile}
            />
          )}

          {/* Right Resource Drawer (with File Upload UI & Feishu Documents) */}
          <ResourceDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            documents={documents}
            onAddToChat={(doc) => {
              handleSendMessage(`请基于文档《${doc.title}》提取重点内容。`, [doc]);
            }}
            onOpenProjectSettings={() => {
              setCurrentPage('project-settings');
              setIsDrawerOpen(false);
            }}
            projectName={currentProjectObj?.name || '测试项目1'}
            uploadedFiles={uploadedFiles}
            onUploadNewFile={handleUploadNewFile}
            onDeleteUploadedFile={handleDeleteUploadedFile}
            onAddFeishuToken={handleAddFeishuToken}
          />
        </div>
      </div>

      {/* 3. Global Modals */}
      <ApprovalsModal
        isOpen={isApprovalsOpen}
        onClose={() => setIsApprovalsOpen(false)}
        tasks={tasks}
        onApproveTask={handleApproveTask}
        onRejectTask={handleRejectTask}
      />

      <VueExportModal
        isOpen={isVueGuideOpen}
        onClose={() => setIsVueGuideOpen(false)}
      />

      <FeishuOrgModal
        isOpen={isFeishuOrgOpen}
        onClose={() => setIsFeishuOrgOpen(false)}
        departments={feishuDepartments}
      />

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreateProject={handleCreateProject}
        availableDocs={documents}
        departments={feishuDepartments}
      />
    </div>
  );
}

import React, { useState } from 'react';
import {
  FolderKanban,
  Users,
  FileText,
  Plus,
  MessageSquare,
  Sliders,
  UserPlus,
  Lock,
  Building2,
  Check,
  X,
  UploadCloud,
  ArrowRight,
  Clock,
  Sparkles,
  Bot,
  ExternalLink,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import {
  ProjectItem,
  ProjectMember,
  FeishuDocument,
  DepartmentNode,
  ProjectConversation,
} from '../../types';

interface ProjectManagementProps {
  projects: ProjectItem[];
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onOpenProjectChat: (id: string, conv?: ProjectConversation) => void;
  onAddMember: (projectId: string, member: Partial<ProjectMember>) => void;
  onAddDocument: (projectId: string, doc: Partial<FeishuDocument>) => void;
  departments: DepartmentNode[];
  onOpenCreateProjectModal: () => void;
  onCreateProjectConversation?: (projectId: string) => void;
  onUploadFile?: (file: File) => void;
}

export const ProjectManagement: React.FC<ProjectManagementProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onOpenProjectChat,
  onAddMember,
  departments,
  onOpenCreateProjectModal,
  onCreateProjectConversation,
  onUploadFile,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'conversations' | 'members' | 'docs' | 'settings'>('conversations');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || '');
  const [newMemberRole, setNewMemberRole] = useState<'成员' | '负责人' | '只读访客'>('成员');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const currentDept = departments.find((d) => d.id === selectedDeptId) || departments[0];

  const handleInviteEmployee = (emp: ProjectMember) => {
    onAddMember(currentProject.id, {
      name: emp.name,
      avatarChar: emp.avatarChar,
      email: emp.email,
      role: newMemberRole,
      department: emp.department,
      joinedAt: '今日',
    });
    showToast(`已向 ${emp.name} 发送飞书协同邀请，并授予【${newMemberRole}】权限`);
    setShowInviteModal(false);
  };

  // Total metrics
  const totalConversations = projects.reduce((acc, p) => acc + (p.conversations?.length || 0), 0);
  const totalMembers = projects.reduce((acc, p) => acc + p.members.length, 0);

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50 select-none">
      {/* Sub-Sidebar for Project Navigation */}
      <aside className="w-72 border-r border-slate-200 bg-white p-4 flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4.5 h-4.5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              项目空间与协同
            </h2>
          </div>
          <button
            onClick={onOpenCreateProjectModal}
            className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50"
            title="创建个人或团队协同项目"
          >
            <Plus className="w-4 h-4" />
            新建空间
          </button>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => onSelectProject(null)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              selectedProjectId === null
                ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-blue-600" />
              <span>全部项目空间</span>
            </div>
            <span className="text-xs bg-slate-200/80 px-2 py-0.5 rounded font-mono font-medium text-slate-700">
              {projects.length}
            </span>
          </button>

          <div className="pt-4 pb-1.5 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
            项目清单
          </div>

          {projects.map((proj) => {
            const isSelected = selectedProjectId === proj.id;
            const convCount = proj.conversations?.length || 0;
            return (
              <button
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj.id);
                  setActiveSubTab('conversations');
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate pr-1">
                  {proj.isPersonal ? (
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <Users className="w-4 h-4 text-blue-500 shrink-0" />
                  )}
                  <span className="truncate">{proj.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono">
                  <span className="text-blue-600 font-medium">{convCount}条对话</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 text-xs text-slate-400 leading-relaxed">
          项目内成员共同挂载飞书资料与知识切片，每个人独立发起的对话保持安全隔离，杜绝越权访问。
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="p-3.5 px-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-150">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                <span className="font-medium">{toastMessage}</span>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-blue-500 hover:text-blue-800 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Header */}
          <div>
            <div className="text-xs font-bold tracking-wider text-blue-700 uppercase mb-1">
              PROJECT WORKSPACE & CONVERSATIONS
            </div>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {selectedProjectId === null ? '全部项目空间' : currentProject.name}
                  </h1>
                  {selectedProjectId !== null && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {currentProject.isPersonal ? '个人私密项目' : `团队协同 · ${currentProject.memberCount}人`}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
                  {selectedProjectId === null
                    ? '统一管理个人私密项目与团队共享资料；支持飞书一键邀请协同，每个项目下可维护多个对话分支。'
                    : currentProject.description}
                </p>
              </div>

              {selectedProjectId !== null && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (onCreateProjectConversation) {
                        onCreateProjectConversation(currentProject.id);
                        showToast(`已在【${currentProject.name}】下创建新对话分支`);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    新建对话
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* VIEW A: ALL PROJECTS OVERVIEW */}
          {selectedProjectId === null ? (
            <div className="space-y-6">
              {/* Summary Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-medium text-slate-500">项目空间总计</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{projects.length} 个</div>
                  <div className="text-xs text-blue-600 mt-1">含 1 个个人私有</div>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-medium text-slate-500">累计对话分支</div>
                  <div className="text-2xl font-bold text-blue-600 mt-1">{totalConversations} 个会话</div>
                  <div className="text-xs text-slate-400 mt-1">各分支上下文独立</div>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-medium text-slate-500">挂载飞书资料</div>
                  <div className="text-2xl font-bold text-indigo-600 mt-1">4 篇云文档</div>
                  <div className="text-xs text-emerald-600 mt-1">实时向量索引</div>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-medium text-slate-500">协同参与成员</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{totalMembers} 人</div>
                  <div className="text-xs text-slate-400 mt-1">飞书组织架构同步</div>
                </div>
              </div>

              {/* Projects Card List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">所有活跃项目空间</span>
                  <button
                    onClick={onOpenCreateProjectModal}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    新建项目
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          {proj.isPersonal ? (
                            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                              <Lock className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                              <Users className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-slate-900">{proj.name}</h3>
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {proj.isPersonal ? '个人私有' : '团队协同'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              负责人: {proj.owner} · 更新于 {proj.lastUpdated}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                          <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {proj.conversations?.length || 0} 个对话分支
                          </span>
                          <span>·</span>
                          <span>{proj.isPersonal ? '仅自己可见' : `成员 ${proj.memberCount} 人`}</span>
                          <span>·</span>
                          <span>绑定知识资料 {proj.docCount} 篇</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <button
                          onClick={() => {
                            onSelectProject(proj.id);
                            setActiveSubTab('conversations');
                          }}
                          className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors"
                        >
                          对话分支 ({proj.conversations?.length || 0})
                        </button>
                        <button
                          onClick={() => onOpenProjectChat(proj.id)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-2xs"
                        >
                          进入工作台
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* VIEW B: SPECIFIC PROJECT DETAIL (WITH CONVERSATIONS AS 1ST TAB) */
            <div className="space-y-6">
              {/* Detail Tabs */}
              <div className="flex items-center gap-1 border-b border-slate-200">
                <button
                  onClick={() => setActiveSubTab('conversations')}
                  className={`pb-3.5 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                    activeSubTab === 'conversations'
                      ? 'border-blue-600 text-blue-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  项目对话列表 ({currentProject.conversations?.length || 0})
                </button>
                <button
                  onClick={() => setActiveSubTab('members')}
                  className={`pb-3.5 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                    activeSubTab === 'members'
                      ? 'border-blue-600 text-blue-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  项目协同成员 ({currentProject.members.length})
                </button>
                <button
                  onClick={() => setActiveSubTab('docs')}
                  className={`pb-3.5 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                    activeSubTab === 'docs'
                      ? 'border-blue-600 text-blue-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  共享知识与文件 ({currentProject.docs.length})
                </button>
                <button
                  onClick={() => setActiveSubTab('settings')}
                  className={`pb-3.5 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                    activeSubTab === 'settings'
                      ? 'border-blue-600 text-blue-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  Agent 授权与合规
                </button>
              </div>

              {/* 1. CONVERSATIONS SUB-TAB (CRITICAL FEATURE FOR USER) */}
              {activeSubTab === 'conversations' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {currentProject.name} 的对话分支列表
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        每个项目下可维护多个平行的对话线程，共同继承该项目的飞书文档与知识库。
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (onCreateProjectConversation) {
                          onCreateProjectConversation(currentProject.id);
                          showToast(`已在【${currentProject.name}】下创建新对话`);
                        }
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-2xs"
                    >
                      <Plus className="w-4 h-4" />
                      发起新对话分支
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                    {currentProject.conversations && currentProject.conversations.length > 0 ? (
                      currentProject.conversations.map((conv) => (
                        <div
                          key={conv.id}
                          className="p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
                        >
                          <div className="space-y-1.5 min-w-0 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <MessageSquare className="w-4.5 h-4.5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900 truncate">
                                  {conv.title}
                                </h4>
                                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                                  <span>更新于 {conv.updatedAt}</span>
                                  <span>·</span>
                                  <span>{conv.messageCount} 条对话往来</span>
                                  <span>·</span>
                                  <span className="text-emerald-600 font-medium">已绑定项目上下文</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => onOpenProjectChat(currentProject.id, conv)}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-2xs"
                            >
                              <span>进入此对话</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-sm text-slate-400">
                        暂无对话，点击右上角“发起新对话分支”开始
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. MEMBERS SUB-TAB */}
              {activeSubTab === 'members' && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">协同成员名单</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        成员可读取项目共享资料及个人有权访问的飞书文档；个人私有对话互不可见。
                      </p>
                    </div>

                    {!currentProject.isPersonal && (
                      <button
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        邀请飞书成员加入
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100">
                    {currentProject.members.map((member) => (
                      <div
                        key={member.id}
                        className="p-4 px-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700">
                            {member.avatarChar}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900">{member.name}</span>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span>{member.department}</span>
                              <span>·</span>
                              <span>加入于 {member.joinedAt}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                              member.role === '负责人'
                                ? 'bg-blue-50 text-blue-800 border-blue-200 font-bold'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {member.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. DOCUMENTS & FILES SUB-TAB */}
              {activeSubTab === 'docs' && (
                <div className="space-y-6">
                  {/* File Upload Zone Embedded in Project */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-bold text-slate-900">
                          为【{currentProject.name}】挂载新知识与文件
                        </h3>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center bg-slate-50/50 transition-colors">
                      <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-800">
                        拖拽本地文件至此处，自动关联至本项目
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        支持 PDF、Word (.docx)、Excel (.xlsx)、Markdown (.md)
                      </p>
                      <label className="mt-3 inline-block px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                        选择文件挂载
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.md"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0] && onUploadFile) {
                              onUploadFile(e.target.files[0]);
                              showToast(`文件《${e.target.files[0].name}》已成功挂载至当前项目`);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">已绑定的飞书文档与知识库</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          挂载的文档会自动索引至项目上下文，向 Agent 提问时自动进行语义切片检索。
                        </p>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {currentProject.docs.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-4 px-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <FileText className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">{doc.title}</span>
                                <span className="text-xs font-mono text-slate-400">
                                  ({doc.token.slice(0, 8)}...)
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                <span>创建人: {doc.creator}</span>
                                <span>·</span>
                                <span>更新于 {doc.updateTime}</span>
                                <span>·</span>
                                <span className="text-emerald-600 font-medium">{doc.permission}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              已向量化
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. SETTINGS SUB-TAB */}
              {activeSubTab === 'settings' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">项目 Agent 授权与安全隔离策略</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      配置此项目允许调用的模型配额、插件沙箱和数据防外溢规则。
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-slate-900">允许执行长周期自主规划任务</div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          开启后，Agent 可自主将跨文档任务拆解为多子任务并分发至队列中。
                        </p>
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                        已启用
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-slate-900">飞书外发群消息必须二次确认</div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          所有推送至飞书群的决策卡片与邮件，均需项目负责人或发起人点击确认后生效。
                        </p>
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                        强制合规开启
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserPlus className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">从飞书通讯录添加协同成员</h3>
                  <p className="text-xs text-slate-500">继承飞书部门与组织架构，一键授予项目权限</p>
                </div>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">授予项目角色</label>
                <div className="flex gap-2">
                  {(['成员', '负责人', '只读访客'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setNewMemberRole(role)}
                      className={`flex-1 py-2 text-xs rounded-xl font-medium border transition-colors ${
                        newMemberRole === role
                          ? 'bg-blue-50 text-blue-800 border-blue-400 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">选择飞书部门</label>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDeptId(dept.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                        selectedDeptId === dept.id
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {dept.name} ({dept.members.length}人)
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-56 overflow-y-auto">
                {currentDept?.members.map((emp) => {
                  const isAlreadyMember = currentProject.members.some((m) => m.name === emp.name);
                  return (
                    <div
                      key={emp.id}
                      className="p-3 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                          {emp.avatarChar}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{emp.name}</div>
                          <div className="text-[11px] text-slate-400">{emp.email}</div>
                        </div>
                      </div>

                      {isAlreadyMember ? (
                        <span className="text-xs text-slate-400 font-medium">已在项目中</span>
                      ) : (
                        <button
                          onClick={() => handleInviteEmployee(emp)}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                        >
                          邀请加入
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

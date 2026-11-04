import React, { useState, useMemo } from 'react';
import {
  User,
  FolderKanban,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Settings,
  Bot,
  Search,
  X,
  Plus,
  Users2,
  Lock,
  Puzzle,
  Building2,
  Sparkles,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  FolderOpen,
} from 'lucide-react';
import { PageMode, ProjectItem, UserProfile, AgentProfile, ProjectConversation } from '../../types';

interface SidebarProps {
  currentPage: PageMode;
  onNavigate: (page: PageMode) => void;
  selectedProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
  projects: ProjectItem[];
  currentUser: UserProfile;
  onOpenNewChat: () => void;
  activeChatTitle: string;
  onSelectHistoryChat: (title: string) => void;
  pendingTasksCount: number;
  currentAgent: AgentProfile;
  availableAgents: AgentProfile[];
  onSelectAgent: (agent: AgentProfile) => void;
  enabledSkillsCount: number;
  onOpenFeishuOrg: () => void;
  onOpenCreateProject: () => void;
  activeConversationId?: string;
  onSelectProjectConversation: (projectId: string, conv: ProjectConversation) => void;
  onCreateProjectConversation: (projectId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  selectedProjectId,
  onSelectProject,
  projects,
  currentUser,
  onOpenNewChat,
  activeChatTitle,
  onSelectHistoryChat,
  pendingTasksCount,
  currentAgent,
  availableAgents,
  onSelectAgent,
  enabledSkillsCount,
  onOpenFeishuOrg,
  onOpenCreateProject,
  activeConversationId,
  onSelectProjectConversation,
  onCreateProjectConversation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [teamProjectsExpanded, setTeamProjectsExpanded] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Keep track of which projects have their conversation lists open
  const [expandedProjectIds, setExpandedProjectIds] = useState<Record<string, boolean>>({
    'proj-personal': true,
    'proj-01': true,
    'proj-02': false,
  });

  const toggleProjectExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedProjectIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Search filtering logic across projects AND their nested conversations
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projects;
    const lower = searchTerm.toLowerCase();
    return projects
      .map((p) => {
        const projMatches = p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower);
        const matchingConvs = p.conversations?.filter((c) =>
          c.title.toLowerCase().includes(lower)
        ) || [];

        if (projMatches || matchingConvs.length > 0) {
          return {
            ...p,
            conversations: projMatches ? p.conversations : matchingConvs,
          };
        }
        return null;
      })
      .filter(Boolean) as ProjectItem[];
  }, [searchTerm, projects]);

  const personalProjects = filteredProjects.filter((p) => p.isPersonal);
  const teamProjects = filteredProjects.filter((p) => !p.isPersonal);

  // If user searched, auto-expand matching projects
  const isProjectExpanded = (id: string) => {
    if (searchTerm.trim()) return true;
    return !!expandedProjectIds[id];
  };

  // Collapsed slim dock mode (inspired by reference screenshot #7)
  if (isCollapsed) {
    return (
      <aside className="w-16 bg-slate-50 border-r border-slate-200 flex flex-col h-screen shrink-0 select-none items-center py-4 text-slate-700 transition-all duration-200">
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs hover:bg-blue-700 transition-colors mb-6"
          title="展开侧边栏"
        >
          <Bot className="w-5 h-5 text-white" />
        </button>

        <div className="space-y-3 flex-1 flex flex-col items-center">
          <button
            onClick={() => {
              onNavigate('workspace');
              onOpenNewChat();
            }}
            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
            title="新建对话"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('workspace')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              currentPage === 'workspace'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:bg-slate-200/60'
            }`}
            title="智能工作台"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('project-settings')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              currentPage === 'project-settings'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:bg-slate-200/60'
            }`}
            title="项目协同空间"
          >
            <FolderKanban className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('skills')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              currentPage === 'skills'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:bg-slate-200/60'
            }`}
            title="技能中心"
          >
            <Puzzle className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenFeishuOrg}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200/60 transition-colors"
            title="飞书组织架构"
          >
            <Building2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              currentPage === 'admin'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:bg-slate-200/60'
            }`}
            title="管理后台"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 flex flex-col items-center pt-3 border-t border-slate-200 w-full">
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            title="展开侧边栏"
          >
            <PanelLeftOpen className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm hover:ring-2 hover:ring-blue-500"
            title="个人设置"
          >
            {currentUser.avatarChar}
          </button>
        </div>
      </aside>
    );
  }

  // Standard Spacious Sidebar
  return (
    <aside className="w-76 md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-screen shrink-0 select-none text-slate-700 overflow-hidden transition-all duration-200">
      {/* 1. Brand & Current Assistant Card */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base tracking-tight">Agent 协同平台</span>
                <span className="text-xs text-blue-700 font-bold px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">
                  企业版
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">飞书组织已同步</p>
            </div>
          </div>

          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="折叠为精简图标栏"
          >
            <PanelLeftClose className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Assistant Selector Dropdown */}
        <div className="relative">
          <div
            onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
            className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-white cursor-pointer transition-all flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">
                  {currentAgent.name}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {currentAgent.subtitle}
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          </div>

          {/* Assistant Popover Menu */}
          {isAgentMenuOpen && (
            <div className="absolute left-0 right-0 top-16 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 space-y-1 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                选择你的智能助理
              </div>
              {availableAgents.map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => {
                    onSelectAgent(ag);
                    setIsAgentMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-sm cursor-pointer flex items-center justify-between transition-colors ${
                    currentAgent.id === ag.id
                      ? 'bg-blue-50 text-blue-800 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="truncate font-bold text-slate-900">{ag.name}</p>
                    <span className="text-xs text-slate-500 block truncate">{ag.subtitle}</span>
                  </div>
                  {currentAgent.id === ag.id && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Real-time Search Box */}
      <div className="px-4 py-3 border-b border-slate-200/80 bg-slate-50/50">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索项目、对话分支或资料..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Navigation & Nested Project/Conversation Tree */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Primary Action Buttons */}
        <div className="space-y-1">
          <button
            onClick={() => {
              onNavigate('workspace');
              onOpenNewChat();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-xs transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Plus className="w-4.5 h-4.5" />
              <span>新建工作对话</span>
            </div>
            <span className="text-xs bg-blue-500/60 text-white px-2 py-0.5 rounded font-mono font-normal">
              Enter
            </span>
          </button>

          <button
            onClick={() => onNavigate('workspace')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              currentPage === 'workspace' && activeChatTitle === '第44周研发进展与要点提炼'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                : 'text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4.5 h-4.5 text-blue-600 shrink-0" />
              <span>当前工作台</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">活跃</span>
          </button>
        </div>

        {/* Global Features Links */}
        <div className="space-y-0.5 pt-1 border-t border-slate-200/60">
          <button
            onClick={() => onNavigate('project-settings')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
              currentPage === 'project-settings'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200 font-bold'
                : 'text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FolderKanban className="w-4.5 h-4.5 text-blue-600 shrink-0" />
              <span>项目协同大厅</span>
            </div>
            <span className="text-xs bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
              {projects.length} 个
            </span>
          </button>

          <button
            onClick={() => onNavigate('skills')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
              currentPage === 'skills'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200 font-bold'
                : 'text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <Puzzle className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
              <span className="truncate">技能与插件中心</span>
            </div>
            <span className="text-xs bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
              {enabledSkillsCount} 个启用
            </span>
          </button>

          <button
            onClick={onOpenFeishuOrg}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>飞书组织与权限</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">109 人</span>
          </button>
        </div>

        {/* 4. Projects with Nested Conversation Lists (User's Core Requirement) */}
        <div className="space-y-3 pt-2 border-t border-slate-200/80">
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>项目协同与对话分支</span>
            <button
              onClick={onOpenCreateProject}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 text-xs px-1.5 py-0.5 rounded hover:bg-blue-50"
              title="新建或邀请加入项目"
            >
              <Plus className="w-3.5 h-3.5" />
              新建项目
            </button>
          </div>

          {/* Section A: Personal Projects */}
          <div className="space-y-1">
            <div className="px-2 py-0.5 text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>个人私有项目</span>
            </div>

            {personalProjects.map((proj) => {
              const isSelected = selectedProjectId === proj.id;
              const isExpanded = isProjectExpanded(proj.id);
              return (
                <div key={proj.id} className="space-y-0.5">
                  <div
                    onClick={() => {
                      onNavigate('workspace');
                      onSelectProject(proj.id);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white text-blue-700 shadow-2xs border border-slate-200 font-bold'
                        : 'text-slate-700 hover:bg-slate-200/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-1">
                      <button
                        onClick={(e) => toggleProjectExpand(proj.id, e)}
                        className="p-1 hover:text-slate-900 text-slate-400 rounded hover:bg-slate-200/60"
                        title={isExpanded ? '收起对话分支' : '展开对话分支'}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="truncate text-sm font-semibold">{proj.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400 font-mono">私密</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreateProjectConversation(proj.id);
                        }}
                        className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="在此项目下新建对话"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Conversations under Personal project */}
                  {isExpanded && proj.conversations && proj.conversations.length > 0 && (
                    <div className="ml-5 pl-2.5 border-l-2 border-slate-200 space-y-0.5 pt-1 pb-1.5">
                      {proj.conversations.map((conv) => {
                        const isConvActive = activeChatTitle === conv.title;
                        return (
                          <button
                            key={conv.id}
                            onClick={() => {
                              onNavigate('workspace');
                              onSelectProjectConversation(proj.id, conv);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm truncate transition-colors flex items-center justify-between ${
                              isConvActive
                                ? 'bg-blue-50 text-blue-700 font-bold'
                                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate pr-1">
                              <MessageSquare className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="truncate text-xs md:text-sm">{conv.title}</span>
                            </div>
                            <span className="text-xs text-slate-400 font-mono shrink-0">
                              {conv.updatedAt}
                            </span>
                          </button>
                        );
                      })}
                      <button
                        onClick={() => onCreateProjectConversation(proj.id)}
                        className="w-full text-left px-2.5 py-1 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5 pt-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>在此空间新建对话...</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Section B: Team Shared Projects */}
          <div className="pt-2 space-y-1">
            <div
              onClick={() => setTeamProjectsExpanded(!teamProjectsExpanded)}
              className="px-2 py-0.5 text-xs font-bold text-slate-400 flex items-center justify-between cursor-pointer hover:text-slate-600"
            >
              <div className="flex items-center gap-1.5">
                <Users2 className="w-3.5 h-3.5 text-slate-400" />
                <span>团队共享项目 ({teamProjects.length})</span>
              </div>
              {teamProjectsExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </div>

            {teamProjectsExpanded &&
              teamProjects.map((proj) => {
                const isSelected = selectedProjectId === proj.id;
                const isExpanded = isProjectExpanded(proj.id);
                return (
                  <div key={proj.id} className="space-y-0.5">
                    <div
                      onClick={() => {
                        onNavigate('workspace');
                        onSelectProject(proj.id);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-white text-blue-700 shadow-2xs border border-slate-200 font-bold'
                          : 'text-slate-700 hover:bg-slate-200/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-1">
                        <button
                          onClick={(e) => toggleProjectExpand(proj.id, e)}
                          className="p-1 hover:text-slate-900 text-slate-400 rounded hover:bg-slate-200/60"
                          title={isExpanded ? '收起对话分支' : '展开对话分支'}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <FolderKanban className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="truncate text-sm font-semibold">{proj.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs text-slate-400 font-mono">
                          {proj.memberCount}人
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCreateProjectConversation(proj.id);
                          }}
                          className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="在此项目下新建对话"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Conversations list under team project */}
                    {isExpanded && proj.conversations && proj.conversations.length > 0 && (
                      <div className="ml-5 pl-2.5 border-l-2 border-slate-200 space-y-0.5 pt-1 pb-1.5">
                        {proj.conversations.map((conv) => {
                          const isConvActive = activeChatTitle === conv.title;
                          return (
                            <button
                              key={conv.id}
                              onClick={() => {
                                onNavigate('workspace');
                                onSelectProjectConversation(proj.id, conv);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm truncate transition-colors flex items-center justify-between ${
                                isConvActive
                                  ? 'bg-blue-50 text-blue-700 font-bold'
                                  : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-1">
                                <MessageSquare className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span className="truncate text-xs md:text-sm">{conv.title}</span>
                              </div>
                              <span className="text-xs text-slate-400 font-mono shrink-0">
                                {conv.updatedAt}
                              </span>
                            </button>
                          );
                        })}
                        <button
                          onClick={() => onCreateProjectConversation(proj.id)}
                          className="w-full text-left px-2.5 py-1 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5 pt-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>新建项目对话...</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* 5. Bottom Current User & Admin Link */}
      <div className="p-3.5 border-t border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-3 cursor-pointer group hover:opacity-85 min-w-0 pr-2"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
              {currentUser.avatarChar}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded">
                  {currentUser.role}
                </span>
              </div>
              <div className="text-xs text-slate-400 truncate font-mono">
                {currentUser.feishuTenant}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('admin')}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 'admin'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="平台管理控制台"
            >
              <ShieldCheck className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 'settings'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="个人设置"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

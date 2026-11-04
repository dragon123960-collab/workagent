import React from 'react';
import {
  Bell,
  FolderOpen,
  ChevronRight,
  Code2,
  Sparkles,
  Lock,
} from 'lucide-react';
import { PageMode } from '../../types';

interface HeaderProps {
  currentPage: PageMode;
  projectName?: string;
  onToggleDrawer: () => void;
  isDrawerOpen: boolean;
  onOpenApprovals: () => void;
  pendingApprovalsCount: number;
  onOpenVueGuide: () => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  projectName,
  onToggleDrawer,
  isDrawerOpen,
  onOpenApprovals,
  pendingApprovalsCount,
  onOpenVueGuide,
  selectedModel,
  onSelectModel,
}) => {
  const getBreadcrumbs = () => {
    switch (currentPage) {
      case 'workspace':
        return [
          '工作空间',
          projectName ? `${projectName} · 项目参考模式` : '个人空间 · 私密工作台',
        ];
      case 'project-settings':
        return ['项目管理', projectName ? `${projectName} · 权限与共享资料` : '全部项目'];
      case 'admin':
        return ['管理后台', '企业调度与安全审计'];
      case 'settings':
        return ['个人设置', '账号、飞书授权与Agent记忆'];
      default:
        return ['Lucas Agent', '企业协同平台'];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-5 flex items-center justify-between gap-6 shrink-0 z-10 select-none">
      {/* Zone 1: Breadcrumb Path */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap min-w-0">
        <span className="hover:text-slate-900 transition-colors cursor-pointer font-medium">
          {breadcrumbs[0]}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-semibold text-slate-900 truncate">{breadcrumbs[1]}</span>

        {currentPage === 'workspace' && (
          <span className="hidden sm:inline-flex items-center gap-1 ml-3 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <Lock className="w-3 h-3 text-slate-500" />
            企业数据沙箱隔离
          </span>
        )}
      </div>

      {/* Zone 2: Model & Status Bar */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg text-xs border border-slate-200 transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-500 text-[11px]">调度网关:</span>
          <select
            value={selectedModel}
            onChange={(e) => onSelectModel(e.target.value)}
            className="bg-transparent font-medium text-slate-700 text-xs focus:outline-none cursor-pointer"
          >
            <option value="Claude 3.5 Sonnet (高思考推理)">Claude 3.5 Sonnet (统一网关)</option>
            <option value="DeepSeek V3 (高速私有化集群)">DeepSeek V3 (高速推理集群)</option>
            <option value="Gemini 2.5 Flash (海量知识库)">Gemini 2.5 Flash (海量知识库)</option>
          </select>
        </div>
      </div>

      {/* Zone 3: Actions & Utilities */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Vue 3 Architecture & Design Spec Button */}
        <button
          onClick={onOpenVueGuide}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
          title="查看企业级 Vue 3 规范与组件源码架构"
        >
          <Code2 className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden md:inline">Vue 3 规范代码</span>
        </button>

        {/* Pending Approvals */}
        <button
          onClick={onOpenApprovals}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            pendingApprovalsCount > 0
              ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
          title="待确认任务审批"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="hidden md:inline">待确认</span>
          {pendingApprovalsCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-500 text-white rounded-full">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        {/* Resources Drawer Toggle */}
        <button
          onClick={onToggleDrawer}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isDrawerOpen
              ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
          }`}
          title="资料与文件"
        >
          <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">资料与文件</span>
        </button>
      </div>
    </header>
  );
};

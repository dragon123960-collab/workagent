import React, { useState } from 'react';
import {
  Puzzle,
  Check,
  Search,
  Sparkles,
  FileText,
  FileSpreadsheet,
  Clock,
  Mail,
  Code,
  Globe,
  Plus,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { SkillItem, AgentProfile } from '../../types';

interface SkillsMarketplaceProps {
  skills: SkillItem[];
  onToggleSkill: (skillId: string) => void;
  currentAgent: AgentProfile;
  onOpenNewChatWithSkill?: (skill: SkillItem) => void;
}

export const SkillsMarketplace: React.FC<SkillsMarketplaceProps> = ({
  skills,
  onToggleSkill,
  currentAgent,
  onOpenNewChatWithSkill,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['全部', '飞书协同', '研发与代码', '文档与报告', '自动化与集成'];

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-indigo-600" />;
      case 'Code':
        return <Code className="w-5 h-5 text-purple-600" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-cyan-600" />;
      default:
        return <Puzzle className="w-5 h-5 text-blue-600" />;
    }
  };

  const filteredSkills = skills.filter((s) => {
    const matchCat = selectedCategory === '全部' || s.category === selectedCategory;
    const matchQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10 select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-blue-700 uppercase mb-1">
              SKILLS & PLUGINS MARKETPLACE
            </div>
            <h1 className="text-2xl font-bold text-slate-900">技能与能力中心</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              为当前助理「{currentAgent.name}」配置扩展能力，挂载飞书 OpenAPI 与企业私有自动化工具。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">当前已挂载:</span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold font-mono">
              {skills.filter((s) => s.enabled).length} / {skills.length} 项技能
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索技能名称或描述..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                skill.enabled
                  ? 'bg-white border-blue-300 shadow-2xs ring-1 ring-blue-500/10'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                      {getSkillIcon(skill.iconName)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{skill.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                          {skill.category}
                        </span>
                        <span className="text-[10px] text-slate-400">·</span>
                        <span className="text-[10px] text-slate-400">{skill.author}</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={skill.enabled}
                      onChange={() => onToggleSkill(skill.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {skill.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">累计执行: {skill.callCount.toLocaleString()} 次</span>
                <span className="text-slate-500 font-medium">
                  {skill.enabled ? '✓ 已挂载至会话上下文' : '未启用'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Custom enterprise skill submission note */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-blue-900">
            <span className="font-bold">需要接入企业内部私有系统 API？</span>
            <span className="ml-1 text-blue-700">支持基于 OpenAPI 3.0 或飞书开放平台一键封装自定义技能。</span>
          </div>
          <button
            onClick={() => alert('请在管理后台-开发者中心上传自定义 OpenAPI JSON Schema')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
          >
            接入私有插件
          </button>
        </div>
      </div>
    </div>
  );
};

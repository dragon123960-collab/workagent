import React, { useState } from 'react';
import {
  User,
  Key,
  Brain,
  Shield,
  LogOut,
  CheckCircle2,
  Trash2,
  RotateCw,
  FolderOpen,
  UploadCloud,
  FileText,
  Sliders,
  Check,
  Building,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import { UserProfile, UploadedFile } from '../../types';

interface UserSettingsProps {
  user: UserProfile;
  onLogout: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  uploadedFiles?: UploadedFile[];
  onUploadNewFile?: (file: File) => void;
  onDeleteUploadedFile?: (id: string) => void;
}

export const UserSettings: React.FC<UserSettingsProps> = ({
  user,
  onLogout,
  onUpdateUser,
  uploadedFiles = [],
  onUploadNewFile,
  onDeleteUploadedFile,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'feishu' | 'memory' | 'files'>('profile');
  const [memories, setMemories] = useState<string[]>([
    '周报输出默认采用四段式：重点攻坚、关键交付、风险预警与下周规划。',
    '商务邮件回复保持谦逊严谨，结尾固定附带公司统一签名档。',
    '代码审查时重点关注高并发安全、接口幂等性与飞书鉴权协议合规。',
    '提炼长文档时优先保留数据指标、负责人及预计交付排期。',
  ]);
  const [newMemory, setNewMemory] = useState('');
  const [isSyncingFeishu, setIsSyncingFeishu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tonePreference, setTonePreference] = useState<'rigorous' | 'concise' | 'creative'>('rigorous');

  // Permission scopes state
  const [scopes, setScopes] = useState([
    {
      id: 'doc_read',
      title: '云空间文档只读权限',
      scope: 'docx:document:readonly',
      desc: '用于 Agent 语义检索周报、业务需求与系统架构方案。',
      enabled: true,
    },
    {
      id: 'bitable_read',
      title: '多维表格数据分析权限',
      scope: 'bitable:app:readonly',
      desc: '用于后台任务自动化比对排期与交付状态，生成多维报表。',
      enabled: true,
    },
    {
      id: 'contact_read',
      title: '企业通讯录基本信息只读',
      scope: 'contact:user.base:readonly',
      desc: '获取项目协同成员姓名、部门与岗位，支持协同任务派发。',
      enabled: true,
    },
    {
      id: 'im_send',
      title: '即时消息协同通知推送 (需逐项确认)',
      scope: 'im:message:send_as_bot',
      desc: '周报生成或重要审批时向您个人或指定飞书群发送卡片通知。',
      enabled: true,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddMemory = () => {
    if (!newMemory.trim()) return;
    setMemories([...memories, newMemory.trim()]);
    setNewMemory('');
    showToast('已成功添加个人专属记忆偏好');
  };

  const handleDeleteMemory = (index: number) => {
    setMemories(memories.filter((_, i) => i !== index));
    showToast('已移除该项记忆');
  };

  const handleTestFeishuAuth = () => {
    setIsSyncingFeishu(true);
    setTimeout(() => {
      setIsSyncingFeishu(false);
      showToast('飞书 OpenAPI 2.0 凭证校验成功！当前授权有效期至 2026-12-01，各范围权限均处于生效状态。');
    }, 700);
  };

  const handleToggleScope = (id: string) => {
    setScopes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    showToast('权限范围配置已更新');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="p-3.5 px-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-150">
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

        {/* Title Header */}
        <div>
          <div className="text-xs font-bold tracking-wider text-blue-700 uppercase mb-1">
            PERSONAL SETTINGS & PREFERENCES
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">个人设置中心</h1>
          <p className="text-sm text-slate-500 mt-1">
            管理你的企业身份、飞书 OpenAPI 数据连接通道、智能助理专属记忆与知识资产。
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3.5 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            个人中心
          </button>
          <button
            onClick={() => setActiveTab('feishu')}
            className={`pb-3.5 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'feishu'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            飞书授权与范围
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`pb-3.5 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'memory'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Brain className="w-4 h-4" />
            助理记忆与偏好
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`pb-3.5 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'files'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            知识文件管理
          </button>
        </div>

        {/* 1. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* User Identity Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-xs shrink-0">
                  {user.avatarChar}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
                    <span className="text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      {user.role}
                    </span>
                    <span className="text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      已认证飞书 SSO
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    所属部门：AI 架构与企业平台部 · 负责智能助理与网关治理
                  </p>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    企业租户: {user.feishuTenant} · 员工工号: EP-88204
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right sm:border-l sm:border-slate-100 sm:pl-6 shrink-0">
                <span className="text-xs text-slate-400">上次会话登录</span>
                <div className="text-sm font-mono font-medium text-slate-700 mt-0.5">
                  {user.lastLogin}
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-1">
                  安全连接加密 (TLS 1.3)
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-500">本月对话次数</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">128 次</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-500">已生效个人记忆</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">{memories.length} 条</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-500">关联协同项目</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">3 个</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-500">知识文档引用</div>
                <div className="text-2xl font-bold text-indigo-600 mt-1">42 篇</div>
              </div>
            </div>

            {/* Account & Data Isolation Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  账号安全与数据隔离准则
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                您的日常对话、上传文件和专属助理记忆均由本人私密保管。当加入协同项目时，项目成员仅可共享该项目显式绑定的飞书文档与知识切片，所有交互严格保留审计日志，杜绝越权外溢。
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  退出当前登录
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. FEISHU AUTH TAB */}
        {activeTab === 'feishu' && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">飞书 OpenAPI 授权与数据连接</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  通过企业应用对接飞书开放平台，基于最小权限原则按需开启数据通道。
                </p>
              </div>
              <button
                onClick={handleTestFeishuAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-sm font-medium transition-colors"
              >
                <RotateCw className={`w-4 h-4 ${isSyncingFeishu ? 'animate-spin' : ''}`} />
                重新校验与同步
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-sm">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-800">企业应用 Client ID:</span>
                <span className="font-mono text-slate-500 ml-2">cli_a1b2c3d4e5f6****</span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                自动续期机制生效中 (Refresh Token 滑动窗口)
              </div>
            </div>

            <div className="space-y-3">
              {scopes.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-slate-900">{item.title}</span>
                      <span className="text-xs font-mono text-slate-400">({item.scope})</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleToggleScope(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
                      item.enabled
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{item.enabled ? '已开启授权' : '已暂停'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. AGENT MEMORY TAB */}
        {activeTab === 'memory' && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Agent 专属记忆与交互偏好</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                智能助理会在所有对话与长周期任务中自动融入以下偏好，无需您在每次提问中重复指示。
              </p>
            </div>

            {/* Tone Selector */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">回答语气与专业风格偏好</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'rigorous', label: '严谨商务与工程规范', desc: '采用四段式结构，重视数据合规与风险预警' },
                  { id: 'concise', label: '极简行动派', desc: '省去客套，直接输出待办清单与核心结论' },
                  { id: 'creative', label: '方案探索与发散', desc: '提供多元架构替代方案与启发式建议' },
                ].map((tone) => (
                  <div
                    key={tone.id}
                    onClick={() => {
                      setTonePreference(tone.id as any);
                      showToast(`已切换语气为【${tone.label}】`);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      tonePreference === tone.id
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/10'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900">{tone.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{tone.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Managed Memories */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">已固化的常驻记忆清单</span>
                <span className="text-xs text-slate-400">共 {memories.length} 条</span>
              </div>

              <div className="space-y-2.5">
                {memories.map((mem, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-sm text-slate-700 leading-relaxed"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-blue-600 font-bold mt-0.5">✦</span>
                      <span>{mem}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteMemory(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors shrink-0"
                      title="删除此项记忆"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Memory Input */}
            <div className="pt-3 border-t border-slate-100 flex gap-2.5">
              <input
                type="text"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddMemory();
                }}
                placeholder="例如：在拟写技术架构文档时，优先使用 Mermaid 画出时序图和泳道图..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddMemory}
                disabled={!newMemory.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium transition-colors shrink-0"
              >
                添加记忆
              </button>
            </div>
          </div>
        )}

        {/* 4. KNOWLEDGE & FILES TAB */}
        {activeTab === 'files' && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">个人知识库与上传文件管理</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  上传本地离线文件或规范文档，Agent 会自动切片并建立语义向量索引。
                </p>
              </div>
            </div>

            {/* Upload Zone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-8 text-center transition-colors bg-slate-50/60">
              <UploadCloud className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800">
                拖拽文件到此处，或点击选择本地文件
              </p>
              <p className="text-xs text-slate-400 mt-1">
                支持 PDF、Word (.docx)、Excel (.xlsx)、Markdown (.md)、TXT (单个文件最大 50MB)
              </p>
              <label className="mt-4 inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer shadow-xs transition-colors">
                选择文件上传
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.md"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0] && onUploadNewFile) {
                      onUploadNewFile(e.target.files[0]);
                      showToast(`文件《${e.target.files[0].name}》正在解析并建立索引`);
                      e.target.value = '';
                    }
                  }}
                />
              </label>
            </div>

            {/* Uploaded Files Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  已解析的文件清单 ({uploadedFiles.length})
                </span>
              </div>

              {uploadedFiles.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  暂未上传任何本地文件
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/30">
                  {uploadedFiles.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 flex items-center justify-between hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                        <div>
                          <div className="text-sm font-bold text-slate-900">{f.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5 font-mono">
                            {f.size} · 上传于 {f.uploadedAt}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          已建立向量索引
                        </span>
                        {onDeleteUploadedFile && (
                          <button
                            onClick={() => {
                              onDeleteUploadedFile(f.id);
                              showToast(`已删除文件《${f.name}》`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                            title="删除文件"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

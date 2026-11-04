import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  Clock,
  Mail,
  Send,
  Plus,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Copy,
  Check,
  Bot,
  Loader2,
  Share2,
  Users,
  UserPlus,
  Lock,
  UploadCloud,
} from 'lucide-react';
import { ChatMessage, FeishuDocument, ProjectItem, AgentProfile, SkillItem } from '../../types';

interface AgentChatViewProps {
  currentProject: ProjectItem | null;
  messages: ChatMessage[];
  onSendMessage: (text: string, attachments?: FeishuDocument[]) => void;
  onOpenResourceDrawer: () => void;
  availableDocs: FeishuDocument[];
  isGenerating: boolean;
  selectedModel: string;
  currentAgent: AgentProfile;
  skills: SkillItem[];
  onOpenInviteMembers?: () => void;
  onUploadFile?: (file: File) => void;
}

export const AgentChatView: React.FC<AgentChatViewProps> = ({
  currentProject,
  messages,
  onSendMessage,
  onOpenResourceDrawer,
  availableDocs,
  isGenerating,
  selectedModel,
  currentAgent,
  skills,
  onOpenInviteMembers,
  onUploadFile,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<FeishuDocument[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSend = () => {
    if (!inputText.trim() && selectedDocs.length === 0) return;
    onSendMessage(inputText, selectedDocs);
    setInputText('');
    setSelectedDocs([]);
    setShowAttachMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleThought = (id: string) => {
    setExpandedThoughts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDirectFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUploadFile) {
      onUploadFile(e.target.files[0]);
      setShowAttachMenu(false);
      e.target.value = '';
    }
  };

  const starterCards = [
    {
      title: '整理飞书资料',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      desc: '检索与当前项目相关的飞书文档，提取业务核心要点与待办事项。',
      prompt:
        '请基于当前绑定的飞书文档《AI 开发部周报-2026年第44周》，提炼出各业务线的核心进展与关键阻碍。',
    },
    {
      title: '准备项目周报',
      icon: <Clock className="w-5 h-5 text-slate-700" />,
      desc: '按规范格式起草周报，清晰区分重点攻关成果与潜在风险预警。',
      prompt:
        '请根据本周项目资料，起草一份结构化的个人周报，包含：本周完成事项、重点攻关项目、下周规划与风险同步。',
    },
    {
      title: '拟写商务邮件',
      icon: <Mail className="w-5 h-5 text-indigo-600" />,
      desc: '规范商务语气，明确各方职责分工、交付时间节点与标准公司签名。',
      prompt:
        '帮我拟写一封发给跨部门平台架构师的协同邮件，沟通企业 Agent 网关安全合规联调上线时间表。',
    },
  ];

  const activeSkills = skills.filter((s) => s.enabled);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden relative">
      {/* 1. Context Kicker Bar (Larger, comfortable typography) */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-4 text-sm shrink-0 select-none">
        <div className="flex items-center gap-3.5 truncate">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Bot className="w-4.5 h-4.5 text-blue-600" />
            <span>{currentAgent.name}</span>
          </div>

          <span className="text-slate-300">|</span>

          {currentProject ? (
            <div className="flex items-center gap-2 text-slate-700 truncate">
              {currentProject.isPersonal ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  个人私有空间
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-xs text-slate-700 font-semibold">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>{currentProject.name}</span>
                  <span className="text-slate-400 font-normal">({currentProject.memberCount}人成员协同)</span>
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-500">独立助理工作台 · 飞书已接入</span>
          )}
        </div>

        {/* Active Skills Micro Pills */}
        <div className="hidden md:flex items-center gap-2.5">
          <span className="text-xs text-slate-400">已生效技能:</span>
          <div className="flex items-center gap-1.5">
            {activeSkills.slice(0, 3).map((s) => (
              <span
                key={s.id}
                className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[130px] font-medium"
              >
                {s.name.split('(')[0].trim()}
              </span>
            ))}
            {activeSkills.length > 3 && (
              <span className="text-xs text-slate-500 font-mono">
                +{activeSkills.length - 3}
              </span>
            )}
          </div>

          {currentProject && !currentProject.isPersonal && onOpenInviteMembers && (
            <button
              onClick={onOpenInviteMembers}
              className="ml-2 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              邀请成员
            </button>
          )}
        </div>
      </div>

      {/* 2. Messages Scroll Area (Increased text size to text-sm/text-[15px]) */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            /* Starter Hero State */
            <div className="py-12 md:py-16 text-center select-none">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs mb-5">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="text-xs font-bold tracking-wider text-blue-700 uppercase mb-2">
                AGENT WORKBENCH
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2.5">
                {currentProject ? `推进：${currentProject.name}` : `你好，董平。我是你的 ${currentAgent.name}`}
              </h1>

              <p className="text-sm md:text-base text-slate-500 max-w-lg mx-auto mb-10 leading-relaxed">
                {currentProject
                  ? currentProject.description
                  : '从一个问题、一份飞书资料，或今天的工作任务开始。'}
              </p>

              {/* Starter Quick Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
                {starterCards.map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSendMessage(card.prompt)}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 rounded-xl bg-slate-50 border border-slate-100">{card.icon}</span>
                          <span className="text-sm font-bold text-slate-900">
                            {card.title}
                          </span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                    <div className="mt-4 text-xs text-blue-600 font-semibold group-hover:text-blue-700">
                      点击立即执行 →
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-xs text-slate-400">
                已深度集成飞书 OpenAPI · 遵循企业数据沙箱隔离 · 历史正文可随时导出
              </div>
            </div>
          ) : (
            /* Active Message List */
            <div className="space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'agent' && (
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-5 py-4 text-sm md:text-[15px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-2xs font-normal'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {/* Attachments if any */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {msg.attachments.map((att, i) => (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              msg.sender === 'user'
                                ? 'bg-blue-700 text-white border border-blue-500'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            {att.title}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Agent Thinking Process Block */}
                    {msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
                      <div className="mb-3.5 rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm">
                        <button
                          onClick={() => toggleThought(msg.id)}
                          className="w-full flex items-center justify-between text-slate-700 hover:text-slate-900 font-bold text-xs"
                        >
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span>推理与规划步骤 ({msg.thinkingSteps.length} 步)</span>
                          </div>
                          {expandedThoughts[msg.id] ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        {expandedThoughts[msg.id] && (
                          <div className="mt-2.5 space-y-1.5 pt-2.5 border-t border-slate-200 font-mono text-xs text-slate-600">
                            {msg.thinkingSteps.map((step, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">›</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tool Invocations Result */}
                    {msg.toolInvocations && msg.toolInvocations.length > 0 && (
                      <div className="mb-3.5 space-y-2">
                        {msg.toolInvocations.map((tool, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                          >
                            <div className="flex items-center justify-between text-slate-800 font-semibold mb-1.5">
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                技能调度: {tool.toolName}
                              </span>
                              <span className="text-[11px] text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded font-mono">
                                已完成
                              </span>
                            </div>
                            <div className="text-slate-600 font-mono text-xs bg-white p-2 rounded-lg border border-slate-200">
                              {tool.outputPreview}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Main Message Content */}
                    <div className="whitespace-pre-wrap leading-relaxed select-text">
                      {msg.content}
                    </div>

                    {/* Footer Actions for Agent responses */}
                    {msg.sender === 'agent' && (
                      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="flex items-center gap-1.5 hover:text-slate-700 transition-colors font-medium"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-blue-600 font-semibold">已复制</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>复制全文</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => alert('已生成飞书云文档导出链接并同步至剪贴板')}
                            className="flex items-center gap-1.5 hover:text-slate-700 transition-colors font-medium"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>导出到飞书</span>
                          </button>
                        </div>
                        <span className="text-xs font-mono">{msg.timestamp}</span>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 mt-0.5 text-sm font-bold shadow-2xs">
                      董
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming loading indicator */}
              {isGenerating && (
                <div className="flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 text-sm text-slate-600 shadow-2xs flex items-center gap-2">
                    <span className="font-semibold text-slate-800">
                      {currentAgent.name} 正在调度 Agent 技能推理处理中...
                    </span>
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Sticky Input Container */}
      <div className="border-t border-slate-200 bg-white p-4 shrink-0 shadow-2xs">
        <div className="max-w-4xl mx-auto">
          {/* Selected attachment tags */}
          {selectedDocs.length > 0 && (
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <span className="text-xs text-slate-500 font-semibold">已引用飞书/本地文档:</span>
              {selectedDocs.map((doc) => (
                <span
                  key={doc.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate max-w-[220px]">{doc.title}</span>
                  <button
                    onClick={() =>
                      setSelectedDocs(selectedDocs.filter((d) => d.id !== doc.id))
                    }
                    className="text-blue-600 hover:text-blue-900 ml-1 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Text Input Frame */}
          <div className="relative rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15 bg-white transition-all">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`对 ${currentAgent.name} 发送指令，或添加资料...`}
              rows={2}
              className="w-full resize-none p-3.5 pb-12 text-sm md:text-base text-slate-800 placeholder-slate-400 focus:outline-none"
            />

            {/* Hidden file input for direct upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleDirectFileChange}
              className="hidden"
              accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.md"
            />

            {/* Bottom Toolbar inside the input box */}
            <div className="absolute left-3 right-3 bottom-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 relative">
                {/* Add Data / Attach Document Button */}
                <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>添加资料</span>
                </button>

                {/* Direct Upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                  title="上传本地 PDF / Word / Excel 文档"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                  <span>上传文件</span>
                </button>

                {/* Model tag */}
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs text-slate-500 bg-slate-50 border border-slate-200 font-mono">
                  {selectedModel.split(' ')[0]}
                </span>

                {/* Attach Popover */}
                {showAttachMenu && (
                  <div className="absolute left-0 bottom-11 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-20 space-y-1.5 animate-in fade-in duration-100">
                    <div className="px-2 py-1 text-xs font-bold text-slate-500 flex items-center justify-between">
                      <span>选择飞书云文档</span>
                      <button
                        onClick={onOpenResourceDrawer}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        上传与全部资料 →
                      </button>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {availableDocs.map((doc) => {
                        const isAdded = selectedDocs.some((d) => d.id === doc.id);
                        return (
                          <div
                            key={doc.id}
                            onClick={() => {
                              if (isAdded) {
                                setSelectedDocs(selectedDocs.filter((d) => d.id !== doc.id));
                              } else {
                                setSelectedDocs([...selectedDocs, doc]);
                              }
                            }}
                            className={`p-2 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-colors ${
                              isAdded
                                ? 'bg-blue-50 text-blue-800 font-semibold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <p className="truncate font-semibold">{doc.title}</p>
                              <span className="text-[11px] text-slate-400">{doc.creator}</span>
                            </div>
                            {isAdded && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>上传本地文件 (PDF / Docx / Xlsx)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputText.trim() && selectedDocs.length === 0}
                className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-all shadow-2xs cursor-pointer disabled:cursor-not-allowed"
                title="发送 (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Privacy & Keybinding Footnote */}
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              按飞书各成员原权限读取 · 对话仅本人可见，不自动公开至公共库
            </span>
            <span className="hidden sm:inline font-mono text-xs">
              Enter 发送 · Shift + Enter 换行
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  FileText,
  Plus,
  ExternalLink,
  Search,
  Check,
  FolderOpen,
  FileSpreadsheet,
  BookOpen,
  SlidersHorizontal,
  UploadCloud,
  FileUp,
  Trash2,
  CheckCircle2,
  Link2,
} from 'lucide-react';
import { FeishuDocument, UploadedFile } from '../../types';

interface ResourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documents: FeishuDocument[];
  onAddToChat: (doc: FeishuDocument) => void;
  onOpenProjectSettings: () => void;
  projectName?: string;
  uploadedFiles: UploadedFile[];
  onUploadNewFile: (file: File) => void;
  onDeleteUploadedFile: (id: string) => void;
  onAddFeishuToken: (title: string, token: string) => void;
}

export const ResourceDrawer: React.FC<ResourceDrawerProps> = ({
  isOpen,
  onClose,
  documents,
  onAddToChat,
  onOpenProjectSettings,
  projectName = '测试项目1',
  uploadedFiles,
  onUploadNewFile,
  onDeleteUploadedFile,
  onAddFeishuToken,
}) => {
  const [activeTab, setActiveTab] = useState<'feishu' | 'upload' | 'local_files'>('feishu');
  const [searchTerm, setSearchTerm] = useState('');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload Form states
  const [isDragging, setIsDragging] = useState(false);
  const [feishuDocUrl, setFeishuDocUrl] = useState('');
  const [feishuDocTitle, setFeishuDocTitle] = useState('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAdd = (doc: FeishuDocument) => {
    onAddToChat(doc);
    setAddedIds((prev) => ({ ...prev, [doc.id]: true }));
    showToast(`已将《${doc.title}》引用至当前对话`);
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [doc.id]: false }));
    }, 2000);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadNewFile(e.dataTransfer.files[0]);
      showToast(`文件《${e.dataTransfer.files[0].name}》正在向量化解析`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadNewFile(e.target.files[0]);
      showToast(`文件《${e.target.files[0].name}》正在向量化解析`);
      e.target.value = '';
    }
  };

  const handleBindFeishuDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feishuDocTitle.trim() || !feishuDocUrl.trim()) return;
    onAddFeishuToken(feishuDocTitle.trim(), feishuDocUrl.trim());
    setFeishuDocTitle('');
    setFeishuDocUrl('');
    showToast('已成功绑定飞书云文档并完成权限验证');
  };

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'sheet':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case 'wiki':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <aside className="w-96 md:w-105 border-l border-slate-200 bg-white flex flex-col h-full shadow-xl z-20 shrink-0 animate-in slide-in-from-right duration-200 select-none">
      {/* 1. Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <FolderOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">资料与知识中心</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="关闭"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Toast Notice inside Drawer */}
      {toastMessage && (
        <div className="px-4 py-2.5 bg-blue-50 border-b border-blue-200 text-blue-900 text-xs font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-blue-500 hover:text-blue-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center p-1 bg-slate-200/60 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('feishu')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'feishu'
                ? 'bg-white text-slate-900 shadow-2xs font-bold text-blue-700'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            飞书云文档 ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-2xs font-bold text-blue-700'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            上传文件
          </button>
          <button
            onClick={() => setActiveTab('local_files')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'local_files'
                ? 'bg-white text-slate-900 shadow-2xs font-bold text-blue-700'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            已解析库 ({uploadedFiles.length})
          </button>
        </div>
      </div>

      {/* TAB 1: FEISHU DOCUMENTS */}
      {activeTab === 'feishu' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Permission Scope Callout */}
          <div className="p-4 bg-blue-50/50 border-b border-blue-100 text-xs text-blue-900 leading-relaxed">
            <p>
              <span className="font-bold text-slate-900">{projectName}</span> ·
              项目成员按各自飞书账号权限读取。项目绑定不会越权扩大文档原有查看权限。
            </p>
            <button
              onClick={onOpenProjectSettings}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 text-xs font-bold transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              打开项目协同设置
            </button>
          </div>

          {/* Search Input */}
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索飞书文档标题或 Token..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Document List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-sm">
            {filteredDocs.map((doc) => {
              const isJustAdded = addedIds[doc.id];
              return (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:shadow-2xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-2.5 mb-1.5">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 mt-0.5 shrink-0">
                        {getDocIcon(doc.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                          {doc.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                          飞书 Token: {doc.token}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                      <span>创建人: {doc.creator}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">{doc.permission}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleAdd(doc)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isJustAdded
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          已添加到当前对话
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-blue-600" />
                          引用到对话上下文
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => showToast(`已在后台同步《${doc.title}》飞书最新版本`)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="校验最新版本"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: UPLOAD FILES & BIND FEISHU LINK */}
      {activeTab === 'upload' && (
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
          {/* Drag & Drop Upload Zone */}
          <div>
            <h3 className="font-bold text-slate-900 mb-1 text-sm">本地文件上传并切片索引</h3>
            <p className="text-xs text-slate-500 mb-3">
              支持自动提取文本、分段切片与向量索引，供助理随时精准引用。
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-white'
              }`}
            >
              <input
                type="file"
                id="file-upload-input"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.md"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer block space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-blue-600 hover:underline">
                    点击选择文件
                  </span>
                  <span className="text-slate-500"> 或拖拽文件到此处</span>
                </div>
                <p className="text-xs text-slate-400">
                  支持 PDF, DOCX, XLSX, Markdown, TXT（单文件最大 50MB）
                </p>
              </label>
            </div>
          </div>

          {/* Quick Bind Feishu Document Link */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 mb-1 text-sm">粘贴飞书文档链接接入</h3>
            <p className="text-xs text-slate-500 mb-3">
              输入飞书文档完整 URL 或 Document Token，系统将自动通过企业 OpenAPI 进行鉴权接入。
            </p>

            <form onSubmit={handleBindFeishuDoc} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">文档名称</label>
                <input
                  type="text"
                  value={feishuDocTitle}
                  onChange={(e) => setFeishuDocTitle(e.target.value)}
                  placeholder="例如：2026 技术规范白皮书"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  飞书链接或 Token
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={feishuDocUrl}
                    onChange={(e) => setFeishuDocUrl(e.target.value)}
                    placeholder="https://company.feishu.cn/docx/..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!feishuDocTitle.trim() || !feishuDocUrl.trim()}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm transition-colors shadow-2xs"
              >
                立即绑定并同步向量
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: ALREADY UPLOADED FILES LIST */}
      {activeTab === 'local_files' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-800 text-xs">
              已建立向量索引的文件库 (共 {uploadedFiles.length} 份)
            </span>
            <button
              onClick={() => setActiveTab('upload')}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              + 上传新文件
            </button>
          </div>

          {uploadedFiles.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <FileUp className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm">暂无本地上传的文件</p>
              <button
                onClick={() => setActiveTab('upload')}
                className="text-xs text-blue-600 font-bold"
              >
                去上传一份 →
              </button>
            </div>
          ) : (
            uploadedFiles.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{f.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">
                        {f.size} · 上传于 {f.uploadedAt}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onDeleteUploadedFile(f.id);
                      showToast(`已删除《${f.name}》`);
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    title="删除文件"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar or status */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>已完成切片与向量索引</span>
                  </div>

                  <button
                    onClick={() => {
                      onAddToChat({
                        id: f.id,
                        token: f.id,
                        title: f.name,
                        type: 'doc',
                        updateTime: f.uploadedAt,
                        creator: '董平',
                        permission: '可阅读',
                        synced: true,
                      });
                    }}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    引用至对话
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bottom Footer Note */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
        所有上传文件均存储在企业专用只读数据沙箱中，严格防范越权泄漏。
      </div>
    </aside>
  );
};

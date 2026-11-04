import React, { useState } from 'react';
import { X, Copy, Check, Code, Layers, Palette, Terminal } from 'lucide-react';

interface VueExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VueExportModal: React.FC<VueExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'workspace_vue' | 'admin_vue' | 'architecture'>('tokens');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const colorTokensCode = `/* ========================================================
   Lucas Enterprise SaaS Design Tokens (Tailwind / Vue 3)
   现代企业级协同系统统一色彩体系（告别黑绿，采用飞书蓝与企业灰）
   ======================================================== */

:root {
  /* 品牌与主控色 (Feishu / Lark Corporate Blue) */
  --color-brand-primary: #2563eb;    /* blue-600 核心主按钮与高亮 */
  --color-brand-hover:   #1d4ed8;    /* blue-700 交互悬停态 */
  --color-brand-active:  #1e40af;    /* blue-800 按下状态 */
  --color-brand-surface: #eff6ff;    /* blue-50  轻量背景与卡片激活态 */
  --color-brand-border:  #bfdbfe;    /* blue-200 细线边框 */

  /* 中性背景层级 (优雅、明亮、克制) */
  --color-canvas-bg:     #f8fafc;    /* slate-50 主画布底色 */
  --color-surface-card:  #ffffff;    /* 纯白卡片容器，单层海拔 */
  --color-sidebar-bg:    #f8fafc;    /* slate-50/90 现代亮色微质感侧边栏 */
  --color-border-subtle: #e2e8f0;    /* 1px 发丝细线边框 (Hairline) */

  /* 文字阶梯 (严禁纯黑，采用深灰蓝) */
  --color-text-primary:   #0f172a;   /* slate-900 标题与正文强调 */
  --color-text-secondary: #475569;   /* slate-600 说明文字 */
  --color-text-muted:     #94a3b8;   /* slate-400 辅助元数据与占位符 */

  /* 企业状态语义色 */
  --color-status-success: #16a34a;   /* 正常/已同步/已连接 */
  --color-status-warning: #d97706;   /* 待人工审批/排队中 */
  --color-status-danger:  #dc2626;   /* 拦截/阻断/异常 */

  /* 字体规范 */
  --font-family-display: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-family-mono:    'JetBrains Mono', monospace;
}`;

  const vueWorkspaceCode = `<template>
  <div class="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
    <!-- 主消息流区域 -->
    <main class="flex-1 overflow-y-auto px-4 md:px-8 py-6">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- 启动欢迎区与快捷 Prompt 卡片 -->
        <div v-if="messages.length === 0" class="py-12 text-center">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-5">
            <Sparkles class="w-6 h-6" />
          </div>
          <h1 class="text-2xl font-bold text-slate-900">一起推进，{{ currentProject?.name || '个人工作台' }}</h1>
          <p class="text-xs text-slate-500 max-w-lg mx-auto mt-2">
            从飞书资料出发，整理信息、准备周报草稿、推进手头工作。
          </p>
        </div>

        <!-- 消息卡片 -->
        <div v-for="msg in messages" :key="msg.id" class="flex gap-3.5" :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'">
          <div class="rounded-2xl px-4 py-3.5 text-xs md:text-sm" :class="msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200'">
            <!-- Agent 思考折叠过程 -->
            <div v-if="msg.thinkingSteps?.length" class="mb-2 p-2 rounded bg-slate-50 text-[11px] font-mono text-slate-600">
              <span class="font-bold text-blue-600">›</span> {{ msg.thinkingSteps[0] }}
            </div>
            <div>{{ msg.content }}</div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部输入框容器 -->
    <footer class="border-t border-slate-200 bg-white p-4">
      <div class="max-w-4xl mx-auto">
        <textarea
          v-model="inputQuery"
          @keydown.enter.prevent="sendMessage"
          placeholder="描述你的任务，或添加资料..."
          class="w-full resize-none p-3 border border-slate-300 rounded-xl text-xs focus:border-blue-500 focus:outline-none"
        />
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Sparkles } from 'lucide-react-vue-next';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  thinkingSteps?: string[];
}

const inputQuery = ref('');
const messages = ref<Message[]>([]);

const sendMessage = () => {
  if (!inputQuery.value.trim()) return;
  messages.value.push({
    id: Date.now().toString(),
    sender: 'user',
    content: inputQuery.value
  });
  inputQuery.value = '';
};
</script>`;

  const vueAdminCode = `<template>
  <div class="flex-1 flex overflow-hidden bg-slate-50">
    <!-- 管理后台二级侧边栏 -->
    <aside class="w-60 border-r border-slate-200 bg-white p-4">
      <h2 class="text-xs font-bold text-slate-900 uppercase">管理后台</h2>
      <nav class="mt-4 space-y-1">
        <button
          v-for="tab in adminTabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="w-full text-left px-3 py-2 rounded-lg text-xs"
          :class="activeTab === tab.key ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200' : 'text-slate-600 hover:bg-slate-100'"
        >
          {{ tab.label }}
        </button>
      </nav>
    </aside>

    <!-- 主展示区 -->
    <main class="flex-1 p-8 overflow-y-auto">
      <div class="max-w-5xl mx-auto space-y-6">
        <!-- 4 核心指标卡片 (Tabular Nums) -->
        <div class="grid grid-cols-4 gap-4">
          <div class="p-5 rounded-xl bg-white border border-slate-200">
            <span class="text-xs text-slate-500">员工总数</span>
            <div class="text-2xl font-bold font-mono mt-1 text-slate-900">109</div>
          </div>
          <div class="p-5 rounded-xl bg-white border border-slate-200">
            <span class="text-xs text-slate-500">协同项目</span>
            <div class="text-2xl font-bold font-mono mt-1 text-slate-900">12</div>
          </div>
          <div class="p-5 rounded-xl bg-white border border-slate-200">
            <span class="text-xs text-slate-500">Agent 调用量</span>
            <div class="text-2xl font-bold font-mono mt-1 text-slate-900">1,842</div>
          </div>
          <div class="p-5 rounded-xl bg-white border border-slate-200">
            <span class="text-xs text-slate-500">网关状态</span>
            <div class="text-2xl font-bold text-blue-600 mt-1">已就绪</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('overview');
const adminTabs = [
  { key: 'overview', label: '平台概览' },
  { key: 'employees', label: '员工管理' },
  { key: 'models', label: '模型状态' },
  { key: 'tasks', label: '任务状态' },
  { key: 'audit', label: '审计记录' },
];
</script>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">企业级 Vue 3 规范与工程化架构</h3>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                  Vue 3 + SFC + Composition API
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                针对公司系统的设计规范、统一色标与可直接落地的 Vue 3 模版
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('tokens')}
            className={`pb-3 px-3 text-xs font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'tokens'
                ? 'border-blue-600 text-blue-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            统一设计 Tokens
          </button>
          <button
            onClick={() => setActiveTab('workspace_vue')}
            className={`pb-3 px-3 text-xs font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'workspace_vue'
                ? 'border-blue-600 text-blue-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            操作台 (Workspace.vue)
          </button>
          <button
            onClick={() => setActiveTab('admin_vue')}
            className={`pb-3 px-3 text-xs font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'admin_vue'
                ? 'border-blue-600 text-blue-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            管理后台 (AdminConsole.vue)
          </button>
        </div>

        {/* Code Content Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900 text-slate-200 font-mono text-xs relative">
          <button
            onClick={() => {
              const code =
                activeTab === 'tokens'
                  ? colorTokensCode
                  : activeTab === 'workspace_vue'
                  ? vueWorkspaceCode
                  : vueAdminCode;
              handleCopy(activeTab, code);
            }}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs border border-slate-700 transition-colors shadow-2xs"
          >
            {copiedKey === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-400">已复制到剪贴板</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>一键复制代码</span>
              </>
            )}
          </button>

          <pre className="overflow-x-auto leading-relaxed">
            {activeTab === 'tokens' && colorTokensCode}
            {activeTab === 'workspace_vue' && vueWorkspaceCode}
            {activeTab === 'admin_vue' && vueAdminCode}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>与当前在线交互原型保持 100% 视觉结构和交互一致性</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

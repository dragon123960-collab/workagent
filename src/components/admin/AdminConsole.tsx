import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Activity,
  Layers,
  History,
  RotateCw,
  Search,
  Clock,
  Lock,
} from 'lucide-react';
import { AgentTask, AuditRecord, ModelGatewayStatus } from '../../types';

interface AdminConsoleProps {
  tasks: AgentTask[];
  auditLogs: AuditRecord[];
  models: ModelGatewayStatus[];
  onRefresh: () => void;
  onApproveTask: (id: string) => void;
  onCancelTask: (id: string) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  tasks,
  auditLogs,
  models,
  onRefresh,
  onApproveTask,
  onCancelTask,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'models' | 'tasks' | 'audit'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const employeeList = [
    { id: 'usr-01', name: '董平', email: 'dongping@company.internal', dept: 'AI 架构与企业平台部', role: '平台管理员', feishuStatus: '已同步', lastActive: '刚刚' },
    { id: 'usr-02', name: '刘双双', email: 'liushuangshuang@company.internal', dept: '技术研发组', role: '项目负责人', feishuStatus: '已同步', lastActive: '12分钟前' },
    { id: 'usr-03', name: '王晨阳', email: 'wangchenyang@company.internal', dept: '算法研发组', role: '普通成员', feishuStatus: '已同步', lastActive: '1小时前' },
    { id: 'usr-04', name: '张雅婷', email: 'zhangyating@company.internal', dept: '产品体验中心', role: '项目负责人', feishuStatus: '已同步', lastActive: '3小时前' },
    { id: 'usr-05', name: '周海明', email: 'zhouhaiming@company.internal', dept: '运营平台组', role: '普通成员', feishuStatus: '已同步', lastActive: '昨天' },
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50 select-none">
      {/* Sub-Sidebar for Admin Console */}
      <aside className="w-60 border-r border-slate-200 bg-white p-4 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-4 px-1">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            管理后台
          </h2>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>平台概览</span>
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'employees'
                ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>员工与权限</span>
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'models'
                ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>模型网关状态</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'tasks'
                ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>任务与队列</span>
            </div>
            {tasks.filter((t) => t.status === 'pending_approval').length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                {tasks.filter((t) => t.status === 'pending_approval').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'audit'
                ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>安全审计记录</span>
          </button>
        </nav>

        <div className="mt-auto p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            企业数据隐私底线
          </div>
          <p className="leading-relaxed">
            管理后台严格脱敏，不存储亦无权调阅员工日常对话与非公开草稿正文。
          </p>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Title with Refresh */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-blue-700 uppercase mb-1">
                ADMINISTRATION CONSOLE
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                {activeTab === 'overview' && '平台概览'}
                {activeTab === 'employees' && '员工管理与权限配置'}
                {activeTab === 'models' && '企业统一模型调度网关'}
                {activeTab === 'tasks' && '长周期 Agent 任务与队列监控'}
                {activeTab === 'audit' && '合规审计日志与调用追踪'}
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                管理人员、企业级 Agent 运行状态与审计元数据。
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>刷新</span>
              </button>
            </div>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 Metric KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-medium text-slate-500">授权员工</div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 mt-2 tabular-nums">
                    109
                  </div>
                  <div className="text-[11px] text-blue-600 font-medium mt-1">
                    飞书组织架构同步正常
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-medium text-slate-500">协同项目</div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 mt-2 tabular-nums">
                    12
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">包含 2 个重点示范项目</div>
                </div>

                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-medium text-slate-500">今日 Agent 调用</div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 mt-2 tabular-nums">
                    1,842
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium mt-1">
                    成功率 99.8% (平均延迟 280ms)
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-medium text-slate-500">模型网关状态</div>
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mt-2">
                    已就绪
                  </div>
                  <div className="text-[11px] text-blue-600 font-medium mt-1">
                    3 条企业调度线路正常
                  </div>
                </div>
              </div>

              {/* Management Scope Notice Box */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  管理范围与安全准则
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  通过二级菜单管理员工、查看模型和任务状态、核对审计记录。后台仅展示运营元数据与聚合用量指标，不提供员工聊天、邮件、文档或任务结果正文的查看入口，切实保护组织内部各成员的思考过程与私密草稿。
                </p>
              </div>

              {/* Live Status Mini Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">活跃任务队列 ({tasks.length})</h3>
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      查看全部 →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {tasks.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="truncate pr-2">
                          <p className="font-semibold text-slate-800 truncate">{t.title}</p>
                          <span className="text-[10px] text-slate-400">{t.project} · {t.startedAt}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            t.status === 'pending_approval'
                              ? 'bg-amber-100 text-amber-800'
                              : t.status === 'running'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {t.status === 'pending_approval' ? '待审批' : t.status === 'running' ? '运行中' : '已完成'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">审计追踪动态</h3>
                    <button
                      onClick={() => setActiveTab('audit')}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      审计详情 →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {auditLogs.slice(0, 3).map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="truncate pr-2">
                          <p className="font-semibold text-slate-800 truncate">{log.action}</p>
                          <span className="text-[10px] text-slate-400">操作人: {log.operator} · {log.timestamp.slice(11)}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EMPLOYEES TAB */}
          {activeTab === 'employees' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="按姓名、部门或邮箱过滤..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => alert('已触发飞书通讯录全量增量同步，将在 30 秒内对齐组织架构')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  从飞书通讯录同步
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-3 px-4">员工姓名</th>
                      <th className="py-3 px-4">所属部门</th>
                      <th className="py-3 px-4">系统角色</th>
                      <th className="py-3 px-4">飞书关联</th>
                      <th className="py-3 px-4">最近活跃</th>
                      <th className="py-3 px-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employeeList.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {emp.name}
                          <div className="text-[10px] text-slate-400 font-normal">{emp.email}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{emp.dept}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                              emp.role === '平台管理员'
                                ? 'bg-slate-100 text-slate-800 border-slate-300 font-bold'
                                : emp.role === '项目负责人'
                                ? 'bg-blue-50 text-blue-800 border-blue-200 font-medium'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {emp.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          ✓ {emp.feishuStatus}
                        </td>
                        <td className="py-3 px-4 text-slate-400">{emp.lastActive}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => alert(`修改 ${emp.name} 权限`)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                          >
                            调整权限
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODELS TAB */}
          {activeTab === 'models' && (
            <div className="space-y-4">
              {models.map((mod) => (
                <div
                  key={mod.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{mod.name}</h3>
                      <span className="text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                        运行正常
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">接入网关: {mod.provider}</p>
                  </div>

                  <div className="flex items-center gap-6 text-xs tabular-nums">
                    <div>
                      <div className="text-slate-400 text-[10px]">平均延迟</div>
                      <div className="font-semibold text-slate-800">{mod.latencyMs} ms</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">可用性</div>
                      <div className="font-semibold text-slate-800">{mod.successRate}%</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">今日消耗 Tokens</div>
                      <div className="font-semibold text-slate-800 font-mono">
                        {mod.todayTokens.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          task.status === 'pending_approval'
                            ? 'bg-amber-100 text-amber-800'
                            : task.status === 'running'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {task.status === 'pending_approval' ? '待审批' : task.status === 'running' ? '执行中' : '已完成'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-xl">{task.detail}</p>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      发起人: {task.creator} · 项目: {task.project} · 耗时: {task.duration || '进行中'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.status === 'pending_approval' ? (
                      <>
                        <button
                          onClick={() => onCancelTask(task.id)}
                          className="px-3 py-1 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                        >
                          驳回
                        </button>
                        <button
                          onClick={() => onApproveTask(task.id)}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
                        >
                          批准
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">状态已固化</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AUDIT TAB */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-3 px-4">操作人</th>
                      <th className="py-3 px-4">操作动作</th>
                      <th className="py-3 px-4">目标资源 / 飞书Token</th>
                      <th className="py-3 px-4">时间戳</th>
                      <th className="py-3 px-4">访问来源 IP</th>
                      <th className="py-3 px-4 text-right">合规结果</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                          {log.operator}
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-700">{log.action}</td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">{log.targetId}</td>
                        <td className="py-3 px-4 text-slate-400 text-[11px]">{log.timestamp}</td>
                        <td className="py-3 px-4 text-slate-400 text-[11px]">{log.ip}</td>
                        <td className="py-3 px-4 text-right font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.status === '成功'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

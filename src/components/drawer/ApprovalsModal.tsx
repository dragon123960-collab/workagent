import React from 'react';
import { X, CheckCircle, AlertTriangle, Clock, Check, Ban } from 'lucide-react';
import { AgentTask } from '../../types';

interface ApprovalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: AgentTask[];
  onApproveTask: (taskId: string) => void;
  onRejectTask: (taskId: string) => void;
}

export const ApprovalsModal: React.FC<ApprovalsModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onApproveTask,
  onRejectTask,
}) => {
  if (!isOpen) return null;

  const pendingTasks = tasks.filter((t) => t.status === 'pending_approval');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Agent 人机协同与任务审批</h3>
              <p className="text-xs text-slate-500">
                涉及敏感数据读取、飞书群发或外部 API 调用需人工介入授权
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

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle className="w-10 h-10 mx-auto text-blue-600 mb-2" />
              <p className="text-sm font-medium text-slate-700">暂无待确认的 Agent 审批事项</p>
              <p className="text-xs text-slate-400 mt-1">后台长周期任务均按既定安全策略平稳运行中</p>
            </div>
          ) : (
            pendingTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 hover:border-amber-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      待人工审批 · {task.type}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 mt-1.5">{task.title}</h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    发起于 {task.startedAt}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                  {task.detail}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-500">
                    <span>关联项目: </span>
                    <span className="font-medium text-slate-700">{task.project}</span>
                    <span className="mx-1.5">·</span>
                    <span>操作人: </span>
                    <span className="font-medium text-slate-700">{task.creator}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRejectTask(task.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
                    >
                      <Ban className="w-3.5 h-3.5 text-slate-500" />
                      驳回终止
                    </button>
                    <button
                      onClick={() => onApproveTask(task.id)}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white transition-colors shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      批准执行
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>企业审计日志将记录每项审批决策 (IP与时间戳)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};

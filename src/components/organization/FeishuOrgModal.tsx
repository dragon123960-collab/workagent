import React, { useState } from 'react';
import { X, Building2, Users, ShieldCheck, CheckCircle2, RotateCw, Search, Lock } from 'lucide-react';
import { DepartmentNode } from '../../types';

interface FeishuOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: DepartmentNode[];
}

export const FeishuOrgModal: React.FC<FeishuOrgModalProps> = ({
  isOpen,
  onClose,
  departments,
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(departments[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const currentDept = departments.find((d) => d.id === selectedDeptId) || departments[0];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('已成功与企业飞书通讯录完成同步！各部门 109 位成员信息已全部对齐。');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">飞书组织架构与人员体系</h3>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                  飞书通讯录实时互联
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                基于企业飞书通讯录统一认证，权限体系严格继承飞书原文档与项目成员限制
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

        {/* Content Body: Split View (Departments Tree left, Members right) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Department List Left */}
          <div className="w-64 border-r border-slate-200 bg-slate-50 p-3 space-y-1 overflow-y-auto">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              企业部门架构 (共 109 人)
            </div>
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  selectedDeptId === dept.id
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200 font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <span className="truncate">{dept.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {dept.memberCount}人
                </span>
              </button>
            ))}

            <div className="pt-4 px-2">
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>从飞书全量同步</span>
              </button>
            </div>
          </div>

          {/* Members Table Right */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{currentDept.name}</h4>
                <p className="text-[11px] text-slate-500">已授权员工名单与飞书 OpenID 映射</p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                本组 {currentDept.members.length} 人
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pt-1">
              {currentDept.members.map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                      {m.avatarChar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{m.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{m.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {m.role}
                    </span>
                    <span className="text-[10px] text-emerald-600">✓ 飞书认证</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Permission Note */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                飞书文档原权读取机制
              </div>
              <p className="leading-relaxed">
                即使将飞书文档绑定至项目，任何成员向 Agent 提问时，系统依然会在飞书服务端校验该员工个人对原文档的 Read 权限，杜绝越权获取非公开内容。
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>所属企业租户: 成都智行创新科技有限公司</span>
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

import React, { useState } from 'react';
import { X, FolderKanban, Users, Lock, Check, Plus, FileText, Building2 } from 'lucide-react';
import { ProjectItem, ProjectMember, FeishuDocument, DepartmentNode } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: ProjectItem) => void;
  availableDocs: FeishuDocument[];
  departments: DepartmentNode[];
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  availableDocs,
  departments,
}) => {
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [isPersonal, setIsPersonal] = useState(false);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [invitedMembers, setInvitedMembers] = useState<ProjectMember[]>([
    {
      id: 'm-02',
      name: '董平',
      avatarChar: '董',
      email: 'dongping@company.internal',
      role: '负责人',
      department: 'AI 架构与企业平台部',
      joinedAt: '刚刚',
    },
  ]);

  if (!isOpen) return null;

  // Flatten all employees from departments
  const allEmployees: ProjectMember[] = departments.flatMap((d) => d.members);

  const toggleInviteMember = (emp: ProjectMember) => {
    if (invitedMembers.some((m) => m.id === emp.id)) {
      if (emp.name === '董平') return; // creator cannot remove self
      setInvitedMembers(invitedMembers.filter((m) => m.id !== emp.id));
    } else {
      setInvitedMembers([
        ...invitedMembers,
        { ...emp, role: '成员', joinedAt: '刚刚' },
      ]);
    }
  };

  const handleToggleDoc = (docId: string) => {
    if (selectedDocIds.includes(docId)) {
      setSelectedDocIds(selectedDocIds.filter((id) => id !== docId));
    } else {
      setSelectedDocIds([...selectedDocIds, docId]);
    }
  };

  const handleCreate = () => {
    if (!projectName.trim()) return;
    const boundDocs = availableDocs.filter((d) => selectedDocIds.includes(d.id));
    const newProjId = `proj-${Date.now()}`;
    const newProj: ProjectItem = {
      id: newProjId,
      name: projectName.trim(),
      description: projectDesc.trim() || '团队共享协同工作空间',
      owner: '董平',
      isPersonal,
      memberCount: isPersonal ? 1 : invitedMembers.length,
      docCount: boundDocs.length,
      lastUpdated: '刚刚',
      status: 'active',
      members: isPersonal ? [invitedMembers[0]] : invitedMembers,
      docs: boundDocs,
      conversations: [
        {
          id: `conv-${Date.now()}`,
          projectId: newProjId,
          title: '探索与初步构想',
          updatedAt: '刚刚',
          messageCount: 0,
        },
      ],
    };
    onCreateProject(newProj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">创建新项目空间</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                可创建个人独立探索项目，或邀请部门成员共享资料协同推进
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Project Type Switcher */}
          <div>
            <label className="block font-semibold text-slate-800 mb-2">项目类型</label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setIsPersonal(false)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  !isPersonal
                    ? 'border-blue-500 bg-blue-50/40 text-blue-900'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>团队协同项目</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  从飞书通讯录邀请成员加入，共同挂载资料并分工推进。
                </p>
              </div>

              <div
                onClick={() => setIsPersonal(true)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isPersonal
                    ? 'border-blue-500 bg-blue-50/40 text-blue-900'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>个人私有项目</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  仅自己可见，所有临时草稿与分析不参与任何团队共享。
                </p>
              </div>
            </div>
          </div>

          {/* Project Name & Desc */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">项目名称</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="例如：2026 智能知识库升级专项"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">项目目标描述</label>
              <textarea
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                placeholder="简述该项目的业务目标与协作范围..."
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs resize-none"
              />
            </div>
          </div>

          {/* Invite Members from Feishu (only if Team Shared) */}
          {!isPersonal && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-slate-800">
                  从飞书通讯录邀请团队成员 ({invitedMembers.length} 人已选)
                </label>
              </div>

              <div className="border border-slate-200 rounded-xl p-2.5 max-h-36 overflow-y-auto space-y-1 bg-slate-50/50">
                {allEmployees.map((emp) => {
                  const isInvited = invitedMembers.some((m) => m.id === emp.id);
                  return (
                    <div
                      key={emp.id}
                      onClick={() => toggleInviteMember(emp)}
                      className={`p-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                        isInvited
                          ? 'bg-blue-50 border border-blue-200 text-blue-900 font-medium'
                          : 'bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">
                          {emp.avatarChar}
                        </div>
                        <span className="font-semibold">{emp.name}</span>
                        <span className="text-[10px] text-slate-400">({emp.department})</span>
                      </div>
                      {isInvited && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bind Feishu Documents */}
          <div>
            <label className="block font-semibold text-slate-800 mb-2">
              绑定共享飞书资料库 ({selectedDocIds.length} 篇已选)
            </label>
            <div className="border border-slate-200 rounded-xl p-2.5 max-h-32 overflow-y-auto space-y-1 bg-slate-50/50">
              {availableDocs.map((doc) => {
                const isSelected = selectedDocIds.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleToggleDoc(doc.id)}
                    className={`p-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200 text-blue-900 font-medium'
                        : 'bg-white hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{doc.title}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-400">创建后成员将收到飞书应用卡片提醒</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
            >
              取消
            </button>
            <button
              onClick={handleCreate}
              disabled={!projectName.trim()}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium shadow-2xs"
            >
              立即创建
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

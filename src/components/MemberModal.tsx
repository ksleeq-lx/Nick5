import React, { useState } from 'react';
import { TeamMember } from '../types';
import { X, Plus, Trash2, Edit3, UserCheck, Users } from 'lucide-react';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  onAddMember: (member: Omit<TeamMember, 'id'>) => void;
  onUpdateMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
}

const DASHBOARD_COLORS = [
  '#fee2e2', '#dbeafe', '#dcfce7', '#f3e8ff', '#fef9c3', '#ffedd5', '#fce7f3', '#e2e8f0'
];

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [avatarColor, setAvatarColor] = useState(DASHBOARD_COLORS[0]);

  if (!isOpen) return null;

  const handleStartEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setName(m.name);
    setRole(m.role);
    setEmail(m.email || '');
    setAvatarColor(m.avatarColor || DASHBOARD_COLORS[0]);
  };

  const handleResetForm = () => {
    setEditingId(null);
    setName('');
    setRole('');
    setEmail('');
    setAvatarColor(DASHBOARD_COLORS[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onUpdateMember({
        id: editingId,
        name,
        role,
        email,
        avatarColor,
      });
    } else {
      onAddMember({
        name,
        role,
        email,
        avatarColor,
      });
    }
    handleResetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="dashboard-card bg-white w-full max-w-xl p-6 relative max-h-[90vh] overflow-y-auto shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
          <Users className="w-6 h-6 text-[#8B0000]" />
          <h2 className="text-xl font-bold text-gray-900">사내 팀원 정보 관리</h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded border border-gray-200 mb-6">
          <h3 className="text-sm font-bold text-gray-800 mb-3">
            {editingId ? '팀원 정보 수정' : '신규 팀원 등록'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">성명 *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="예: 홍길동"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">직책 / 직급</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="예: 선임연구원"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-bold text-gray-700 mb-1">사내 이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-1">아바타 색상</label>
            <div className="flex gap-2 flex-wrap">
              {DASHBOARD_COLORS.map(col => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setAvatarColor(col)}
                  className={`w-7 h-7 rounded border transition-transform ${
                    avatarColor === col ? 'scale-110 border-gray-900 ring-2 ring-[#8B0000]' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            {editingId && (
              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded"
              >
                취소
              </button>
            )}
            <button
              type="submit"
              className="btn-primary-red px-4 py-2 rounded text-xs font-bold flex items-center gap-1"
            >
              {editingId ? <UserCheck className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {editingId ? '수정 완료' : '팀원 추가'}
            </button>
          </div>
        </form>

        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3">등록된 팀원 목록 ({members.length}명)</h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {members.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-800 border border-gray-300 text-xs"
                    style={{ backgroundColor: member.avatarColor || '#fee2e2' }}
                  >
                    {member.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xs flex items-center gap-2">
                      {member.name}
                      <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-normal">
                        {member.role || '팀원'}
                      </span>
                    </div>
                    {member.email && <div className="text-[11px] text-gray-500">{member.email}</div>}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(member)}
                    className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                    title="수정"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteMember(member.id)}
                    className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShiftRecord, TeamMember, ShiftType } from '../types';
import { Sun, Moon, Sunrise, Plus, Trash2, Edit2, Calendar, User, Clock } from 'lucide-react';

interface ShiftManagerProps {
  shifts: ShiftRecord[];
  members: TeamMember[];
  onAddShift: (shift: Omit<ShiftRecord, 'id'>) => void;
  onUpdateShift: (shift: ShiftRecord) => void;
  onDeleteShift: (id: string) => void;
}

export const ShiftManager: React.FC<ShiftManagerProps> = ({
  shifts,
  members,
  onAddShift,
  onUpdateShift,
  onDeleteShift,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [shiftType, setShiftType] = useState<ShiftType>('주간근무');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState('');

  const [selectedFilterType, setSelectedFilterType] = useState<string>('all');

  const handleOpenAdd = () => {
    setEditingId(null);
    setMemberId(members[0]?.id || '');
    setShiftType('주간근무');
    setDate(new Date().toISOString().split('T')[0]);
    setMemo('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: ShiftRecord) => {
    setEditingId(record.id);
    setMemberId(record.memberId);
    setShiftType(record.shiftType);
    setDate(record.date);
    setMemo(record.memo || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !date) return;

    if (editingId) {
      onUpdateShift({
        id: editingId,
        memberId,
        shiftType,
        date,
        memo,
      });
    } else {
      onAddShift({
        memberId,
        shiftType,
        date,
        memo,
      });
    }
    setIsModalOpen(false);
  };

  const getMemberName = (id: string) => {
    return members.find(m => m.id === id)?.name || '알 수 없음';
  };

  const filteredShifts = selectedFilterType === 'all'
    ? shifts
    : shifts.filter(s => s.shiftType === selectedFilterType);

  const getShiftBadgeStyle = (type: ShiftType) => {
    switch (type) {
      case '주간근무':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case '야간근무':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case '오전근무':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  const getShiftIcon = (type: ShiftType) => {
    switch (type) {
      case '주간근무':
        return <Sun className="w-4 h-4 text-amber-600" />;
      case '야간근무':
        return <Moon className="w-4 h-4 text-indigo-600" />;
      case '오전근무':
        return <Sunrise className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dashboard-card p-4 border-l-4 border-amber-500">
          <div className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
            <Sun className="w-4 h-4 text-amber-600" /> 주간근무 등록 건수
          </div>
          <div className="text-2xl font-bold text-amber-900">
            {shifts.filter(s => s.shiftType === '주간근무').length} 건
          </div>
        </div>
        <div className="dashboard-card p-4 border-l-4 border-indigo-600">
          <div className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
            <Moon className="w-4 h-4 text-indigo-600" /> 야간근무 등록 건수
          </div>
          <div className="text-2xl font-bold text-indigo-900">
            {shifts.filter(s => s.shiftType === '야간근무').length} 건
          </div>
        </div>
        <div className="dashboard-card p-4 border-l-4 border-emerald-600">
          <div className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
            <Sunrise className="w-4 h-4 text-emerald-600" /> 오전근무 등록 건수
          </div>
          <div className="text-2xl font-bold text-emerald-900">
            {shifts.filter(s => s.shiftType === '오전근무').length} 건
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 dashboard-card">
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <span className="text-sm font-bold text-gray-700">근무 형태 필터:</span>
          {['all', '주간근무', '야간근무', '오전근무'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedFilterType(type)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                selectedFilterType === type
                  ? 'bg-[#8B0000] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? '전체 보기' : type}
            </button>
          ))}
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary-red px-4 py-2 rounded text-sm font-bold flex items-center gap-1.5 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> 교대근무 이력 등록
        </button>
      </div>

      {/* Shift Table */}
      <div className="dashboard-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8B0000]" /> 교대근무 이력 추적 목록 ({filteredShifts.length}건)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/70 text-xs font-bold text-gray-600 border-b border-gray-200">
                <th className="py-3 px-4">근무 일자</th>
                <th className="py-3 px-4">팀원</th>
                <th className="py-3 px-4">근무 유형 (주간/야간/오전)</th>
                <th className="py-3 px-4">세부 메모 / 시간</th>
                <th className="py-3 px-4 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredShifts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    등록된 교대근무 이력이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredShifts.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 text-gray-600 font-medium">{record.date}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{getMemberName(record.memberId)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded text-xs font-bold border inline-flex items-center gap-1.5 ${getShiftBadgeStyle(record.shiftType)}`}>
                        {getShiftIcon(record.shiftType)}
                        {record.shiftType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{record.memo || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(record)}
                          className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteShift(record.id)}
                          className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit Shift */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="dashboard-card bg-white w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              {editingId ? '교대근무 이력 수정' : '새 교대근무 이력 등록'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">팀원 선택 *</label>
                  <select
                    value={memberId}
                    onChange={e => setMemberId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">근무 유형 *</label>
                  <select
                    value={shiftType}
                    onChange={e => setShiftType(e.target.value as ShiftType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
                  >
                    <option value="주간근무">주간근무 (Day)</option>
                    <option value="야간근무">야간근무 (Night)</option>
                    <option value="오전근무">오전근무 (Morning)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">근무 일자 *</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">세부 메모 / 시간대</label>
                <input
                  type="text"
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                  placeholder="예: 09:00 ~ 18:00 또는 특근 조"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn-primary-red px-5 py-2 rounded text-sm font-bold"
                >
                  {editingId ? '수정 완료' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

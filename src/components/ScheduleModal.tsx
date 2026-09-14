import React, { useState, useEffect } from 'react';
import { ScheduleItem, TeamMember, Category } from '../types';
import { X, Plus, Trash2, Calendar, Clock } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  categories: Category[];
  scheduleToEdit?: ScheduleItem | null;
  defaultDate?: string;
  onAddSchedule: (schedule: Omit<ScheduleItem, 'id'>) => void;
  onUpdateSchedule: (schedule: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  members,
  categories,
  scheduleToEdit,
  defaultDate,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
}) => {
  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (scheduleToEdit) {
      setMemberId(scheduleToEdit.memberId);
      setCategoryId(scheduleToEdit.categoryId);
      setTitle(scheduleToEdit.title);
      setStartDate(scheduleToEdit.startDate);
      setEndDate(scheduleToEdit.endDate);
      setStartTime(scheduleToEdit.startTime || '');
      setEndTime(scheduleToEdit.endTime || '');
      setMemo(scheduleToEdit.memo || '');
    } else {
      setMemberId(members[0]?.id || '');
      setCategoryId(categories[0]?.id || '');
      setTitle('');
      setStartDate(defaultDate || new Date().toISOString().split('T')[0]);
      setEndDate(defaultDate || new Date().toISOString().split('T')[0]);
      setStartTime('');
      setEndTime('');
      setMemo('');
    }
  }, [scheduleToEdit, defaultDate, isOpen, members, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !memberId || !categoryId) return;

    if (scheduleToEdit) {
      onUpdateSchedule({
        id: scheduleToEdit.id,
        memberId,
        categoryId,
        title,
        startDate,
        endDate,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        memo,
      });
    } else {
      onAddSchedule({
        memberId,
        categoryId,
        title,
        startDate,
        endDate,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        memo,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="dashboard-card bg-white w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
          <Calendar className="w-6 h-6 text-[#8B0000]" />
          <h2 className="text-xl font-bold text-gray-900">
            {scheduleToEdit ? '일정 정보 수정' : '신규 팀원 일정 등록'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">담당 팀원 *</label>
              <select
                value={memberId}
                onChange={e => setMemberId(e.target.value)}
                required
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
              <label className="block text-xs font-bold text-gray-700 mb-1">일정 카테고리 *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">일정 제목 *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예: 프로젝트 킥오프 미팅 / 현장 출장"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">시작일 *</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">종료일 *</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">시작 시간 (선택)</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">종료 시간 (선택)</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">비고 및 상세 메모</label>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="참고사항 입력"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {scheduleToEdit ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteSchedule(scheduleToEdit.id);
                  onClose();
                }}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded text-xs font-bold flex items-center gap-1 border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" /> 삭제
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-bold"
              >
                취소
              </button>
              <button
                type="submit"
                className="btn-primary-red px-5 py-2 rounded text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {scheduleToEdit ? '일정 수정' : '일정 등록'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

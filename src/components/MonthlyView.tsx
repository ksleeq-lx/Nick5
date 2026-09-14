import React from 'react';
import { TeamMember, Category, ScheduleItem } from '../types';
import { Plus, Clock } from 'lucide-react';

interface MonthlyViewProps {
  currentDate: Date;
  members: TeamMember[];
  categories: Category[];
  schedules: ScheduleItem[];
  onSelectSchedule: (schedule: ScheduleItem) => void;
  onAddScheduleForDate: (memberId: string, dateStr: string) => void;
}

export const MonthlyView: React.FC<MonthlyViewProps> = ({
  currentDate,
  members,
  categories,
  schedules,
  onSelectSchedule,
  onAddScheduleForDate,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = firstDayOfMonth.getDay();

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const getCategory = (catId: string) => {
    return categories.find(c => c.id === catId) || categories[0];
  };

  const getMember = (memId: string) => {
    return members.find(m => m.id === memId);
  };

  const calendarDays: { dateStr: string | null; dayNum: number | null; isToday: boolean }[] = [];
  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push({ dateStr: null, dayNum: null, isToday: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    calendarDays.push({
      dateStr,
      dayNum: d,
      isToday: dateStr === todayStr,
    });
  }

  const getSchedulesForDate = (dateStr: string) => {
    return schedules.filter(
      s => s.startDate <= dateStr && s.endDate >= dateStr
    );
  };

  return (
    <div className="dashboard-card p-4 md:p-6 bg-white">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((dName, idx) => (
          <div
            key={idx}
            className={`text-center py-2 rounded font-bold text-xs border ${
              idx === 0
                ? 'bg-red-50 text-red-800 border-red-200'
                : idx === 6
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-gray-100 text-gray-800 border-gray-200'
            }`}
          >
            {dName}요일
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((cell, idx) => {
          if (!cell.dateStr || cell.dayNum === null) {
            return (
              <div
                key={idx}
                className="bg-gray-50 border border-dashed border-gray-200 rounded min-h-[110px] opacity-40"
              />
            );
          }

          const daySchedules = getSchedulesForDate(cell.dateStr);

          return (
            <div
              key={idx}
              className={`bg-white border rounded p-2 min-h-[130px] flex flex-col justify-between group transition-all ${
                cell.isToday
                  ? 'border-[#8B0000] bg-red-50/20 ring-1 ring-[#8B0000] shadow-2xs'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      cell.isToday ? 'bg-[#8B0000] text-white' : 'text-gray-800'
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  <button
                    onClick={() => onAddScheduleForDate(members[0]?.id || '', cell.dateStr!)}
                    className="p-1 rounded hover:bg-gray-200 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="일정 추가"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 max-h-[85px] overflow-y-auto pr-0.5">
                  {daySchedules.map(sch => {
                    const cat = getCategory(sch.categoryId);
                    const member = getMember(sch.memberId);
                    return (
                      <div
                        key={sch.id}
                        onClick={() => onSelectSchedule(sch)}
                        className="p-1 rounded text-xs font-bold cursor-pointer shadow-2xs border transition-transform hover:scale-[1.01] flex items-center gap-1"
                        style={{
                          backgroundColor: cat?.color || '#fef2f2',
                          color: cat?.textColor || '#991b1b',
                          borderColor: (cat?.textColor || '#991b1b') + '40',
                        }}
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 border border-gray-300"
                          style={{ backgroundColor: member?.avatarColor || '#fee2e2' }}
                        >
                          {member?.name.slice(0, 1) || '?'}
                        </div>
                        <div className="truncate flex-1">
                          <span className="opacity-80 font-normal mr-1">[{member?.name}]</span>
                          {sch.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

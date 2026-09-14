import React from 'react';
import { TeamMember, Category, ScheduleItem } from '../types';
import { Plus, Clock } from 'lucide-react';

interface WeeklyViewProps {
  currentDate: Date;
  members: TeamMember[];
  categories: Category[];
  schedules: ScheduleItem[];
  onSelectSchedule: (schedule: ScheduleItem) => void;
  onAddScheduleForDate: (memberId: string, dateStr: string) => void;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  currentDate,
  members,
  categories,
  schedules,
  onSelectSchedule,
  onAddScheduleForDate,
}) => {
  const getWeekDays = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));

    const weekDays: { dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] = [];
    const todayStr = new Date().toISOString().split('T')[0];
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      const dateStr = nextDay.toISOString().split('T')[0];
      weekDays.push({
        dateStr,
        dayName: dayNames[i],
        dayNum: nextDay.getDate(),
        isToday: dateStr === todayStr,
      });
    }
    return weekDays;
  };

  const weekDays = getWeekDays(currentDate);

  const getCategory = (catId: string) => {
    return categories.find(c => c.id === catId) || categories[0];
  };

  const getSchedulesForMemberAndDate = (memberId: string, dateStr: string) => {
    return schedules.filter(
      s => s.memberId === memberId && s.startDate <= dateStr && s.endDate >= dateStr
    );
  };

  return (
    <div className="dashboard-card p-4 md:p-6 overflow-x-auto bg-white">
      <div className="min-w-[900px]">
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-2 mb-3 pb-2 border-b border-gray-200">
          <div className="font-bold text-gray-700 text-center py-2 bg-gray-100 rounded text-xs">
            팀원 / 요일
          </div>
          {weekDays.map((wd, idx) => (
            <div
              key={idx}
              className={`text-center py-2 rounded border transition-colors ${
                wd.isToday
                  ? 'bg-[#8B0000] text-white border-[#8B0000] font-bold shadow-xs'
                  : 'bg-gray-50 border-gray-200 font-bold text-gray-800'
              }`}
            >
              <div className="text-xs opacity-90">{wd.dayName}요일</div>
              <div className="text-lg">{wd.dayNum}</div>
            </div>
          ))}
        </div>

        {/* Member Rows */}
        <div className="space-y-3">
          {members.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              등록된 팀원이 없습니다. 상단의 '팀원 관리'를 통해 팀원을 추가해주세요.
            </div>
          ) : (
            members.map(member => (
              <div
                key={member.id}
                className="grid grid-cols-8 gap-2 items-stretch bg-gray-50/50 p-2 rounded border border-gray-200"
              >
                {/* Member Info */}
                <div className="flex flex-col items-center justify-center p-2 bg-white rounded border border-gray-200 text-center shadow-2xs">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-800 border border-gray-300 mb-1 text-xs"
                    style={{ backgroundColor: member.avatarColor || '#fee2e2' }}
                  >
                    {member.name.slice(0, 1)}
                  </div>
                  <div className="font-bold text-gray-900 text-xs">{member.name}</div>
                  <div className="text-[11px] text-gray-500 truncate max-w-full">{member.role}</div>
                </div>

                {/* Days Cells */}
                {weekDays.map((wd, dayIdx) => {
                  const daySchedules = getSchedulesForMemberAndDate(member.id, wd.dateStr);

                  return (
                    <div
                      key={dayIdx}
                      className="bg-white border border-gray-200 rounded p-2 min-h-[100px] flex flex-col justify-between relative group hover:border-gray-400 transition-all"
                    >
                      <div className="space-y-1.5 flex-1">
                        {daySchedules.map(sch => {
                          const cat = getCategory(sch.categoryId);
                          return (
                            <div
                              key={sch.id}
                              onClick={() => onSelectSchedule(sch)}
                              className="p-1.5 rounded text-xs font-bold cursor-pointer shadow-2xs border transition-transform hover:scale-[1.01]"
                              style={{
                                backgroundColor: cat?.color || '#fef2f2',
                                color: cat?.textColor || '#991b1b',
                                borderColor: (cat?.textColor || '#991b1b') + '40',
                              }}
                            >
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="px-1 py-0.2 rounded bg-white/80 text-[10px] font-bold">
                                  {cat?.name}
                                </span>
                                {sch.startTime && (
                                  <span className="text-[10px] flex items-center gap-0.5 opacity-80">
                                    <Clock className="w-3 h-3" />
                                    {sch.startTime}
                                  </span>
                                )}
                              </div>
                              <div className="truncate font-bold">{sch.title}</div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => onAddScheduleForDate(member.id, wd.dateStr)}
                        className="w-full mt-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded font-bold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-300"
                      >
                        <Plus className="w-3 h-3" /> 일정등록
                      </button>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

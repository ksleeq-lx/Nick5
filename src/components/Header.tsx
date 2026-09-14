import React from 'react';
import { ViewMode, MainTab } from '../types';
import { Calendar as CalendarIcon, Users, Tag, Plus, ChevronLeft, ChevronRight, DollarSign, Clock, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentDate: Date;
  onPrevDate: () => void;
  onNextDate: () => void;
  onToday: () => void;
  onOpenMemberModal: () => void;
  onOpenCategoryModal: () => void;
  onOpenScheduleModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  currentDate,
  onPrevDate,
  onNextDate,
  onToday,
  onOpenMemberModal,
  onOpenCategoryModal,
  onOpenScheduleModal,
}) => {
  const formatHeaderDate = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    if (viewMode === 'month') {
      return `${year}년 ${month}월`;
    } else {
      return `${year}년 ${month}월 주간`;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 mb-6 shadow-xs rounded-lg">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Title / Logo with Dark Red Theme */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#8B0000] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            사내
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              사내 팀원 일정 및 대시보드 관리 시스템
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Enterprise Team Schedule & Expense Management Dashboard
            </p>
          </div>
        </div>

        {/* Main Tabs Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-md font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'calendar'
                ? 'bg-[#8B0000] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CalendarIcon className="w-4 h-4" /> 일정 캘린더
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 rounded-md font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'expenses'
                ? 'bg-[#8B0000] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <DollarSign className="w-4 h-4" /> 월간 사용비
          </button>
          <button
            onClick={() => setActiveTab('shifts')}
            className={`px-4 py-2 rounded-md font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'shifts'
                ? 'bg-[#8B0000] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" /> 교대근무 이력
          </button>
        </div>

        {/* Action Buttons & Date Controls (Only for calendar tab or general actions) */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {activeTab === 'calendar' && (
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-0.5">
              <button
                onClick={onPrevDate}
                className="p-1 rounded hover:bg-gray-200 text-gray-700"
                title="이전"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onToday}
                className="px-2.5 py-1 font-bold text-gray-800 hover:bg-gray-200 rounded text-xs"
              >
                오늘
              </button>
              <span className="px-2 font-bold text-gray-900 text-xs sm:text-sm">
                {formatHeaderDate()}
              </span>
              <button
                onClick={onNextDate}
                className="p-1 rounded hover:bg-gray-200 text-gray-700"
                title="다음"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded font-bold text-xs ${
                  viewMode === 'week' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600'
                }`}
              >
                주간
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded font-bold text-xs ${
                  viewMode === 'month' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600'
                }`}
              >
                월간
              </button>
            </div>
          )}

          <button
            onClick={onOpenMemberModal}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-xs font-bold flex items-center gap-1 border border-gray-300"
          >
            <Users className="w-4 h-4" /> 팀원 관리
          </button>
          <button
            onClick={onOpenCategoryModal}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-xs font-bold flex items-center gap-1 border border-gray-300"
          >
            <Tag className="w-4 h-4" /> 카테고리
          </button>

          {activeTab === 'calendar' && (
            <button
              onClick={onOpenScheduleModal}
              className="btn-primary-red px-3 py-2 rounded text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-4 h-4" /> 일정 등록
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

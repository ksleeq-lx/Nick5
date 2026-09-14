import React, { useState, useEffect } from 'react';
import { TeamMember, Category, ScheduleItem, ExpenseItem, ShiftRecord, ViewMode, MainTab } from './types';
import { loadStoredData, saveStoredData } from './utils/storage';
import { Header } from './components/Header';
import { WeeklyView } from './components/WeeklyView';
import { MonthlyView } from './components/MonthlyView';
import { ExpenseManager } from './components/ExpenseManager';
import { ShiftManager } from './components/ShiftManager';
import { MemberModal } from './components/MemberModal';
import { CategoryModal } from './components/CategoryModal';
import { ScheduleModal } from './components/ScheduleModal';

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);

  const [activeTab, setActiveTab] = useState<MainTab>('calendar');
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Modals state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const [scheduleToEdit, setScheduleToEdit] = useState<ScheduleItem | null>(null);
  const [defaultScheduleDate, setDefaultScheduleDate] = useState<string | undefined>(undefined);

  // Load initial data
  useEffect(() => {
    const data = loadStoredData();
    setCategories(data.categories);
    setMembers(data.members);
    setSchedules(data.schedules);
    setExpenses(data.expenses);
    setShifts(data.shifts);
  }, []);

  // Save data on change
  useEffect(() => {
    if (categories.length > 0 || members.length > 0) {
      saveStoredData(categories, members, schedules, expenses, shifts);
    }
  }, [categories, members, schedules, expenses, shifts]);

  // Date navigation
  const handlePrevDate = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Member CRUD
  const handleAddMember = (newMem: Omit<TeamMember, 'id'>) => {
    const member: TeamMember = { ...newMem, id: `mem-${Date.now()}` };
    setMembers(prev => [...prev, member]);
  };

  const handleUpdateMember = (updated: TeamMember) => {
    setMembers(prev => prev.map(m => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('정말 이 팀원을 삭제하시겠습니까? 관련 데이터가 함께 정리됩니다.')) {
      setMembers(prev => prev.filter(m => m.id !== id));
      setSchedules(prev => prev.filter(s => s.memberId !== id));
      setExpenses(prev => prev.filter(e => e.memberId !== id));
      setShifts(prev => prev.filter(sh => sh.memberId !== id));
    }
  };

  // Category CRUD
  const handleAddCategory = (newCat: Omit<Category, 'id'>) => {
    const category: Category = { ...newCat, id: `cat-${Date.now()}` };
    setCategories(prev => [...prev, category]);
  };

  const handleUpdateCategory = (updated: Category) => {
    setCategories(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCategory = (id: string) => {
    if (categories.length <= 1) {
      alert('최소 1개의 카테고리는 유지되어야 합니다.');
      return;
    }
    if (window.confirm('이 카테고리를 삭제하시겠습니까?')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  // Schedule CRUD
  const handleAddSchedule = (newSch: Omit<ScheduleItem, 'id'>) => {
    const schedule: ScheduleItem = { ...newSch, id: `sch-${Date.now()}` };
    setSchedules(prev => [...prev, schedule]);
  };

  const handleUpdateSchedule = (updated: ScheduleItem) => {
    setSchedules(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSchedule = (id: string) => {
    if (window.confirm('일정을 삭제하시겠습니까?')) {
      setSchedules(prev => prev.filter(s => s.id !== id));
    }
  };

  // Expense CRUD
  const handleAddExpense = (newExp: Omit<ExpenseItem, 'id'>) => {
    const expense: ExpenseItem = { ...newExp, id: `exp-${Date.now()}` };
    setExpenses(prev => [...prev, expense]);
  };

  const handleUpdateExpense = (updated: ExpenseItem) => {
    setExpenses(prev => prev.map(e => (e.id === updated.id ? updated : e)));
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('해당 사용비 내역을 삭제하시겠습니까?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  // Shift CRUD
  const handleAddShift = (newShift: Omit<ShiftRecord, 'id'>) => {
    const shift: ShiftRecord = { ...newShift, id: `shift-${Date.now()}` };
    setShifts(prev => [...prev, shift]);
  };

  const handleUpdateShift = (updated: ShiftRecord) => {
    setShifts(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteShift = (id: string) => {
    if (window.confirm('교대근무 이력을 삭제하시겠습니까?')) {
      setShifts(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleOpenAddSchedule = (memberId?: string, dateStr?: string) => {
    setScheduleToEdit(null);
    setDefaultScheduleDate(dateStr || new Date().toISOString().split('T')[0]);
    setIsScheduleModalOpen(true);
  };

  const handleSelectSchedule = (schedule: ScheduleItem) => {
    setScheduleToEdit(schedule);
    setDefaultScheduleDate(schedule.startDate);
    setIsScheduleModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-16 px-4 md:px-8 pt-6 relative bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          viewMode={viewMode}
          setViewMode={setViewMode}
          currentDate={currentDate}
          onPrevDate={handlePrevDate}
          onNextDate={handleNextDate}
          onToday={handleToday}
          onOpenMemberModal={() => setIsMemberModalOpen(true)}
          onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
          onOpenScheduleModal={() => handleOpenAddSchedule()}
        />

        {/* Main Content Area based on Tab */}
        <main>
          {activeTab === 'calendar' && (
            <div>
              {/* Category Legend */}
              <div className="flex items-center gap-2 mb-4 flex-wrap bg-white p-3 dashboard-card text-xs">
                <span className="font-bold text-gray-700">일정 카테고리:</span>
                {categories.map(cat => (
                  <span
                    key={cat.id}
                    className="px-2.5 py-1 rounded font-bold border flex items-center gap-1"
                    style={{
                      backgroundColor: cat.color,
                      color: cat.textColor,
                      borderColor: cat.textColor + '40',
                    }}
                  >
                    {cat.name}
                  </span>
                ))}
              </div>

              {viewMode === 'week' ? (
                <WeeklyView
                  currentDate={currentDate}
                  members={members}
                  categories={categories}
                  schedules={schedules}
                  onSelectSchedule={handleSelectSchedule}
                  onAddScheduleForDate={handleOpenAddSchedule}
                />
              ) : (
                <MonthlyView
                  currentDate={currentDate}
                  members={members}
                  categories={categories}
                  schedules={schedules}
                  onSelectSchedule={handleSelectSchedule}
                  onAddScheduleForDate={handleOpenAddSchedule}
                />
              )}
            </div>
          )}

          {activeTab === 'expenses' && (
            <ExpenseManager
              expenses={expenses}
              members={members}
              onAddExpense={handleAddExpense}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeTab === 'shifts' && (
            <ShiftManager
              shifts={shifts}
              members={members}
              onAddShift={handleAddShift}
              onUpdateShift={handleUpdateShift}
              onDeleteShift={handleDeleteShift}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        members={members}
        onAddMember={handleAddMember}
        onUpdateMember={handleUpdateMember}
        onDeleteMember={handleDeleteMember}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        members={members}
        categories={categories}
        scheduleToEdit={scheduleToEdit}
        defaultDate={defaultScheduleDate}
        onAddSchedule={handleAddSchedule}
        onUpdateSchedule={handleUpdateSchedule}
        onDeleteSchedule={handleDeleteSchedule}
      />
    </div>
  );
}

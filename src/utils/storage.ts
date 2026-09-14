import { TeamMember, Category, ScheduleItem, ExpenseItem, ShiftRecord } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: '휴가', color: '#fef2f2', textColor: '#991b1b', iconName: 'Palmtree' },
  { id: 'cat-2', name: '휴직', color: '#fff1f2', textColor: '#be123c', iconName: 'UserMinus' },
  { id: 'cat-3', name: '야간근무', color: '#faf5ff', textColor: '#6b21a8', iconName: 'Moon' },
  { id: 'cat-4', name: '출장', color: '#eff6ff', textColor: '#1e40af', iconName: 'Briefcase' },
  { id: 'cat-5', name: '재택근무', color: '#f0fdf4', textColor: '#166534', iconName: 'Home' },
];

export const INITIAL_MEMBERS: TeamMember[] = [
  { id: 'mem-1', name: '김철수', role: '팀장 (PM)', avatarColor: '#fee2e2', email: 'cs.kim@company.com' },
  { id: 'mem-2', name: '이지영', role: '선임연구원', avatarColor: '#dbeafe', email: 'jy.lee@company.com' },
  { id: 'mem-3', name: '박민수', role: '주임연구원', avatarColor: '#dcfce7', email: 'ms.park@company.com' },
  { id: 'mem-4', name: '정수진', role: '사원', avatarColor: '#f3e8ff', email: 'sj.jung@company.com' },
];

const getTodayStr = (offsetDays: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: 'sch-1',
    memberId: 'mem-1',
    categoryId: 'cat-4', // 출장
    title: '고객사 시스템 점검 출장',
    startDate: getTodayStr(-1),
    endDate: getTodayStr(1),
    startTime: '09:00',
    endTime: '18:00',
    memo: '서울 본사 미팅 및 현장 점검',
  },
  {
    id: 'sch-2',
    memberId: 'mem-2',
    categoryId: 'cat-1', // 휴가
    title: '하계 휴가',
    startDate: getTodayStr(2),
    endDate: getTodayStr(4),
    memo: '개인 사유 휴가',
  },
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    memberId: 'mem-1',
    title: '고객사 출장 KTX 왕복 및 숙박비',
    amount: 245000,
    category: '출장비',
    date: getTodayStr(-1),
    memo: '영수증 첨부 완료',
  },
  {
    id: 'exp-2',
    memberId: 'mem-3',
    title: '신규 개발 장비 테스트용 비매품 샘플',
    amount: 150000,
    category: '비매품',
    date: getTodayStr(-2),
    memo: 'R&D 테스트 부품',
  },
  {
    id: 'exp-3',
    memberId: 'mem-1',
    title: '3분기 팀 워크숍 및 회식비',
    amount: 420000,
    category: '회식비',
    date: getTodayStr(-5),
    memo: '팀원 전원 참석',
  },
];

export const INITIAL_SHIFTS: ShiftRecord[] = [
  {
    id: 'shift-1',
    memberId: 'mem-2',
    shiftType: '주간근무',
    date: getTodayStr(0),
    memo: '09:00 ~ 18:00',
  },
  {
    id: 'shift-2',
    memberId: 'mem-3',
    shiftType: '야간근무',
    date: getTodayStr(0),
    memo: '22:00 ~ 07:00 (당직)',
  },
  {
    id: 'shift-3',
    memberId: 'mem-4',
    shiftType: '오전근무',
    date: getTodayStr(0),
    memo: '06:00 ~ 15:00 (조기출근)',
  },
];

const STORAGE_KEYS = {
  CATEGORIES: 'dashboard_categories_v2',
  MEMBERS: 'dashboard_members_v2',
  SCHEDULES: 'dashboard_schedules_v2',
  EXPENSES: 'dashboard_expenses_v2',
  SHIFTS: 'dashboard_shifts_v2',
};

export const loadStoredData = () => {
  try {
    const storedCat = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const storedMem = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    const storedSch = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    const storedExp = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const storedShifts = localStorage.getItem(STORAGE_KEYS.SHIFTS);

    let categories = storedCat ? JSON.parse(storedCat) : INITIAL_CATEGORIES;
    // Ensure '휴직' exists in categories if loaded from older local storage
    if (!categories.some((c: Category) => c.name === '휴직')) {
      categories.push({ id: `cat-leave-${Date.now()}`, name: '휴직', color: '#fff1f2', textColor: '#be123c', iconName: 'UserMinus' });
    }

    return {
      categories,
      members: storedMem ? JSON.parse(storedMem) : INITIAL_MEMBERS,
      schedules: storedSch ? JSON.parse(storedSch) : INITIAL_SCHEDULES,
      expenses: storedExp ? JSON.parse(storedExp) : INITIAL_EXPENSES,
      shifts: storedShifts ? JSON.parse(storedShifts) : INITIAL_SHIFTS,
    };
  } catch (e) {
    console.error('Failed to load storage', e);
    return {
      categories: INITIAL_CATEGORIES,
      members: INITIAL_MEMBERS,
      schedules: INITIAL_SCHEDULES,
      expenses: INITIAL_EXPENSES,
      shifts: INITIAL_SHIFTS,
    };
  }
};

export const saveStoredData = (
  categories: Category[],
  members: TeamMember[],
  schedules: ScheduleItem[],
  expenses: ExpenseItem[],
  shifts: ShiftRecord[]
) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
  } catch (e) {
    console.error('Failed to save storage', e);
  }
};

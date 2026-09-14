export type ViewMode = 'week' | 'month';
export type MainTab = 'calendar' | 'expenses' | 'shifts';

export interface Category {
  id: string;
  name: string;
  color: string;
  textColor: string;
  iconName: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  email?: string;
}

export interface ScheduleItem {
  id: string;
  memberId: string;
  categoryId: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  memo?: string;
}

export interface ExpenseItem {
  id: string;
  memberId?: string;
  title: string;
  amount: number;
  category: '비매품' | '출장비' | '회식비' | '기타';
  date: string; // YYYY-MM-DD
  memo?: string;
}

export type ShiftType = '주간근무' | '야간근무' | '오전근무';

export interface ShiftRecord {
  id: string;
  memberId: string;
  shiftType: ShiftType;
  date: string; // YYYY-MM-DD
  memo?: string;
}

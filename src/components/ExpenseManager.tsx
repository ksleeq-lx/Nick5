import React, { useState } from 'react';
import { ExpenseItem, TeamMember } from '../types';
import { DollarSign, Plus, Trash2, Edit2, FileText, PieChart, Calendar, User } from 'lucide-react';

interface ExpenseManagerProps {
  expenses: ExpenseItem[];
  members: TeamMember[];
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onUpdateExpense: (expense: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  expenses,
  members,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<'비매품' | '출장비' | '회식비' | '기타'>('출장비');
  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState('');

  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setAmount(0);
    setCategory('출장비');
    setMemberId(members[0]?.id || '');
    setDate(new Date().toISOString().split('T')[0]);
    setMemo('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: ExpenseItem) => {
    setEditingId(exp.id);
    setTitle(exp.title);
    setAmount(exp.amount);
    setCategory(exp.category);
    setMemberId(exp.memberId || members[0]?.id || '');
    setDate(exp.date);
    setMemo(exp.memo || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    if (editingId) {
      onUpdateExpense({
        id: editingId,
        title,
        amount: Number(amount),
        category,
        memberId,
        date,
        memo,
      });
    } else {
      onAddExpense({
        title,
        amount: Number(amount),
        category,
        memberId,
        date,
        memo,
      });
    }
    setIsModalOpen(false);
  };

  const getMemberName = (id?: string) => {
    return members.find(m => m.id === id)?.name || '미지정';
  };

  // Calculations
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);
  const categoryTotals = {
    출장비: expenses.filter(e => e.category === '출장비').reduce((s, e) => s + e.amount, 0),
    회식비: expenses.filter(e => e.category === '회식비').reduce((s, e) => s + e.amount, 0),
    비매품: expenses.filter(e => e.category === '비매품').reduce((s, e) => s + e.amount, 0),
    기타: expenses.filter(e => e.category === '기타').reduce((s, e) => s + e.amount, 0),
  };

  const filteredExpenses = filterCategory === 'all'
    ? expenses
    : expenses.filter(e => e.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="dashboard-card p-4 border-l-4 border-[#8B0000]">
          <div className="text-xs text-gray-500 font-medium mb-1">총 사용비 합계</div>
          <div className="text-2xl font-bold text-[#8B0000]">
            {totalAmount.toLocaleString()} 원
          </div>
        </div>
        <div className="dashboard-card p-4 border-l-4 border-blue-600">
          <div className="text-xs text-gray-500 font-medium mb-1">출장비</div>
          <div className="text-xl font-bold text-blue-900">
            {categoryTotals.출장비.toLocaleString()} 원
          </div>
        </div>
        <div className="dashboard-card p-4 border-l-4 border-green-600">
          <div className="text-xs text-gray-500 font-medium mb-1">회식비</div>
          <div className="text-xl font-bold text-green-900">
            {categoryTotals.회식비.toLocaleString()} 원
          </div>
        </div>
        <div className="dashboard-card p-4 border-l-4 border-purple-600">
          <div className="text-xs text-gray-500 font-medium mb-1">비매품 (샘플/자재)</div>
          <div className="text-xl font-bold text-purple-900">
            {categoryTotals.비매품.toLocaleString()} 원
          </div>
        </div>
        <div className="dashboard-card p-4 border-l-4 border-amber-600">
          <div className="text-xs text-gray-500 font-medium mb-1">기타 지출</div>
          <div className="text-xl font-bold text-amber-900">
            {categoryTotals.기타.toLocaleString()} 원
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 dashboard-card">
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <span className="text-sm font-bold text-gray-700">분류 필터:</span>
          {['all', '출장비', '회식비', '비매품', '기타'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                filterCategory === cat
                  ? 'bg-[#8B0000] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? '전체 보기' : cat}
            </button>
          ))}
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary-red px-4 py-2 rounded text-sm font-bold flex items-center gap-1.5 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> 사용비 내역 등록
        </button>
      </div>

      {/* Expenses Table */}
      <div className="dashboard-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#8B0000]" /> 팀 월간 사용비 내역 목록 ({filteredExpenses.length}건)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/70 text-xs font-bold text-gray-600 border-b border-gray-200">
                <th className="py-3 px-4">지출 일자</th>
                <th className="py-3 px-4">분류</th>
                <th className="py-3 px-4">내역 제목</th>
                <th className="py-3 px-4">담당자</th>
                <th className="py-3 px-4 text-right">금액</th>
                <th className="py-3 px-4">비고</th>
                <th className="py-3 px-4 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    등록된 사용비 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 text-gray-600 font-medium">{item.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          item.category === '출장비'
                            ? 'bg-blue-100 text-blue-800'
                            : item.category === '회식비'
                            ? 'bg-green-100 text-green-800'
                            : item.category === '비매품'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">{item.title}</td>
                    <td className="py-3 px-4 text-gray-700">{getMemberName(item.memberId)}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#8B0000]">
                      {item.amount.toLocaleString()} 원
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{item.memo || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(item.id)}
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

      {/* Modal for Add / Edit Expense */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="dashboard-card bg-white w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              {editingId ? '사용비 내역 수정' : '새 사용비 내역 등록'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">분류 *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
                  >
                    <option value="출장비">출장비</option>
                    <option value="회식비">회식비</option>
                    <option value="비매품">비매품</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">담당 팀원 *</label>
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
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">내역 제목 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="예: 고객사 출장 교통비 및 식대"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">금액 (원) *</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    required
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">지출 일자 *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">비고 및 메모</label>
                <textarea
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                  rows={3}
                  placeholder="영수증 번호나 추가 설명"
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

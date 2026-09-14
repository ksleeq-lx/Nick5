import React, { useState } from 'react';
import { Category } from '../types';
import { X, Plus, Trash2, Edit3, Tag } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

const CATEGORY_STYLES = [
  { bg: '#fef2f2', text: '#991b1b' },
  { bg: '#eff6ff', text: '#1e40af' },
  { bg: '#f0fdf4', text: '#166534' },
  { bg: '#faf5ff', text: '#6b21a8' },
  { bg: '#fffbeb', text: '#92400e' },
  { bg: '#f1f5f9', text: '#334155' },
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [selectedPair, setSelectedPair] = useState(CATEGORY_STYLES[0]);

  if (!isOpen) return null;

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSelectedPair({ bg: cat.color, text: cat.textColor });
  };

  const handleResetForm = () => {
    setEditingId(null);
    setName('');
    setSelectedPair(CATEGORY_STYLES[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onUpdateCategory({
        id: editingId,
        name,
        color: selectedPair.bg,
        textColor: selectedPair.text,
        iconName: 'Tag',
      });
    } else {
      onAddCategory({
        name,
        color: selectedPair.bg,
        textColor: selectedPair.text,
        iconName: 'Tag',
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
          <Tag className="w-6 h-6 text-[#8B0000]" />
          <h2 className="text-xl font-bold text-gray-900">일정 카테고리 관리</h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded border border-gray-200 mb-6">
          <h3 className="text-sm font-bold text-gray-800 mb-3">
            {editingId ? '카테고리 수정' : '신규 카테고리 추가'}
          </h3>
          <div className="mb-3">
            <label className="block text-xs font-bold text-gray-700 mb-1">카테고리 명 *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="예: 교육 / 회의"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#8B0000]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-1">배색 스타일 선택</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORY_STYLES.map((pair, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPair(pair)}
                  className={`px-3 py-1 rounded text-xs font-bold border transition-transform ${
                    selectedPair.bg === pair.bg ? 'scale-105 border-gray-900 ring-2 ring-[#8B0000]' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: pair.bg, color: pair.text }}
                >
                  미리보기
                </button>
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
              {editingId ? <Tag className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {editingId ? '수정 완료' : '카테고리 추가'}
            </button>
          </div>
        </form>

        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3">등록된 카테고리 목록</h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1 rounded text-xs font-bold border"
                    style={{ backgroundColor: cat.color, color: cat.textColor, borderColor: cat.textColor + '40' }}
                  >
                    {cat.name}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(cat)}
                    className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                    title="수정"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
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

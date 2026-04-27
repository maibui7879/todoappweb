// src/components/Category/CategoryModal.tsx
import { useState } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../../api/category.api";
import { type Category } from "../../types/category.type";

const COLORS = [
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];

interface CategoryModalProps {
  category?: Category;
  onClose: () => void;
}

const CategoryModal = ({ category, onClose }: CategoryModalProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(category?.name || "");
  const [color, setColor] = useState(category?.color || "#8B5CF6");
  const isEdit = !!category;

  const createMutation = useMutation({
    mutationFn: () => categoryApi.create({ name, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => categoryApi.update(category!._id, { name, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = () => {
    if (!name.trim()) return;
    isEdit ? updateMutation.mutate() : createMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">
            {isEdit ? "Sửa danh mục" : "Tạo danh mục mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-1 block">
            Tên danh mục *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Học tập, Sức khỏe..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#8B5CF6]"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <div className="mb-5">
          <label className="text-xs text-gray-500 mb-2 block">Màu sắc</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || isPending}
          className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium py-2 rounded-xl transition-colors disabled:opacity-50"
        >
          {isPending ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo danh mục"}
        </button>
      </div>
    </div>
  );
};

export default CategoryModal;

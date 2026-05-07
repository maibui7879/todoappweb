interface CategoryStat {
  name: string;
  color: string;
  count: number;
  completed: number;
}

export const CategoryBreakdown = ({ categories }: { categories: CategoryStat[] }) => {
  return (
    <div className="bg-white p-7 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex-1">
      <h3 className="text-[17px] font-bold text-slate-800 mb-5">Theo danh mục</h3>
      <div className="space-y-4">
        {categories.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">Chưa có dữ liệu</p>
        ) : (
          categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: cat.color || '#cbd5e1' }} 
                />
                <span className="text-[15px] font-semibold text-slate-600">{cat.name}</span>
              </div>
              <span className="text-[15px] font-bold text-slate-800">
                {cat.completed}/{cat.count}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface StatsHeaderProps {
  period: 'week' | 'month' | 'year';
  setPeriod: (p: 'week' | 'month' | 'year') => void;
  dateRange: string; // "20/04/2026 - 26/04/2026"
}

export const StatsHeader = ({ period, setPeriod, dateRange }: StatsHeaderProps) => {
  return (
    <div className="flex items-center justify-between py-4 mb-6 border-b border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">Thống kê hiệu suất</h1>
      
      <div className="flex items-center gap-6">
        <span className="text-gray-600 font-medium">{dateRange}</span>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                period === p ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'
              }`}
            >
              {p === 'week' ? 'Tuần' : p === 'month' ? 'Tháng' : 'Năm'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
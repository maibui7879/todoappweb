import { useState } from 'react';
import { useStat } from '../../hooks/useStat';
import { OverviewGrid } from '../../components/Stats/Overview/OverviewGrid';
import { StatHeader } from '../../components/Stats/StatHeader';
import { ChartSection } from '../../components/Stats/Chart/ChartSection';
import { StreakCheckIn } from '../../components/Stats/Streak/StreakCheckIn';

const StatsPage = () => {
  const [type, setType] = useState<'week' | 'month' | 'year'>('week');
  const { overview, details, loading } = useStat(type);

  if (loading || !overview || !details) {
    return (
      <div className="p-8 text-center max-w-6xl mx-auto">
        <p className="text-slate-500">Đang tính toán số liệu...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 1. Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thống kê năng suất</h1>
          <p className="text-slate-500 text-sm">Chào bạn, hãy xem bạn đã nỗ lực thế nào nhé!</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(['week', 'month', 'year'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                type === t ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'week' ? '7 ngày qua' : t === 'month' ? '30 ngày qua' : '12 tháng qua'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Thẻ Overview */}
      <OverviewGrid 
        overview={{
          ...details.overview,
        }} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Biểu đồ chính (Bên trái) */}
        <div className="lg:col-span-2">
          <ChartSection data={details.chartTrend} />
        </div>

        {/* 4. Streak & Category (Bên phải) */}
        <div className="space-y-6">
          <StreakCheckIn status={overview.last7DaysStatus} />
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Theo danh mục</h3>
            <div className="space-y-4">
              {details.byCategory.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-medium text-slate-600">{cat.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{cat.completed}/{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
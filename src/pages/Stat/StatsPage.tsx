// src/pages/Stats/StatsPage.tsx
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { statsApi } from '../../api/stats.api';
import type { OverviewStats, DetailedStats } from '../../types/stat.type';

// Giả định đường dẫn import các components con của bạn
import { StatHeader } from './components/StatHeader';
import { OverviewGrid } from './components/Overview/OverviewGrid';
import { StreakCheckIn } from './components/Streak/StreakCheckIn';
import { ChartSection } from './components/Chart/ChartSection';

const StatsPage = () => {
  const [type, setType] = useState<'week' | 'month' | 'year'>('week');
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  
  const [streakData, setStreakData] = useState<OverviewStats | null>(null);
  const [detailedData, setDetailedData] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatsData = async () => {
      setLoading(true);
      try {
        const [streakResponse, detailedResponse] = await Promise.all([
          statsApi.getOverview(),
          statsApi.getDetailed(type, selectedDate)
        ]);

        setStreakData(streakResponse);
        setDetailedData(detailedResponse);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, [type, selectedDate]);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* 1. Header luôn được hiển thị, không bao giờ bị unmount. 
             Khi đổi type/selectedDate, dải ngày bên trong sẽ tự nhảy ngay lập tức */}
      <StatHeader 
        type={type} 
        setType={setType} 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
      />

      {/* 2. Xử lý hiển thị Content bên dưới */}
      {(!streakData || !detailedData) ? (
        // Chỉ hiển thị chữ "Đang tải" ở lần render đầu tiên (khi chưa có data)
        <div className="py-20 flex justify-center items-center text-slate-500 font-medium">
          Đang tải dữ liệu...
        </div>
      ) : (
        // HIỆU ỨNG: Thêm transform scale-[0.98] và duration-500 ease-out để tạo độ mượt
        <div className={`space-y-8 transition-all duration-500 ease-out transform ${
          loading ? 'opacity-40 scale-[0.98] pointer-events-none' : 'opacity-100 scale-100'
        }`}>
          <OverviewGrid 
            overview={{
              ...detailedData.overview,
            }} 
          />

          <StreakCheckIn 
            status={streakData.last7DaysStatus} 
            currentStreak={streakData.currentStreak} 
            longestStreak={streakData.longestStreak} 
          />

          <div className="lg:col-span-2">
            <ChartSection data={detailedData.chartTrend} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
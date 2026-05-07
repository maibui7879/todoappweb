import React, { useEffect, useState } from 'react';
import { statsApi } from '../../api/stats.api';
import type { OverviewStats, DetailedStats } from '../../types/stat.type';

// Giả định đường dẫn import các components con của bạn
import { StatHeader } from './components/StatHeader';
import { OverviewGrid } from './components/Overview/OverviewGrid';
import { StreakCheckIn } from './components/Streak/StreakCheckIn';
import { ChartSection } from './components/Chart/ChartSection';

const StatsPage = () => {
  const [type, setType] = useState<'week' | 'month' | 'year'>('week');
  
  // Tách riêng 2 state cho 2 API
  const [streakData, setStreakData] = useState<OverviewStats | null>(null);
  const [detailedData, setDetailedData] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatsData = async () => {
      setLoading(true);
      try {
        // Gọi 2 API song song để tối ưu tốc độ
        const [streakResponse, detailedResponse] = await Promise.all([
          statsApi.getOverview(),
          statsApi.getDetailed(type)
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
  }, [type]); // Gọi lại API chi tiết khi đổi tab Tuần/Tháng/Năm

  if (loading || !streakData || !detailedData) {
    return <div className="p-8 flex justify-center items-center h-screen text-slate-500 font-medium">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* 1. Header */}
      <StatHeader type={type} setType={setType} />

      {/* 2. Overview Row */}
      <OverviewGrid 
        overview={{
          ...detailedData.overview,
           // Lấy tỷ lệ hoàn thành từ API streak
        }} 
      />

      {/* 3. Streak Banner: Truyền dữ liệu thật từ API streakData */}
      <StreakCheckIn 
        status={streakData.last7DaysStatus} 
        currentStreak={streakData.currentStreak} 
        longestStreak={streakData.longestStreak} 
      />

      <div className="gap-8">
        {/* 4. Chart Section */}
        <div className="lg:col-span-2">
          <ChartSection data={detailedData.chartTrend} />
        </div>


        </div>
      </div>
  );
};

export default StatsPage;
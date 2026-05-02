import { StatHeader } from '../../components/Stats/StatHeader'; // Import đúng tên StatHeader (không s)
import { OverviewGrid } from '../../components/Stats/Overview/OverviewGrid';
//import { StreakCard } from '../../components/Stats/Streak/StreakCard';
//import { PerformanceChart } from '../../components/Stats/Chart/PerformanceChart';
import { useStat } from '../../hooks/useStat';

export const StatsPage = () => {
  // Lấy toàn bộ logic từ Controller (Hook)
  const { 
    period, 
    setPeriod, 
    dateRange, 
    currentDate, 
    onDateChange, 
    overviewData, 
    //streakData 
  } = useStat();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-[#f8faff] min-h-screen">
      {/* 1. Header & Filters (Phần bạn khoanh đỏ) */}
      <StatHeader 
        period={period} 
        setPeriod={setPeriod} 
        dateRange={dateRange}
        currentDate={currentDate}
        onDateChange={onDateChange}
      />
      
      {/* 2. Overview Grid (4 thẻ thống kê) */}
      {overviewData && <OverviewGrid overview={overviewData} />}
      
      {/* 3. Streak Card (Thông tin chuỗi ngày)
      {streakData && <StreakCard streak={streakData} />} */}
      
      {/* 4. Chart (Biểu đồ xu hướng) */}
      <div className="mt-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        {/* <PerformanceChart /> */}
      </div>

      {/* Footer Quote */}
      <p className="text-center text-gray-400 mt-12 italic text-sm">
        "Kỷ luật là cầu nối giữa mục tiêu và thành tựu." — Jim Rohn
      </p>
    </div>
  );
};

export default StatsPage;
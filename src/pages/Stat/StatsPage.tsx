import dayjs from 'dayjs';
import { useMemo } from 'react';
import { StatsHeader } from '../../components/Stats/StatHeader';
import { OverviewGrid } from '../../components/Stats/Overview/OverviewGrid';
import { useStatsManager } from '../../hooks/useStat';

const StatsPage = () => {
  const { data, isLoading, isError, period, setPeriod } = useStatsManager();

  const dateRange = useMemo(() => {
    if (!data?.meta) return '';
    return `${dayjs(data.meta.startDate).format('DD/MM/YYYY')} - ${dayjs(
      data.meta.endDate,
    ).format('DD/MM/YYYY')}`;
  }, [data]);

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <div className="px-8 py-8 max-w-6xl mx-auto">
        <StatsHeader period={period} setPeriod={setPeriod} dateRange={dateRange || 'Đang tải...'} />

        {isLoading ? (
          <div className="py-16 text-center text-gray-400">Đang tải dữ liệu thống kê...</div>
        ) : isError ? (
          <div className="py-16 text-center text-red-500">Không thể tải dữ liệu thống kê.</div>
        ) : data ? (
          <OverviewGrid overview={data.overview} />
        ) : (
          <div className="py-16 text-center text-gray-400">Không có dữ liệu thống kê.</div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;

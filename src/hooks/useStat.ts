import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { statsApi } from '../api/stats.api';
import type { OverviewResponse, StatsMeta } from '../types/stat.type';

export const useStat = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [meta, setMeta] = useState<StatsMeta | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await statsApi.getDashboard(period, currentDate.format('YYYY-MM-DD'));
        // Backend trả về { overview, meta, dailyTrend, ... }[cite: 2]
        setData(res.overview);
        setMeta(res.meta);
      } catch (error) {
        console.error("Lỗi fetch stats:", error);
      }
    };
    fetchStats();
  }, [period, currentDate]); // Tự động gọi lại khi đổi Tab hoặc chọn ngày trên lịch

  const formatUtcDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-GB', { timeZone: 'UTC' });

  return {
    period,
    setPeriod,
    currentDate: currentDate.format('YYYY-MM-DD'),
    onDateChange: (dateStr: string) => setCurrentDate(dayjs(dateStr)),
    overviewData: data,
    // Lấy range ngày trực tiếp từ Backend và hiển thị theo UTC để không bị lệch do timezone local
    dateRange: meta
      ? `${formatUtcDate(meta.startDate)} - ${formatUtcDate(meta.endDate)}`
      : '---'
  };
};
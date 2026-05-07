import { useState, useEffect } from 'react';
import { statsApi } from '../api/stats.api';
import type { OverviewStats, DetailedStats } from '../types/stat.type';

export const useStat = (type: 'week' | 'month' | 'year' = 'week', date?: string) => {
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [details, setDetails] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ovData, detData] = await Promise.all([
        statsApi.getOverview(),
        statsApi.getDetailed(type, date)
      ]);
      setOverview(ovData);
      setDetails(detData);
    } catch (error) {
      console.error("Lỗi tải thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type, date]);

  return { overview, details, loading, refetch: fetchData };
};
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api/stats.api';
import type { StatsResponse } from '../types/stat.type';

export const useStatsManager = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [date] = useState(() => new Date().toISOString().split('T')[0]);

  const query = useQuery<StatsResponse, Error, StatsResponse>({
    queryKey: ['stats', period, date],
    queryFn: () => statsApi.getDashboard(period, date),
  });

  return {
    period,
    setPeriod,
    date,
    ...query,
  };
};

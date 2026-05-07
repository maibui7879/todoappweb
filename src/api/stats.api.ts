import axiosClient from './axiosClient';
import type { StatsResponse, OverviewStats, DetailedStats } from '../types/stat.type';

export const statsApi = {
  // Lấy streak và 7 ngày gần nhất
  getOverview: (): Promise<OverviewStats> => {
    return axiosClient.get('/stats/streak');
  },
  // Lấy dữ liệu biểu đồ (tuần/tháng/năm)
  getDetailed: (type: 'week' | 'month' | 'year', date?: string): Promise<DetailedStats> => {
    return axiosClient.get('/stats', { params: { type, date } });
  },
  // Legacy method for backward compatibility
  getDashboard: (type: 'week' | 'month' | 'year', date: string): Promise<StatsResponse> =>
    axiosClient.get<StatsResponse, StatsResponse>('/stats', {
      params: { type, date },
    }),
};

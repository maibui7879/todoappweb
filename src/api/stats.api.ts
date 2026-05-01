import axiosClient from './axiosClient';
import type { StatsResponse } from '../types/stat.type';

export const statsApi = {
  getDashboard: (type: string, date: string): Promise<StatsResponse> =>
    axiosClient.get<StatsResponse, StatsResponse>('/stats', {
      params: { type, date },
    }),
};

import axiosClient from './axiosClient';

export const statsApi = {
  getDashboard: () => axiosClient.get('/stats/dashboard'),
};
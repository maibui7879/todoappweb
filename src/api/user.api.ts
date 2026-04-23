import axiosClient from './axiosClient';
import type { User, UpdateProfileDto } from '../types/user.type';

export const userApi = {
  // GET /users
  getAll: (): Promise<User[]> => 
    axiosClient.get('/users'),

  // GET /users/:id
  getOne: (id: string): Promise<User> => 
    axiosClient.get(`/users/${id}`),

  // PATCH /users/me
  // Đây là API quan trọng để cập nhật Profile từ giao diện
  updateMe: (data: UpdateProfileDto): Promise<User> => 
    axiosClient.patch('/users/me', data),

  // DELETE /users/:id
  delete: (id: string): Promise<any> => 
    axiosClient.delete(`/users/${id}`),
};
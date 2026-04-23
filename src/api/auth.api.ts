// src/api/auth.api.ts
import axiosClient from './axiosClient';
import type {
  LoginResponse,
  LoginDto,
  RegisterDto,
  RegisterResponse
} from '../types/auth.type';
import type { User } from '../types/user.type';

export const authApi = {
  // POST /auth/register
  register: (data: RegisterDto): Promise<RegisterResponse> =>
    axiosClient.post('/auth/register', data),

  // POST /auth/login
  login: (data: LoginDto): Promise<LoginResponse> =>
    axiosClient.post('/auth/login', data),

  // GET /auth/profile
  getProfile: (): Promise<User> =>
    axiosClient.get('/auth/profile'),
};
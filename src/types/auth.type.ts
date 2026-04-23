import type { User } from './user.type';

export interface LoginResponse {
  access_token: string; // Khớp với trả về của AuthService.login
}

// Dùng cho cả register và login request
export interface RegisterDto {
  email: string;
  password?: string;
  fullName: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}
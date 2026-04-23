import type { User } from './user.type';

// ✅ Response login (BE trả token)
export interface LoginResponse {
  access_token: string;
}

// ✅ Response register (BE trả message + userId)
export interface RegisterResponse {
  message: string;
  userId: string;
}

// ✅ DTO dùng cho register
export interface RegisterDto {
  email: string;
  password: string; // ❗ bắt buộc
  fullName: string;
}

// ✅ DTO dùng cho login
export interface LoginDto {
  email: string;
  password: string; // ❗ bắt buộc
}
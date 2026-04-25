import type { User } from "./user.type";

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

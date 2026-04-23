// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect,  } from 'react';
import { type ReactNode } from 'react';
import { type User } from '../types/user.type';
import { authApi } from '../api/auth.api';

// 1. Định nghĩa cấu trúc của Context
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Dùng để hiện loading lúc mới vào web
  login: (token: string, user: User) => void;
  logout: () => void;
}

// 2. Khởi tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Tạo Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true); // Mặc định là đang load

  // Tự động kiểm tra Token và lấy Profile khi lần đầu mở Web lên
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          // Gọi API /auth/profile để lấy thông tin user hiện tại
          const userData = await authApi.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Token không hợp lệ hoặc đã hết hạn');
          logout(); // Xóa sạch nếu lỗi
        }
      }
      setIsLoading(false); // Kết thúc quá trình kiểm tra
    };

    fetchProfile();
  }, [token]);

  // Hàm xử lý Đăng nhập
// Trong AuthContext.tsx

const login = async (accessToken: string) => {
  localStorage.setItem('token', accessToken);
  setToken(accessToken);
  
  try {
    // Ngay sau khi có token, gọi profile để lấy thông tin User đầy đủ
    const userData = await authApi.getProfile();
    setUser(userData);
  } catch (error) {
    logout();
    throw error;
  }
};
  // Hàm xử lý Đăng xuất
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom Hook để xài cho gọn
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};
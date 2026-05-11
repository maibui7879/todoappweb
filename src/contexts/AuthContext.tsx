// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { type ReactNode } from "react";
import { type User } from "../types/user.type";

// 1. Định nghĩa cấu trúc của Context
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// 2. Khởi tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Tạo Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Khôi phục user từ localStorage khi mở lại web
  const savedUser = localStorage.getItem("user");
  console.log('📦 SavedUser từ localStorage:', savedUser);
  const [user, setUser] = useState<User | null>(
    savedUser ? JSON.parse(savedUser) : null,
  );
  console.log('👤 User state:', user);

  // Tự động kiểm tra Token khi lần đầu mở web
  useEffect(() => {
    console.log('🔐 Kiểm tra Auth - Token:', !!token, 'User:', !!savedUser);
    if (!token) {
      console.log('⚪ Không có token, set isLoading = false');
      setIsLoading(false);
      return;
    }
    // Nếu có token nhưng không có user trong localStorage thì logout
    if (!localStorage.getItem("user")) {
      console.log('⚠️ Có token nhưng không có user, logout');
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoading(false);
      return;
    }
    console.log('✅ Auth check xong, set isLoading = false');
    setIsLoading(false);
  }, []);

  // Hàm xử lý Đăng nhập — nhận token + user từ login response
  const login = (accessToken: string, userData: User) => {
    console.log('🔑 Login - userData nhận được:', userData);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  };

  // Hàm xử lý Đăng xuất
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom Hook để xài cho gọn
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
};

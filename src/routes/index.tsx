import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// Các trang (Pages) - Bạn thay thế bằng các import thật của bạn
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import TasksPage from "../pages/tasks/TasksPage";
import StarredPage from "../pages/starred/StarredPage";
import OverduePage from "../pages/overdue/OverduePage";
import CategoryDetailPage from "../pages/category/CategoryDetailPage";
import StatsPage from "../pages/Stat/StatPage";
import NotificationsPage from "../pages/noti/NotificationsPage";
import ProfilePage from "../pages/auth/ProfilePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES (Auth) --- */}
      <Route path="/login" element={
        <AuthLayout type="login">
          <LoginPage />
        </AuthLayout>
      } />
      <Route path="/register" element={
        <AuthLayout type="register">
          <RegisterPage />
        </AuthLayout>
      } />

      {/* --- PROTECTED ROUTES (Main App) --- */}
      <Route path="/" element={<MainLayout />}>
        {/* Redirect mặc định vào trang Tasks */}
        <Route index element={<Navigate to="/tasks" replace />} />
        
        {/* Các trang cố định */}
        <Route path="tasks" element={<TasksPage />} />
        <Route path="starred" element={<StarredPage />} />
        <Route path="overdue" element={<OverduePage />} />
        
        {/* Route động cho danh mục */}
        <Route path="category/:categoryId" element={<CategoryDetailPage />} />
        
        {/* Các trang công cụ/cài đặt */}
        <Route path="stats" element={<StatsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* --- 404 NOT FOUND --- */}
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
};

export default AppRoutes;

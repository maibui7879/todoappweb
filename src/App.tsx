// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import MainLayout from "./layouts/MainLayout";
import TasksPage from "./pages/tasks/TasksPage";
import StarredPage from "./pages/starred/StarredPage";
import StatsPage from "./pages/Stat/StatsPage";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">
    {title} — coming soon
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/starred" element={<StarredPage />} />
          <Route path="/categories" element={<ComingSoon title="Danh mục" />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route
            path="/notifications"
            element={<ComingSoon title="Thông báo" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

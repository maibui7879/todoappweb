import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import NotificationPopover from "../pages/noti/components/NotificationPopover";
import { useNotification } from "../hooks/useNotifications"; 
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();

  return (
    <div className="flex flex-col h-screen bg-[#F4F6FB]">
      {/* HEADER */}
      <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-[99] w-full flex-shrink-0">
        <span className="text-lg font-semibold text-[#8B5CF6] tracking-wide uppercase">
          Xin chào, {user?.fullName || user?.email || "User"}
        </span>
        
        <div className="flex items-center gap-6">
          <NotificationPopover />

          <button
            onClick={() => logout()}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Đăng xuất"
          >
            <LogOut size={36} />
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-gray-600 hover:bg-[#EDE9FE] hover:text-[#8B5CF6] transition-all ml-1"
            title="Trang cá nhân"
          >
            <User size={20} />
          </button>
        </div>
      </header>

      {/* SIDEBAR + MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#C4B5FD] py-3 text-center text-xs text-white w-full flex-shrink-0">
        © 2026 Brand, Inc. • Privacy • Terms
      </footer>
    </div>
  );
};


export default MainLayout;

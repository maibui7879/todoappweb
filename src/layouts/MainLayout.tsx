// src/layouts/MainLayout.tsx
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [categoryOpen, setCategoryOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6FB]">
      {/* SIDEBAR */}
      <aside
        className="w-[220px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col"
        style={{ minHeight: "100vh" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <div className="w-7 h-7 rounded-lg bg-[#8B5CF6] flex items-center justify-center">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 11l3 3L22 4"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-bold text-gray-800 text-sm">To-do List</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
          {/* Danh sách việc cần làm */}
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
              ${isActive ? "bg-[#EDE9FE] text-[#7C3AED] font-medium" : "text-gray-600 hover:bg-gray-50"}`
            }
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            Danh sách việc cần làm
          </NavLink>

          {/* Có gắn dấu sao */}
          <NavLink
            to="/starred"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
              ${isActive ? "bg-[#EDE9FE] text-[#7C3AED] font-medium" : "text-gray-600 hover:bg-gray-50"}`
            }
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Có gắn dấu sao
          </NavLink>

          {/* Danh sách (dropdown) */}
          <div>
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Danh sách
              </div>
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                className={`transition-transform ${categoryOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {categoryOpen && (
              <div className="ml-4 mt-0.5 flex flex-col gap-0.5">
                <NavLink
                  to="/tasks"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                    ${isActive ? "bg-[#EDE9FE] text-[#7C3AED] font-medium" : "text-gray-500 hover:bg-gray-50"}`
                  }
                >
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] flex-shrink-0" />
                  Công việc
                </NavLink>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                    ${isActive ? "bg-[#EDE9FE] text-[#7C3AED] font-medium" : "text-gray-500 hover:bg-gray-50"}`
                  }
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  Danh mục
                </NavLink>
                <NavLink
                  to="/stats"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                    ${isActive ? "bg-[#EDE9FE] text-[#7C3AED] font-medium" : "text-gray-500 hover:bg-gray-50"}`
                  }
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  Thống kê
                </NavLink>
                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                    ${isActive ? "bg-[#EDE9FE] text-[#7C3AED] font-medium" : "text-gray-500 hover:bg-gray-50"}`
                  }
                >
                  <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                  Thông báo
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* User + Logout */}
        <div className="border-t border-gray-100 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#EDE9FE] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path
                  d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                  stroke="#7C3AED"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="7" r="4" stroke="#7C3AED" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-xs text-gray-600 truncate">
              {user?.fullName || user?.email || "User"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

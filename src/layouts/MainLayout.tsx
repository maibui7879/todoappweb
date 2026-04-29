// src/layouts/MainLayout.tsx
import { NavLink, Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-[#F4F6FB]">
      {/* SIDEBAR + CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-[220px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <svg
              width="32"
              height="32"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 25C20 15 30 10 40 10V90C30 90 20 80 20 70V25Z"
                fill="#0099E5"
              />
              <path
                d="M40 10C65 10 80 25 80 50C80 75 65 90 40 90V10Z"
                fill="#0099E5"
                fillOpacity="0.2"
              />
              <circle cx="65" cy="30" r="18" fill="#6366F1" />
              <circle cx="65" cy="70" r="18" fill="#F59E0B" />
            </svg>
            <span className="font-bold text-gray-900 text-base tracking-tight">
              To-do List
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5 overflow-y-auto">
            {/* Danh sách việc cần làm */}
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
                ${isActive ? "bg-[#EDE9FE] text-[#7C3AED] font-medium" : "text-gray-600 hover:bg-gray-50"}`
              }
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 11l3 3L22 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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

            {/* Thông báo */}
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
                ${isActive ? "bg-[#EDE9FE] text-[#7C3AED] font-medium" : "text-gray-600 hover:bg-gray-50"}`
              }
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.73 21a2 2 0 01-3.46 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Thông báo
            </NavLink>

            {/* Thống kê */}
            <NavLink
              to="/stats"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
                ${isActive ? "bg-[#EDE9FE] text-[#7C3AED] font-medium" : "text-gray-600 hover:bg-gray-50"}`
              }
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 20V10M12 20V4M6 20v-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Thống kê
            </NavLink>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#C4B5FD] py-3 text-center text-xs text-white w-full flex-shrink-0">
        © 2026 Brand, Inc. • Privacy • Terms • Sitemap
      </footer>
    </div>
  );
};

export default MainLayout;

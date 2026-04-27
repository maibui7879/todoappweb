// src/layouts/MainLayout.tsx
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const MainLayout = () => {
  const [categoryOpen, setCategoryOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-[#F4F6FB]">
      {/* SIDEBAR + CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-[220px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-full">
          {/* LOGO */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            {/* Icon */}
            <div className="relative w-10 h-10 flex-shrink-0">
              {/* Blue shape */}
              <div className="absolute left-0 top-[4px] w-[16px] h-[32px] bg-[#1296DB] rounded-tl-full rounded-br-full" />

              {/* Purple circle */}
              <div className="absolute right-[2px] top-0 w-[18px] h-[18px] rounded-full bg-[#5B67F2]" />

              {/* Orange circle */}
              <div className="absolute right-[2px] bottom-[2px] w-[18px] h-[18px] rounded-full bg-[#F5A623]" />
            </div>

            {/* Text */}
            <span className="font-extrabold text-[18px] text-gray-900 tracking-tight leading-none">
              To-do List
            </span>
          </div>

          {/* NAV */}
          <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5 overflow-y-auto">
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
                ${
                  isActive
                    ? "bg-[#EDE9FE] text-[#7C3AED] font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`
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

            <NavLink
              to="/starred"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
                ${
                  isActive
                    ? "bg-[#EDE9FE] text-[#7C3AED] font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`
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

            {/* DROPDOWN */}
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
                  className={`transition-transform ${
                    categoryOpen ? "rotate-180" : ""
                  }`}
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
                  {[
                    { to: "/tasks", color: "bg-[#8B5CF6]", label: "Công việc" },
                    {
                      to: "/categories",
                      color: "bg-blue-400",
                      label: "Danh mục",
                    },
                    { to: "/stats", color: "bg-green-400", label: "Thống kê" },
                    {
                      to: "/notifications",
                      color: "bg-orange-400",
                      label: "Thông báo",
                    },
                  ].map(({ to, color, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                        ${
                          isActive
                            ? "bg-[#EDE9FE] text-[#7C3AED] font-medium"
                            : "text-gray-500 hover:bg-gray-50"
                        }`
                      }
                    >
                      <span className={`w-2 h-2 rounded-full ${color}`} />
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* MAIN */}
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

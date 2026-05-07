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

            {/* Danh sách dropdown */}
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
                  {[
                    // {
                    //   to: "/categories",
                    //   color: "bg-blue-400",
                    //   label: "Danh mục",
                    // },
                    { to: "/stats", 
                      color: "bg-green-400", 
                      label: "Thống kê" },
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
                      ${isActive ? "bg-[#EDE9FE] text-[#7C3AED] font-medium" : "text-gray-500 hover:bg-gray-50"}`
                      }
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${color} flex-shrink-0`}
                      />
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* FOOTER - full width */}
      <footer className="bg-[#C4B5FD] py-3 text-center text-xs text-white w-full flex-shrink-0">
        © 2026 Brand, Inc. • Privacy • Terms • Sitemap
      </footer>
    </div>
  );
};

export default MainLayout;
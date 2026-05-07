// src/components/Stats/StatHeader.tsx
import { useAuth } from "../../../contexts/AuthContext";

interface StatHeaderProps {
  type: 'week' | 'month' | 'year';
  setType: (type: 'week' | 'month' | 'year') => void;
}

export const StatHeader = ({ type, setType }: StatHeaderProps) => {
  const tabs = [
    { id: 'week', label: 'Tuần' },
    { id: 'month', label: 'Tháng' },
    { id: 'year', label: 'Năm' },
  ] as const;
  const { user } = useAuth();
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Thống kê</h1>
        <p className="text-slate-500 text-sm mt-1.5 font-medium">
          Chào {user?.fullName || 'bạn'}, hãy xem bạn đã nỗ lực thế nào nhé!
        </p>
      </div>
      
      <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setType(tab.id)}
            className={`px-7 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
              type === tab.id 
                ? 'bg-white text-blue-600 shadow-md shadow-slate-200/50' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
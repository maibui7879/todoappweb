import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: any[];
}

export const ChartSection = ({ data }: ChartProps) => {
  return (
    // THAY ĐỔI: h-[300px] trên mobile, sm:h-[450px] trên màn hình lớn
    <div className="bg-white p-5 sm:p-7 rounded-[20px] sm:rounded-[32px] shadow-sm border border-slate-50 h-[300px] sm:h-[450px] flex flex-col">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-[17px] font-extrabold text-slate-800">Xu hướng hoàn thành</h3>
        <p className="text-slate-400 text-[11px] sm:text-xs mt-0.5 sm:mt-1">Theo dõi số lượng công việc hoàn thành theo thời gian</p>
      </div>
      
      <div className="flex-1 w-full -ml-4 sm:ml-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="completed" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCompleted)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
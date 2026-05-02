import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import { CalendarOutlined } from '@ant-design/icons';
import type { StatsHeaderProps } from '../../types/stat.type';

export const StatHeader = ({ period, setPeriod, dateRange, currentDate, onDateChange }: StatsHeaderProps) => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#7c3aed' } }}>
      <div className="flex items-center justify-between py-6">
        <h1 className="text-2xl font-bold text-slate-800">Thống kê hiệu suất</h1>
        
        {/* Badge hiển thị khoảng ngày */}
        <div className="bg-violet-100 text-violet-600 px-4 py-1.5 rounded-full text-sm font-medium">
          {dateRange} {/* Giá trị này giờ là do Backend quyết định và Hook truyền xuống[cite: 2] */}
        </div>

        <div className="flex items-center gap-4">
          {/* Thanh chọn Tab */}
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
            {(['week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  period === p 
                    ? 'bg-white shadow-sm text-violet-600 border-b-2 border-violet-600 rounded-none' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {p === 'week' ? 'Tuần' : p === 'month' ? 'Tháng' : 'Năm'}
              </button>
            ))}
          </div>

          {/* Bộ chọn ngày mốc */}
          <DatePicker 
            value={dayjs(currentDate)}
            onChange={(date) => date && onDateChange(date.format('YYYY-MM-DD'))}
            allowClear={false}
            suffixIcon={<CalendarOutlined />}
            className="rounded-xl h-[42px] border-slate-200"
            format="DD/MM/YYYY"
          />
        </div>
      </div>
    </ConfigProvider>
  );
};
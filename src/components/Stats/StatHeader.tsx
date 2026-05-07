import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import { CalendarOutlined } from '@ant-design/icons';
import type { StatsHeaderProps } from '../../types/stat.type';

export const StatHeader = ({ period, setPeriod, dateRange, currentDate, onDateChange }: StatsHeaderProps) => {
  return (
    <ConfigProvider theme={{ 
      token: { 
        colorPrimary: '#7c3aed',
        borderRadius: 12,
      } 
    }}>
      <div className="flex flex-col gap-4 py-6">
        {/* Row 1: Title & Badge */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-[36px] leading-[40px] font-[800] font-['Archivo'] bg-gradient-to-r from-[#5BB0E5] to-[#7174E4] bg-clip-text text-transparent">
              Hiệu suất công việc
            </h1>
            <p className="text-[#7198E5] mt-2 font-medium text-[15px] italic">
              Phân tích chi tiết và theo dõi tiến độ công việc hàng ngày của bạn.
            </p>
          </div>

          {/* Badge khoảng ngày - Dùng chung Gradient cho đồng bộ */}
          <div className="bg-gradient-to-r from-[#60A5FA] to-[#7174E4] text-white px-6 py-2 rounded-2xl text-sm font-bold shadow-lg shadow-blue-100/50">
            {dateRange}
          </div>
        </div>

        {/* Row 2: Tabs & DatePicker */}
        <div className="flex items-center justify-end gap-4 mt-2">
          {/* Thanh chọn Tab style Gradient đồng bộ */}
          <div className="flex bg-[#F8FAFC] p-1.5 rounded-2xl shadow-inner border border-gray-100">
            {(['week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-8 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  period === p
                    ? 'bg-gradient-to-r from-[#60A5FA] to-[#8B5CF6] text-white shadow-md shadow-indigo-200'
                    : 'text-gray-400 hover:text-indigo-400'
                }`}
              >
                {p === 'week' ? 'Tuần' : p === 'month' ? 'Tháng' : 'Năm'}
              </button>
            ))}
          </div>

          {/* Bộ chọn ngày mốc - Gradient Xanh-Tím */}
          <div className="relative group">
            <DatePicker
              value={dayjs(currentDate)}
              onChange={(date) => date && onDateChange(date.format('YYYY-MM-DD'))}
              allowClear={false}
              suffixIcon={<CalendarOutlined className="text-white group-hover:scale-110 transition-transform" />}
              className="rounded-2xl h-[48px] border-none bg-gradient-to-r from-[#60A5FA] to-[#8B5CF6] text-white font-bold px-5 shadow-lg shadow-blue-100 hover:shadow-indigo-200"
              format="DD/MM/YYYY"
              inputReadOnly
              placeholder="Chọn ngày"
              style={{ color: 'white' }}
            />
            <span className="absolute left-4 top-[-10px] bg-white px-2 text-[10px] font-[800] text-indigo-400 border border-indigo-50 rounded-md shadow-sm">
              NGÀY MỐC
            </span>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};
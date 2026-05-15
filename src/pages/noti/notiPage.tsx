import { useState, useEffect } from "react";
import { Typography, Card, Button, Space, Input, Dropdown, Checkbox, type MenuProps } from "antd";
import { SearchOutlined, StarFilled, SettingOutlined, BellOutlined } from "@ant-design/icons";
import { useNotification } from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import NotificationTable from "./components/NotificationTable";

const { Title, Text } = Typography;

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { notifications, loadHistory, readNotification, markAllAsRead } = useNotification();
  
  const [params, setParams] = useState({ 
    keyword: "", 
    isImportant: undefined as boolean | undefined 
  });
  
  // Quản lý các cột đang hiển thị
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['status', 'title', 'message', 'level', 'createdAt', 'action']);

  useEffect(() => {
    loadHistory({ keyword: params.keyword, isImportant: params.isImportant, limit: 100 });
  }, [params, loadHistory]);

  // LOGIC CẤU HÌNH CỘT (PHẦN BẠN ĐANG THIẾU)
  const menuProps: MenuProps = {
    items: [
      { key: 'status', label: 'Trạng thái' },
      { key: 'title', label: 'Tiêu đề' },
      { key: 'message', label: 'Nội dung' },
      { key: 'level', label: 'Mức độ' },
      { key: 'createdAt', label: 'Thời gian' },
      { key: 'action', label: 'Thao tác' },
    ].map(item => ({
      key: item.key,
      label: (
        <Checkbox 
          className="hover:text-violet-600 transition-colors"
          checked={visibleColumns.includes(item.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setVisibleColumns([...visibleColumns, item.key]);
            } else {
              // Đảm bảo không ẩn hết tất cả các cột
              if (visibleColumns.length > 1) {
                setVisibleColumns(visibleColumns.filter(k => k !== item.key));
              }
            }
          }}
        >
          <span className="font-medium text-gray-600">{item.label}</span>
        </Checkbox>
      ),
    })),
    // Style cho dropdown menu tím lịm
    style: {
      padding: '8px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.1), 0 8px 10px -6px rgba(139, 92, 246, 0.1)',
    }
  };

  return (
    <div className="p-8 bg-[#FDFDFF] min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header trang */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-100">
                <BellOutlined className="text-2xl" />
              </div>
              <Title level={1} style={{ margin: 0 }} className="font-black text-gray-900">
                Thông báo <Text className="text-violet-600 text-3xl font-black">({notifications.filter((n) => !n.isRead).length})</Text>
              </Title>
            </div>
            <Text className="text-gray-500 font-medium text-base">
              Theo dõi và quản lý các cập nhật quan trọng từ hệ thống To-do List
            </Text>
          </div>
          
          <Button 
            type="primary" 
            className="h-12 px-8 rounded-2xl font-bold bg-violet-600 hover:bg-violet-700 border-none shadow-md shadow-violet-100"
            onClick={markAllAsRead}
          >
            Đánh dấu tất cả là đã đọc
          </Button>
        </div>

        <Card className="rounded-[36px] border-none shadow-[0_20px_60px_rgba(139,92,246,0.06)] overflow-hidden">
          
          {/* Toolbar lọc */}
          <div className="flex justify-between items-center mb-8 p-3">
            <Space size="middle">
              <Input 
                placeholder="Tìm từ khóa hoặc tiêu đề..." 
                prefix={<SearchOutlined className="text-violet-300" />} 
                className="w-80 h-12 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-1 focus:ring-violet-100 transition-all"
                allowClear
                onChange={(e) => setParams({...params, keyword: e.target.value})}
              />
              <Button 
                className={`h-12 px-6 rounded-2xl flex items-center font-bold transition-all 
                  ${params.isImportant 
                    ? 'bg-purple-600 text-white border-none shadow-sm shadow-purple-200' 
                    : 'bg-violet-50 text-violet-600 border border-violet-100 hover:bg-violet-100'}`}
                icon={<StarFilled />} 
                onClick={() => setParams({...params, isImportant: params.isImportant ? undefined : true})}
              >
                {params.isImportant ? "Đang lọc QUAN TRỌNG" : "Chỉ xem Quan trọng"}
              </Button>
            </Space>

            {/* Dropdown cấu hình cột */}
            <Dropdown 
              menu={menuProps} 
              trigger={['click']} 
              placement="bottomRight"
              overlayClassName="custom-dropdown-violet"
            >
              <Button 
                icon={<SettingOutlined />} 
                className="h-12 px-6 rounded-2xl text-gray-500 font-medium border-gray-100 bg-white hover:text-violet-600 hover:border-violet-200 transition-all"
              >
                Cấu hình cột
              </Button>
            </Dropdown>
          </div>

          {/* Bảng dữ liệu */}
          <NotificationTable 
            data={notifications} 
            visibleColumns={visibleColumns}
            onRead={readNotification}
            onNavigate={(id) => navigate(`/tasks?taskId=${id}`)}
          />
        </Card>
      </div>

      <style>{`
        /* Custom màu tím cho checkbox của Ant Design */
        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #7C3AED !important;
          border-color: #7C3AED !important;
        }
        .ant-checkbox-wrapper:hover .ant-checkbox-inner {
          border-color: #7C3AED !important;
        }

        .ant-table-thead > tr > th {
          background: #FDFDFF !important;
          color: #9CA3AF !important;
          font-size: 11px !important;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 1px solid #F3F4F6 !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #F9FAFB !important;
          padding: 16px !important;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #F9F9FF !important;
        }
        
        .ant-table-body::-webkit-scrollbar {
          width: 6px;
        }
        .ant-table-body::-webkit-scrollbar-thumb {
          background: #EDE9FE;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
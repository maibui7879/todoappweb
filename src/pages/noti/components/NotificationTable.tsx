import { Table, Tag, Space, Button, Tooltip, Badge, Typography } from "antd";
import { ClockCircleOutlined, EyeOutlined, StarFilled } from "@ant-design/icons";
import { type Notification } from "../../../types/notification.type";
import dayjs from "dayjs";

const { Text } = Typography;

interface Props {
  data: Notification[];
  visibleColumns: string[];
  onRead: (id: string) => void;
  onNavigate: (taskId: string) => void;
}

const NotificationTable = ({ data, visibleColumns, onRead, onNavigate }: Props) => {
  const allColumns = [
    {
      title: "Trạng thái",
      dataIndex: "isRead",
      key: "status",
      width: 130,
      render: (isRead: boolean) => (
        isRead ? 
        <Tag color="default" className="rounded-full text-xs">Đã đọc</Tag> : 
        <Badge status="processing" text={<Text strong className="text-blue-600 text-sm">Mới</Text>} />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 130 ,
      render: (text: string, record: Notification) => (
        <Text strong={!record.isRead} className={`${record.isImportant ? "text-violet-600" : "text-gray-800"} text-base`}>
          {text}
        </Text>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      render: (text: string) => <span className="text-sm text-gray-600">{text}</span>
    },
    {
      title: "Mức độ",
      dataIndex: "isImportant",
      key: "level",
      width: 140,
      render: (isImportant: boolean) => (
        isImportant ? 
        <Tag icon={<StarFilled />} color="purple" className="font-bold border-none shadow-sm text-xs">QUAN TRỌNG</Tag> : 
        <Tag color="blue" className="border-none opacity-70 text-xs">Thường</Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: (a: Notification, b: Notification) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (date: string) => (
        <Space className="text-gray-400 text-sm font-medium">
          <ClockCircleOutlined size={14} />
          {dayjs(date).format("HH:mm DD/MM/YYYY")}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 80,
      render: (_: any, record: Notification) => (
        <Tooltip title="Đi đến Task">
          <Button 
            type="text" 
            shape="circle" 
            className="text-indigo-600 hover:bg-indigo-50"
            icon={<EyeOutlined size={18} />} 
            onClick={(e) => {
              e.stopPropagation(); // Ngăn sự kiện onClick của row
              onRead(record._id);
              if (record.taskId) onNavigate(record.taskId);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const columns = allColumns.filter(col => visibleColumns.includes(col.key));

  return (
    <>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="_id"
        className="custom-large-font-table" // Thêm class để apply CSS bên dưới
        pagination={{ pageSize: 8, position: ['bottomCenter'] }}
        onRow={(record) => ({
          onClick: () => onRead(record._id),
        })}
        rowClassName={(record) => 
          `cursor-pointer transition-all hover:bg-indigo-50/50 ${!record.isRead ? 'bg-indigo-50/20' : ''}`
        }
      />

      <style>{`
        /* Tăng cỡ chữ chung của Header */
        .custom-large-font-table .ant-table-thead > tr > th {
          font-size: 14px !important;
          padding: 12px 16px !important; /* Giảm padding để chữ to không làm phình bảng */
        }

        /* Tăng cỡ chữ chung của các ô nội dung */
        .custom-large-font-table .ant-table-tbody > tr > td {
          font-size: 15px !important; 
          padding: 10px 16px !important; /* Thu nhỏ padding dọc */
        }

        /* Chỉnh lại icon cho cân đối với chữ to */
        .custom-large-font-table .anticon {
          font-size: 16px;
        }
        .custom-large-font-table .ant-typography {
          font-size: inherit; 
        }
      `}</style>
    </>
  );
};

export default NotificationTable;
import { useState, useEffect } from 'react';
import { List, Badge, Tag, Input, Checkbox, Button, Card, Typography, Space } from 'antd';
import { BellOutlined, StarFilled, ClockCircleOutlined } from '@ant-design/icons';
import { useNotification } from '../../hooks/useNotifications';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;

const NotificationsPage = () => {
  const { notifications, loadHistory, readNotification, markAllAsRead } = useNotification();
  const [params, setParams] = useState({
    keyword: '',
    isImportant: false
  });

  // Mỗi khi params thay đổi, gọi lại API từ backend
  useEffect(() => {
    loadHistory(params);
  }, [params, loadHistory]);

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>
            <BellOutlined /> Thông báo
          </Title>
          <Button type="link" onClick={markAllAsRead}>Đánh dấu tất cả đã đọc</Button>
        </div>

        {/* Bộ lọc chuyên nghiệp */}
        <Space direction="vertical" style={{ width: '100%', marginBottom: '24px' }} size="middle">
          <div style={{ display: 'flex', gap: '16px' }}>
            <Search
              placeholder="Tìm kiếm thông báo..."
              onSearch={(value) => setParams({ ...params, keyword: value })}
              style={{ flex: 1 }}
              allowClear
            />
            <Card size="small" style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox 
                checked={params.isImportant}
                onChange={(e) => setParams({ ...params, isImportant: e.target.checked })}
              >
                <Text strong><StarFilled style={{ color: '#fadb14' }} /> Chỉ xem quan trọng</Text>
              </Checkbox>
            </Card>
          </div>
        </Space>

        {/* Danh sách thông báo */}
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              onClick={() => readNotification(item._id)}
              style={{
                cursor: 'pointer',
                backgroundColor: item.isRead ? 'transparent' : '#f0f5ff',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '12px',
                transition: 'all 0.3s',
                borderLeft: item.isImportant ? '4px solid #722ed1' : 'none'
              }}
              className="notification-item"
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={!item.isRead}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      backgroundColor: item.isImportant ? '#f9f0ff' : '#e6f7ff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.isImportant ? '#722ed1' : '#1890ff'
                    }}>
                      <BellOutlined />
                    </div>
                  </Badge>
                }
                title={
                  <Space>
                    <Text strong={!item.isRead}>{item.title}</Text>
                    {item.isImportant && <Tag color="purple">QUAN TRỌNG</Tag>}
                    {item.message.toLowerCase().includes('hạn') && <Tag color="red">SẮP ĐẾN HẠN</Tag>}
                  </Space>
                }
                description={
                  <div style={{ marginTop: '4px' }}>
                    <Text type={item.isRead ? "secondary" : undefined}>{item.message}</Text>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
                      <ClockCircleOutlined /> {dayjs(item.createdAt).fromNow()}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};
export default NotificationsPage;
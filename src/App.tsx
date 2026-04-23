import React from 'react';
import { Button, DatePicker, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function App() {
  return (
    //Đây là test giao diện chính của App, sử dụng Tailwind để dàn layout và Antd để tạo các component UI. 
    // Mục đích là để kiểm tra xem Tailwind và Antd có hoạt động tốt cùng nhau không, và để tạo một giao diện cơ bản cho ứng dụng quản lý công việc.
    // Khi thực hiện dự án, xóa đi các component này và thay thế bằng các component thực tế của ứng dụng.
    // Dùng Tailwind để dàn layout (h-screen, flex, bg, padding...)
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      
      {/* Dùng Tailwind để tạo bóng và bo góc cho khung */}
      <Card className="w-full max-w-md shadow-lg rounded-2xl border-none">
        
        <h1 className="text-2xl font-bold text-center text-primary mb-6">
          To-do List Test
        </h1>

        <div className="flex flex-col gap-4">
          {/* Dùng Component của Antd */}
          <DatePicker 
            className="w-full py-2" 
            placeholder="Chọn ngày làm việc" 
          />

          {/* Nút bấm của Antd kết hợp class của Tailwind để ghi đè độ rộng */}
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            Thêm công việc mới
          </Button>
        </div>

      </Card>
    </div>
  );
}

export default App;
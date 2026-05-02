// src/pages/auth/RegisterPage.tsx
import { Form, Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/Auth/AuthLayout';
import { authApi } from '../../api/auth.api';

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      // bỏ confirmPassword trước khi gửi lên BE
      const { confirmPassword, ...payload } = values;

      const res = await authApi.register(payload);

      // debug nếu cần
      console.log('REGISTER RES:', res);

      message.success(res.message || 'Đăng ký thành công');

      // chuyển về login (SPA chuẩn)
      navigate('/');

    } catch (err: any) {
      console.log('REGISTER ERROR:', err?.response?.data);

      message.error(
        err?.response?.data?.message ||
        err?.message ||
        'Đăng ký thất bại'
      );
    }
  };

  return (
    <AuthLayout type="register">
      <Form layout="vertical" onFinish={onFinish}>
        
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="example.email@gmail.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 8, message: 'Tối thiểu 8 ký tự' }, // ✅ match BE
          ]}
        >
          <Input.Password
            placeholder="Enter at least 8+ characters"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không khớp'));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Nhập lại mật khẩu"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          className="h-11 bg-indigo-600 hover:bg-indigo-700"
        >
          Đăng ký
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default RegisterPage;
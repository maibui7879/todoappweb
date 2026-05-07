// src/pages/auth/LoginPage.tsx
import { Form, Input, Button, Checkbox, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { authApi } from "../../api/auth.api";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: any) => {
    try {
      const res = await authApi.login(values);
      login(res.accessToken, res.user);
      message.success("Đăng nhập thành công");
      navigate("/tasks");
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Email hoặc mật khẩu không đúng",
      );
    }
  };

  return (
    <AuthLayout type="login">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="example.email@gmail.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 8, message: "Tối thiểu 8 ký tự" },
          ]}
        >
          <Input.Password
            placeholder="Enter at least 8+ characters"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <div className="flex justify-between items-center mb-4">
          <Checkbox defaultChecked>Nhớ mật khẩu</Checkbox>
          <span className="text-indigo-600 text-sm cursor-pointer">
            Quên mật khẩu?
          </span>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          block
          className="h-11 bg-indigo-600 hover:bg-indigo-700"
        >
          Đăng nhập
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default LoginPage;

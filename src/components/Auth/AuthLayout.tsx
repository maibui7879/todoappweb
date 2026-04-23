// src/components/Auth/AuthLayout.tsx

interface Props {
  children: React.ReactNode;
  type: 'login' | 'register';
}

const AuthLayout = ({ children, type }: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 animate-[fadeIn_0.6s_ease-in-out]">
      <div className="w-full max-w-6xl h-[650px] bg-white rounded-2xl shadow-lg flex overflow-hidden border border-gray-200">

        {/* LEFT */}
        <div className="w-1/2 p-10 flex flex-col justify-between">

          {/* Header */}
          <div className="flex justify-between items-center">

            {/* LOGO IMAGE */}
            <img 
              src="/logo.png" 
              alt="logo" 
              className="h-12 object-contain"
            />

            <div className="text-sm text-gray-500">
              {type === 'login' ? 'Bạn chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
              <a
                href={type === 'login' ? '/register' : '/'}
                className="text-indigo-600 font-medium hover:underline"
              >
                {type === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
              </a>
            </div>
          </div>

          {/* FORM */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm animate-[slideUp_0.6s_ease]">
              <h2 className="text-3xl font-bold text-center mb-8">
                {type === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </h2>

              {children}
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="w-1/2 bg-[#6C63FF] flex items-center justify-center">

          {/* ẢNH CHÍNH */}
          <img
            src="/photo.png"
            alt="illustration"
            className="w-[200%] max-w-[500px] object-contain animate-[float_3s_ease-in-out_infinite]"
          />

        </div>

      </div>
    </div>
  );
};

export default AuthLayout;
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Bạn có thể khai báo mã màu chuẩn của app vào đây sau này
      colors: {
        primary: '#8B5CF6', // Màu tím chủ đạo của UI
      }
    },
  },
  plugins: [],
}
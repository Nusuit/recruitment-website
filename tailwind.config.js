// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Các đường dẫn đến tất cả các file template, component JSX/TSX, HTML, và SCSS của bạn
  // Tailwind sẽ quét các file này để tìm các class tiện ích và chỉ tạo CSS cho những class được sử dụng.
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html,scss}", // Quan trọng: thêm .scss vào đây
    "./public/index.html", // Nếu bạn có file HTML tĩnh
  ],
  theme: {
    extend: {
      // Tại đây bạn có thể mở rộng theme mặc định của Tailwind
      // Ví dụ: thêm class max-w-4/5 tùy chỉnh
      maxWidth: {
        "4/5": "80%", // Định nghĩa class max-w-4/5 tương đương với max-width: 80%
      },
      // Bạn có thể thêm màu sắc, font chữ, breakpoint, v.v.
      // colors: {
      //   'custom-blue': '#007bff',
      // },
    },
  },
  plugins: [
    // Tại đây bạn có thể thêm các plugin của Tailwind, ví dụ: @tailwindcss/forms, @tailwindcss/typography
    // require('@tailwindcss/forms'),
  ],
};

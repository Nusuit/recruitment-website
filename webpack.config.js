// webpack.config.js
const path = require("path");
// Nếu bạn muốn tách CSS ra file riêng thay vì inject vào <style>
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // ... (entry, output, devServer, etc. của bạn)
  entry: "./src/index.js", // Điểm bắt đầu của ứng dụng
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), // Thư mục output
    publicPath: "/", // Quan trọng cho devServer và routing
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"), // Phục vụ file tĩnh từ thư mục public
    },
    compress: true,
    port: 3000,
    hot: true, // Bật Hot Module Replacement
    historyApiFallback: true, // Quan trọng cho Single Page Applications
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Xử lý các file .js và .jsx
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Sử dụng Babel để biên dịch JavaScript hiện đại
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"], // Preset cho React và ES6+
          },
        },
      },
      {
        test: /\.(scss|css)$/, // Xử lý cả file .scss và .css
        use: [
          // MiniCssExtractPlugin.loader, // Sử dụng thay cho 'style-loader' nếu muốn tách CSS
          "style-loader", // 3. Inject CSS vào DOM (thông qua thẻ <style>)

          {
            loader: "css-loader", // 2. Phiên dịch @import và url() thành require/import
            options: {
              importLoaders: 2, // Số lượng loader được áp dụng trước css-loader trên @imported resources
              // (postcss-loader, sass-loader)
              sourceMap: true, // Bật source map cho CSS để dễ debug
            },
          },
          {
            loader: "postcss-loader", // 1.b. Xử lý CSS với PostCSS (bao gồm Tailwind)
            options: {
              postcssOptions: {
                // Không cần khai báo plugins ở đây nữa nếu đã có postcss.config.js
                // config: path.resolve(__dirname, 'postcss.config.js'), // Hoặc chỉ định đường dẫn tường minh
              },
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader", // 1.a. Biên dịch SCSS sang CSS
            options: {
              implementation: require("sass"), // Ưu tiên dùng Dart Sass
              sourceMap: true,
              // sassOptions: {
              //   includePaths: [path.resolve(__dirname, 'src/styles/some-other-path')], // Thêm đường dẫn tìm kiếm cho @import
              // },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Xử lý các file hình ảnh
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i, // Xử lý các file font
        type: "asset/resource",
      },
    ],
  },
  // plugins: [
  //   new MiniCssExtractPlugin({ // Nếu bạn dùng MiniCssExtractPlugin
  //     filename: 'styles/[name].[contenthash].css',
  //   }),
  //   // ... (các plugin khác như HtmlWebpackPlugin)
  // ],
  resolve: {
    extensions: [".js", ".jsx", ".scss", ".css"], // Cho phép import không cần ghi phần mở rộng
    // alias: { // Tạo alias cho đường dẫn import dễ dàng hơn
    //   '@components': path.resolve(__dirname, 'src/components'),
    //   '@styles': path.resolve(__dirname, 'src/styles'),
    // }
  },
  // ... (các cấu hình khác như optimization, devtool)
  devtool: "eval-source-map", // Hoặc 'source-map' cho production
};

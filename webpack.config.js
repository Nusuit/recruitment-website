// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack"); // Import webpack
require("dotenv").config(); // Tải biến môi trường từ file .env (nếu có)

module.exports = {
  mode: "development", // Chỉ định mode (nên có)
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true, // Tự động dọn dẹp thư mục dist trước khi build
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    // Hiển thị lỗi trực tiếp trên trình duyệt (overlay)
    client: {
      overlay: {
        errors: true,
        warnings: false, // Đặt là true nếu muốn xem cả cảnh báo
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2, // 2 = postcss-loader + sass-loader
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {}, // Sẽ tự động tìm postcss.config.js
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"), // Dùng Dart Sass
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "body",
    }),
    // Plugin để định nghĩa biến môi trường cho phía client
    new webpack.DefinePlugin({
      "process.env.REACT_APP_API_URL": JSON.stringify(
        process.env.REACT_APP_API_URL || "http://localhost:8080/api"
      ),
      // Bạn có thể định nghĩa thêm các biến khác nếu cần
      // 'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".scss", ".css"],
  },
  devtool: "eval-source-map", // Bật source map để dễ debug
};

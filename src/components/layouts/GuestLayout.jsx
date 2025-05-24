// src/components/layouts/GuestLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom"; // Sử dụng Outlet cho nested routes
import Header from "../common/Header";
import Footer from "../common/Footer";
// import PropTypes from 'prop-types'; // Không cần thiết cho functional component đơn giản này

const GuestLayout = () => {
  // Chuyển thành functional component
  return (
    <div className="flex flex-col min-h-screen">
      <Header />{" "}
      {/* userType sẽ được quản lý bên trong Header dựa trên AuthContext */}
      <main className="flex-1 w-full">
        <Outlet /> {/* Nội dung của các route con sẽ được render ở đây */}
      </main>
      <Footer />
    </div>
  );
};

// GuestLayout.propTypes = {
//   children: PropTypes.node, // Outlet sẽ thay thế children trực tiếp
// };

export default GuestLayout;

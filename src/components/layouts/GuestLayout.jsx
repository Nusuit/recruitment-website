import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

const GuestLayout = () => {
  return (
    <div className="guest-layout">
      <Header userType="guest" />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;
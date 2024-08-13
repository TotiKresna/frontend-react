import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC = () => {
  return (
    <Sidebar>
      <Header />
      <Outlet />
      <Footer />
    </Sidebar>
  );
};

export default Layout;
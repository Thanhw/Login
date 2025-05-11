import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Outlet để render component con của route
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import MusicPlayer from '../MusicPlayer/MusicPlayer'; // Thêm Music Player
import './Layout.css'; // File CSS cho Layout

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State quản lý đóng/mở sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Navbar />
        <div className="page-content">
           {/* Outlet sẽ render component tương ứng với route hiện tại */}
           <Outlet />
        </div>
        <Footer />
      </div>
      {/* Music Player luôn hiển thị ở dưới cùng */}
      <MusicPlayer />
    </div>
  );
}

export default Layout;
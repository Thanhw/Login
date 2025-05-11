import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-column">
        {/* // Nội dung cột 1 */}
        <p>Copyright © 2024 by Nhóm 1 - TTCS. </p>
        <p>All Rights Reserved. Website designed for educational purposes.</p>
        {/* Thêm nội dung khác nếu cần */}
      </div>
      <div className="footer-column">
         {/* // Nội dung cột 2 */}
         <p>Liên hệ:</p>
         <p>Email: contact@yourdomain.com</p>
         <p>Điện thoại: 123-456-7890</p>
         {/* Thêm link mạng xã hội, etc. */}
      </div>
    </footer>
  );
}

export default Footer;
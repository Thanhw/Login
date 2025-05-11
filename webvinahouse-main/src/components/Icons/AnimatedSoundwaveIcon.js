import React from 'react';
import './AnimatedSoundwaveIcon.css'; // Import CSS riêng cho icon này

function AnimatedSoundwaveIcon({ width = 16, height = 16, color = '#1DB954' }) {
  // color = '#1DB954' là màu xanh lá cây như mô tả ban đầu
  return (
    <svg
      className="soundwave-icon"
      width={width}
      height={height}
      viewBox="0 0 16 16" // ViewBox để dễ scale, tỉ lệ với width/height mặc định
      fill={color} // Đặt màu fill mặc định ở đây
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 4 vạch dọc (rectangles) */}
      {/* Các giá trị x, width, animation-delay được điều chỉnh để tạo hiệu ứng */}
      <rect className="soundwave-bar" x="1" y="0" width="2" height="16" />
      <rect className="soundwave-bar" x="5" y="0" width="2" height="16" />
      <rect className="soundwave-bar" x="9" y="0" width="2" height="16" />
      <rect className="soundwave-bar" x="13" y="0" width="2" height="16" />
    </svg>
  );
}

export default AnimatedSoundwaveIcon;
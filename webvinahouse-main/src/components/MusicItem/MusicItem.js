import React, { useState, useRef, useEffect } from 'react';
import './MusicItem.css';

function MusicItem({ item, onClick }) {
   // backend: item có id, title, artist, image
  const [isOverflowing, setIsOverflowing] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      const element = titleRef.current;
      if (element) {
        // Kiểm tra xem chiều rộng scroll có lớn hơn chiều rộng client không
        setIsOverflowing(element.scrollWidth > element.clientWidth);
      }
    };
    checkOverflow();
    // Có thể thêm resize listener để kiểm tra lại khi cửa sổ thay đổi kích thước
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [item.title]); // Kiểm tra lại khi title thay đổi


  return (
    <div className="music-item" onClick={onClick}>
      <img src={item.image || '/assets/placeholder-song.png'} alt={item.title} className="music-item-image" />
      <div className="music-item-info">
        <div
          ref={titleRef}
          className={`music-item-title font-regular ${isOverflowing ? 'overflow-scroll-animation' : ''}`}
          title={item.title} // Tooltip hiển thị tên đầy đủ khi hover
         >
          {item.title}
        </div>
        <p className="music-item-artist font-light">{item.artist}</p> {/* Giả sử font light cho artist */}
      </div>
    </div>
  );
}

export default MusicItem;
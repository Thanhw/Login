import React from 'react';
import MusicItem from '../MusicItem/MusicItem'; // Component cho từng bài hát
import './GridList.css';

function GridList({ items = [], onItemClick }) {
   // backend: cấu trúc item cần có id, title, artist, image
  return (
    <div className="grid-list-container">
      {items.map((item, index) => (
         // Thêm khoảng cách trực quan giữa 2 grid (4 item đầu và 4 item sau)
         // Thêm một div trống hoặc margin lớn hơn cho item thứ 5 (index 4)
        <React.Fragment key={item.id}>
           {index === 4 && <div className="grid-spacer"></div>}
           <MusicItem
               item={item}
               onClick={() => onItemClick && onItemClick(item)}
            />
        </React.Fragment>
      ))}
    </div>
  );
}

export default GridList;
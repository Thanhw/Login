import React from 'react';
import './HorizontalScrollList.css';

function HorizontalScrollList({ items = [], onItemClick }) {
  // backend: cấu trúc item cần có id, name, image
  return (
    <div className="horizontal-scroll-container">
      {items.map((item) => (
        <div
          key={item.id}
          className="scroll-item"
          onClick={() => onItemClick && onItemClick(item)}
        >
          <img src={item.image || '/assets/placeholder.png'} alt={item.name} className="scroll-item-image" />
          <p className="scroll-item-name font-regular">{item.name}</p>
        </div>
      ))}
    </div>
  );
}

export default HorizontalScrollList;
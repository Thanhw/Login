import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HorizontalScrollList from '../HorizontalScrollList/HorizontalScrollList';
import GridList from '../GridList/GridList';
import './CategorySection.css';

function CategorySection({
  title,
  type, // 'horizontal' hoặc 'grid'
  items = [], // Danh sách các item (playlist, dj, hoặc bài hát)
  viewAllLink, // Link cho tiêu đề (nếu có)
  onItemClick, // Hàm xử lý khi click vào item (playlist, dj, bài hát)
  initialItemCount, // Số item hiển thị ban đầu (chỉ cho grid)
  loadMoreIncrement // Số item load thêm (chỉ cho grid)
}) {
  const [visibleItemCount, setVisibleItemCount] = useState(initialItemCount || items.length);

  const handleLoadMore = () => {
    setVisibleItemCount(prevCount => Math.min(prevCount + loadMoreIncrement, items.length));
  };

  const hasMoreItems = type === 'grid' && visibleItemCount < items.length;

  const TitleComponent = viewAllLink ? Link : 'div';

  return (
    <section className="category-section">
      <TitleComponent to={viewAllLink || '#'} className="category-title text-uppercase">
         {title}
      </TitleComponent>

      <div className="category-content">
        {type === 'horizontal' && (
          <HorizontalScrollList items={items} onItemClick={onItemClick} />
        )}
        {type === 'grid' && (
          <GridList items={items.slice(0, visibleItemCount)} onItemClick={onItemClick} />
        )}
      </div>

      {/* Nút "Xem thêm" chỉ cho grid */}
      {type === 'grid' && hasMoreItems && (
        <button onClick={handleLoadMore} className="load-more-button">
          XEM THÊM
        </button>
      )}
    </section>
  );
}

export default CategorySection;
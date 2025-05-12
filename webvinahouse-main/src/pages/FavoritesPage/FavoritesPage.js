import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MusicItem from '../../components/MusicItem/MusicItem';
import './FavoritesPage.css';

function FavoritesPage() {
  const currentUser = useMemo(() => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : {};
    } catch (err) {
      console.error('Lỗi khi parse user từ localStorage:', err);
      return {};
    }
  }, []); // Chỉ chạy một lần khi component mount

  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser || !currentUser.username) return;

    setIsLoading(true);
    setError(null);

    console.log('Bắt đầu tải danh sách yêu thích...');
    const timer = setTimeout(() => {
      try {
        setFavoriteSongs([
          { id: 't1', title: 'Vaicaunoicokhiennguoithaydoi', artist: 'GREY D x tlinh', image: '/assets/song1.png' },
          { id: 's102', title: 'Leave The Door Open', artist: 'Bruno Mars, Anderson .Paak, Silk Sonic', image: '/assets/song2.png' },
          { id: 't3', title: 'See Tình', artist: 'Hoàng Thùy Linh', image: '/assets/song1.png' },
          { id: 's105', title: 'Có hẹn với thanh xuân', artist: 'MONSTAR', image: '/assets/song1.png'},
          { id: 't8', title: 'Waiting For You', artist: 'MONO', image: '/assets/song2.png'},
        ]);
        setIsLoading(false);
        console.log('Tải danh sách yêu thích hoàn tất.');
      } catch (err) {
        console.error('Lỗi trong setTimeout:', err);
        setError('Lỗi khi tải danh sách yêu thích.');
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser]); // Chỉ chạy khi currentUser thay đổi

  const handlePlaySong = (song) => {
    console.log("Phát bài hát yêu thích:", song);
  };

  if (!currentUser || !currentUser.username) {
    return <div className="favorites-page-error">Bạn cần <Link to="/login">đăng nhập</Link> để xem mục này.</div>;
  }

  if (isLoading) {
    return <div className="favorites-page-loading">Đang tải danh sách yêu thích...</div>;
  }

  if (error) {
    return <div className="favorites-page-error">Lỗi: {error}</div>;
  }

  return (
    <div className="favorites-page-container">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link>  Yêu thích
      </div>
      <h1 className="favorites-title">Bài hát Yêu thích</h1>
      {favoriteSongs.length > 0 ? (
        <div className="favorites-songs-grid">
          {favoriteSongs.map(song => (
            <MusicItem
              key={song.id}
              item={song}
              onClick={() => handlePlaySong(song)}
            />
          ))}
        </div>
      ) : (
        <p>Bạn chưa có bài hát yêu thích nào.</p>
      )}
    </div>
  );
}

export default FavoritesPage;
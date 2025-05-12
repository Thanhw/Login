import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MusicItem from '../../components/MusicItem/MusicItem';
import './MyPlaylistPage.css';

function MyPlaylistPage() {
  const currentUser = useMemo(() => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : {};
    } catch (err) {
      console.error('Lỗi khi parse user từ localStorage:', err);
      return {};
    }
  }, []);

  const [songs, setSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser || !currentUser.username) return;

    setIsLoading(true);
    setError(null);

    console.log('Bắt đầu tải playlist...');
    const timer = setTimeout(() => {
      try {
        setPlaylistName("Playlist Của Tôi");
        setSongs([
          { id: 's201', title: 'Bài hát tự thêm 1', artist: 'Nghệ sĩ A', image: '/assets/song1.png' },
          { id: 's202', title: 'Track yêu thích trong playlist', artist: 'Nghệ sĩ B', image: '/assets/song2.png' },
          { id: 's203', title: 'Một chút EDM', artist: 'DJ X', image: '/assets/song1.png' },
          { id: 's204', title: 'Ballad cuối tuần', artist: 'Ca sĩ Y', image: '/assets/song2.png' },
        ]);
        setIsLoading(false);
        console.log('Tải playlist hoàn tất.');
      } catch (err) {
        console.error('Lỗi trong setTimeout:', err);
        setError('Lỗi khi tải playlist.');
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser]);

  const handlePlaySong = (song) => {
    console.log("Phát bài hát từ My Playlist:", song);
  };

  if (!currentUser || !currentUser.username) {
    return <div className="myplaylist-page-error">Bạn cần <Link to="/login">đăng nhập</Link> để xem mục này.</div>;
  }

  if (isLoading) {
    return <div className="myplaylist-page-loading">Đang tải {playlistName}...</div>;
  }

  if (error) {
    return <div className="myplaylist-page-error">Lỗi: {error}</div>;
  }

  return (
    <div className="myplaylist-page-container">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link>  {playlistName}
      </div>
      <h1 className="myplaylist-title">{playlistName}</h1>
      {songs.length > 0 ? (
        <div className="myplaylist-songs-grid">
          {songs.map(song => (
            <MusicItem
              key={song.id}
              item={song}
              onClick={() => handlePlaySong(song)}
            />
          ))}
        </div>
      ) : (
        <p>Playlist này của bạn hiện đang trống.</p>
      )}
    </div>
  );
}

export default MyPlaylistPage;
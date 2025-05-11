// src/pages/PlaylistPage/PlaylistPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// import apiClient from '../../services/api'; // Import nếu dùng axios
import MusicItem from '../../components/MusicItem/MusicItem'; // Tái sử dụng component bài hát
import './PlaylistPage.css'; // File CSS riêng cho trang Playlist

function PlaylistPage() {
  // Lấy playlistId từ URL
  const { playlistId } = useParams();
  // Đổi tên state cho phù hợp
  const [playlistInfo, setPlaylistInfo] = useState(null); // Thông tin Playlist
  const [songs, setSongs] = useState([]); // Danh sách bài hát trong Playlist
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state khi playlistId thay đổi
    setIsLoading(true);
    setError(null);
    setPlaylistInfo(null);
    setSongs([]);

    // Hàm fetch dữ liệu Playlist chi tiết
    const fetchPlaylistData = async () => {
      // // --- BỎ COMMENT KHI CÓ API ---
      // // backend: Cần API endpoint dạng /api/playlists/{playlistId}/ để lấy thông tin playlist và danh sách bài hát
      // try {
      //   // const response = await apiClient.get(`/playlists/${playlistId}`);
      //   // // backend: API cần trả về object chứa thông tin playlist và mảng các bài hát (đầy đủ thông tin bài hát)
      //   // if (response.data) {
      //   //   setPlaylistInfo(response.data.playlistInfo); // Ví dụ: { name, description, cover_image_url, creator_name? }
      //   //   setSongs(response.data.songs);            // Ví dụ: [{ id, title, artist, image }, ...]
      //   // } else {
      //   //   setError('Không tìm thấy dữ liệu cho Playlist này.');
      //   // }
      // } catch (err) {
      //   console.error("Lỗi fetch dữ liệu Playlist:", err);
      //   setError('Đã có lỗi xảy ra khi tải dữ liệu.');
      // } finally {
      //   setIsLoading(false);
      // }
      // // --- KẾT THÚC PHẦN API THẬT ---


      // --- DỮ LIỆU GIẢ LẬP (XÓA KHI CÓ API) ---
      console.log("Đang fetch data cho Playlist ID:", playlistId);
      setTimeout(() => {
          // Dữ liệu giả dựa trên playlistId
          if (playlistId === 'pl1' || playlistId === 'chill-hits') {
              setPlaylistInfo({
                  name: 'Chill Hits',
                  // backend: nên cung cấp url ảnh bìa (có thể vuông)
                  cover_image_url: '/assets/playlist-img1.png', // Placeholder image
                  description: 'Những bản nhạc US-UK và V-Pop nhẹ nhàng giúp bạn thư giãn sau những giờ làm việc căng thẳng. Cập nhật thường xuyên.',
                  creator_name: 'VinaHouse Team' // Ví dụ: tên người tạo
              });
              // Danh sách bài hát giả lập cho playlist này
              setSongs([
                  { id: 's101', title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', image: '/assets/song1.png' },
                  { id: 's102', title: 'Leave The Door Open', artist: 'Bruno Mars, Anderson .Paak, Silk Sonic', image: '/assets/song2.png' },
                  { id: 's103', title: 'Ánh Sao Và Bầu Trời', artist: 'T.R.I', image: '/assets/song1.png'},
                  { id: 's104', title: 'Peaches', artist: 'Justin Bieber ft. Daniel Caesar, Giveon', image: '/assets/song2.png'},
                  { id: 's105', title: 'Có hẹn với thanh xuân', artist: 'MONSTAR', image: '/assets/song1.png'},
                  { id: 's106', title: 'Butter', artist: 'BTS', image: '/assets/song2.png'},
                  { id: 's107', title: 'Bước Qua Nhau', artist: 'Vũ.', image: '/assets/song1.png'},
                  { id: 's108', title: 'Good 4 U', artist: 'Olivia Rodrigo', image: '/assets/song2.png'},
              ]);
          } else if (playlistId === 'pl2' || playlistId === 'v-pop') {
               setPlaylistInfo({
                  name: 'V-Pop Không Thể Thiếu',
                  cover_image_url: '/assets/playlist-img2.png',
                  description: 'Tuyển tập những bản hit V-Pop đình đám nhất mọi thời đại mà bạn không thể bỏ qua.',
                  creator_name: 'VinaHouse Team'
              });
               setSongs([
                  { id: 't1', title: 'Vaicaunoicokhiennguoithaydoi', artist: 'GREY D x tlinh', image: '/assets/song1.png'},
                  { id: 't2', title: 'Để Mị Nói Cho Mà Nghe', artist: 'Hoàng Thùy Linh', image: '/assets/song2.png'},
                  { id: 't3', title: 'See Tình', artist: 'Hoàng Thùy Linh', image: '/assets/song1.png'},
                  { id: 't4', title: 'Mang Tiền Về Cho Mẹ', artist: 'Đen Vâu ft. Nguyên Thảo', image: '/assets/song2.png'},
                  // ... thêm bài hát khác
               ]);
          }
          else {
               setError('Không tìm thấy thông tin cho Playlist này (ID giả lập).');
          }
          setIsLoading(false);
      }, 1000);
      // --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---
    };

    fetchPlaylistData();

  }, [playlistId]); // Dependency là playlistId

  // Hàm xử lý khi click vào bài hát
  const handlePlaySong = (song) => {
      console.log("Phát bài hát từ Playlist:", song);
      // // todo: Tích hợp với MusicPlayer
      // // Có thể cần gửi cả context của playlist vào player để xử lý next/previous trong playlist
      // playerContext.playTrack(song, songs); // Ví dụ: gửi cả danh sách bài hát
  };

  // Hiển thị loading
  if (isLoading) {
    return <div className="playlist-page-loading">Đang tải dữ liệu Playlist...</div>;
  }

  // Hiển thị lỗi
  if (error) {
    return <div className="playlist-page-error">Lỗi: {error}</div>;
  }

  // Hiển thị nếu không có thông tin playlist
  if (!playlistInfo) {
      return <div className="playlist-page-error">Không tìm thấy thông tin Playlist.</div>;
  }

  // Render giao diện chính
  return (
    // Đổi class container
    <div className="playlist-page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        {/* Thay đổi text và link */}
        <Link to="/">Trang chủ</Link> &gt; <Link to="/playlists">Playlist</Link> &gt; {playlistInfo.name}
      </div>

      {/* Phần thông tin Playlist */}
      {/* Đổi class section */}
      <div className="playlist-info-section">
        {/* Đổi class ảnh và alt text */}
        <img src={playlistInfo.cover_image_url || '/assets/default-playlist-cover.png'} alt={`Bìa playlist ${playlistInfo.name}`} className="playlist-cover-image" />
        {/* Đổi class details */}
        <div className="playlist-details">
          {/* Có thể thêm chữ "PLAYLIST" nhỏ phía trên tên */}
          {/* <p className="playlist-label text-uppercase">Playlist</p> */}
          {/* Đổi class tên */}
          <h1 className="playlist-name">{playlistInfo.name}</h1>
          {/* Đổi class mô tả */}
          <p className="playlist-description">{playlistInfo.description}</p>
          {/* Hiển thị người tạo nếu có */}
          {playlistInfo.creator_name && <p className="playlist-creator">Tạo bởi: {playlistInfo.creator_name}</p>}
          {/* Có thể thêm nút Play All, tổng số bài hát,... */}
        </div>
      </div>

      {/* Phần danh sách bài hát */}
      {/* Đổi class section và grid */}
      <div className="playlist-songs-section">
        {/* <h2 className="section-title">Danh sách bài hát</h2> */}
        {songs.length > 0 ? (
          <div className="playlist-songs-grid">
            {songs.map(song => (
              <MusicItem
                key={song.id}
                item={song}
                onClick={() => handlePlaySong(song)}
              />
            ))}
          </div>
        ) : (
          <p>Playlist này chưa có bài hát nào.</p>
        )}
        {/* Trang Playlist thường không có nút "Xem thêm" ở đây */}
      </div>
    </div>
  );
}

export default PlaylistPage;
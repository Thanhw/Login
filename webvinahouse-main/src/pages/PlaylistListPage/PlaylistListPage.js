// src/pages/PlaylistListPage/PlaylistListPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import apiClient from '../../services/api'; // Import nếu dùng axios
import './PlaylistListPage.css'; // File CSS riêng

// Component nhỏ để hiển thị một Playlist trong grid
function PlaylistGridItem({ playlist }) {
    const navigate = useNavigate();

    const handlePlaylistClick = () => {
        // Điều hướng đến trang chi tiết Playlist (sẽ tạo sau)
        navigate(`/playlist/${playlist.id}`);
    };

    return (
        <div className="playlist-grid-item" onClick={handlePlaylistClick}>
            {/* // backend: playlist.image_url nên là ảnh vuông */}
            <img src={playlist.image_url || '/assets/default-playlist-square.png'} alt={playlist.name} className="playlist-grid-image" />
            <p className="playlist-grid-name">{playlist.name}</p>
        </div>
    );
}


function PlaylistListPage() {
    // Thay đổi tên state từ djs thành playlists
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllPlaylists = async () => {
            setIsLoading(true);
            setError(null);
            // // --- BỎ COMMENT KHI CÓ API ---
            // // backend: Cần API endpoint dạng /api/playlists/ để lấy danh sách tất cả Playlist (id, name, image_url)
            // try {
            //     // const response = await apiClient.get('/playlists'); // Gọi API playlists
            //     // setPlaylists(response.data || []); // Cập nhật state playlists
            // } catch (err) {
            //     console.error("Lỗi fetch danh sách Playlist:", err);
            //     setError('Không thể tải danh sách Playlist.');
            // } finally {
            //     setIsLoading(false);
            // }
            // // --- KẾT THÚC PHẦN API THẬT ---

            // --- DỮ LIỆU GIẢ LẬP (XÓA KHI CÓ API) ---
            setTimeout(() => {
                // Thay thế dữ liệu giả lập DJ bằng Playlist
                setPlaylists([
                    { id: 'pl1', name: 'Chill Hits', image_url: '/assets/playlist-img1.png' },
                    { id: 'pl2', name: 'V-Pop Không Thể Thiếu', image_url: '/assets/playlist-img2.png' },
                    { id: 'pl3', name: 'Acoustic Thư Giãn', image_url: '/assets/playlist-img1.png' },
                    { id: 'pl4', name: 'US-UK Now', image_url: '/assets/playlist-img2.png' },
                    { id: 'pl5', name: 'Indie Việt Hay Nhất', image_url: '/assets/playlist-img1.png' },
                    { id: 'pl6', name: 'Nhạc Hoa Chọn Lọc', image_url: '/assets/playlist-img2.png' },
                    { id: 'pl7', name: 'Rap Việt Cực Chất', image_url: '/assets/playlist-img1.png' },
                    { id: 'pl8', name: 'EDM Drop The Bass', image_url: '/assets/playlist-img2.png' },
                    { id: 'pl9', name: 'Nhạc Phim Hàn Quốc', image_url: '/assets/playlist-img1.png' },
                    { id: 'pl10', name: 'Workout Motivation', image_url: '/assets/playlist-img2.png' },
                    { id: 'pl11', name: 'Lofi Cho Ngày Mưa', image_url: '/assets/playlist-img1.png'},
                    { id: 'pl12', name: 'Nhạc Chơi Game', image_url: '/assets/playlist-img2.png' },
                ]);
                setIsLoading(false);
            }, 500); // Giả lập chờ 0.5 giây
            // --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---
        };

        fetchAllPlaylists();
    }, []);

    if (isLoading) {
        // Thay đổi text loading
        return <div className="playlist-list-loading">Đang tải danh sách Playlist...</div>;
    }

    if (error) {
        // Thay đổi text lỗi
        return <div className="playlist-list-error">Lỗi: {error}</div>;
    }

    return (
        // Thay đổi class container chính
        <div className="playlist-list-page-container">
            {/* Breadcrumb hoặc Tiêu đề trang */}
            <div className="breadcrumb">
                {/* Thay đổi text và link */}
                <Link to="/">Trang chủ</Link> &gt; Playlist
            </div>
             {/* Thay đổi tiêu đề */}
            <h1 className="playlist-list-title">Playlist Không thể thiếu</h1>

            {/* Lưới hiển thị Playlist */}
             {/* Thay đổi class grid */}
            <div className="playlist-list-grid">
                {playlists.map(playlist => (
                    // Sử dụng PlaylistGridItem
                    <PlaylistGridItem key={playlist.id} playlist={playlist} />
                ))}
            </div>
            {playlists.length === 0 && !isLoading && (
                 // Thay đổi text
                 <p>Không tìm thấy Playlist nào.</p>
            )}
        </div>
    );
}

export default PlaylistListPage;
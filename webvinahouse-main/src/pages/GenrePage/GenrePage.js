// src/pages/GenrePage/GenrePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
// import apiClient from '../../services/api'; // Import nếu dùng axios
import MusicItem from '../../components/MusicItem/MusicItem'; // Tái sử dụng component hiển thị bài hát
import './GenrePage.css'; // File CSS riêng

// Hàm helper để định dạng tên thể loại từ URL param (ví dụ: 'nhac-viet-hot' -> 'Nhạc Việt Hot')
const formatGenreName = (slug) => {
  if (!slug) return '';
  // Thay thế gạch ngang bằng khoảng trắng và viết hoa chữ cái đầu mỗi từ
  return slug.replace(/-/g, ' ').replace(/(?:^|\s)\S/g, char => char.toUpperCase());
};

function GenrePage() {
  const { genreName: genreSlug } = useParams(); // Lấy slug thể loại từ URL, đổi tên thành genreSlug
  const [songs, setSongs] = useState([]); // State lưu danh sách bài hát
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // State cho phân trang
  const [hasMore, setHasMore] = useState(true); // State kiểm tra còn bài hát để tải không
  const [isLoadingMore, setIsLoadingMore] = useState(false); // State cho nút "Xem thêm"

  const formattedGenreName = formatGenreName(genreSlug); // Định dạng tên thể loại để hiển thị

  // Hàm fetch dữ liệu bài hát (có phân trang)
  const fetchSongs = useCallback(async (pageNum = 1) => {
    if (pageNum === 1) {
      setIsLoading(true); // Chỉ loading toàn trang khi tải trang đầu
    } else {
      setIsLoadingMore(true); // Loading cho nút "Xem thêm"
    }
    setError(null);

    // // --- BỎ COMMENT KHI CÓ API ---
    // // backend: Cần API endpoint hỗ trợ lấy bài hát theo genreSlug và phân trang
    // // Ví dụ: /api/genres/{genreSlug}/songs?page={pageNum}&limit=10 (limit=10 ví dụ)
    // try {
    //   // const response = await apiClient.get(`/genres/${genreSlug}/songs`, {
    //   //   params: { page: pageNum, limit: 10 } // Ví dụ lấy 10 bài mỗi lần
    //   // });
    //   // const newSongs = response.data.songs || [];
    //   // const totalPages = response.data.totalPages || 1; // API cần trả về tổng số trang hoặc dấu hiệu hết trang

    //   // setSongs(prevSongs => pageNum === 1 ? newSongs : [...prevSongs, ...newSongs]); // Nếu là trang 1 thì thay thế, ngược lại thì nối vào
    //   // setHasMore(pageNum < totalPages); // Kiểm tra xem còn trang tiếp theo không
    //   // setPage(pageNum);

    // } catch (err) {
    //   console.error("Lỗi fetch bài hát theo thể loại:", err);
    //   setError('Không thể tải danh sách bài hát.');
    //   // backend: Xử lý lỗi cụ thể
    // } finally {
    //   setIsLoading(false);
    //   setIsLoadingMore(false);
    // }
    // // --- KẾT THÚC PHẦN API THẬT ---

    // --- DỮ LIỆU GIẢ LẬP (XÓA KHI CÓ API) ---
    console.log(`Workspaceing page ${pageNum} for genre: ${genreSlug}`);
    setTimeout(() => {
        let newSongs = [];
        // Giả lập dữ liệu cho một số thể loại
        if (genreSlug === 'nhac-co' && pageNum <= 2) { // Giả lập 2 trang cho Nhạc Cổ
            const startId = (pageNum - 1) * 8; // Giả sử mỗi trang 8 bài
             newSongs = [
                { id: `t${startId + 51}`, title: `Giai Điệu Vượt Thời Gian ${pageNum}`, artist: `Nghệ sĩ Cổ ${startId+1}`, image: '/assets/song1.png'},
                { id: `t${startId + 52}`, title: `Hoài Niệm Xưa ${pageNum}`, artist: `Nghệ sĩ Cổ ${startId+2}`, image: '/assets/song2.png'},
                { id: `t${startId + 53}`, title: `Tình Ca Bất Hủ ${pageNum}`, artist: `Danh Ca Cổ ${startId+3}`, image: '/assets/song1.png'},
                { id: `t${startId + 54}`, title: `Vọng Về Quá Khứ ${pageNum}`, artist: `Nhạc Sĩ Cổ ${startId+4}`, image: '/assets/song2.png'},
                { id: `t${startId + 55}`, title: `Nhạc Vàng Chọn Lọc ${pageNum}`, artist: `Nghệ sĩ Cổ ${startId+5}`, image: '/assets/song1.png'},
                { id: `t${startId + 56}`, title: `Nhạc Trữ Tình ${pageNum}`, artist: `Nghệ sĩ Cổ ${startId+6}`, image: '/assets/song2.png'},
                { id: `t${startId + 57}`, title: `Bolero Ngọt Ngào ${pageNum}`, artist: `Nghệ sĩ Cổ ${startId+7}`, image: '/assets/song1.png'},
                { id: `t${startId + 58}`, title: `Tình Ca Dang Dở ${pageNum}`, artist: `Nghệ sĩ Cổ ${startId+8}`, image: '/assets/song2.png'},
            ];
            setHasMore(pageNum < 2); // Giả sử chỉ có 2 trang
        } else if (genreSlug === 'nhac-viet-hot' && pageNum <= 1) { // Giả lập 1 trang cho Nhạc Việt
             newSongs = [
                { id: 't1', title: 'Vaicaunoicokhiennguoithaydoi', artist: 'GREY D x tlinh', image: '/assets/song1.png'},
                { id: 't2', title: 'Để Mị Nói Cho Mà Nghe', artist: 'Hoàng Thùy Linh', image: '/assets/song2.png'},
                { id: 't3', title: 'See Tình', artist: 'Hoàng Thùy Linh', image: '/assets/song1.png'},
                { id: 't4', title: 'Mang Tiền Về Cho Mẹ', artist: 'Đen Vâu ft. Nguyên Thảo', image: '/assets/song2.png'},
                { id: 't5', title: 'Ngày Đầu Tiên', artist: 'Đức Phúc', image: '/assets/song1.png'},
                { id: 't6', title: 'Ánh Sao Và Bầu Trời', artist: 'T.R.I', image: '/assets/song2.png'},
                { id: 't7', title: 'Chạy Về Khóc Với Anh', artist: 'ERIK', image: '/assets/song1.png'},
                { id: 't8', title: 'Waiting For You', artist: 'MONO', image: '/assets/song2.png'},
             ];
             setHasMore(false); // Chỉ có 1 trang
        }
         else {
             // Thể loại khác không có dữ liệu giả lập hoặc đã hết trang
             setHasMore(false);
         }

        setSongs(prevSongs => pageNum === 1 ? newSongs : [...prevSongs, ...newSongs]);
        setPage(pageNum);
        setIsLoading(false);
        setIsLoadingMore(false);
    }, 1000); // Giả lập chờ 1 giây
    // --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---

  }, [genreSlug]); // Dependency là genreSlug

  // Fetch dữ liệu lần đầu khi component mount hoặc genreSlug thay đổi
  useEffect(() => {
    setSongs([]); // Xóa bài hát cũ khi chuyển genre
    setPage(1);   // Reset về trang 1
    setHasMore(true); // Đặt lại hasMore
    fetchSongs(1); // Gọi fetch trang đầu tiên
  }, [fetchSongs]); // useEffect này phụ thuộc vào fetchSongs (đã dùng useCallback)

  // Hàm để tải thêm bài hát
  const loadMoreSongs = () => {
    if (!isLoadingMore && hasMore) {
      fetchSongs(page + 1); // Fetch trang tiếp theo
    }
  };

  // Hàm xử lý khi click vào bài hát
  const handlePlaySong = (song) => {
      console.log("Phát bài hát thể loại:", song);
      // // todo: Tích hợp với MusicPlayer
      // playerContext.playTrack(song);
  };

  // Hiển thị loading ban đầu
  if (isLoading) {
    return <div className="genre-page-loading">Đang tải bài hát thể loại {formattedGenreName}...</div>;
  }

  // Hiển thị lỗi
  if (error) {
    return <div className="genre-page-error">Lỗi: {error}</div>;
  }

  // Render giao diện
  return (
    <div className="genre-page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> &gt; <Link to="/genres">Thể loại</Link> &gt; {formattedGenreName}
      </div>

      {/* Tiêu đề thể loại */}
      <h1 className="genre-title">{formattedGenreName}</h1>

      {/* Lưới bài hát 2 cột */}
      {songs.length > 0 ? (
        <div className="genre-songs-grid">
          {songs.map(song => (
            <MusicItem
              key={song.id}
              item={song}
              onClick={() => handlePlaySong(song)}
            />
          ))}
        </div>
      ) : (
        <p>Không có bài hát nào thuộc thể loại này.</p>
      )}

      {/* Nút Xem Thêm */}
      {hasMore && (
        <button
          className="load-more-button genre-load-more"
          onClick={loadMoreSongs}
          disabled={isLoadingMore} // Disable nút khi đang tải
        >
          {isLoadingMore ? 'Đang tải...' : 'XEM THÊM'}
        </button>
      )}
    </div>
  );
}

export default GenrePage;
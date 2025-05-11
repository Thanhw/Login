// src/pages/DJPage/DJPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams để lấy djId từ URL, Link để tạo breadcrumb
// import apiClient from '../../services/api'; // Import nếu dùng axios
import MusicItem from '../../components/MusicItem/MusicItem'; // Tái sử dụng component hiển thị bài hát
import './DJPage.css'; // File CSS riêng cho trang này

function DJPage() {
  const { djId } = useParams(); // Lấy giá trị của :djId từ URL
  const [djInfo, setDjInfo] = useState(null); // State lưu thông tin DJ
  const [songs, setSongs] = useState([]); // State lưu danh sách bài hát
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state khi djId thay đổi (nếu người dùng chuyển từ DJ này sang DJ khác)
    setIsLoading(true);
    setError(null);
    setDjInfo(null);
    setSongs([]);

    // Hàm fetch dữ liệu
    const fetchDJData = async () => {
      // // --- BỎ COMMENT KHI CÓ API ---
      // // backend: Cần API endpoint dạng /api/djs/{djId}/ để lấy thông tin chi tiết DJ (tên, ảnh, mô tả) và danh sách bài hát của họ
      // try {
      //   // const response = await apiClient.get(`/djs/${djId}`); // Gọi API với djId lấy từ URL
      //   // // backend: API cần trả về object chứa thông tin DJ và mảng các bài hát
      //   // if (response.data) {
      //   //   setDjInfo(response.data.djInfo); // Ví dụ: { name, description, image_url }
      //   //   setSongs(response.data.songs);   // Ví dụ: [{ id, title, artist, image }, ...]
      //   // } else {
      //   //   setError('Không tìm thấy dữ liệu cho DJ này.');
      //   // }
      // } catch (err) {
      //   console.error("Lỗi fetch dữ liệu DJ:", err);
      //   setError('Đã có lỗi xảy ra khi tải dữ liệu.');
      //   // backend: Xử lý các mã lỗi cụ thể từ API nếu cần (404, 500, ...)
      // } finally {
      //   setIsLoading(false);
      // }
      // // --- KẾT THÚC PHẦN API THẬT ---


       // --- DỮ LIỆU GIẢ LẬP (XÓA KHI CÓ API) ---
        console.log("Đang fetch data cho DJ ID:", djId); // Giả lập log
        // Giả lập độ trễ mạng
        setTimeout(() => {
            // Dữ liệu giả dựa trên djId (ví dụ đơn giản)
            if (djId === 'masew' || djId === 'dj1') { // Giả sử djId là 'masew' hoặc 'dj1'
                setDjInfo({
                    name: 'Masew',
                    // backend: nên cung cấp url ảnh 230x230
                    image_url: '/assets/dj-img1.png', // Placeholder image
                    description: 'Là một nhà sản xuất âm nhạc/Người tạo hoà âm phối khí người Việt Nam nổi tiếng với những bản phối khí bắt tai, khai thác tốt các chất liệu dân gian nhưng âm nhạc nhưng không kém phần trẻ trung và đời sống của mình.'
                });
                setSongs([
                    { id: 's1', title: 'Túy Âm', artist: 'Masew x Xesi', image: '/assets/song1.png' },
                    { id: 's2', title: 'Buồn Của Anh', artist: 'Đạt G, Masew, K-ICM', image: '/assets/song2.png' },
                    { id: 's3', title: 'Mời Anh Vào Team Em', artist: 'Chi Pu ft. Masew', image: '/assets/song1.png' },
                    { id: 's4', title: 'Đóa Hoa Hồng (Remix)', artist: 'Chi Pu x Masew', image: '/assets/song2.png' },
                    { id: 's5', title: 'Yêu Em Dại Khờ (Masew Remix)', artist: 'Lou Hoàng', image: '/assets/song1.png' },
                    { id: 's6', title: 'Ex\'s Hate Me (Masew Remix)', artist: 'Bray x Masew', image: '/assets/song2.png' },
                    { id: 's7', title: 'Em Hơi Mệt Với Bạn Thân Anh', artist: 'Hương Giang ft. Masew', image: '/assets/song1.png' },
                    { id: 's8', title: 'Ai Cần Ai (Masew Remix)', artist: 'Bảo Anh', image: '/assets/song2.png' },
                    // Thêm nhiều bài hát hơn nếu cần
                ]);
            } else if (djId === 'hoaprox' || djId === 'dj2') { // Giả lập cho DJ khác
                 setDjInfo({
                    name: 'Hoaprox',
                    image_url: '/assets/dj-img2.png',
                    description: 'Hoaprox tên thật là Nguyễn Thái Hòa, là một nhà sản xuất âm nhạc, DJ nổi tiếng người Việt Nam. Anh được biết đến rộng rãi qua các bản hit EDM sôi động và các sản phẩm hợp tác quốc tế.'
                });
                 setSongs([
                    { id: 's9', title: 'Ngẫu Hứng', artist: 'Hoaprox', image: '/assets/song1.png' },
                    { id: 's10', title: 'I Can\'t Find You', artist: 'Hoaprox', image: '/assets/song2.png' },
                    { id: 's11', title: 'With You', artist: 'Hoaprox ft. Nick Strand & Mio', image: '/assets/song1.png' },
                    // ... thêm bài hát
                 ]);
            }
            else {
                 setError('Không tìm thấy thông tin cho DJ này (ID giả lập).');
            }
            setIsLoading(false);
        }, 1000); // Giả lập chờ 1 giây
       // --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---
    };

    fetchDJData();

    // Cleanup function (không cần thiết nếu chỉ fetch 1 lần, nhưng tốt nếu có logic phức tạp hơn)
    // return () => {
    //   // Hủy các request đang chạy nếu cần
    // };
  }, [djId]); // Gọi lại useEffect nếu djId thay đổi

  // Hàm xử lý khi click vào bài hát (tương tự HomePage)
  const handlePlaySong = (song) => {
      console.log("Phát bài hát của DJ:", song);
      // // todo: Tích hợp với MusicPlayer component
      // playerContext.playTrack(song);
  };

  // Hiển thị trạng thái loading
  if (isLoading) {
    return <div className="dj-page-loading">Đang tải dữ liệu DJ...</div>;
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return <div className="dj-page-error">Lỗi: {error}</div>;
  }

  // Hiển thị nếu không có thông tin DJ
  if (!djInfo) {
      return <div className="dj-page-error">Không tìm thấy thông tin DJ.</div>;
  }

  // Render giao diện chính của trang
  return (
    <div className="dj-page-container">
      {/* Phần Breadcrumb (tùy chọn) */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> &gt; <Link to="/djs">DJ</Link> &gt; {djInfo.name}
      </div>

      {/* Phần thông tin DJ */}
      <div className="dj-info-section">
        <img src={djInfo.image_url || '/assets/default-dj.png'} alt={djInfo.name} className="dj-avatar" />
        <div className="dj-details">
          <h1 className="dj-name">{djInfo.name}</h1>
          <p className="dj-description">{djInfo.description}</p>
          {/* Có thể thêm các thông tin khác: lượt nghe, nút theo dõi,... */}
        </div>
      </div>

      {/* Phần danh sách bài hát */}
      <div className="dj-songs-section">
        <h2 className="section-title">Bài hát nổi bật</h2>
        {songs.length > 0 ? (
          <div className="dj-songs-grid">
            {songs.map(song => (
              // Tái sử dụng MusicItem hoặc tạo component mới nếu cần style khác
              <MusicItem
                key={song.id}
                item={song}
                onClick={() => handlePlaySong(song)}
              />
            ))}
          </div>
        ) : (
          <p>Chưa có bài hát nào cho DJ này.</p>
        )}
        {/* Có thể thêm nút "Xem thêm" nếu danh sách bài hát dài và có phân trang */}
        {/* {songs.length > 8 && <button className="load-more-button">XEM THÊM</button>} */}
      </div>
    </div>
  );
}

export default DJPage;
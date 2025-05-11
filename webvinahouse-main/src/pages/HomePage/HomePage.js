import React, { useState, useEffect } from 'react';
import { useNavigate, } from 'react-router-dom';
// import apiClient from '../../services/api'; // Import nếu dùng axios và đã cấu hình
import Slideshow from '../../components/Slideshow/Slideshow';
import CategorySection from '../../components/CategorySection/CategorySection';
import './HomePage.css';

// Import các ảnh cho slideshow
import slideImg1 from '../../assets/slide-img1.png';
import slideImg2 from '../../assets/slide-img2.png';
import slideImg3 from '../../assets/slide-img3.png';
import slideImg4 from '../../assets/slide-img4.png';
import slideImg5 from '../../assets/slide-img5.jpeg';
function HomePage() {
  // State để lưu dữ liệu từ API hoặc dữ liệu giả lập
  const [playlists, setPlaylists] = useState([]);
  const [djs, setDjs] = useState([]);
  const [genresData, setGenresData] = useState({}); // Lưu dạng { genreName: [tracks] }

  // Hook để điều hướng trang
  const navigate = useNavigate();

  // useEffect để fetch dữ liệu hoặc thiết lập dữ liệu giả lập khi component mount
  useEffect(() => {
    // // ---- BỎ COMMENT PHẦN NÀY KHI CÓ API THẬT ----
    // const fetchData = async () => {
    //   try {
    //     // Gọi nhiều API cùng lúc (ví dụ)
    //     // const [playlistRes, djRes, genresRes] = await Promise.all([
    //     //   apiClient.get('/playlists/featured?limit=8'), // Lấy 8 playlist
    //     //   apiClient.get('/djs/featured?limit=8'),       // Lấy 8 DJ
    //     //   apiClient.get('/genres/homepage')           // Lấy dữ liệu genres cho trang chủ
    //     // ]);
    //     // // backend: Đảm bảo API trả về đúng số lượng và cấu trúc dữ liệu
    //     // setPlaylists(playlistRes.data);
    //     // setDjs(djRes.data);
    //     // setGenresData(genresRes.data);
    //   } catch (error) {
    //     console.error("Lỗi fetch dữ liệu trang chủ:", error);
    //     // Xử lý lỗi, có thể hiển thị thông báo cho người dùng
    //   }
    // };
    // fetchData();
    // // ----------------------------------------------


    // ---- DỮ LIỆU GIẢ LẬP (PLACEHOLDER DATA) ----
    // Sử dụng dữ liệu này khi chưa có API hoặc để test giao diện

    // 8 Playlists giả lập
    setPlaylists([
      { id: 'pl1', name: 'Chill cùng Playlist này', image: '/assets/playlist-img1.png' },
      { id: 'pl2', name: 'Nhạc Việt Remix Hay Nhất', image: '/assets/playlist-img2.png' },
      { id: 'pl3', name: 'Acoustic Buồn', image: '/assets/playlist-img1.png' },
      { id: 'pl4', name: 'Top Hits US-UK', image: '/assets/playlist-img2.png' },
      { id: 'pl5', name: 'Indie Việt không thể bỏ lỡ', image: '/assets/playlist-img1.png' },
      { id: 'pl6', name: 'Nhạc Hoa Lời Việt Gây Nghiện', image: '/assets/playlist-img2.png' },
      { id: 'pl7', name: 'Rap Việt Thế Hệ Mới', image: '/assets/playlist-img1.png' },
      { id: 'pl8', name: 'EDM Quẩy Tung Nóc', image: '/assets/playlist-img2.png' },
    ]);

    // 8 DJs giả lập
    setDjs([
      { id: 'dj1', name: 'Masew', image: '/assets/dj-img1.png' },
      { id: 'dj2', name: 'Hoaprox', image: '/assets/dj-img2.png' },
      { id: 'dj3', name: 'K-ICM', image: '/assets/dj-img1.png' },
      { id: 'dj4', name: 'Touliver', image: '/assets/dj-img2.png' },
      { id: 'dj5', name: 'Triple D', image: '/assets/dj-img1.png' },
      { id: 'dj6', name: 'Nimbia', image: '/assets/dj-img2.png' },
      { id: 'dj7', name: 'Tilo', image: '/assets/dj-img1.png' },
      { id: 'dj8', name: 'Onionn', image: '/assets/dj-img2.png' },
    ]);

    // Dữ liệu Genres giả lập (mỗi thể loại có ít nhất 8 bài hát)
    setGenresData({
        "NHẠC VIỆT HOT 🔥": [
            { id: 't1', title: 'Vaicaunoicokhiennguoithaydoi', artist: 'GREY D x tlinh', image: '/assets/song1.png'},
            { id: 't2', title: 'Để Mị Nói Cho Mà Nghe', artist: 'Hoàng Thùy Linh', image: '/assets/song2.png'},
            { id: 't3', title: 'See Tình', artist: 'Hoàng Thùy Linh', image: '/assets/song1.png'},
            { id: 't4', title: 'Mang Tiền Về Cho Mẹ', artist: 'Đen Vâu ft. Nguyên Thảo', image: '/assets/song2.png'},
            { id: 't5', title: 'Ngày Đầu Tiên', artist: 'Đức Phúc', image: '/assets/song1.png'},
            { id: 't6', title: 'Ánh Sao Và Bầu Trời', artist: 'T.R.I', image: '/assets/song2.png'},
            { id: 't7', title: 'Chạy Về Khóc Với Anh', artist: 'ERIK', image: '/assets/song1.png'},
            { id: 't8', title: 'Waiting For You', artist: 'MONO', image: '/assets/song2.png'},
        ],
         "NHẠC GÕ": [
            { id: 't11', title: 'Nhạc Gõ Hay Nhất Compilation', artist: 'Various Artists', image: '/assets/song1.png'},
            { id: 't12', title: 'Gõ Đến Sáng (Remix)', artist: 'DJ Gõ', image: '/assets/song2.png'},
            { id: 't13', title: 'Điệu Gõ Quen Thuộc 2024', artist: 'Producer Gõ', image: '/assets/song1.png'},
            { id: 't14', title: 'Gõ Xập Xình Bass Căng', artist: 'MC Gõ', image: '/assets/song2.png'},
            { id: 't15', title: 'Tiếng Gõ Đêm Khuya', artist: 'Nghệ sĩ Gõ 1', image: '/assets/song1.png'},
            { id: 't16', title: 'Gõ Vang Trời', artist: 'Nghệ sĩ Gõ 2', image: '/assets/song2.png'},
            { id: 't17', title: 'Vũ Điệu Nhạc Gõ', artist: 'Nghệ sĩ Gõ 3', image: '/assets/song1.png'},
            { id: 't18', title: 'Gõ Cho Đã Nư', artist: 'Nghệ sĩ Gõ 4', image: '/assets/song2.png'},
        ],
        "NHẠC TRÔI": [
            { id: 't21', title: 'Trôi Theo Dòng Nhạc (Lofi Version)', artist: 'Various Artists', image: '/assets/song1.png'},
            { id: 't22', title: 'Phiêu Cùng Nhạc Trôi Vol. 5', artist: 'DJ Trôi', image: '/assets/song2.png'},
            { id: 't23', title: 'Melody Bay Bổng Giữa Đêm', artist: 'Producer Trôi', image: '/assets/song1.png'},
            { id: 't24', title: 'Lạc Vào Cõi Trôi (Deep House)', artist: 'MC Trôi', image: '/assets/song2.png'},
            { id: 't25', title: 'Giấc Mơ Trôi', artist: 'Nghệ sĩ Trôi 1', image: '/assets/song1.png'},
            { id: 't26', title: 'Trôi Đi Muộn Phiền', artist: 'Nghệ sĩ Trôi 2', image: '/assets/song2.png'},
            { id: 't27', title: 'Hoàng Hôn Trôi', artist: 'Nghệ sĩ Trôi 3', image: '/assets/song1.png'},
            { id: 't28', title: 'Bản Nhạc Trôi Êm Đềm', artist: 'Nghệ sĩ Trôi 4', image: '/assets/song2.png'},
       ],
        "NHẠC TƯNG TỬNG": [
            { id: 't31', title: 'Vui Tươi Tưng Tửng Cả Ngày', artist: 'Various Artists', image: '/assets/song1.png'},
            { id: 't32', title: 'Nhảy Cùng Tưng Tửng (Remix)', artist: 'DJ Tưng Tửng', image: '/assets/song2.png'},
            { id: 't33', title: 'Beat Tưng Tửng Độc Lạ', artist: 'Producer Tưng Tửng', image: '/assets/song1.png'},
            { id: 't34', title: 'La La La Tưng Tửng Yêu Đời', artist: 'MC Tưng Tửng', image: '/assets/song2.png'},
            { id: 't35', title: 'Tưng Tửng Cuối Tuần', artist: 'Nghệ sĩ Tưng Tửng 1', image: '/assets/song1.png'},
            { id: 't36', title: 'Điệu Nhảy Tưng Tửng', artist: 'Nghệ sĩ Tưng Tửng 2', image: '/assets/song2.png'},
            { id: 't37', title: 'Tưng Tửng Hát Ca', artist: 'Nghệ sĩ Tưng Tửng 3', image: '/assets/song1.png'},
            { id: 't38', title: 'Tưng Tửng Không Lo Âu', artist: 'Nghệ sĩ Tưng Tửng 4', image: '/assets/song2.png'},
        ],
        "TIKTOK REMIX": [
            { id: 't41', title: 'Trend TikTok Hot Tháng Này', artist: 'Various Artists', image: '/assets/song1.png'},
            { id: 't42', title: 'Remix Gây Nghiện TikTok', artist: 'DJ TikTok', image: '/assets/song2.png'},
            { id: 't43', title: 'Điệu Nhảy Triệu View TikTok', artist: 'Producer TikTok', image: '/assets/song1.png'},
            { id: 't44', title: 'Nhạc Nền TikTok Viral', artist: 'MC TikTok', image: '/assets/song2.png'},
            { id: 't45', title: 'TikTok Remix China', artist: 'TikTok Remix Artist 1', image: '/assets/song1.png'},
            { id: 't46', title: 'Vinahouse TikTok Style', artist: 'TikTok Remix Artist 2', image: '/assets/song2.png'},
            { id: 't47', title: 'K-Pop TikTok Remix', artist: 'TikTok Remix Artist 3', image: '/assets/song1.png'},
            { id: 't48', title: 'US-UK TikTok Remix Hits', artist: 'TikTok Remix Artist 4', image: '/assets/song2.png'},
       ],
        "NHẠC CỔ": [
            { id: 't51', title: 'Giai Điệu Vượt Thời Gian (Hòa Tấu)', artist: 'Various Artists', image: '/assets/song1.png'},
            { id: 't52', title: 'Hoài Niệm Xưa - Tình Khúc Bất Hủ', artist: 'Nghệ Sĩ Cổ', image: '/assets/song2.png'},
            { id: 't53', title: 'Tình Ca Thập Niên 90', artist: 'Danh Ca Cổ', image: '/assets/song1.png'},
            { id: 't54', title: 'Vọng Về Quá Khứ (Nhạc Không Lời)', artist: 'Nhạc Sĩ Cổ', image: '/assets/song2.png'},
            { id: 't55', title: 'Nhạc Vàng Chọn Lọc', artist: 'Nghệ sĩ Cổ 1', image: '/assets/song1.png'},
            { id: 't56', title: 'Nhạc Trữ Tình Xưa Hay Nhất', artist: 'Nghệ sĩ Cổ 2', image: '/assets/song2.png'},
            { id: 't57', title: 'Bolero Ngọt Ngào', artist: 'Nghệ sĩ Cổ 3', image: '/assets/song1.png'},
            { id: 't58', title: 'Những Bản Tình Ca Dang Dở', artist: 'Nghệ sĩ Cổ 4', image: '/assets/song2.png'},
        ],
    });
    // ---- KẾT THÚC DỮ LIỆU GIẢ LẬP ----

  }, []); // Dependency rỗng để chỉ chạy 1 lần khi mount

  // Mảng chứa các ảnh slideshow đã import
  const slideImages = [
    slideImg1,
    slideImg2,
    slideImg3,
    slideImg4,
    slideImg5,
  ];

  // Hàm xử lý khi click vào một bài hát (placeholder)
  const handlePlaySong = (song) => {
      console.log("Phát bài hát:", song);
      // // todo: Tích hợp với MusicPlayer component
      // // Ví dụ: Gọi hàm từ Context hoặc cập nhật state chung
      // playerContext.playTrack(song);
  };

  // Render giao diện component
  return (
    <div className="homepage-container">
      {/* Slideshow */}
      <Slideshow images={slideImages} />

      {/* Các Category Section */}
      <CategorySection
         title="PLAYLIST"
         type="horizontal"
         items={playlists} // Sử dụng state playlists (8 items)
         viewAllLink="/playlists" // Link tới trang danh sách playlist
         onItemClick={(item) => navigate(`/playlist/${item.id}`)} // Chuyển trang khi click
        />

       <CategorySection
          title="DJ"
          type="horizontal"
          items={djs} // Sử dụng state djs (8 items)
          viewAllLink="/djs" // Link tới trang danh sách DJ
          onItemClick={(item) => navigate(`/dj/${item.id}`)} // Chuyển trang khi click
        />

      {/* Lặp qua các thể loại từ state genresData */}
       {Object.entries(genresData).map(([genreName, tracks]) => (
           // Chỉ render section nếu có bài hát trong thể loại đó
           tracks && tracks.length > 0 &&
           <CategorySection
               key={genreName} // Key là tên thể loại duy nhất
               title={genreName} // Tên thể loại (ví dụ: "NHẠC VIỆT HOT 🔥")
               type="grid" // Kiểu hiển thị dạng lưới
               items={tracks} // Danh sách các bài hát trong thể loại
               // Link tới trang chi tiết thể loại (ví dụ: /genre/nhac-viet-hot)
               viewAllLink={`/genre/${genreName.toLowerCase().replace(/ /g, '-').replace('🔥','')}`} // Tạo link thân thiện
               onItemClick={handlePlaySong} // Gọi hàm phát nhạc khi click vào bài hát
               initialItemCount={4} // Hiển thị 4 bài hát ban đầu (2x2 grid)
               loadMoreIncrement={4} // Mỗi lần bấm "Xem thêm" sẽ hiện thêm 4 bài
           />
       ))}

    </div>
  );
}

export default HomePage;
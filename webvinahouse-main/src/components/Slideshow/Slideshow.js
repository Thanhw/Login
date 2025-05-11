import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Slideshow.css'; // CSS tùy chỉnh

function Slideshow({ images }) {
  const settings = {
    dots: false, // Không hiển thị chấm chỉ mục
    infinite: true, // Lặp vô hạn
    speed: 500, // Tốc độ chuyển slide (ms)
    slidesToShow: 3, // Số lượng slide thấy được một phần hoặc toàn bộ
    slidesToScroll: 1, // Mỗi lần chuyển 1 slide
    autoplay: true, // Tự động chạy
    autoplaySpeed: 3000, // Thời gian giữa các lần chuyển (ms)
    cssEase: "linear", // Kiểu chuyển động
    variableWidth: true, // Cho phép các slide có chiều rộng khác nhau (hoặc cố định)
    centerMode: false, // Không cần center mode ở đây
    arrows: true, // Hiển thị nút next/prev (có thể ẩn bằng CSS nếu muốn)
     // responsive: [ // Cấu hình responsive nếu cần ]
  };

  return (
    <div className="slideshow-container">
      <Slider {...settings}>
        {images.map((imgSrc, index) => (
          <div key={index} className="slide-item-wrapper">
            <img src={imgSrc} alt={`Slide ${index + 1}`} className="slide-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Slideshow;
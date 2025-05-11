// src/pages/DJListPage/DJListPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import apiClient from '../../services/api'; // Import nếu dùng axios
import './DJListPage.css'; // File CSS riêng

// Component nhỏ để hiển thị một DJ trong grid (có thể tách ra file riêng nếu muốn)
function DJGridItem({ dj }) {
    const navigate = useNavigate();

    const handleDJClick = () => {
        navigate(`/dj/${dj.id}`); // Chuyển đến trang DJ cá nhân
    };

    return (
        <div className="dj-grid-item" onClick={handleDJClick}>
            {/* // backend: dj.image_url nên là ảnh vuông */}
            <img src={dj.image_url || '/assets/default-dj-square.png'} alt={dj.name} className="dj-grid-image" />
            <p className="dj-grid-name">{dj.name}</p>
        </div>
    );
}


function DJListPage() {
    const [djs, setDjs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllDJs = async () => {
            setIsLoading(true);
            setError(null);
            // // --- BỎ COMMENT KHI CÓ API ---
            // // backend: Cần API endpoint dạng /api/djs/ để lấy danh sách tất cả DJ (id, name, image_url)
            // try {
            //     // const response = await apiClient.get('/djs');
            //     // setDjs(response.data || []); // Đảm bảo luôn là mảng
            // } catch (err) {
            //     console.error("Lỗi fetch danh sách DJ:", err);
            //     setError('Không thể tải danh sách DJ.');
            // } finally {
            //     setIsLoading(false);
            // }
            // // --- KẾT THÚC PHẦN API THẬT ---

            // --- DỮ LIỆU GIẢ LẬP (XÓA KHI CÓ API) ---
            setTimeout(() => {
                setDjs([
                    { id: 'dj1', name: 'Masew', image_url: '/assets/dj-img1.png' },
                    { id: 'dj2', name: 'Hoaprox', image_url: '/assets/dj-img2.png' },
                    { id: 'dj3', name: 'K-ICM', image_url: '/assets/dj-img1.png' },
                    { id: 'dj4', name: 'Touliver', image_url: '/assets/dj-img2.png' },
                    { id: 'dj5', name: 'Triple D', image_url: '/assets/dj-img1.png' },
                    { id: 'dj6', name: 'Nimbia', image_url: '/assets/dj-img2.png' },
                    { id: 'dj7', name: 'Tilo', image_url: '/assets/dj-img1.png' },
                    { id: 'dj8', name: 'Onionn', image_url: '/assets/dj-img2.png' },
                    { id: 'dj9', name: 'Rum', image_url: '/assets/dj-img1.png' }, // Thêm DJ
                    { id: 'dj10', name: 'CM1X', image_url: '/assets/dj-img2.png' }, // Thêm DJ
                    { id: 'dj11', name: 'Get Looze', image_url: '/assets/dj-img1.png'}, // Thêm DJ
                    { id: 'dj12', name: 'SlimV', image_url: '/assets/dj-img2.png' }, // Thêm DJ
                ]);
                setIsLoading(false);
            }, 500); // Giả lập chờ 0.5 giây
            // --- KẾT THÚC DỮ LIỆU GIẢ LẬP ---
        };

        fetchAllDJs();
    }, []);

    if (isLoading) {
        return <div className="dj-list-loading">Đang tải danh sách DJ...</div>;
    }

    if (error) {
        return <div className="dj-list-error">Lỗi: {error}</div>;
    }

    return (
        <div className="dj-list-page-container">
            {/* Breadcrumb hoặc Tiêu đề trang */}
            <div className="breadcrumb">
                <Link to="/">Trang chủ</Link> &gt; DJ
            </div>
            <h1 className="dj-list-title">DJs cháy nhất</h1>

            {/* Lưới hiển thị DJ */}
            <div className="dj-list-grid">
                {djs.map(dj => (
                    <DJGridItem key={dj.id} dj={dj} />
                ))}
            </div>
            {djs.length === 0 && !isLoading && (
                 <p>Không tìm thấy DJ nào.</p>
            )}
        </div>
    );
}

export default DJListPage;
import React, { useState, useRef, useEffect, useCallback /*, useContext */ } from 'react';
// import { PlayerContext } from '../../contexts/PlayerContext'; // Ví dụ nếu dùng Context
import './MusicPlayer.css'; // CSS chính của Player

// Import SVG thành React Component
import { ReactComponent as PlayIcon } from '../../assets/play-icon.svg';
import { ReactComponent as PauseIcon } from '../../assets/pause-icon.svg';
import { ReactComponent as VolumeIcon } from '../../assets/volume-icon.svg';
import { ReactComponent as VolumeMuteIcon } from '../../assets/volume-mute-icon.svg';
import { ReactComponent as FavoriteIcon } from '../../assets/favorite-icon.svg';
import { ReactComponent as AddToPlaylistIcon } from '../../assets/add-playlist-icon.svg';
import { ReactComponent as QueueIcon } from '../../assets/queue-icon.svg';
import { ReactComponent as SkipIcon } from '../../assets/skip-icon.svg';
import { ReactComponent as RepeatIcon } from '../../assets/repeat-icon.svg';
import { ReactComponent as RepeatOneIcon } from '../../assets/repeat-one-icon.svg';
import { ReactComponent as ShuffleIcon } from '../../assets/shuffle-icon.svg';
import { ReactComponent as CloseIcon } from '../../assets/close-icon.svg';

// Import component icon sóng nhạc mới
import AnimatedSoundwaveIcon from '../Icons/AnimatedSoundwaveIcon'; // Điều chỉnh đường dẫn nếu cần

function MusicPlayer() {
    // --- State Variables ---
    const [currentTrack, setCurrentTrack] = useState({
        id: 't1',
        title: 'Vaicaunoicokhiennguoithaydoi Vaicaunoicokhiennguoithaydoi',
        artist: 'GREY D x tlinh',
        image: '/assets/song1.png', // Placeholder image path
        src: null, // Placeholder src - Ideally set this when a song is selected
        // src: '/path/to/music1.mp3', // Example path - backend: cần đường dẫn file nhạc
        isFavorite: false,
        // isAddedToPlaylist: false, // Ví dụ: Thêm state này nếu cần theo dõi trạng thái playlist
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7); // Âm lượng từ 0 đến 1
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0); // Tiến trình từ 0 đến 100
    const [duration, setDuration] = useState(0); // Tổng thời gian (giây), lấy từ audio metadata
    const [currentTime, setCurrentTime] = useState(0); // Thời gian hiện tại (giây)
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [showQueue, setShowQueue] = useState(false);
    const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'one', 'all'
    const [isShuffled, setIsShuffled] = useState(false);
    const [queue, setQueue] = useState([ // Dữ liệu giả lập cho danh sách chờ
         { id: 't2', title: 'Để Mị Nói Cho Mà Nghe', artist: 'Hoàng Thùy Linh', isFavorite: true },
         { id: 't3', title: 'See Tình', artist: 'Hoàng Thùy Linh', isFavorite: false },
    ]);
    const [isInteractingPlayer, setIsInteractingPlayer] = useState(false); // State theo dõi tương tác hover

    // --- Refs ---
    const audioRef = useRef(null); // Tham chiếu đến thẻ <audio>

    // --- Helper Functions (Định nghĩa trước để các Effect/Callback có thể sử dụng nếu cần) ---
    const formatTime = (timeInSeconds) => { // Định dạng thời gian
        if (isNaN(timeInSeconds) || timeInSeconds === Infinity || timeInSeconds < 0) {
            return "0:00";
        }
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    // --- Callback Functions (Định nghĩa trước các hàm sẽ dùng trong Effect hoặc làm callback) ---

    // Hàm phát bài tiếp theo (dùng useCallback để tối ưu và đưa vào dependency của effect nếu cần)
    const playNext = useCallback(() => {
         console.log("Phát bài tiếp theo");
         // Logic chọn bài tiếp theo dựa trên queue, repeat, shuffle...
         if (queue.length > 0) {
             const nextTrackInQueue = queue[0];
             console.log("Chuẩn bị phát:", nextTrackInQueue.title);
             // !!! Quan trọng: Cần lấy thông tin đầy đủ (bao gồm cả src) của bài hát tiếp theo từ state hoặc API
             // Ví dụ (cần điều chỉnh):
             // setCurrentTrack({
             //    ...nextTrackInQueue,
             //    src: getTrackSourceById(nextTrackInQueue.id) // Hàm giả định lấy src
             // });

             // Xóa bài vừa lấy khỏi queue (nếu không repeat all) hoặc chuyển xuống cuối (nếu repeat all)
             if (repeatMode !== 'all') {
                 setQueue(prevQueue => prevQueue.slice(1));
             } else {
                 setQueue(prevQueue => [...prevQueue.slice(1), nextTrackInQueue]);
             }
             // Cân nhắc việc tự động phát bài mới ở đây hoặc trong useEffect của currentTrack
             // setIsPlaying(true); // Có thể cần delay nhỏ hoặc chờ audio sẵn sàng
         } else {
             console.log("Hết danh sách chờ.");
             setIsPlaying(false);
             setCurrentTrack(null); // Reset bài hát hiện tại nếu hết queue và không lặp lại
         }
    // }, [queue, repeatMode, isShuffled, setCurrentTrack, setIsPlaying]); // Cần thêm setCurrentTrack, setIsPlaying nếu dùng chúng bên trong
    }, [queue, repeatMode, isShuffled]); // Giữ dependencies tối thiểu nếu logic state phức tạp được quản lý ở nơi khác (Context/Reducer)

    // --- Effects ---

    // Effect để điều khiển play/pause audio
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentTrack || !currentTrack.src) {
            // Nếu không có audio element hoặc không có bài hát/đường dẫn src -> đảm bảo trạng thái là paused
            if (isPlaying) setIsPlaying(false);
            return;
        };

        if (isPlaying) {
            audio.play().catch(error => {
                console.error("Lỗi khi phát nhạc:", error);
                setIsPlaying(false); // Dừng lại nếu có lỗi
            });
        } else {
            audio.pause();
        }
    }, [isPlaying, currentTrack]); // Chạy lại khi trạng thái play hoặc bài hát thay đổi

    // Effect để cập nhật volume/mute
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = isMuted ? 0 : volume;
    }, [volume, isMuted]); // Chạy lại khi volume hoặc trạng thái mute thay đổi

    // Effect để cập nhật tiến trình bài hát, duration và xử lý kết thúc bài
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Hàm cập nhật thời gian hiện tại và thanh progress
        const updateProgress = () => {
            // Chỉ cập nhật nếu audio đang có thể phát và có duration hợp lệ
            if (audio.duration && isFinite(audio.duration) && audio.readyState > 0) {
                 setCurrentTime(audio.currentTime);
                 setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        // Hàm lấy tổng thời gian bài hát khi metadata được load
        const setAudioDuration = () => {
            if(audio.duration && isFinite(audio.duration)) {
                setDuration(audio.duration);
            } else {
                // Reset nếu không lấy được duration
                setDuration(0);
                setProgress(0);
                setCurrentTime(0);
            }
        };

        // Hàm xử lý khi bài hát kết thúc - gọi playNext đã được định nghĩa ở trên
        const handleEnded = () => {
            playNext();
        };

        // Hàm xử lý lỗi audio element
        const handleError = (e) => {
             console.error("Lỗi Audio Element:", e);
             // Có thể hiển thị thông báo lỗi cho người dùng
             alert(`Không thể phát bài hát: ${currentTrack?.title || 'N/A'}. Có thể file bị lỗi hoặc không được hỗ trợ.`);
             // Thử phát bài tiếp theo để không bị kẹt
             playNext();
        };

        // Gán các event listener
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', setAudioDuration); // Lấy duration khi metadata load xong
        audio.addEventListener('durationchange', setAudioDuration); // Bắt cả sự kiện duration thay đổi (hữu ích khi src thay đổi)
        audio.addEventListener('ended', handleEnded); // Xử lý khi hết bài
        audio.addEventListener('error', handleError); // Bắt lỗi

        // Dọn dẹp listener khi component unmount hoặc dependencies thay đổi
        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', setAudioDuration);
            audio.removeEventListener('durationchange', setAudioDuration);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError); // Gỡ listener lỗi
        };
    // }, [currentTrack, playNext]); // Giữ playNext nếu muốn effect chạy lại khi logic playNext thay đổi (hiếm khi cần thiết nếu playNext dùng useCallback đúng)
       }, [currentTrack, playNext]); // Phụ thuộc vào currentTrack và playNext (để đảm bảo handleEnded gọi đúng phiên bản mới nhất của playNext khi nó thay đổi)

    // --- Các hàm xử lý sự kiện còn lại ---

    // Hàm bật/tắt phát nhạc
    const togglePlayPause = () => {
        if (!currentTrack || !currentTrack.src) {
             console.log("Chưa có bài hát để phát.");
             // Có thể hiện thông báo hoặc chọn bài hát đầu tiên trong queue nếu muốn
             return;
        }
        setIsPlaying(prevIsPlaying => !prevIsPlaying);
    };

    // Hàm xử lý thay đổi volume từ thanh trượt
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        // Tự động unmute nếu tăng volume khi đang mute, hoặc mute nếu giảm về 0
        if (isMuted && newVolume > 0) {
            setIsMuted(false);
        } else if (!isMuted && newVolume === 0 && newVolume !== volume) { // Chỉ mute nếu volume thực sự giảm về 0
            setIsMuted(true);
        }
    };

    // Hàm bật/tắt mute
    const toggleMute = () => {
        setIsMuted(prevIsMuted => !prevIsMuted);
    };

    // Hàm xử lý khi người dùng kéo thanh progress
    const handleProgressChange = (e) => {
        const audio = audioRef.current;
        if (!audio || !duration || !isFinite(duration)) return; // Không tua nếu chưa có duration hợp lệ
        const seekTime = (parseFloat(e.target.value) / 100) * duration;
        // Chỉ đặt currentTime nếu giá trị hợp lệ
        if (isFinite(seekTime)) {
           audio.currentTime = seekTime;
           setProgress(parseFloat(e.target.value)); // Cập nhật thanh kéo ngay
           setCurrentTime(seekTime); // Cập nhật cả thời gian hiển thị
        }
    };

    // Hàm xử lý thêm/bỏ yêu thích
    const toggleFavorite = (trackId) => {
        console.log("Toggle favorite cho track:", trackId);
        // // backend: Gọi API cập nhật trạng thái yêu thích cho trackId
        // Ví dụ: apiClient.post(`/api/tracks/${trackId}/favorite`).then(...)

        // Cập nhật state local (Optimistic Update)
        if (currentTrack && currentTrack.id === trackId) {
            setCurrentTrack(prev => ({...prev, isFavorite: !prev.isFavorite}));
        }
        setQueue(prevQueue => prevQueue.map(t =>
            t.id === trackId ? {...t, isFavorite: !t.isFavorite} : t
        ));
    };

    // Hàm xử lý thêm vào playlist (placeholder)
    const addToUserPlaylist = (trackId) => {
        console.log("Thêm track vào playlist:", trackId);
        // // todo: Mở popup/modal cho người dùng chọn playlist
        // // backend: Gọi API thêm trackId vào playlist đã chọn
    };

    // Hàm xóa bài hát khỏi danh sách chờ
    const removeFromQueue = (trackId) => {
        console.log("Xóa khỏi queue:", trackId);
        setQueue(prevQueue => prevQueue.filter(t => t.id !== trackId));
    };

    // Hàm thay đổi chế độ lặp lại
    const toggleRepeatMode = () => {
        const nextMode = repeatMode === 'none' ? 'all' : (repeatMode === 'all' ? 'one' : 'none');
        setRepeatMode(nextMode);
        console.log("Repeat mode:", nextMode);
        // Cập nhật thuộc tính loop của thẻ audio nếu cần cho 'one'
        if (audioRef.current) {
            audioRef.current.loop = (nextMode === 'one');
        }
    };

    // Hàm bật/tắt chế độ trộn bài
    const toggleShuffle = () => {
        const newShuffleState = !isShuffled;
        setIsShuffled(newShuffleState);
        console.log("Shuffle mode:", newShuffleState);
        // // todo: Xáo trộn (hoặc sắp xếp lại) danh sách chờ `queue` nếu cần
    };

    // --- Render Logic ---
    const playerClass = `music-player ${!isInteractingPlayer ? 'player-shrunk' : ''} ${isPlaying ? 'is-playing' : 'is-paused'}`;

    // Player trống nếu không có bài hát
    if (!currentTrack) {
        return (
             <div className="music-player empty">
                 <div className="player-content">
                    <span>Chưa có bài hát nào được chọn</span>
                 </div>
             </div>
        );
    }

    // Xác định class cho nút AddToPlaylist dựa vào state (ví dụ)
    // const isCurrentTrackInPlaylist = checkTrackInPlaylist(currentTrack.id); // Hàm giả định
    // const addToPlaylistButtonClass = `control-button ${isCurrentTrackInPlaylist ? 'added-to-playlist' : ''}`;

    return (
        <div
           className={playerClass}
           onMouseEnter={() => setIsInteractingPlayer(true)}
           onMouseLeave={() => setIsInteractingPlayer(false)}
        >
            {/* Thẻ audio ẩn để phát nhạc */}
            <audio
                ref={audioRef}
                src={currentTrack.src}
                preload="metadata" // Chỉ tải metadata ban đầu
                // Thuộc tính loop sẽ được quản lý bởi toggleRepeatMode nếu cần
            ></audio>

            {/* Nội dung player */}
            <div className="player-content">
                {/* Thông tin bài hát (Trái) */}
                <div className="track-info">
                    <img src={currentTrack.image || '/assets/default-artwork.png'} alt={currentTrack.title} className="track-artwork" />
                    <div className="track-details">
                        <p className="track-title" title={currentTrack.title}>{currentTrack.title}</p>
                        <p className="track-artist" title={currentTrack.artist}>{currentTrack.artist}</p>
                    </div>
                </div>

                {/* Điều khiển chính (Giữa) */}
                <div className="player-controls">
                    <div className="controls-top">
                        {/* Shuffle */}
                        <button className={`control-button ${isShuffled ? 'active' : ''}`} onClick={toggleShuffle} title={isShuffled ? "Tắt trộn bài" : "Bật trộn bài"}>
                            <ShuffleIcon />
                        </button>
                        {/* Skip Previous */}
                        <button className="control-button" onClick={() => console.log("Chưa làm: Phát bài trước")} title="Bài trước">
                            <SkipIcon style={{ transform: 'rotate(180deg)' }}/>
                        </button>
                        {/* Play/Pause */}
                        <button className="control-button play-pause" onClick={togglePlayPause} title={isPlaying ? "Tạm dừng" : "Phát"}>
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </button>
                        {/* Skip Next */}
                        <button className="control-button" onClick={playNext} title="Bài tiếp theo">
                            <SkipIcon />
                        </button>
                        {/* Repeat */}
                        <button className={`control-button ${repeatMode !== 'none' ? 'active' : ''}`} onClick={toggleRepeatMode} title={`Lặp lại: ${repeatMode === 'none' ? 'Không lặp' : (repeatMode === 'all' ? 'Tất cả' : 'Một bài')}`}>
                            {repeatMode === 'one' ? <RepeatOneIcon /> : <RepeatIcon />}
                        </button>
                    </div>
                    <div className="controls-bottom progress-container">
                        {/* Thời gian hiện tại */}
                        <span className="time current-time">{formatTime(currentTime)}</span>
                        {/* Thanh progress */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={isNaN(progress) ? 0 : progress}
                            className="progress-bar"
                            onChange={handleProgressChange}
                            aria-label="Tiến trình bài hát"
                            style={{ backgroundSize: `${isNaN(progress) ? 0 : progress}% 100%` }} // Cập nhật màu nền
                        />
                        {/* Tổng thời gian */}
                        <span className="time duration">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Điều khiển phụ & Queue (Phải) */}
                <div className="player-actions">
                    {/* Volume */}
                    <div
                        className="volume-control"
                        onMouseEnter={() => setShowVolumeSlider(true)}
                        onMouseLeave={() => setShowVolumeSlider(false)}
                        title={`Âm lượng: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                    >
                        <button className="control-button" onClick={toggleMute} aria-label={isMuted ? "Bỏ tắt tiếng" : "Tắt tiếng"}>
                            {isMuted || volume === 0 ? <VolumeMuteIcon /> : <VolumeIcon />}
                        </button>
                        {showVolumeSlider && (
                            <div className="volume-slider-container">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={isMuted ? 0 : volume}
                                    className="volume-slider"
                                    onChange={handleVolumeChange}
                                    aria-label="Điều chỉnh âm lượng"
                                    style={{ backgroundSize: `${(isMuted ? 0 : volume) * 100}% 100%` }}
                                />
                            </div>
                        )}
                    </div>
                    {/* Favorite */}
                    <button
                        className={`control-button ${currentTrack.isFavorite ? 'favorited' : ''}`}
                        onClick={() => toggleFavorite(currentTrack.id)}
                        title={currentTrack.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                        aria-pressed={currentTrack.isFavorite}
                    >
                        <FavoriteIcon />
                    </button>
                    {/* Add to Playlist */}
                    <button
                        // className={addToPlaylistButtonClass} // Ví dụ thêm class động
                        className={`control-button`}
                        onClick={() => addToUserPlaylist(currentTrack.id)}
                        title="Thêm vào playlist"
                    >
                        <AddToPlaylistIcon />
                    </button>
                    {/* Queue */}
                    <div className="queue-container">
                        <button className="control-button" onClick={() => setShowQueue(!showQueue)} title={showQueue ? "Ẩn danh sách chờ" : "Hiện danh sách chờ"} aria-expanded={showQueue}>
                            <QueueIcon />
                        </button>
                        {showQueue && (
                            <div className="queue-list">
                                <h4>Danh sách chờ</h4>
                                {/* Bài đang phát */}
                                <div className="queue-item current">
                                    {/* Icon sóng nhạc động */}
                                    <div className={`playing-indicator-container ${isPlaying ? 'playing' : ''}`}>
                                        <AnimatedSoundwaveIcon width={16} height={16} />
                                    </div>
                                    <span className="queue-title current-title" title={currentTrack.title}>{currentTrack.title}</span>
                                    <span className="queue-artist" title={currentTrack.artist}>{currentTrack.artist}</span>
                                    {/* Nút fav/add trong queue cho bài hiện tại */}
                                    <button className={`queue-action-button ${currentTrack.isFavorite ? 'favorited' : ''}`} onClick={() => toggleFavorite(currentTrack.id)} title={currentTrack.isFavorite ? "Bỏ yêu thích" : "Yêu thích"} aria-pressed={currentTrack.isFavorite}>
                                        <FavoriteIcon />
                                    </button>
                                    <button className={`queue-action-button`} onClick={() => addToUserPlaylist(currentTrack.id)} title="Thêm vào playlist">
                                        <AddToPlaylistIcon />
                                    </button>
                                </div>
                                {/* Các bài trong queue */}
                                {queue.map(track => (
                                    <div key={track.id} className="queue-item">
                                        {/* Có thể thêm nút play ở đây để phát ngay bài trong queue */}
                                        <span className="queue-title" title={track.title}>{track.title}</span>
                                        <span className="queue-artist" title={track.artist}>{track.artist}</span>
                                        <button className={`queue-action-button ${track.isFavorite ? 'favorited' : ''}`} onClick={() => toggleFavorite(track.id)} title={track.isFavorite ? "Bỏ yêu thích" : "Yêu thích"} aria-pressed={track.isFavorite}>
                                            <FavoriteIcon />
                                        </button>
                                        <button className={`queue-action-button`} onClick={() => addToUserPlaylist(track.id)} title="Thêm vào playlist">
                                            <AddToPlaylistIcon />
                                        </button>
                                        <button className="queue-action-button remove" onClick={() => removeFromQueue(track.id)} title="Xóa khỏi danh sách chờ">
                                            <CloseIcon />
                                        </button>
                                    </div>
                                ))}
                                {queue.length === 0 && <p className="empty-queue">Danh sách chờ trống.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;
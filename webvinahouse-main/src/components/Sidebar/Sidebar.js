import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Import icons
import trangchuIcon from '../../assets/trangchu-sidebar.png';
import theloaiIcon from '../../assets/theloai-sidebar.png';
import djIcon from '../../assets/dj-sidebar.png';
import playlistIcon from '../../assets/playlist-sidebar.png';
import favIcon from '../../assets/fav-sidebar.png';
import myPlaylistIcon from '../../assets/my-playlist-sidebar.png';

// Giả sử bạn có danh sách các thể loại, DJ, Playlist từ API
const genres = ["NHẠC VIỆT HOT", "NHẠC GÕ", "NHẠC TRÔI", "NHẠC TƯNG TỬNG", "TIKTOK REMIX", "NHẠC CỔ"];
const djs = ["DJ A", "DJ B", "DJ C"];
const playlists = ["Playlist 1", "Playlist 2"];

// Admin management links
const adminLinks = [
  { text: "Quản lý Người Dùng", to: "/admin/users" },
  { text: "Quản lý Bài Hát", to: "/admin/songs" },
  { text: "Quản lý DJ", to: "/admin/artists" },
  { text: "Quản lý Thể Loại", to: "/admin/genres" },
  { text: "Quản lý Playlist", to: "/admin/playlists" },
  { text: "Xem Log", to: "/admin/logs" },
];

function SidebarItem({ icon, text, to, children, hasDropdown, isOpen, onClick }) {
  const location = useLocation();
  const isActive = to && location.pathname === to;

  return (
    <div className="sidebar-item-container">
      <Link
        to={to || '#'}
        className={`sidebar-item ${isActive ? 'active' : ''}`}
        onClick={hasDropdown ? onClick : null}
      >
        <img src={icon} alt={text} />
        <span className="text-uppercase">{text}</span>
        {hasDropdown && <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>}
      </Link>
      {hasDropdown && isOpen && (
        <div className="dropdown-menu">
          {children}
        </div>
      )}
    </div>
  );
}

function Sidebar({ isOpen, toggleSidebar }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  const handleDropdownClick = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Check if the user is an admin
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = storedUser.isAdmin || false;

  return (
    <>
      {/* Thanh trigger nhỏ */}
      <div className={`sidebar-trigger ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
        {isOpen ? '<' : '>'}
      </div>

      {/* Sidebar chính */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <SidebarItem icon={trangchuIcon} text="TRANG CHỦ" to="/" />

          <SidebarItem
            icon={theloaiIcon}
            text="THỂ LOẠI"
            hasDropdown
            isOpen={openDropdown === 'genres'}
            onClick={() => handleDropdownClick('genres')}
          >
            {genres.map(genre => (
              <Link
                key={genre}
                to={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`}
                className={`dropdown-item font-light ${location.pathname === `/genre/${genre.toLowerCase().replace(/ /g, '-')}` ? 'active' : ''}`}
              >
                {genre}
              </Link>
            ))}
          </SidebarItem>

          <SidebarItem
            icon={djIcon}
            text="DJ"
            hasDropdown
            isOpen={openDropdown === 'djs'}
            onClick={() => handleDropdownClick('djs')}
          >
            <Link to="/djs" className={`dropdown-item font-light ${location.pathname === '/djs' ? 'active' : ''}`}>
              Tất cả DJ
            </Link>
            {djs.map(dj => (
              <Link
                key={dj}
                to={`/dj/${dj.toLowerCase().replace(/ /g, '-')}`}
                className={`dropdown-item font-light ${location.pathname === `/dj/${dj.toLowerCase().replace(/ /g, '-')}` ? 'active' : ''}`}
              >
                {dj}
              </Link>
            ))}
          </SidebarItem>

          <SidebarItem
            icon={playlistIcon}
            text="PLAYLIST"
            hasDropdown
            isOpen={openDropdown === 'playlists'}
            onClick={() => handleDropdownClick('playlists')}
          >
            <Link to="/playlists" className={`dropdown-item font-light ${location.pathname === '/playlists' ? 'active' : ''}`}>
              Tất cả Playlist
            </Link>
            {playlists.map(playlist => (
              <Link
                key={playlist}
                to={`/playlist/${playlist.toLowerCase().replace(/ /g, '-')}`}
                className={`dropdown-item font-light ${location.pathname === `/playlist/${playlist.toLowerCase().replace(/ /g, '-')}` ? 'active' : ''}`}
              >
                {playlist}
              </Link>
            ))}
          </SidebarItem>

          {/* Admin Management Section - Only visible to admins */}
          {isAdmin && (
            <>
              <hr className="sidebar-divider" />
              <SidebarItem
                icon={djIcon}
                text="QUẢN LÝ"
                hasDropdown
                isOpen={openDropdown === 'admin'}
                onClick={() => handleDropdownClick('admin')}
              >
                {adminLinks.map(link => (
                  <Link
                    key={link.text}
                    to={link.to}
                    className={`dropdown-item font-light ${location.pathname === link.to ? 'active' : ''}`}
                  >
                    {link.text}
                  </Link>
                ))}
              </SidebarItem>
            </>
          )}

          <hr className="sidebar-divider" />

          <SidebarItem icon={favIcon} text="YÊU THÍCH" to="/favorites" />
          <SidebarItem icon={myPlaylistIcon} text="MY PLAYLIST" to="/my-playlist" />
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
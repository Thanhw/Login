import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import PlaylistListPage from './pages/PlaylistListPage/PlaylistListPage';
import DJListPage from './pages/DJListPage/DJListPage';
import GenrePage from './pages/GenrePage/GenrePage';
import PlaylistPage from './pages/PlaylistPage/PlaylistPage';
import DJPage from './pages/DJPage/DJPage';
import AuthLayout from './components/Layout/AuthLayout';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import MyPlaylistPage from './pages/MyPlaylistPage/MyPlaylistPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout cho các trang đã xác thực */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/my-playlist" element={<MyPlaylistPage />} />
          <Route path="/playlists" element={<PlaylistListPage />} />
          <Route path="/djs" element={<DJListPage />} />
          <Route path="/genre/:genreName" element={<GenrePage />} />
          <Route path="/dj/:djId" element={<DJPage />} />
          <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
          <Route path="/user/profile" element={<UserProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="users" element={<AdminDashboard />} />
            <Route path="songs" element={<AdminDashboard />} />
            <Route path="artists" element={<AdminDashboard />} />
            <Route path="genres" element={<AdminDashboard />} />
            <Route path="playlists" element={<AdminDashboard />} />
            <Route path="logs" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* AuthLayout cho các trang đăng nhập/đăng ký */}
        <Route path="/login" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
        </Route>
        <Route path="/register" element={<AuthLayout />}>
          <Route index element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
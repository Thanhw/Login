import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './AdminDashboard.css';
import apiClient from "../../services/api";

// Đăng ký các thành phần Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedDJ, setSelectedDJ] = useState(null);
  const [genreSearch, setGenreSearch] = useState('');
  const [djSearch, setDjSearch] = useState('');
  const [playlistSearch, setPlaylistSearch] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);
  const [selectedSongToAdd, setSelectedSongToAdd] = useState('');
  const [logSortField, setLogSortField] = useState('created_at');
  const [logSortOrder, setLogSortOrder] = useState('desc');
  const [logFilterAction, setLogFilterAction] = useState('all');
  const [logSearch, setLogSearch] = useState('');
  const [chartType, setChartType] = useState('byDate');
  const [editingSong, setEditingSong] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSong, setNewSong] = useState({
    title: '',
    audio_url: '',
    image_url: '',
    duration: '',
    genre_id: '',
    artist_id: ''
  });
  const [showCreateDJForm, setShowCreateDJForm] = useState(false);
  const [showCreateGenreForm, setShowCreateGenreForm] = useState(false);
  const [newGenre, setNewGenre] = useState({ name: '', image_url: '' });

  const [newDJ, setNewDJ] = useState({
    name: '',
    image_url: '',
    contact: '',
  });
  const handleCreateGenre = async () => {
    if (!newGenre.name) {
      alert('Vui lòng nhập tên');
      return;
    }

    try {
      const data = {
        name: newGenre.name
      }
      await apiClient.post('/admin/create-genres', data);
      alert('Thể loại đã được tạo!');
      setShowCreateGenreForm(false);
      setNewGenre({
        name: ''
      });
      fetchGenres(); // Hàm reload lại danh sách bài hát
    } catch (error) {
      console.error('Lỗi khi tạo Genres:', error);
      alert('Tạo Thể loại thất bại.');
    }
  };
  const handleCreateDJ = async () => {
    if (!newDJ.name) {
      alert('Vui lòng nhập tên DJ');
      return;
    }

    try {
      const data = {
        name: newDJ.name,
        image_url: newDJ.image_url
      }
      await apiClient.post('/admin/create-artist', data);
      alert('DJ đã được tạo!');
      setShowCreateDJForm(false);
      setNewDJ({
        name: '',
        image_url: ''
      });
      fetchDjs(); // Hàm reload lại danh sách bài hát
    } catch (error) {
      console.error('Lỗi khi tạo DJ:', error);
      alert('Tạo DJ thất bại.');
    }
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/admin/users') return 'users';
    if (path === '/admin/songs') return 'songs';
    if (path === '/admin/artists') return 'artists';
    if (path === '/admin/genres') return 'genres';
    if (path === '/admin/playlists') return 'playlists';
    if (path === '/admin/logs') return 'logs';
    return 'users';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    console.log("storedUser", storedUser);
    console.log("token", token);
    if (!token || !storedUser.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // if (token === 'fake-admin-token-123456' && storedUser.username === 'admin') {
        //   setUsers([
        //     { id: 1, username: 'user1', email: 'user1@example.com', is_active: true },
        //     { id: 2, username: 'user2', email: 'user2@example.com', is_active: false },
        //   ]);
        //   setSongs([
        //     { id: 1, title: 'Test Song 1', artist: 'DJ 1', genre: 'Genre 1', release_date: '2025-01-15', is_approved: true, is_featured: false },
        //     { id: 2, title: 'Test Song 2', artist: 'DJ 2', genre: 'Genre 2', release_date: '2025-02-20', is_approved: false, is_featured: false },
        //     { id: 3, title: 'Test Song 3', artist: 'DJ 1', genre: 'Genre 1', release_date: '2025-03-10', is_approved: true, is_featured: false },
        //   ]);
        //   setArtists([
        //     { id: 1, name: 'DJ 1', verified: true, contact: 'dj1@example.com' },
        //     { id: 2, name: 'DJ 2', verified: false, contact: '555-123-4567' },
        //   ]);
        //   setGenres([
        //     { id: 1, name: 'Genre 1' },
        //     { id: 2, name: 'Genre 2' },
        //   ]);
        //   setPlaylists([
        //     { id: 1, name: 'Playlist 1', user_id: 1, is_public: true },
        //     { id: 2, name: 'Playlist 2', user_id: 2, is_public: false },
        //   ]);
        //   setLogs([
        //     { id: 1, admin_id: 1, action: 'ACTIVATE', target_table: 'users', target_id: 1, details: 'Activated user', created_at: '2025-03-21T15:00:00Z' },
        //     { id: 2, admin_id: 1, action: 'DELETE', target_table: 'songs', target_id: 2, details: 'Removed unapproved song', created_at: '2025-03-21T10:30:00Z' },
        //     { id: 3, admin_id: 1, action: 'APPROVE', target_table: 'songs', target_id: 3, details: 'Approved new song', created_at: '2025-03-22T09:15:00Z' },
        //   ]);
        //   return;
        // }

        const [usersResponse, songsResponse, artistsResponse, genresResponse, playlistsResponse, logsResponse] = await Promise.all([
          fetch('http://localhost:8000/api/artists', { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:8000/api/songs', { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:8000/api/artists', { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:8000/api/genres', { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:8000/api/playlists', { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:8000/api/artists', { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }),
        ]);

        const usersData = await usersResponse.json();
        const songsData = await songsResponse.json();
        const artistsData = await artistsResponse.json();
        const genresData = await genresResponse.json();
        const playlistsData = await playlistsResponse.json();
        const logsData = await logsResponse.json();

        console.log("songs", songsData);
        if (usersResponse.ok) setUsers(usersData);
        if (songsResponse.ok) setSongs(songsData);
        if (artistsResponse.ok) setArtists(artistsData);
        if (genresResponse.ok) setGenres(genresData);
        if (playlistsResponse.ok) setPlaylists(playlistsData);
        if (logsResponse.ok) setLogs(logsData);
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchData();
  }, [navigate]);

  const fetchGenres = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/genres', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGenres(data); // Assuming setSongs is a useState setter
    } catch (error) {
      console.error('Lỗi khi fetch danh sách bài hát:', error);
    }
  };

  const fetchSongs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/songs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSongs(data); // Assuming setSongs is a useState setter
    } catch (error) {
      console.error('Lỗi khi fetch danh sách bài hát:', error);
    }
  };

  const fetchDjs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/artists', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setArtists(data); // Assuming setSongs is a useState setter
    } catch (error) {
      console.error('Lỗi khi fetch danh sách bài hát:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleManageUser = async (userId, action) => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (token === 'fake-admin-token-123456' && storedUser.username === 'admin') {
        if (userId === storedUser.id) {
          setError('Admin cannot modify their own account.');
          return;
        }
        if (action === 'DELETE') {
          setUsers(users.filter((user) => user.id !== userId));
        } else if (action === 'ACTIVATE') {
          setUsers(users.map((user) => (user.id === userId ? { ...user, is_active: true } : user)));
        } else if (action === 'DEACTIVATE') {
          setUsers(users.map((user) => (user.id === userId ? { ...user, is_active: false } : user)));
        }
        setLogs([...logs, { id: logs.length + 1, admin_id: storedUser.id, action, target_table: 'users', target_id: userId, details: 'No reason provided', created_at: new Date().toISOString() }]);
        return;
      }

      const response = await fetch('YOUR_API_ENDPOINT/admin/manage-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId, action }),
      });

      const data = await response.json();
      if (response.ok) {
        if (action === 'DELETE') {
          setUsers(users.filter((user) => user.id !== userId));
        } else if (action === 'ACTIVATE') {
          setUsers(users.map((user) => (user.id === userId ? { ...user, is_active: true } : user)));
        } else if (action === 'DEACTIVATE') {
          setUsers(users.map((user) => (user.id === userId ? { ...user, is_active: false } : user)));
        }
        setLogs([...logs, { ...data.log, details: 'No reason provided' }]);
      } else {
        setError(data.message || `Failed to ${action.toLowerCase()} user`);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleManageSong = async (songId, action) => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (token === 'fake-admin-token-123456' && storedUser.username === 'admin') {
        if (action === 'DELETE') {
          setSongs(songs.filter((song) => song.id !== songId));
        } else if (action === 'APPROVE') {
          setSongs(songs.map((song) => (song.id === songId ? { ...song, is_approved: true } : song)));
        } else if (action === 'REJECT') {
          setSongs(songs.map((song) => (song.id === songId ? { ...song, is_approved: false } : song)));
        } else if (action === 'FEATURE') {
          setSongs(songs.map((song) => (song.id === songId ? { ...song, is_featured: true } : song)));
        }
        setLogs([...logs, { id: logs.length + 1, admin_id: storedUser.id, action, target_table: 'songs', target_id: songId, details: 'No reason provided', created_at: new Date().toISOString() }]);
        return;
      }

      const response = await fetch('YOUR_API_ENDPOINT/admin/manage-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ song_id: songId, action }),
      });

      const data = await response.json();
      if (response.ok) {
        if (action === 'DELETE') {
          setSongs(songs.filter((song) => song.id !== songId));
        } else if (action === 'APPROVE') {
          setSongs(songs.map((song) => (song.id === songId ? { ...song, is_approved: true } : song)));
        } else if (action === 'REJECT') {
          setSongs(songs.map((song) => (song.id === songId ? { ...song, is_approved: false } : song)));
        } else if (action === 'FEATURE') {
          setSongs(songs.map((song) => (song.id === songId ? { ...song, is_featured: true } : song)));
        }
        setLogs([...logs, { ...data.log, details: 'No reason provided' }]);
      } else {
        setError(data.message || `Failed to ${action.toLowerCase()} song`);
      }
    } catch (err) {
      console.log("err", err);
      setError('An error occurred. Please try again.');
    }
  };

  const handleManageArtist = async (artistId, action, name = null, image_url = null) => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (token === 'fake-admin-token-123456' && storedUser.username === 'admin') {
        if (action === 'CREATE') {
          const newArtist = { id: artists.length + 1, name: name || `DJ ${artists.length + 1}`, verified: false, contact: '' };
          setArtists([...artists, newArtist]);
        } else if (action === 'DELETE') {
          setArtists(artists.filter((artist) => artist.id !== artistId));
          if (selectedDJ && selectedDJ.id === artistId) {
            setSelectedDJ(null);
          }
        } else if (action === 'VERIFY') {
          setArtists(artists.map((artist) => (artist.id === artistId ? { ...artist, verified: true } : artist)));
        } else if (action === 'UNVERIFY') {
          setArtists(artists.map((artist) => (artist.id === artistId ? { ...artist, verified: false } : artist)));
        }
        setLogs([...logs, { id: logs.length + 1, admin_id: storedUser.id, action, target_table: 'artists', target_id: action === 'CREATE' ? artists.length + 1 : artistId, details: 'No reason provided', created_at: new Date().toISOString() }]);
        return;
      }

      const response = await fetch('YOUR_API_ENDPOINT/admin/manage-artist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ artist_id: artistId, action, name, image_url }),
      });

      const data = await response.json();
      if (response.ok) {
        if (action === 'CREATE') {
          setArtists([...artists, data.artist]);
        } else if (action === 'DELETE') {
          setArtists(artists.filter((artist) => artist.id !== artistId));
          if (selectedDJ && selectedDJ.id === artistId) {
            setSelectedDJ(null);
          }
        } else if (action === 'VERIFY') {
          setArtists(artists.map((artist) => (artist.id === artistId ? { ...artist, verified: true } : artist)));
        } else if (action === 'UNVERIFY') {
          setArtists(artists.map((artist) => (artist.id === artistId ? { ...artist, verified: false } : artist)));
        }
        setLogs([...logs, { ...data.log, details: 'No reason provided' }]);
      } else {
        setError(data.message || `Failed to ${action.toLowerCase()} artist`);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleManageGenre = async (genreId, action, name = null) => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (token === 'fake-admin-token-123456' && storedUser.username === 'admin') {
        if (action === 'CREATE') {
          const newGenre = { id: genres.length + 1, name: name || `Genre ${genres.length + 1}` };
          setGenres([...genres, newGenre]);
        } else if (action === 'DELETE') {
          setGenres(genres.filter((genre) => genre.id !== genreId));
          if (selectedGenre && selectedGenre.id === genreId) {
            setSelectedGenre(null);
          }
        }
        setLogs([...logs, { id: logs.length + 1, admin_id: storedUser.id, action, target_table: 'genres', target_id: action === 'CREATE' ? genres.length + 1 : genreId, details: 'No reason provided', created_at: new Date().toISOString() }]);
        return;
      }

      const response = await fetch('YOUR_API_ENDPOINT/admin/manage-genre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ genre_id: genreId, action, name }),
      });

      const data = await response.json();
      if (response.ok) {
        if (action === 'CREATE') {
          setGenres([...genres, data.genre]);
        } else if (action === 'DELETE') {
          setGenres(genres.filter((genre) => genre.id !== genreId));
          if (selectedGenre && selectedGenre.id === genreId) {
            setSelectedGenre(null);
          }
        }
        setLogs([...logs, { ...data.log, details: 'No reason provided' }]);
      } else {
        setError(data.message || `Failed to ${action.toLowerCase()} genre`);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleManagePlaylist = async (playlistId, action) => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (token === 'fake-admin-token-123456' && storedUser.username === 'admin') {
        if (action === 'DELETE') {
          setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId));
          if (selectedPlaylistId === playlistId) {
            setSelectedPlaylistId(null);
            setPlaylistSongs([]);
          }
        } else if (action === 'MAKE_PUBLIC') {
          setPlaylists(playlists.map((playlist) => (playlist.id === playlistId ? { ...playlist, is_public: true } : playlist)));
        } else if (action === 'MAKE_PRIVATE') {
          setPlaylists(playlists.map((playlist) => (playlist.id === playlistId ? { ...playlist, is_public: false } : playlist)));
        }
        setLogs([...logs, { id: logs.length + 1, admin_id: storedUser.id, action, target_table: 'playlists', target_id: playlistId, details: 'No reason provided', created_at: new Date().toISOString() }]);
        return;
      }

      const response = await fetch('YOUR_API_ENDPOINT/admin/manage-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ playlist_id: playlistId, action }),
      });

      const data = await response.json();
      if (response.ok) {
        if (action === 'DELETE') {
          setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId));
          if (selectedPlaylistId === playlistId) {
            setSelectedPlaylistId(null);
            setPlaylistSongs([]);
          }
        } else if (action === 'MAKE_PUBLIC') {
          setPlaylists(playlists.map((playlist) => (playlist.id === playlistId ? { ...playlist, is_public: true } : playlist)));
        } else if (action === 'MAKE_PRIVATE') {
          setPlaylists(playlists.map((playlist) => (playlist.id === playlistId ? { ...playlist, is_public: false } : playlist)));
        }
        setLogs([...logs, { ...data.log, details: 'No reason provided' }]);
      } else {
        setError(data.message || `Failed to ${action.toLowerCase()} playlist`);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleSelectPlaylist = async (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setIsLoadingSongs(true);

    const token = localStorage.getItem('token');

    if (token === 'fake-admin-token-123456' && JSON.parse(localStorage.getItem('user') || '{}').username === 'admin') {
      const mockPlaylistSongs = {
        1: [
          { id: 1, title: 'Test Song 1', artist: 'DJ 1', genre: 'Genre 1', release_date: '2025-01-15', is_approved: true, is_featured: false },
          { id: 2, title: 'Test Song 2', artist: 'DJ 2', genre: 'Genre 2', release_date: '2025-02-20', is_approved: false, is_featured: false },
        ],
        2: [
          { id: 2, title: 'Test Song 2', artist: 'DJ 2', genre: 'Genre 2', release_date: '2025-02-20', is_approved: false, is_featured: false },
        ],
      };

      setPlaylistSongs(mockPlaylistSongs[playlistId] || []);
      setIsLoadingSongs(false);
      return;
    }

    try {
      const response = await fetch(`YOUR_API_ENDPOINT/admin/playlist-songs/${playlistId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setPlaylistSongs(data.songs || []);
      } else {
        setError(data.message || 'Failed to fetch songs for the playlist');
        setPlaylistSongs([]);
      }
    } catch (err) {
      setError('An error occurred while fetching playlist songs. Please try again.');
      setPlaylistSongs([]);
    } finally {
      setIsLoadingSongs(false);
    }
  };

  const handleCreateSong = async () => {
    try {
      const data = {
        title: newSong.title,
        song_file_url: newSong.audio_url,
        image_url: newSong.image_url,
        artists: [newSong.artist_id],
        genres: [newSong.genre_id],
        duration: parseInt(newSong.duration, 10),
      }

      console.log("create songs", data);
      await apiClient.post('/admin/create-song', data);
      alert('Bài hát đã được tạo!');
      setShowCreateForm(false);
      setNewSong({
        title: '',
        audio_url: '',
        image_url: '',
        duration: '',
        genre_id: '',
        artist_id: ''
      });
      fetchSongs(); // Hàm reload lại danh sách bài hát
    } catch (error) {
      console.error('Lỗi khi tạo bài hát:', error);
      alert('Tạo bài hát thất bại.');
    }
  };


  const handleAddSongToPlaylist = async () => {
    if (!selectedPlaylistId || !selectedSongToAdd) {
      setError('Vui lòng chọn một playlist và một bài hát để thêm.');
      return;
    }

    const songToAdd = songs.find(song => song.id === parseInt(selectedSongToAdd));
    if (!songToAdd) {
      setError('Bài hát không tồn tại.');
      return;
    }

    const token = localStorage.getItem('token');

    if (token === 'fake-admin-token-123456' && JSON.parse(localStorage.getItem('user') || '{}').username === 'admin') {
      if (playlistSongs.some(song => song.id === songToAdd.id)) {
        setError('Bài hát đã tồn tại trong playlist.');
        return;
      }

      setPlaylistSongs([...playlistSongs, songToAdd]);
      setSelectedSongToAdd('');
      return;
    }

    try {
      const response = await fetch(`YOUR_API_ENDPOINT/admin/playlist/${selectedPlaylistId}/add-song`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ song_id: songToAdd.id }),
      });

      const data = await response.json();
      if (response.ok) {
        setPlaylistSongs([...playlistSongs, songToAdd]);
        setSelectedSongToAdd('');
      } else {
        setError(data.message || 'Failed to add song to the playlist');
      }
    } catch (err) {
      setError('An error occurred while adding the song. Please try again.');
    }
  };

  const handleRemoveSongFromPlaylist = async (songId) => {
    const token = localStorage.getItem('token');

    if (token === 'fake-admin-token-123456' && JSON.parse(localStorage.getItem('user') || '{}').username === 'admin') {
      setPlaylistSongs(playlistSongs.filter(song => song.id !== songId));
      return;
    }

    try {
      const response = await fetch(`YOUR_API_ENDPOINT/admin/playlist/${selectedPlaylistId}/remove-song`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ song_id: songId }),
      });

      const data = await response.json();
      if (response.ok) {
        setPlaylistSongs(playlistSongs.filter(song => song.id !== songId));
      } else {
        setError(data.message || 'Failed to remove song from the playlist');
      }
    } catch (err) {
      setError('An error occurred while removing the song. Please try again.');
    }
  };

  const handleAddSongToGenre = async (genreId) => {
    const title = prompt('Tiêu đề bài hát:');
    if (!title) return;

    const artistName = prompt('Tên nghệ sĩ (DJ):');
    if (!artistName) return;

    const releaseDate = prompt('Ngày phát hành (YYYY-MM-DD):');
    if (!releaseDate) return;

    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (token === 'fake-admin-token-123456' && storedUser.username === 'admin') {
      const newSong = {
        id: songs.length + 1,
        title,
        artist: artistName,
        genre: genres.find(g => g.id === genreId).name,
        release_date: releaseDate,
        is_approved: false,
        is_featured: false,
      };
      setSongs([...songs, newSong]);
      setLogs([...logs, { id: logs.length + 1, admin_id: storedUser.id, action: 'CREATE', target_table: 'songs', target_id: newSong.id, details: 'No reason provided', created_at: new Date().toISOString() }]);
      return;
    }

    try {
      const response = await fetch('YOUR_API_ENDPOINT/admin/add-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, artist: artistName, genre_id: genreId, release_date: releaseDate }),
      });

      const data = await response.json();
      if (response.ok) {
        setSongs([...songs, data.song]);
        setLogs([...logs, { ...data.log, details: 'No reason provided' }]);
      } else {
        setError(data.message || 'Failed to add song');
      }
    } catch (err) {
      setError('An error occurred while adding the song. Please try again.');
    }
  };

  const handleAddSongToDJ = async (djId) => {
    const title = prompt('Tiêu đề bài hát:');
    if (!title) return;

    const genreName = prompt('Thể loại:');
    if (!genreName) return;

    const releaseDate = prompt('Ngày phát hành (YYYY-MM-DD):');
    if (!releaseDate) return;

    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (token === 'fake-admin-token-123456' && storedUser.username === 'admin') {
      const newSong = {
        id: songs.length + 1,
        title,
        artist: artists.find(dj => dj.id === djId).name,
        genre: genreName,
        release_date: releaseDate,
        is_approved: false,
        is_featured: false,
      };
      setSongs([...songs, newSong]);
      setLogs([...logs, { id: logs.length + 1, admin_id: storedUser.id, action: 'CREATE', target_table: 'songs', target_id: newSong.id, details: 'No reason provided', created_at: new Date().toISOString() }]);
      return;
    }

    try {
      const response = await fetch('YOUR_API_ENDPOINT/admin/add-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, artist_id: djId, genre: genreName, release_date: releaseDate }),
      });

      const data = await response.json();
      if (response.ok) {
        setSongs([...songs, data.song]);
        setLogs([...logs, { ...data.log, details: 'No reason provided' }]);
      } else {
        setError(data.message || 'Failed to add song');
      }
    } catch (err) {
      setError('An error occurred while adding the song. Please try again.');
    }
  };

  const handleEditSong = async (song) => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (token === 'fake-admin-token-123456' && storedUser.username === 'admin') {
      setSongs(songs.map(s => (s.id === song.id ? song : s)));
      setEditingSong(null);
      setLogs([...logs, { id: logs.length + 1, admin_id: storedUser.id, action: 'UPDATE', target_table: 'songs', target_id: song.id, details: 'No reason provided', created_at: new Date().toISOString() }]);
      return;
    }

    try {
      const response = await fetch('YOUR_API_ENDPOINT/admin/update-song', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(song),
      });

      const data = await response.json();
      if (response.ok) {
        setSongs(songs.map(s => (s.id === song.id ? data.song : s)));
        setEditingSong(null);
        setLogs([...logs, { ...data.log, details: 'No reason provided' }]);
      } else {
        setError(data.message || 'Failed to update song');
      }
    } catch (err) {
      setError('An error occurred while updating the song. Please try again.');
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (token === 'fake-admin-token-346' && storedUser.username === 'admin') {
        setSongs(songs.filter(song => song.id !== songId));
        setLogs([...logs, { id: logs.length + 1, admin_id: storedUser.id, action: 'DELETE', target_table: 'songs', target_id: songId, details: 'No reason provided', created_at: new Date().toISOString() }]);
        return;
      }

      const response = await fetch('YOUR_API_ENDPOINT/admin/manage-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ song_id: songId, action: 'DELETE' }),
      });

      const data = await response.json();
      if (response.ok) {
        setSongs(songs.filter(song => song.id !== songId));
        setLogs([...logs, { ...data.log, details: 'No reason provided' }]);
      } else {
        setError(data.message || 'Failed to delete song');
      }
    } catch (err) {
      setError('An error occurred while deleting the song. Please try again.');
    }
  };

  const getUploadedSongsCount = (djName) => {
    return songs.filter(song => song.artist === djName).length;
  };

  const prepareChartData = () => {
    let labels = [];
    let data = [];

    if (chartType === 'byDate') {
      const logCountsByDate = {};
      logs.forEach(log => {
        const date = new Date(log.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
        logCountsByDate[date] = (logCountsByDate[date] || 0) + 1;
      });

      labels = Object.keys(logCountsByDate).sort((a, b) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-')));
      data = labels.map(date => logCountsByDate[date]);
    } else if (chartType === 'byAction') {
      const logCountsByAction = {};
      logs.forEach(log => {
        logCountsByAction[log.action] = (logCountsByAction[log.action] || 0) + 1;
      });

      labels = Object.keys(logCountsByAction);
      data = labels.map(action => logCountsByAction[action]);
    }

    return {
      labels,
      datasets: [
        {
          label: chartType === 'byDate' ? 'Số lượng hành động theo ngày' : 'Số lượng hành động theo loại',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const sortedAndFilteredLogs = [...logs]
    .filter(log =>
      (logFilterAction === 'all' || log.action === logFilterAction) &&
      (logSearch === '' || log.details.toLowerCase().includes(logSearch.toLowerCase()))
    )
    .sort((a, b) => {
      const fieldA = a[logSortField];
      const fieldB = b[logSortField];
      if (logSortField === 'created_at') {
        const dateA = new Date(fieldA);
        const dateB = new Date(fieldB);
        return logSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return logSortOrder === 'asc'
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });

  const groupLogsByDate = (logs) => {
    const grouped = {};
    logs.forEach(log => {
      const date = new Date(log.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(log);
    });
    return grouped;
  };

  const groupedLogs = groupLogsByDate(sortedAndFilteredLogs);

  const handleSort = (field) => {
    if (logSortField === field) {
      setLogSortOrder(logSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setLogSortField(field);
      setLogSortOrder('asc');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(genreSearch.toLowerCase())
  );

  const filteredDJs = artists.filter(dj =>
    dj.name.toLowerCase().includes(djSearch.toLowerCase())
  );

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(playlistSearch.toLowerCase())
  );

  const getDashboardStats = () => {
    const totalLogs = logs.length;
    const actionsCount = {};
    const datesCount = {};
    const currentTime = new Date('2025-05-18T23:35:00+07:00'); // Thời gian hiện tại: 11:35 PM, 18/05/2025
    const twentyFourHoursAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000); // 24 giờ trước

    let recentLogsCount = 0;

    logs.forEach(log => {
      const logTime = new Date(log.created_at);
      actionsCount[log.action] = (actionsCount[log.action] || 0) + 1;
      const date = logTime.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
      datesCount[date] = (datesCount[date] || 0) + 1;

      // Đếm số hành động trong 24 giờ gần nhất
      if (logTime >= twentyFourHoursAgo && logTime <= currentTime) {
        recentLogsCount++;
      }
    });

    const topAction = Object.entries(actionsCount).sort((a, b) => b[1] - a[1])[0];
    const topDate = Object.entries(datesCount).sort((a, b) => b[1] - a[1])[0];

    return {
      totalLogs,
      actionsCount,
      topAction: topAction ? `${topAction[0]} (${topAction[1]} lần)` : 'N/A',
      topDate: topDate ? `${topDate[0]} (${topDate[1]} hành động)` : 'N/A',
      recentLogsCount,
    };
  };

  const dashboardStats = getDashboardStats();

  return (
    <div className="admin-dashboard">
      <h2>TRANG QUẢN LÝ</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="admin-content">
        <div className="content-section">
          {/* Quản lý Người Dùng */}
          {activeTab === 'users' && (
            <div>
              <h3>Danh sách Người Dùng</h3>
              {users.length > 0 ? (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên người dùng</th>
                      <th>Email</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.is_active ? 'Hoạt động' : 'Vô hiệu hóa'}</td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={() => handleManageUser(user.id, 'ACTIVATE')} className="action-button activate">Kích hoạt</button>
                            <button onClick={() => handleManageUser(user.id, 'DEACTIVATE')} className="action-button deactivate">Vô hiệu hóa</button>
                            <button onClick={() => handleManageUser(user.id, 'DELETE')} className="action-button delete">Xóa</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Không có người dùng nào.</p>
              )}
            </div>
          )}

          {/* Quản lý Bài Hát */}
          {activeTab === 'songs' && (
            <div>
              <h3>Danh sách Bài Hát</h3>
              <button
                  onClick={() => setShowCreateForm(true)}
                  className="action-button create"
              >
                Tạo bài hát mới
              </button>
              {showCreateForm && (
                  <div className="create-song-form">
                    <h4>Thêm Bài Hát Mới</h4>
                    <input
                        type="text"
                        placeholder="Tên bài hát"
                        value={newSong.title}
                        onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="URL bài hát"
                        value={newSong.audio_url}
                        onChange={(e) => setNewSong({ ...newSong, audio_url: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="URL ảnh bài hát"
                        value={newSong.image_url}
                        onChange={(e) => setNewSong({ ...newSong, image_url: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Thời lượng - phút (ví dụ: 120)"
                        value={newSong.duration}
                        onChange={(e) => setNewSong({ ...newSong, duration: e.target.value })}
                    />

                    {/* Chọn thể loại */}
                    <select
                        value={newSong.genre_id}
                        onChange={(e) => setNewSong({ ...newSong, genre_id: e.target.value })}
                    >
                      <option value="">-- Chọn thể loại --</option>
                      {genres.map((genre) => (
                          <option key={genre.id} value={genre.id}>
                            {genre.name}
                          </option>
                      ))}
                    </select>

                    {/* Chọn tác giả */}
                    <select
                        value={newSong.artist_id}
                        onChange={(e) => setNewSong({ ...newSong, artist_id: e.target.value })}
                    >
                      <option value="">-- Chọn DJ --</option>
                      {artists.map((artists) => (
                          <option key={artists.id} value={artists.id}>
                            {artists.name}
                          </option>
                      ))}
                    </select>

                    <button className="action-button create" onClick={() => handleCreateSong()}>
                      Lưu bài hát
                    </button>
                    <button className="action-button delete" onClick={() => setShowCreateForm(false)}>
                      Hủy
                    </button>
                  </div>
              )}

              {songs.length > 0 ? (
                <table className="songs-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tiêu đề</th>
                      <th>Tác giả</th>
                      <th>Thể loại</th>
                      <th>Ngày phát hành</th>
                      <th>Phê duyệt</th>
                      <th>Nổi bật</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songs.map((song) => (
                      <tr key={song.id}>
                        <td>{song.id}</td>
                        <td>{song.title}</td>
                        <td>{song.artist}</td>
                        <td>{song.genre}</td>
                        <td>{song.release_date}</td>
                        <td>{song.is_approved ? 'Có' : 'Không'}</td>
                        <td>{song.is_featured ? 'Có' : 'Không'}</td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={() => handleManageSong(song.id, 'APPROVE')} className="action-button activate">Phê duyệt</button>
                            <button onClick={() => handleManageSong(song.id, 'REJECT')} className="action-button deactivate">Từ chối</button>
                            <button onClick={() => handleManageSong(song.id, 'FEATURE')} className="action-button feature">Nổi bật</button>
                            <button onClick={() => handleManageSong(song.id, 'DELETE')} className="action-button delete">Xóa</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Không có bài hát nào.</p>
              )}
            </div>
          )}

          {/* Quản lý DJ */}
          {activeTab === 'artists' && (
            <div>
              <h3>Danh sách DJ</h3>
              <div className="genre-controls">
                <button
                    onClick={() => setShowCreateDJForm(true)}
                    className="action-button create"
                >
                  Tạo DJ mới
                </button>

                {showCreateDJForm && (
                    <div className="create-dj-form">
                      <h4>Thêm DJ Mới</h4>
                      <input
                          type="text"
                          placeholder="Tên DJ"
                          value={newDJ.name}
                          onChange={(e) => setNewDJ({ ...newDJ, name: e.target.value })}
                      />
                      <input
                          type="text"
                          placeholder="URL ảnh DJ"
                          value={newDJ.image_url}
                          onChange={(e) => setNewDJ({ ...newDJ, image_url: e.target.value })}
                      />

                      <button className="action-button create" onClick={handleCreateDJ}>
                        Lưu DJ
                      </button>
                      <button className="action-button delete" onClick={() => setShowCreateDJForm(false)}>
                        Hủy
                      </button>
                    </div>
                )}


                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Tìm kiếm DJ..."
                    value={djSearch}
                    onChange={(e) => setDjSearch(e.target.value)}
                  />
                </div>
              </div>
              {filteredDJs.length > 0 ? (
                <table className="djs-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>Ảnh</th>
                      <th>Xác minh</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDJs.map((dj) => (
                      <tr
                        key={dj.id}
                        onClick={() => setSelectedDJ(dj)}
                        className={selectedDJ && selectedDJ.id === dj.id ? 'selected' : ''}
                      >
                        <td>{dj.id}</td>
                        <td>{dj.name}</td>
                        <td>
                          {dj.image_url ? (
                              <img
                                  src={dj.image_url}
                                  alt={dj.name}
                                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                              />
                          ) : (
                              'Không có ảnh'
                          )}
                        </td>                        <td>{dj.verified ? 'Có' : 'Không'}</td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={(e) => { e.stopPropagation(); handleManageArtist(dj.id, 'VERIFY'); }} className="action-button activate">Xác minh</button>
                            <button onClick={(e) => { e.stopPropagation(); handleManageArtist(dj.id, 'UNVERIFY'); }} className="action-button deactivate">Hủy xác minh</button>
                            <button onClick={(e) => { e.stopPropagation(); handleManageArtist(dj.id, 'DELETE'); }} className="action-button delete">Xóa</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Không có DJ nào.</p>
              )}

              {selectedDJ && (
                <div className="dj-songs">
                  <h4>Bài hát của {selectedDJ.name}</h4>
                  <button
                    onClick={() => handleAddSongToDJ(selectedDJ.id)}
                    className="action-button create"
                  >
                    Thêm bài hát

                  </button>
                  {songs.filter(song => song.artist === selectedDJ.name).length > 0 ? (
                    <table className="songs-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Tiêu đề</th>
                          <th>Thể loại</th>
                          <th>Ngày phát hành</th>
                          <th>Phê duyệt</th>
                          <th>Nổi bật</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {songs.filter(song => song.artist === selectedDJ.name).map((song) => (
                          <tr key={song.id}>
                            <td>{song.id}</td>
                            <td>
                              {editingSong && editingSong.id === song.id ? (
                                <input
                                  type="text"
                                  value={editingSong.title}
                                  onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })}
                                />
                              ) : (
                                song.title
                              )}
                            </td>
                            <td>
                              {editingSong && editingSong.id === song.id ? (
                                <input
                                  type="text"
                                  value={editingSong.genre}
                                  onChange={(e) => setEditingSong({ ...editingSong, genre: e.target.value })}
                                />
                              ) : (
                                song.genre
                              )}
                            </td>
                            <td>
                              {editingSong && editingSong.id === song.id ? (
                                <input
                                  type="text"
                                  value={editingSong.release_date}
                                  onChange={(e) => setEditingSong({ ...editingSong, release_date: e.target.value })}
                                />
                              ) : (
                                song.release_date
                              )}
                            </td>
                            <td>{song.is_approved ? 'Có' : 'Không'}</td>
                            <td>{song.is_featured ? 'Có' : 'Không'}</td>
                            <td>
                              <div className="action-buttons">
                                {editingSong && editingSong.id === song.id ? (
                                  <>
                                    <button
                                      onClick={() => handleEditSong(editingSong)}
                                      className="action-button create"
                                    >
                                      Lưu
                                    </button>
                                    <button
                                      onClick={() => setEditingSong(null)}
                                      className="action-button delete"
                                    >
                                      Hủy
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => setEditingSong({ ...song })}
                                      className="action-button activate"
                                    >
                                      Sửa
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSong(song.id)}
                                      className="action-button delete"
                                    >
                                      Xóa
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Không có bài hát nào của DJ này.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quản lý Thể Loại */}
          {activeTab === 'genres' && (
            <div>
              <h3>Danh sách Thể Loại</h3>
              <div className="genre-controls">
                <button
                    onClick={() => setShowCreateGenreForm(true)}
                    className="action-button create"
                >
                  Tạo thể loại mới
                </button>

                {showCreateGenreForm && (
                    <div className="create-genre-form">
                      <h4>Thêm Thể Loại Mới</h4>
                      <input
                          type="text"
                          placeholder="Tên thể loại"
                          value={newGenre.name}
                          onChange={(e) => setNewGenre({ ...newGenre, name: e.target.value })}
                      />

                      <button className="action-button create" onClick={handleCreateGenre}>
                        Lưu thể loại
                      </button>
                      <button
                          className="action-button delete"
                          onClick={() => setShowCreateGenreForm(false)}
                      >
                        Hủy
                      </button>
                    </div>
                )}

                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Tìm kiếm thể loại..."
                    value={genreSearch}
                    onChange={(e) => setGenreSearch(e.target.value)}
                  />
                </div>
              </div>
              {filteredGenres.length > 0 ? (
                <table className="genres-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGenres.map((genre) => (
                      <tr
                        key={genre.id}
                        onClick={() => setSelectedGenre(genre)}
                        className={selectedGenre && selectedGenre.id === genre.id ? 'selected' : ''}
                      >
                        <td>{genre.id}</td>
                        <td>{genre.name}</td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={(e) => { e.stopPropagation(); handleManageGenre(genre.id, 'DELETE'); }} className="action-button delete">Xóa</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Không có thể loại nào.</p>
              )}

              {selectedGenre && (
                <div className="genre-songs">
                  <h4>Bài hát thuộc thể loại {selectedGenre.name}</h4>
                  <button
                    onClick={() => handleAddSongToGenre(selectedGenre.id)}
                    className="action-button create"
                  >
                    Thêm bài hát
                  </button>
                  {songs.filter(song => song.genre === selectedGenre.name).length > 0 ? (
                    <table className="songs-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Tiêu đề</th>
                          <th>Tác giả</th>
                          <th>Ngày phát hành</th>
                          <th>Phê duyệt</th>
                          <th>Nổi bật</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {songs.filter(song => song.genre === selectedGenre.name).map((song) => (
                          <tr key={song.id}>
                            <td>{song.id}</td>
                            <td>
                              {editingSong && editingSong.id === song.id ? (
                                <input
                                  type="text"
                                  value={editingSong.title}
                                  onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })}
                                />
                              ) : (
                                song.title
                              )}
                            </td>
                            <td>
                              {editingSong && editingSong.id === song.id ? (
                                <input
                                  type="text"
                                  value={editingSong.artist}
                                  onChange={(e) => setEditingSong({ ...editingSong, artist: e.target.value })}
                                />
                              ) : (
                                song.artist
                              )}
                            </td>
                            <td>
                              {editingSong && editingSong.id === song.id ? (
                                <input
                                  type="text"
                                  value={editingSong.release_date}
                                  onChange={(e) => setEditingSong({ ...editingSong, release_date: e.target.value })}
                                />
                              ) : (
                                song.release_date
                              )}
                            </td>
                            <td>{song.is_approved ? 'Có' : 'Không'}</td>
                            <td>{song.is_featured ? 'Có' : 'Không'}</td>
                            <td>
                              <div className="action-buttons">
                                {editingSong && editingSong.id === song.id ? (
                                  <>
                                    <button
                                      onClick={() => handleEditSong(editingSong)}
                                      className="action-button create"
                                    >
                                      Lưu
                                    </button>
                                    <button
                                      onClick={() => setEditingSong(null)}
                                      className="action-button delete"
                                    >
                                      Hủy
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => setEditingSong({ ...song })}
                                      className="action-button activate"
                                    >
                                      Sửa
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSong(song.id)}
                                      className="action-button delete"
                                    >
                                      Xóa
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Không có bài hát nào thuộc thể loại này.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quản lý Playlist */}
          {activeTab === 'playlists' && (
            <div>
              <h3>Danh sách Playlist</h3>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Tìm kiếm playlist..."
                  value={playlistSearch}
                  onChange={(e) => setPlaylistSearch(e.target.value)}
                />
              </div>
              {filteredPlaylists.length > 0 ? (
                <table className="playlists-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>User ID</th>
                      <th>Công khai</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlaylists.map((playlist) => (
                      <tr
                        key={playlist.id}
                        onClick={() => handleSelectPlaylist(playlist.id)}
                        className={selectedPlaylistId === playlist.id ? 'selected' : ''}
                      >
                        <td>{playlist.id}</td>
                        <td>{playlist.name}</td>
                        <td>{playlist.user_id}</td>
                        <td>{playlist.is_public ? 'Có' : 'Không'}</td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={(e) => { e.stopPropagation(); handleManagePlaylist(playlist.id, 'MAKE_PUBLIC'); }} className="action-button activate">Đặt công khai</button>
                            <button onClick={(e) => { e.stopPropagation(); handleManagePlaylist(playlist.id, 'MAKE_PRIVATE'); }} className="action-button deactivate">Đặt riêng tư</button>
                            <button onClick={(e) => { e.stopPropagation(); handleManagePlaylist(playlist.id, 'DELETE'); }} className="action-button delete">Xóa</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Không có playlist nào.</p>
              )}

              {selectedPlaylistId && (
                <div className="playlist-songs">
                  <h4>Bài hát trong Playlist</h4>
                  <div className="add-song-section">
                    <label htmlFor="add-song">Thêm bài hát: </label>
                    <select
                      id="add-song"
                      value={selectedSongToAdd}
                      onChange={(e) => setSelectedSongToAdd(e.target.value)}
                    >
                      <option value="">Chọn bài hát</option>
                      {songs.map((song) => (
                        <option key={song.id} value={song.id}>
                          {song.title} - {song.artist}
                        </option>
                      ))}
                    </select>
                    <button onClick={handleAddSongToPlaylist} className="action-button create">
                      Thêm
                    </button>
                  </div>
                  {isLoadingSongs ? (
                    <p>Đang tải bài hát...</p>
                  ) : playlistSongs.length > 0 ? (
                    <table className="songs-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Tiêu đề</th>
                          <th>Tác giả</th>
                          <th>Thể loại</th>
                          <th>Ngày phát hành</th>
                          <th>Phê duyệt</th>
                          <th>Nổi bật</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playlistSongs.map((song) => (
                          <tr key={song.id}>
                            <td>{song.id}</td>
                            <td>{song.title}</td>
                            <td>{song.artist}</td>
                            <td>{song.genre}</td>
                            <td>{song.release_date}</td>
                            <td>{song.is_approved ? 'Có' : 'Không'}</td>
                            <td>{song.is_featured ? 'Có' : 'Không'}</td>
                            <td>
                              <div className="action-buttons">
                                <button onClick={() => handleRemoveSongFromPlaylist(song.id)} className="action-button delete">Xóa</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Không có bài hát nào trong playlist này.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Xem Log */}
          {activeTab === 'logs' && (
            <div className="logs-section">
              <h3>Lịch sử Hành động</h3>
              <div className="dashboard-section">
                <h4 className="dashboard-title">Bảng Thống Kê</h4>
                <div className="dashboard-stats">
                  <div className="stat-box total-logs">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                      <h5>Tổng Số Hành Động</h5>
                      <p>{dashboardStats.totalLogs}</p>
                    </div>
                  </div>
                  <div className="stat-box top-action">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                      <h5>Hành Động Phổ Biến Nhất</h5>
                      <p>{dashboardStats.topAction}</p>
                    </div>
                  </div>
                  <div className="stat-box top-date">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                      <h5>Ngày Hoạt Động Cao Nhất</h5>
                      <p>{dashboardStats.topDate}</p>
                    </div>
                  </div>
                  <div className="stat-box recent-logs">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                      <h5>Hành Động 24h Gần Nhất</h5>
                      <p>{dashboardStats.recentLogsCount}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="log-controls">
                <div className="log-filter">
                  <label htmlFor="action-filter">Lọc theo Hành động: </label>
                  <select
                    id="action-filter"
                    value={logFilterAction}
                    onChange={(e) => setLogFilterAction(e.target.value)}
                  >
                    <option value="all">Tất cả Hành động</option>
                    {[...new Set(logs.map(log => log.action))].map(action => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Tìm kiếm chi tiết log..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                  />
                </div>
                <div className="chart-type-selector">
                  <label htmlFor="chart-type">Loại biểu đồ: </label>
                  <select
                    id="chart-type"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                  >
                    <option value="byDate">Theo ngày</option>
                    <option value="byAction">Theo hành động</option>
                  </select>
                </div>
              </div>
              <div className="chart-container">
                <Bar
                  data={prepareChartData()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: { color: '#bbb' },
                      },
                      title: {
                        display: true,
                        text: chartType === 'byDate' ? 'Thống kê hành động theo ngày' : 'Thống kê hành động theo loại',
                        color: '#fff',
                        font: { size: 16 },
                      },
                    },
                    scales: {
                      x: { ticks: { color: '#bbb' }, grid: { color: '#444' } },
                      y: { ticks: { color: '#bbb' }, grid: { color: '#444' }, beginAtZero: true },
                    },
                  }}
                />
              </div>
              {Object.keys(groupedLogs).length > 0 ? (
                <div className="logs-container">
                  {Object.entries(groupedLogs).map(([date, logsForDate]) => (
                    <div key={date} className="log-group">
                      <h4 className="log-date-header">{date}</h4>
                      <table className="logs-table">
                        <thead>
                          <tr>
                            <th onClick={() => handleSort('id')}>
                              ID {logSortField === 'id' && (logSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('admin_id')}>
                              Admin ID {logSortField === 'admin_id' && (logSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('action')}>
                              Hành động {logSortField === 'action' && (logSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('target_table')}>
                              Bảng {logSortField === 'target_table' && (logSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('target_id')}>
                              Target ID {logSortField === 'target_id' && (logSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('details')}>
                              Chi tiết {logSortField === 'details' && (logSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('created_at')}>
                              Thời gian {logSortField === 'created_at' && (logSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {logsForDate.map((log) => (
                            <tr key={log.id}>
                              <td>{log.id}</td>
                              <td>{log.admin_id}</td>
                              <td>{log.action}</td>
                              <td>{log.target_table}</td>
                              <td>{log.target_id}</td>
                              <td>{log.details}</td>
                              <td>{formatTimestamp(log.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Không có log nào phù hợp với bộ lọc.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <button onClick={handleLogout} className="logout-button">
        Đăng xuất
      </button>
    </div>
  );
};

export default AdminDashboard;
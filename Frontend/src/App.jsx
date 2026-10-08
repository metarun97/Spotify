import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ArtistDashboard from './pages/ArtistDashboard';
import ArtistMusicUpload from './pages/ArtistMusicUpload';
import MusicPlayerPage from './pages/MusicPlayerPage';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3002', { withCredentials: true });

    setSocket(newSocket);

    newSocket.on('play', (data) => {
      const musicId = data.musicId;

      window.location.href = `/music/${musicId}`;
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home socket={socket} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/music/:id" element={<MusicPlayerPage />} />
      <Route path="/artist/dashboard" element={<ArtistDashboard />} />
      <Route path="/artist/upload" element={<ArtistMusicUpload />} />
    </Routes>
  );
}

export default App;

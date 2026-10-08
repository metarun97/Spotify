import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './MusicPlayerPage.css';
import axios from 'axios';
import { FaCirclePause, FaCirclePlay } from 'react-icons/fa6';

const demoTrack = {
  id: 'demo',
  title: 'Midnight Drive',
  artist: 'Alex Morgan',
  coverImageUrl:
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
};

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${mins}:${secs}`;
}

function MusicPlayerPage() {
  const { id } = useParams();
  const audioRef = useRef(null);

  const [song, setSong] = useState({
    ...demoTrack,
    id: id || demoTrack.id,
  });
  const [volume, setVolume] = useState(0.75);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const speedOptions = [0.75, 1, 1.25, 1.5, 2];

  const handlePlayToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value);
    const audio = audioRef.current;

    setVolume(nextVolume);
    if (audio) audio.volume = nextVolume;
  };

  const handleSpeedChange = (nextSpeed) => {
    const audio = audioRef.current;

    setSpeed(nextSpeed);
    if (audio) audio.playbackRate = nextSpeed;
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3002/api/music/get-details/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setSong(res.data.music);
      });
  }, []);

  return (
    <main className="music-player-page">
      <div className="music-player-card">
        <Link to="/" className="music-player-back">
          ← Back to library
        </Link>

        <div className="music-player-layout">
          <div className="music-player-cover">
            <img src={song.coverImageUrl} alt={song.title} />
          </div>

          <div>
            <p className="music-player-label">Now playing</p>
            <h1 className="music-player-title">{song.title}</h1>
            <p className="music-player-artist">{song.artist}</p>
          </div>
        </div>

        <div className="music-player-controls">
          <div className="music-player-top-row">
            <button
              type="button"
              className="music-player-button"
              onClick={handlePlayToggle}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FaCirclePause /> : <FaCirclePlay />}
            </button>

            <div className="music-player-volume">
              <span>Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>

          <div className="music-player-progress-wrap">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="music-player-progress"
            />
            <div className="music-player-time-row">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="music-player-speed-row">
            <span className="music-player-speed-label">Speed</span>
            {speedOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSpeedChange(option)}
                className={`music-player-speed-button ${
                  option === speed ? 'is-active' : ''
                }`}
              >
                {option}x
              </button>
            ))}
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={song.musicUrl}
        volume={volume}
        playbackrate={speed}
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration || 0)
        }
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime || 0)
        }
        onEnded={() => setIsPlaying(false)}
        autoPlay
      />
    </main>
  );
}

export default MusicPlayerPage;

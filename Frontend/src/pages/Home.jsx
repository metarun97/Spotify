import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ArtistDashboard.css';
import axios from 'axios';

const playlistArtOptions = ['after-hours', 'writing-room', 'live-favorites'];

function Home({ socket }) {
  const [musics, setMusics] = useState([
    {
      id: 'track-1',
      title: 'Midnight Drive',
      artist: 'Alex Morgan',
      coverImageUrl:
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      imageUrl: '',
      plays: '2,410',
      release: '2026-08-22',
    },
    {
      id: 'track-2',
      title: 'Golden Hour',
      artist: 'Alex Morgan',
      coverImageUrl:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
      imageUrl: '',
      plays: '1,860',
      release: '2026-07-14',
    },
    {
      id: 'track-3',
      title: 'Paper Planes',
      artist: 'Alex Morgan',
      coverImageUrl:
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80',
      imageUrl: '',
      plays: '980',
      release: '2026-06-03',
    },
  ]);

  const [playlists, setPlaylists] = useState([
    {
      id: 'playlist-1',
      title: 'After Hours',
      count: '0',
    },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    /* Get all musics */
    axios
      .get('http://localhost:3002/api/music', { withCredentials: true })
      .then((res) => {
        setMusics(
          res.data.musics.map((m) => ({
            id: m._id,
            title: m.title,
            artist: m.artist,
            coverImageUrl: m.coverImageUrl,
            musicUrl: m.musicUrl,
          })),
        );
      });

    /* Get all playlists */
    axios
      .get('http://localhost:3002/api/music/playlist', {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        setPlaylists(
          res.data.playlists.map((p) => ({
            id: p._id,
            title: p.title,
            count: p.musics.length,
          })),
        );
      });
  }, []);

  return (
    <main className="artist-dashboard">
      <header className="artist-header">
        <Link className="artist-wordmark" to="/" aria-label="Spotify home">
          Spotify
        </Link>
        <span className="artist-header-label">Music library</span>
        <Link className="artist-action-button" to="/artist/dashboard">
          Artist dashboard
        </Link>
      </header>

      <div className="artist-content">
        <section className="artist-welcome" aria-labelledby="library-title">
          <div>
            <p className="artist-eyebrow">YOUR CATALOG</p>
            <h1 id="library-title">Music and playlists</h1>
            <p className="artist-subtitle">
              Browse every track and playlist in your library.
            </p>
          </div>
          <span className="artist-section-count">
            {musics.length} tracks · {playlists.length} playlists
          </span>
        </section>

        <section
          className="artist-section"
          aria-labelledby="library-tracks-title"
        >
          <div className="artist-section-heading">
            <div>
              <p className="artist-eyebrow">ALL RELEASES</p>
              <h2 id="library-tracks-title">Every track</h2>
            </div>
            <span className="artist-section-count">{musics.length} tracks</span>
          </div>

          <div className="home-track-grid" aria-label="All tracks">
            {musics.length ? (
              musics.map((music, index) => (
                <article
                  onClick={() => {
                    socket?.emit('play', { musicId: music.id });
                    navigate(`/music/${music.id}`);
                  }}
                  className="home-track-tile"
                  key={music.id ?? `${music.title}-${index}`}
                >
                  <div className="home-track-cover">
                    {music.coverImageUrl || music.imageUrl ? (
                      <img
                        src={music.coverImageUrl || music.imageUrl}
                        alt={`${music.title} cover`}
                        loading="lazy"
                      />
                    ) : (
                      <span aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                  <div className="home-track-copy">
                    <strong>{music.title}</strong>
                    <span>{music.artist}</span>
                    <small>{music.plays ?? '—'} plays</small>
                  </div>
                </article>
              ))
            ) : (
              <p className="artist-subtitle">No tracks found.</p>
            )}
          </div>
        </section>

        <section
          className="artist-section playlist-section"
          aria-labelledby="library-playlists-title"
        >
          <div className="artist-section-heading">
            <div>
              <p className="artist-eyebrow">CURATED COLLECTIONS</p>
              <h2 id="library-playlists-title">All playlists</h2>
            </div>
            <span className="artist-section-count">
              {playlists.length} playlists
            </span>
          </div>

          {playlists.length ? (
            <div className="playlist-grid">
              {playlists.map((playlist, playlistIndex) => {
                const playlistTracks = Array.isArray(playlist.musics)
                  ? playlist.musics
                  : [];
                const cover =
                  playlistTracks[0]?.coverImageUrl ||
                  playlistTracks[0]?.imageUrl;
                const playlistArt =
                  playlist.art ||
                  playlistArtOptions[playlistIndex % playlistArtOptions.length];

                return (
                  <article
                    className="playlist-item"
                    key={playlist.id ?? `${playlist.title}-${playlistIndex}`}
                  >
                    <div
                      className={`playlist-art playlist-${playlistArt}`}
                      aria-hidden="true"
                    >
                      {cover ? (
                        <img src={cover} alt="" loading="lazy" />
                      ) : (
                        <span className="playlist-art-mark">♪</span>
                      )}
                    </div>
                    <div className="playlist-copy">
                      <h3>{playlist.title}</h3>
                      <p className="playlist-artist">{playlist.artist}</p>
                      <p className="playlist-musics">
                        {playlist.count ?? playlistTracks.length}{' '}
                        {(playlist.count ?? playlistTracks.length) === 1
                          ? 'track'
                          : 'tracks'}
                      </p>
                      <div className="playlist-track-list home-playlist-track-grid">
                        {playlistTracks.map((music, musicIndex) => (
                          <div
                            className="playlist-track home-playlist-track-tile"
                            key={music.id ?? `${music.title}-${musicIndex}`}
                          >
                            <span className="playlist-track-image home-playlist-track-cover">
                              {music.coverImageUrl || music.imageUrl ? (
                                <img
                                  src={music.coverImageUrl || music.imageUrl}
                                  alt=""
                                  loading="lazy"
                                />
                              ) : (
                                <span aria-hidden="true">
                                  {String(musicIndex + 1).padStart(2, '0')}
                                </span>
                              )}
                            </span>
                            <span className="playlist-track-copy home-playlist-track-copy">
                              <strong>{music.title}</strong>
                              <span>{music.artist}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="artist-subtitle">No playlists found.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default Home;

import { useState, useEffect } from 'react';
import './ArtistDashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ArtistDashboard() {
  const [musics, setMusics] = useState([
    {
      id: 1,
      title: 'title1',
      artist: 'artist-A',
      imageUrl: 'imageUrl1',
      coverImageUrl: 'coverImageUrl1',
      release: 'Single',
      plays: '2,410',
      date: 'Oct 6, 2026',
      art: 'gold',
    },
    {
      id: 2,
      title: 'title2',
      artist: 'artist-A',
      imageUrl: 'imageUrl2',
      coverImageUrl: 'coverImageUrl2',
      release: 'Single',
      plays: '1,860',
      date: 'Sep 18, 2026',
      art: 'paper',
    },
    {
      id: 3,
      title: 'title3',
      artist: 'artist-A',
      imageUrl: 'imageUrl3',
      coverImageUrl: 'coverImageUrl3',
      release: 'Single',
      plays: '980',
      date: 'Aug 22, 2026',
      art: 'motion',
    },
    {
      id: 4,
      title: 'title4',
      artist: 'artist-A',
      imageUrl: 'imageUrl4',
      coverImageUrl: 'coverImageUrl4',
      release: 'Single',
      plays: '740',
      date: 'Jul 12, 2026',
      art: 'night',
    },
  ]);

  const [playlistList, setPlaylistList] = useState([
    {
      title: 'After Hours',
      artist: 'Alex Morgan',
      musics: [
        {
          title: 'Golden Hour',
          artist: 'Alex Morgan',
          imageUrl: '',
          coverImageUrl: '',
        },
        {
          title: 'Slow Motion',
          artist: 'Alex Morgan',
          imageUrl: '',
          coverImageUrl: '',
        },
      ],
      art: 'after-hours',
    },
    {
      title: 'The Writing Room',
      artist: 'Alex Morgan',
      musics: [
        {
          title: 'Paper Planes',
          artist: 'Alex Morgan',
          imageUrl: '',
          coverImageUrl: '',
        },
      ],
      art: 'writing-room',
    },
    {
      title: 'Live Favorites',
      artist: 'Alex Morgan',
      musics: [
        {
          title: 'Night Drive',
          artist: 'Alex Morgan',
          imageUrl: '',
          coverImageUrl: '',
        },
        {
          title: 'Golden Hour',
          artist: 'Alex Morgan',
          imageUrl: '',
          coverImageUrl: '',
        },
      ],
      art: 'live-favorites',
    },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    /* Artist musics API */
    axios
      .get('http://localhost:3002/api/music/artist-musics', {
        withCredentials: true,
      })
      .then((res) => {
        setMusics(
          res.data.musics.map((m) => ({
            id: m._id,
            title: m.title,
            artist: m.artist,
            imageUrl: m.imageUrl,
            coverImageUrl: m.coverImageUrl,
            release: m.release
              ? new Date(m?.release).toISOString().split('T')[0]
              : '03-10-2026',
          })),
        );
      });

    /* Artist playlist API */
    axios
      .get('http://localhost:3002/api/music/playlist/artist', {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.playlist);
        setPlaylistList(
          res.data.playlist.map((p) => ({
            id: p._id,
            artist: p.artist,
            musics: p.musics,
          })),
        );
      });
  }, []);

  return (
    <main className="artist-dashboard">
      <header className="artist-header">
        <a className="artist-wordmark" href="/" aria-label="Spotify home">
          Spotify
        </a>
        <span className="artist-header-label">Artist workspace</span>
        <div className="artist-profile" aria-label="Artist profile">
          AM
        </div>
      </header>

      <div className="artist-content">
        <section className="artist-welcome" aria-labelledby="artist-title">
          <div>
            <p className="artist-eyebrow">YOUR MUSIC</p>
            <h1 id="artist-title">Good afternoon, Alex</h1>
            <p className="artist-subtitle">
              Here&apos;s what&apos;s happening with your catalog.
            </p>
          </div>
          <div className="artist-listeners">
            <span className="listener-pulse" aria-hidden="true" />
            <span>
              <strong>12,804</strong> monthly listeners
            </span>
          </div>
        </section>

        <section
          className="artist-section"
          id="music"
          aria-labelledby="music-title"
        >
          <div className="artist-section-heading">
            <div>
              <p className="artist-eyebrow">CATALOG</p>
              <h2 id="music-title">Your music</h2>
            </div>
            <div className="artist-heading-actions">
              <span className="artist-section-count">
                {musics.length} releases
              </span>
              <button
                onClick={() => {
                  navigate('/artist/upload');
                }}
                className="artist-action-button"
                type="button"
              >
                <span aria-hidden="true">+</span> Add track
              </button>
            </div>
          </div>

          <div className="track-list" role="table" aria-label="Your music">
            <div className="track-row track-heading" role="row">
              <span role="columnheader">Track</span>
              <span role="columnheader">Artist</span>
              <span role="columnheader">Plays</span>
              <span role="columnheader">Release</span>
            </div>
            {musics.length > 0 ? (
              musics.map((music, index) => (
                <div
                  className="track-row"
                  role="row"
                  key={music.id ?? `${music.title}-${index}`}
                >
                  <div className="track-title-cell" role="cell">
                    <span className={`cover-art cover-${music.art || 'gold'}`}>
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
                    </span>
                    <span className="track-copy">
                      <strong>{music.title}</strong>
                      <span className="track-mobile-release">
                        {music.artist || 'Alex Morgan'}
                      </span>
                    </span>
                  </div>
                  <span className="track-release" role="cell">
                    {music.artist || 'Single'}
                  </span>
                  <span className="track-plays" role="cell">
                    {music.plays ?? 0}
                  </span>
                  <span className="track-date" role="cell">
                    {music.release}
                  </span>
                </div>
              ))
            ) : (
              <div className="track-row track-empty" role="row">
                <span role="cell">No music added yet.</span>
              </div>
            )}
          </div>
        </section>

        <section
          className="artist-section playlist-section"
          id="playlists"
          aria-labelledby="playlists-title"
        >
          <div className="artist-section-heading">
            <div>
              <p className="artist-eyebrow">CURATED BY YOU</p>
              <h2 id="playlists-title">Your playlists</h2>
            </div>
            <div className="artist-heading-actions">
              <span className="artist-section-count">
                {playlistList.length} playlists
              </span>
              <button className="artist-action-button" type="button">
                <span aria-hidden="true">+</span> Add playlist
              </button>
            </div>
          </div>

          <div className="playlist-grid">
            {playlistList.map((playlist) => (
              <article className="playlist-item">
                <div
                  className="playlist-art playlist"
                  key={playlist?.id}
                  aria-hidden="true"
                >
                  {playlist.musics[0]?.coverImageUrl ||
                  playlist.musics[0]?.imageUrl ? (
                    <img
                      src={
                        playlist.musics.coverImageUrl ||
                        playlist.musics[0].imageUrl
                      }
                      alt=""
                    />
                  ) : (
                    <span className="playlist-art-mark">A</span>
                  )}
                </div>
                <div className="playlist-copy">
                  <h3>{playlist.title}</h3>
                  <p className="playlist-artist">{playlist.artist}</p>
                  <p className="playlist-musics">
                    {playlist.musics.length}{' '}
                    {playlist.musics.length === 1 ? 'music' : 'musics'}
                  </p>
                  <div className="playlist-track-list">
                    {musics.map((music, index) => (
                      <div className="playlist-track" key={music.id}>
                        <span className="playlist-track-image">
                          {music.imageUrl || music.coverImageUrl ? (
                            <img
                              src={music.coverImageUrl || music.imageUrl}
                              alt={music.title}
                              loading="lazy"
                            />
                          ) : (
                            <span aria-hidden="true">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          )}
                        </span>
                        <span className="playlist-track-copy">
                          <strong>{music.title}</strong>
                          <span>{music.artist}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="playlist-arrow" aria-hidden="true">
                  ↗
                </span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ArtistDashboard;

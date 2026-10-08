import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './ArtistMusicUpload.css';

function ArtistMusicUpload() {
  const [formData, setFormData] = useState({
    title: '',
    coverImage: null,
    audioFile: null,
  });
  const [coverPreview, setCoverPreview] = useState('');
  const [audioPreview, setAudioPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const coverInputRef = useRef(null);
  const audioInputRef = useRef(null);

  function clearPreview() {
    setFormData((current) => ({
      ...current,
      coverImage: null,
      audioFile: null,
    }));
    if (coverInputRef.current) coverInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
  }

  useEffect(() => {
    if (!formData.coverImage) {
      setCoverPreview('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(formData.coverImage);
    setCoverPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [formData.coverImage]);

  useEffect(() => {
    if (!formData.audioFile) {
      setAudioPreview('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(formData.audioFile);
    setAudioPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [formData.audioFile]);

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const uploadData = new FormData();
    uploadData.append('title', formData.title.trim());
    uploadData.append('coverImage', formData.coverImage);
    uploadData.append('music', formData.audioFile);

    setIsUploading(true);
    setStatus(null);

    axios
      .post('http://localhost:3002/api/music/upload', uploadData, {
        withCredentials: true,
      })
      .then(() => {
        form.reset();
        setFormData({ title: '', coverImage: null, audioFile: null });
        navigate("/artist/dashboard");
        setStatus({ type: 'success', message: 'Track uploaded successfully.' });
      })
      .catch((error) => {
        setStatus({
          type: 'error',
          message:
            error.response?.data?.message ||
            'Upload failed. Check the music service and try again.',
        });
      })
      .finally(() => {
        setIsUploading(false);
      });
  }

  return (
    <main className="artist-upload-page">
      <header className="artist-upload-header">
        <Link className="artist-upload-wordmark" to="/artist/dashboard">
          Spotify
        </Link>
        <Link className="artist-upload-back" to="/artist/dashboard">
          Back to dashboard
        </Link>
      </header>

      <section className="artist-upload-content" aria-labelledby="upload-title">
        <p className="artist-upload-eyebrow">ARTIST WORKSPACE</p>
        <h1 id="upload-title">Upload a track</h1>
        <p className="artist-upload-subtitle">
          Add a title, cover artwork, and audio file to your catalog.
        </p>

        <form className="artist-upload-form" onSubmit={handleSubmit}>
          <div className="artist-upload-field artist-upload-title-field">
            <label htmlFor="track-title">Track title</label>
            <input
              id="track-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Enter song title"
              maxLength={120}
              required
            />
          </div>

          <div className="artist-upload-field">
            <label htmlFor="cover-image">Cover artwork</label>
            <input
              id="cover-image"
              ref={coverInputRef}
              name="coverImageUrl"
              type="file"
              accept="image/*"
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  coverImage: event.target.files?.[0] || null,
                }))
              }
              required
            />
            <span className="artist-upload-hint">JPG, PNG, or WebP image</span>
          </div>

          <div className="artist-upload-field">
            <label htmlFor="audio-file">MP3 audio</label>
            <input
              id="audio-file"
              ref={audioInputRef}
              name="musicFile"
              type="file"
              accept="audio/mpeg,.mp3"
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  audioFile: event.target.files?.[0] || null,
                }))
              }
              required
            />
            <span className="artist-upload-hint">MP3 format</span>
          </div>

          <section
            className="artist-upload-preview"
            aria-labelledby="track-preview-title"
          >
            <div className="artist-upload-preview-heading">
              <h2 id="track-preview-title">Track preview</h2>
              <button
                className="artist-upload-clear-preview"
                type="button"
                onClick={clearPreview}
                disabled={!formData.coverImage && !formData.audioFile}
              >
                Clear preview
              </button>
            </div>
            <div className="artist-upload-preview-track">
              <div className="artist-upload-preview-art">
                {coverPreview ? (
                  <img src={coverPreview} alt="Selected cover artwork preview" />
                ) : (
                  <span>Cover</span>
                )}
              </div>
              <div className="artist-upload-preview-copy">
                <strong>{formData.title.trim() || 'Your track title'}</strong>
                <span>{formData.audioFile?.name || 'No audio file selected'}</span>
              </div>
            </div>
            {audioPreview ? (
              <audio
                className="artist-upload-audio-preview"
                controls
                src={audioPreview}
                aria-label="Preview selected MP3"
              />
            ) : (
              <p className="artist-upload-preview-hint">
                Select an MP3 to preview the audio.
              </p>
            )}
          </section>

          {status && (
            <p className={`artist-upload-status is-${status.type}`} role="status">
              {status.message}
            </p>
          )}

          <div className="artist-upload-actions">
            <Link className="artist-upload-cancel" to="/artist/dashboard">
              Cancel
            </Link>
            <button
              className="artist-upload-submit"
              type="submit"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading…' : 'Upload track'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ArtistMusicUpload;

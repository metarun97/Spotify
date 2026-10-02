import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/login',
        {
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,
        },
      );

      navigate('/');
    } catch (error) {
      console.log('Error in Login user', error);
    }
  }

  return (
    <main className="register-page">
      <header className="register-header">
        <Link className="register-wordmark" to="/" aria-label="Spotify home">
          Spotify
        </Link>
        <p className="register-header-prompt">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </p>
      </header>

      <section className="register-content" aria-labelledby="login-title">
        <h1 id="login-title">Log in to Spotify</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="login-email">Email address</label>
            <input
              autoComplete="email"
              id="login-email"
              name="email"
              placeholder="name@example.com"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="register-field">
            <label htmlFor="login-password">Password</label>
            <input
              autoComplete="current-password"
              id="login-password"
              name="password"
              placeholder="Enter your password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button className="register-submit" type="submit">
            Log in
          </button>

          <div className="register-divider" aria-hidden="true">
            <span>or</span>
          </div>

          <button
            className="register-google"
            type="button"
            onClick={() => {
              window.location.href = 'http://localhost:3000/api/auth/login';
            }}
          >
            <span className="register-google-mark" aria-hidden="true">
              G
            </span>
            Continue with Google
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;

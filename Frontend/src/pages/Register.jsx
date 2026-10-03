import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    fullname: {
      firstName: '',
      lastName: '',
    },
    password: '',
    role: 'user',
  });

  const navigate = useNavigate();

  /* HandleChange function */
  function handleChange(e) {
    const { name, value } = e.target;

    if (name.startsWith('fullname.')) {
      const fieldName = name.split('.')[1];

      setFormData((currentFormData) => ({
        ...currentFormData,
        fullname: {
          ...currentFormData.fullname,
          [fieldName]: value,
        },
      }));
      return;
    }

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  /* handleSubmit function */
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/register',
        {
          email: formData.email,
          fullname: {
            firstName: formData.fullname.firstName,
            lastName: formData.fullname.lastName,
          },
          password: formData.password,
          role: formData.role,
        },
        {
          withCredentials: true,
        },
      );
      console.log(response);
      navigate('/');
    } catch (error) {
      console.log('Error to Register a user', error);
    }
  }

  return (
    <main className="register-page">
      <header className="register-header">
        <Link className="register-wordmark" to="/" aria-label="Spotify home">
          Spotify
        </Link>
        <p className="register-header-prompt">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </header>

      <section className="register-content" aria-labelledby="register-title">
        <h1 id="register-title">Sign up and start listening</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="register-email">Email address</label>
            <input
              autoComplete="email"
              id="register-email"
              name="email"
              placeholder="name@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <fieldset className="register-name-fields">
            <legend>Full name</legend>
            <div className="register-name-grid">
              <div className="register-field">
                <label htmlFor="register-first-name">First name</label>
                <input
                  autoComplete="given-name"
                  id="register-first-name"
                  name="fullname.firstName"
                  placeholder="First name"
                  type="text"
                  value={formData.fullname.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="register-field">
                <label htmlFor="register-last-name">Last name</label>
                <input
                  autoComplete="family-name"
                  id="register-last-name"
                  name="fullname.lastName"
                  placeholder="Last name"
                  type="text"
                  value={formData.fullname.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </fieldset>

          <div className="register-field">
            <label htmlFor="register-password">Password</label>
            <input
              autoComplete="new-password"
              id="register-password"
              name="password"
              placeholder="Create a password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <fieldset className="register-role-fields">
            <legend>I want to join as</legend>
            <div className="register-role-options">
              <label className="register-role-option" htmlFor="role-user">
                <input
                  checked={formData.role === 'user'}
                  id="role-user"
                  name="role"
                  type="radio"
                  value="user"
                  onChange={handleChange}
                />
                <span>User</span>
              </label>
              <label className="register-role-option" htmlFor="role-artist">
                <input
                  id="role-artist"
                  name="role"
                  type="radio"
                  value="artist"
                  checked={formData.role === 'artist'}
                  onChange={handleChange}
                />
                <span>Artist</span>
              </label>
            </div>
          </fieldset>

          <button className="register-submit" type="submit">
            Create account
          </button>

          <div className="register-divider" aria-hidden="true">
            <span>or</span>
          </div>

          <button
            className="register-google"
            type="button"
            onClick={() => {
              window.location.href = 'http://localhost:3000/api/auth/google';
            }}
          >
            <span className="register-google-mark" aria-hidden="true">
              G
            </span>
            Continue with Google
          </button>
        </form>

        <p className="register-terms">
          By continuing, you agree to the <a href="#terms">Terms of Service</a>{' '}
          and <a href="#privacy">Privacy Policy</a>.
        </p>
      </section>
    </main>
  );
}

export default Register;

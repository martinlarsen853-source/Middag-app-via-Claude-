import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api.js';
import PersonCounter from './PersonCounter.jsx';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [persons, setPersons] = useState(2);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Passordet må være minst 6 tegn');
      return;
    }

    setLoading(true);
    try {
      const data = await register(name, email, password, persons);
      localStorage.setItem('middag_token', data.token);
      localStorage.setItem('middag_user', JSON.stringify(data.user));
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf8f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{ width: '100%', maxWidth: '384px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🍽️</div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1c1917',
            marginBottom: '8px',
            fontFamily: 'Georgia, serif',
          }}>
            Tallerken
          </h1>
          <p style={{ color: '#78716c', fontSize: '1rem', margin: 0 }}>Lag din konto</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid #e7e5e2',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#1c1917',
            marginBottom: '24px',
            margin: '0 0 24px',
          }}>
            Registrer deg
          </h2>

          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              color: '#b91c1c',
              fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                color: '#78716c',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '8px',
              }}>
                Navn
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Ola Nordmann"
                style={{
                  width: '100%',
                  background: '#faf8f5',
                  border: '1.5px solid #e7e5e2',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#1c1917',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#c2410c'}
                onBlur={e => e.target.style.borderColor = '#e7e5e2'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#78716c',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '8px',
              }}>
                E-postadresse
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="din@epost.no"
                style={{
                  width: '100%',
                  background: '#faf8f5',
                  border: '1.5px solid #e7e5e2',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#1c1917',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#c2410c'}
                onBlur={e => e.target.style.borderColor = '#e7e5e2'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#78716c',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '8px',
              }}>
                Passord
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Minst 6 tegn"
                style={{
                  width: '100%',
                  background: '#faf8f5',
                  border: '1.5px solid #e7e5e2',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#1c1917',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#c2410c'}
                onBlur={e => e.target.style.borderColor = '#e7e5e2'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#78716c',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '12px',
              }}>
                Antall personer som spiser vanligvis
              </label>
              <PersonCounter value={persons} onChange={setPersons} />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#e7e5e2' : '#c2410c',
                color: loading ? '#a8a29e' : '#fff',
                fontWeight: 600,
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '8px',
                boxShadow: loading ? 'none' : '0 8px 32px rgba(194,65,12,0.25)',
              }}
              onMouseEnter={e => {
                if (!loading) e.target.style.background = '#b53b0a';
              }}
              onMouseLeave={e => {
                if (!loading) e.target.style.background = '#c2410c';
              }}
            >
              {loading ? 'Oppretter konto...' : 'Opprett konto'}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            color: '#78716c',
            marginTop: '24px',
            fontSize: '0.9rem',
            margin: '24px 0 0',
          }}>
            Har du allerede konto?{' '}
            <Link to="/login" style={{
              color: '#c2410c',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#b53b0a'}
            onMouseLeave={e => e.target.style.color = '#c2410c'}
            >
              Logg inn her
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

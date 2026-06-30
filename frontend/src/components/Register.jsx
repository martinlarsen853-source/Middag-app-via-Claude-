import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api.js';
import PersonCounter from './PersonCounter.jsx';
import { colors, radius, shadows } from '../theme.js';

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
      background: colors.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{ width: '100%', maxWidth: '384px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🛒</div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: colors.text,
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}>
            Handleklar
          </h1>
          <p style={{ color: colors.textSecond, fontSize: '1rem', margin: 0 }}>Lag din konto</p>
        </div>

        {/* Card */}
        <div style={{
          background: colors.bgAlt,
          borderRadius: radius.xl,
          padding: '32px',
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.md,
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            color: colors.text,
            marginBottom: '24px',
            margin: '0 0 24px',
          }}>
            Registrer deg
          </h2>

          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: radius.md,
              padding: '16px',
              marginBottom: '24px',
              color: colors.error,
              fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                color: colors.textSecond,
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
                  background: colors.bg,
                  border: `1.5px solid ${colors.border}`,
                  borderRadius: radius.md,
                  padding: '12px 14px',
                  color: colors.text,
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = colors.accent}
                onBlur={e => e.target.style.borderColor = colors.border}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: colors.textSecond,
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
                  background: colors.bg,
                  border: `1.5px solid ${colors.border}`,
                  borderRadius: radius.md,
                  padding: '12px 14px',
                  color: colors.text,
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = colors.accent}
                onBlur={e => e.target.style.borderColor = colors.border}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: colors.textSecond,
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
                  background: colors.bg,
                  border: `1.5px solid ${colors.border}`,
                  borderRadius: radius.md,
                  padding: '12px 14px',
                  color: colors.text,
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = colors.accent}
                onBlur={e => e.target.style.borderColor = colors.border}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: colors.textSecond,
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
                background: loading ? colors.borderLight : colors.accent,
                color: loading ? colors.textTertiary : colors.white,
                fontWeight: 600,
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '8px',
                boxShadow: loading ? 'none' : shadows.accent,
              }}
              onMouseEnter={e => {
                if (!loading) e.target.style.background = colors.accentDark;
              }}
              onMouseLeave={e => {
                if (!loading) e.target.style.background = colors.accent;
              }}
            >
              {loading ? 'Oppretter konto...' : 'Opprett konto'}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            color: colors.textSecond,
            marginTop: '24px',
            fontSize: '0.9rem',
            margin: '24px 0 0',
          }}>
            Har du allerede konto?{' '}
            <Link to="/login" style={{
              color: colors.accent,
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = colors.accentDark}
            onMouseLeave={e => e.target.style.color = colors.accent}
            >
              Logg inn her
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

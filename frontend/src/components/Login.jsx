import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, register } from '../api.js';

const TEST_EMAIL = 'test@tallerken.no';
const TEST_PASS  = 'test1234';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = location.state?.from?.pathname || '/app';

  async function doLogin(em, pw) {
    const data = await login(em, pw);
    localStorage.setItem('middag_token', data.token);
    localStorage.setItem('middag_user', JSON.stringify(data.user));
    navigate(from, { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await doLogin(email, password); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function handleTestLogin() {
    setError(''); setTestLoading(true);
    try {
      // Opprett testbruker om den ikke finnes, ignorer feil hvis den allerede finnes
      try { await register('Testbruker', TEST_EMAIL, TEST_PASS, 2); } catch {}
      await doLogin(TEST_EMAIL, TEST_PASS);
    } catch (err) {
      setError(err.message);
    } finally {
      setTestLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        {/* Logo */}
        <div style={s.logoArea}>
          <span style={s.logoEmoji}>🍽</span>
          <h1 style={s.appName}>Tallerken</h1>
          <p style={s.tagline}>Aldri lure på hva du skal lage</p>
        </div>

        {/* Test-knapp */}
        <button
          onClick={handleTestLogin}
          disabled={testLoading}
          style={s.testBtn}
        >
          {testLoading ? 'Logger inn…' : '⚡ Logg inn som testbruker'}
        </button>

        <div style={s.divider}>
          <span style={s.dividerLine} />
          <span style={s.dividerText}>eller logg inn manuelt</span>
          <span style={s.dividerLine} />
        </div>

        {/* Skjema */}
        <div style={s.card}>
          {error && <div style={s.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <label style={s.label}>E-post</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="din@epost.no"
              style={s.input}
              onFocus={e => e.target.style.borderColor = '#c2410c'}
              onBlur={e => e.target.style.borderColor = '#e7e5e2'}
            />

            <label style={{ ...s.label, marginTop: 14 }}>Passord</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••"
              style={s.input}
              onFocus={e => e.target.style.borderColor = '#c2410c'}
              onBlur={e => e.target.style.borderColor = '#e7e5e2'}
            />

            <button type="submit" disabled={loading} style={s.submitBtn}>
              {loading ? 'Logger inn…' : 'Logg inn'}
            </button>
          </form>

          <p style={s.registerLink}>
            Ingen konto?{' '}
            <Link to="/register" style={s.link}>Registrer deg</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh', background: '#faf8f5',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px', fontFamily: 'system-ui, sans-serif',
  },
  wrap: { width: '100%', maxWidth: 400 },
  logoArea: { textAlign: 'center', marginBottom: 32 },
  logoEmoji: { fontSize: '3rem', display: 'block', marginBottom: 8 },
  appName: {
    fontFamily: 'Georgia, serif', fontSize: '2.4rem', fontWeight: 800,
    color: '#1c1917', margin: '0 0 6px', letterSpacing: '-0.03em',
  },
  tagline: { color: '#78716c', fontSize: '1rem', margin: 0 },

  testBtn: {
    width: '100%', background: '#c2410c', color: '#fff',
    border: 'none', borderRadius: 14, padding: '16px',
    fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    marginBottom: 20, transition: 'background 0.2s',
    boxShadow: '0 4px 20px rgba(194,65,12,0.25)',
  },

  divider: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, background: '#e7e5e2' },
  dividerText: { color: '#a8a29e', fontSize: '0.8rem', whiteSpace: 'nowrap' },

  card: {
    background: '#fff', borderRadius: 20, padding: 28,
    border: '1px solid #f0ede9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.06)',
  },
  error: {
    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
    padding: '10px 14px', color: '#b91c1c', fontSize: '0.88rem', marginBottom: 16,
  },
  label: { display: 'block', color: '#44403c', fontSize: '0.88rem', fontWeight: 600, marginBottom: 6 },
  input: {
    width: '100%', boxSizing: 'border-box',
    background: '#faf8f5', border: '1.5px solid #e7e5e2', borderRadius: 10,
    padding: '11px 14px', fontSize: '1rem', color: '#1c1917',
    outline: 'none', transition: 'border-color 0.2s',
  },
  submitBtn: {
    width: '100%', background: '#1c1917', color: '#fff',
    border: 'none', borderRadius: 10, padding: '13px',
    fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: 20,
    transition: 'background 0.2s',
  },
  registerLink: { textAlign: 'center', color: '#78716c', fontSize: '0.88rem', marginTop: 16, marginBottom: 0 },
  link: { color: '#c2410c', fontWeight: 600, textDecoration: 'none' },
};

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, register } from '../api.js';
import * as mock from '../mockApi.js';
import { colors, radius, shadows } from '../theme.js';

const TEST_EMAIL = 'test@handleklar.no';
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
      // Alltid bruk mock for testknappen — omgår Supabase e-postbekreftelse
      localStorage.setItem('middag_demo_session', 'true');
      try { await mock.register('Testbruker', TEST_EMAIL, TEST_PASS, 2); } catch {}
      const data = await mock.login(TEST_EMAIL, TEST_PASS);
      localStorage.setItem('middag_token', data.token);
      localStorage.setItem('middag_user', JSON.stringify(data.user));
      navigate(from, { replace: true });
    } catch (err) {
      localStorage.removeItem('middag_demo_session');
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
          <span style={s.logoEmoji}>🛒</span>
          <h1 style={s.appName}>Handleklar</h1>
          <p style={s.tagline}>Fra null til handleliste på ett minutt</p>
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
              onFocus={e => e.target.style.borderColor = colors.accent}
              onBlur={e => e.target.style.borderColor = colors.border}
            />

            <label style={{ ...s.label, marginTop: 14 }}>Passord</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••"
              style={s.input}
              onFocus={e => e.target.style.borderColor = colors.accent}
              onBlur={e => e.target.style.borderColor = colors.border}
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
    minHeight: '100vh', background: colors.bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px', fontFamily: 'system-ui, sans-serif',
  },
  wrap: { width: '100%', maxWidth: 400 },
  logoArea: { textAlign: 'center', marginBottom: 32 },
  logoEmoji: { fontSize: '3rem', display: 'block', marginBottom: 8 },
  appName: {
    letterSpacing: '-0.02em', fontSize: '2.4rem', fontWeight: 800,
    color: colors.text, margin: '0 0 6px', letterSpacing: '-0.03em',
  },
  tagline: { color: colors.textSecond, fontSize: '1rem', margin: 0 },

  testBtn: {
    width: '100%', background: colors.accent, color: '#fff',
    border: 'none', borderRadius: 14, padding: '16px',
    fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    marginBottom: 20, transition: 'background 0.2s',
    boxShadow: '0 4px 20px rgba(194,65,12,0.25)',
  },

  divider: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, background: colors.border },
  dividerText: { color: 'colors.textTertiary', fontSize: '0.8rem', whiteSpace: 'nowrap' },

  card: {
    background: colors.bgAlt, borderRadius: radius.xl, padding: 28,
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.md,
  },
  error: {
    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
    padding: '10px 14px', color: '#b91c1c', fontSize: '0.88rem', marginBottom: 16,
  },
  label: { display: 'block', color: '#44403c', fontSize: '0.88rem', fontWeight: 600, marginBottom: 6 },
  input: {
    width: '100%', boxSizing: 'border-box',
    background: colors.bg, border: `1.5px solid ${colors.border}`, borderRadius: 10,
    padding: '11px 14px', fontSize: '1rem', color: 'colors.text',
    outline: 'none', transition: 'border-color 0.2s',
  },
  submitBtn: {
    width: '100%', background: 'colors.text', color: '#fff',
    border: 'none', borderRadius: 10, padding: '13px',
    fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: 20,
    transition: 'background 0.2s',
  },
  registerLink: { textAlign: 'center', color: colors.textSecond, fontSize: '0.88rem', marginTop: 16, marginBottom: 0 },
  link: { color: colors.accent, fontWeight: 600, textDecoration: 'none' },
};

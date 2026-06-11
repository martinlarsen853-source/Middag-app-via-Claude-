import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHousehold, joinHousehold } from '../api.js';

export default function Navbar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [household, setHousehold] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('middag_user') || 'null');
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (showModal) {
      getHousehold().then(setHousehold).catch(() => {});
    }
  }, [showModal]);

  function handleLogout() {
    localStorage.removeItem('middag_token');
    localStorage.removeItem('middag_user');
    localStorage.removeItem('middag_demo_session');
    navigate('/login', { replace: true });
  }

  async function handleCopyCode() {
    if (!household?.household?.invite_code) return;
    await navigator.clipboard.writeText(household.household.invite_code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleJoin(e) {
    e.preventDefault();
    setJoinError('');
    setJoinSuccess('');
    try {
      await joinHousehold(joinCode);
      setJoinSuccess('Du har blitt med i husholdningen!');
      setJoinCode('');
      const data = await getHousehold();
      setHousehold(data);
    } catch (err) {
      setJoinError(err.message);
    }
  }

  const navStyles = {
    bar: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      background: 'rgba(250,248,245,0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e7e5e2',
      print: 'none',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textDecoration: 'none',
      color: '#1c1917',
      transition: 'color 0.2s',
    },
    logoText: {
      fontFamily: 'Georgia, serif',
      fontSize: '1.1rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: '#1c1917',
    },
    greeting: {
      fontSize: '0.85rem',
      color: '#78716c',
      marginRight: '12px',
      display: 'none',
      '@media (min-width: 640px)': {
        display: 'inline',
      },
    },
    iconBtn: {
      background: '#fff',
      border: '1.5px solid #e7e5e2',
      borderRadius: '10px',
      padding: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      color: '#78716c',
    },
    iconBtnHover: {
      borderColor: '#c2410c',
      color: '#c2410c',
    },
  };

  return (
    <>
      <nav style={{ ...navStyles.bar, display: 'flex' }} className="no-print">
        <Link to="/" style={navStyles.logo}>
          <span style={{ fontSize: '1.8rem' }}>🍽️</span>
          <span style={navStyles.logoText}>Tallerken</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user && (
            <span style={navStyles.greeting}>
              Hei, {user.name.split(' ')[0]}!
            </span>
          )}

          <button
            onClick={() => setShowModal(true)}
            onMouseEnter={e => Object.assign(e.target.style, navStyles.iconBtnHover)}
            onMouseLeave={e => Object.assign(e.target.style, { borderColor: '#e7e5e2', color: '#78716c' })}
            title="Husholdning"
            style={navStyles.iconBtn}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          <button
            onClick={handleLogout}
            onMouseEnter={e => Object.assign(e.target.style, { borderColor: '#c2410c', color: '#c2410c' })}
            onMouseLeave={e => Object.assign(e.target.style, { borderColor: '#e7e5e2', color: '#78716c' })}
            title="Logg ut"
            style={navStyles.iconBtn}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Household Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(28,25,23,0.5)',
            backdropFilter: 'blur(8px)',
            animation: 'fade-up 0.2s ease-out',
          }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}
          className="no-print"
        >
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '384px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1c1917', margin: 0, fontFamily: 'Georgia, serif' }}>
                Husholdning
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a8a29e',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {household ? (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '0.8rem', color: '#78716c', marginBottom: '4px', fontWeight: 500 }}>Husholdning</p>
                  <p style={{ fontSize: '1rem', color: '#1c1917', fontWeight: 600, margin: 0 }}>{household.household.name}</p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '0.8rem', color: '#78716c', marginBottom: '8px', fontWeight: 500 }}>Invitasjonskode</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      flex: 1,
                      background: '#fff7ed',
                      border: '2px solid #fed7aa',
                      borderRadius: '10px',
                      padding: '12px',
                      fontFamily: 'monospace',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#c2410c',
                      textAlign: 'center',
                      letterSpacing: '0.1em',
                    }}>
                      {household.household.invite_code}
                    </div>
                    <button
                      onClick={handleCopyCode}
                      style={{
                        background: '#fff7ed',
                        border: '2px solid #fed7aa',
                        borderRadius: '10px',
                        padding: '10px',
                        cursor: 'pointer',
                        color: '#c2410c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => Object.assign(e.target.style, { background: '#fed7aa', color: '#b53b0a' })}
                      onMouseLeave={e => Object.assign(e.target.style, { background: '#fff7ed', color: '#c2410c' })}
                      title="Kopier kode"
                    >
                      {copied ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#a8a29e', marginTop: '8px', textAlign: 'center', margin: '8px 0 0' }}>
                    Del denne koden med andre for å spise sammen
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '0.8rem', color: '#78716c', marginBottom: '8px', fontWeight: 500 }}>
                    Medlemmer ({household.members.length})
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {household.members.map(m => (
                      <div key={m.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: '#fff7ed',
                        borderRadius: '10px',
                        padding: '10px 12px',
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#fed7aa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#c2410c',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}>
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ color: '#1c1917', fontSize: '0.95rem' }}>{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e7e5e2', paddingTop: '16px' }}>
                  <p style={{ fontSize: '0.8rem', color: '#78716c', marginBottom: '8px', fontWeight: 500 }}>Bli med i annen husholdning</p>
                  <form onSubmit={handleJoin} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={joinCode}
                      onChange={e => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="Kode"
                      maxLength={6}
                      style={{
                        flex: 1,
                        background: '#faf8f5',
                        border: '1.5px solid #e7e5e2',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        color: '#1c1917',
                        fontSize: '0.95rem',
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        outline: 'none',
                        transition: 'border 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#c2410c'}
                      onBlur={e => e.target.style.borderColor = '#e7e5e2'}
                    />
                    <button
                      type="submit"
                      style={{
                        background: '#c2410c',
                        color: '#fff',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        border: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 8px 32px rgba(194,65,12,0.25)',
                      }}
                      onMouseEnter={e => e.target.style.background = '#b53b0a'}
                      onMouseLeave={e => e.target.style.background = '#c2410c'}
                    >
                      Bli med
                    </button>
                  </form>
                  {joinError && <p style={{ color: '#b91c1c', fontSize: '0.75rem', marginTop: '8px' }}>{joinError}</p>}
                  {joinSuccess && <p style={{ color: '#15803d', fontSize: '0.75rem', marginTop: '8px' }}>{joinSuccess}</p>}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#a8a29e' }}>Laster...</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

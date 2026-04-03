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
      // Refresh
      const data = await getHousehold();
      setHousehold(data);
    } catch (err) {
      setJoinError(err.message);
    }
  }

  return (
    <>
      <nav className="glass border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40 no-print">
        <Link to="/" className="flex items-center gap-2 text-white hover:text-green-400 transition-colors">
          <span className="text-2xl">🍽️</span>
          <span className="font-bold text-lg hidden sm:block">Middagshjulet</span>
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <span className="text-gray-400 text-sm hidden sm:block mr-1">
              Hei, {user.name.split(' ')[0]}!
            </span>
          )}

          {/* Household button */}
          <button
            onClick={() => setShowModal(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105"
            title="Husholdning"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-white/10 hover:bg-red-500/30 text-white hover:text-red-300 transition-all duration-200 hover:scale-105"
            title="Logg ut"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print"
          onClick={e => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="glass-strong rounded-3xl p-6 w-full max-w-sm animate-[fade-up_0.2s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Husholdning</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {household ? (
              <>
                <div className="mb-5">
                  <p className="text-gray-400 text-sm mb-1">Husholdning</p>
                  <p className="text-white font-semibold">{household.household.name}</p>
                </div>

                <div className="mb-5">
                  <p className="text-gray-400 text-sm mb-2">Invitasjonskode</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/10 rounded-2xl px-4 py-3 font-mono text-xl font-bold text-green-400 tracking-widest text-center">
                      {household.household.invite_code}
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="p-3 rounded-2xl bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-all"
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
                  <p className="text-gray-500 text-xs mt-2 text-center">Del denne koden med andre for å spise sammen</p>
                </div>

                <div className="mb-5">
                  <p className="text-gray-400 text-sm mb-2">Medlemmer ({household.members.length})</p>
                  <div className="space-y-2">
                    {household.members.map(m => (
                      <div key={m.id} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center text-green-400 font-bold text-sm">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white text-sm">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-gray-400 text-sm mb-2">Bli med i annen husholdning</p>
                  <form onSubmit={handleJoin} className="flex gap-2">
                    <input
                      type="text"
                      value={joinCode}
                      onChange={e => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="Kode"
                      maxLength={6}
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 font-mono uppercase text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all"
                    >
                      Bli med
                    </button>
                  </form>
                  {joinError && <p className="text-red-400 text-xs mt-2">{joinError}</p>}
                  {joinSuccess && <p className="text-green-400 text-xs mt-2">{joinSuccess}</p>}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">Laster...</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

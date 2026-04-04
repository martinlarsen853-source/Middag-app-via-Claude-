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
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-4xl font-bold text-white mb-2">Middagshjulet</h1>
          <p className="text-gray-400 text-lg">Lag din konto</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Registrer deg</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Navn
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Ola Nordmann"
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                E-postadresse
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="din@epost.no"
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Passord
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Minst 6 tegn"
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Antall personer som spiser vanligvis
              </label>
              <div className="flex items-center">
                <PersonCounter value={persons} onChange={setPersons} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-500/50 text-white font-semibold py-3 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              {loading ? 'Oppretter konto...' : 'Opprett konto'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Har du allerede konto?{' '}
            <Link to="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
              Logg inn her
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

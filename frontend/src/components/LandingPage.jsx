import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const features = [
  {
    emoji: '🎡',
    title: 'Spinnehjulet',
    desc: 'Snurr gjennom 20+ middager på sekunder. Aldri stå i butikken og lure på hva du skal ha.'
  },
  {
    emoji: '🛒',
    title: 'Handleliste etter hylle',
    desc: 'Får du opp lista sortert etter butikkens gang – Rema 1000, Kiwi eller Coop. Bare følg lista.'
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'Del med husstanden',
    desc: 'Samboer handler? Send invitasjonskoden. Dere ser det samme, til enhver tid.'
  },
  {
    emoji: '⚖️',
    title: 'Tilpass antall personer',
    desc: 'Trykk + eller − så skaleres alle mengder automatisk. For 2 eller for 6.'
  },
  {
    emoji: '⏱',
    title: 'Sorter etter tid eller pris',
    desc: 'Dårlig tid? Sorter på raskeste rett. Stram økonomi? Sorter på billigste.'
  },
  {
    emoji: '📅',
    title: 'Sjelden spist',
    desc: 'Appen husker hva du har spist. Sorter på "sjelden spist" og få variasjon i hverdagen.'
  }
];

const steps = [
  { n: '1', text: 'Åpne appen i butikken' },
  { n: '2', text: 'Snurr hjulet, velg middag' },
  { n: '3', text: 'Velg butikk' },
  { n: '4', text: 'Følg handlelista hyllevis' }
];

export default function LandingPage() {
  const token = localStorage.getItem('middag_token');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white overflow-x-hidden">

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 -right-60 w-[600px] h-[600px] bg-green-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-60 w-[500px] h-[500px] bg-emerald-600/6 rounded-full blur-3xl" />
        <div className="absolute -bottom-60 right-1/3 w-[400px] h-[400px] bg-green-400/5 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl">🍽️</span>
          <span>Middagshjulet</span>
        </div>
        <div className="flex items-center gap-3">
          {token ? (
            <button
              onClick={() => navigate('/app')}
              className="bg-green-500 hover:bg-green-400 text-white font-semibold px-5 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02]"
            >
              Åpne appen
            </button>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white font-medium px-4 py-2 rounded-xl transition-colors">
                Logg inn
              </Link>
              <Link to="/register" className="bg-green-500 hover:bg-green-400 text-white font-semibold px-5 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02]">
                Kom i gang
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-16 pb-24 max-w-3xl mx-auto">
        <div className="inline-block bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Gratis å bruke
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
          Slutt på<br />
          <span className="text-green-400">matpanikk</span> i butikken
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
          Snurr hjulet, velg middag, få handlelista sortert etter butikkens hyller.
          Ferdig på under ett minutt.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200 hover:scale-[1.02] shadow-xl shadow-green-500/25"
          >
            Start gratis →
          </Link>
          <Link
            to="/login"
            className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-200"
          >
            Logg inn
          </Link>
        </div>
      </section>

      {/* Wheel preview */}
      <section className="relative z-10 max-w-sm mx-auto px-6 mb-24">
        <div
          className="rounded-3xl p-6 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
        >
          <p className="text-gray-400 text-xs text-center mb-4 font-medium uppercase tracking-wider">Slik ser det ut</p>
          <div className="space-y-2">
            {[
              { e: '🌮', n: 'Tacos', t: '30 min', p: 2, dim: true },
              { e: '🍝', n: 'Spaghetti Bolognese', t: '45 min', p: 2, selected: true },
              { e: '🐟', n: 'Laksepasta', t: '25 min', p: 2, dim: true },
            ].map((item) => (
              <div
                key={item.n}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  item.selected
                    ? 'border-2 border-green-500/60 shadow-lg shadow-green-500/15'
                    : 'border border-white/10 opacity-50'
                }`}
                style={{
                  background: item.selected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'
                }}
              >
                <span className="text-3xl">{item.e}</span>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${item.selected ? 'text-white' : 'text-gray-300'}`}>{item.n}</p>
                  <p className="text-gray-500 text-xs">⏱ {item.t}</p>
                </div>
                {item.selected && <div className="w-2 h-2 rounded-full bg-green-400" />}
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-green-500 text-white font-bold py-3 rounded-2xl text-sm">
            Velg denne! 🍝
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 mb-24 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Slik fungerer det</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div key={s.n} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-xl flex items-center justify-center mx-auto mb-3">
                {s.n}
              </div>
              <p className="text-gray-300 text-sm font-medium">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 mb-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Alt du trenger</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl border border-white/10 hover:border-green-500/30 transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24 text-center max-w-xl mx-auto">
        <div
          className="rounded-3xl p-10 border border-green-500/20"
          style={{ background: 'rgba(34,197,94,0.06)' }}
        >
          <div className="text-5xl mb-4">🍽️</div>
          <h2 className="text-3xl font-bold mb-3">Klar til å prøve?</h2>
          <p className="text-gray-400 mb-8">Gratis. Ingen kredittkort. Klar på 30 sekunder.</p>
          <Link
            to="/register"
            className="inline-block bg-green-500 hover:bg-green-400 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all duration-200 hover:scale-[1.02] shadow-xl shadow-green-500/25"
          >
            Opprett konto gratis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-gray-600 text-sm">
        © 2025 Middagshjulet
      </footer>

    </div>
  );
}

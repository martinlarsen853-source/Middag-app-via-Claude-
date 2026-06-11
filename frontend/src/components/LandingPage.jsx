import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Scroll-reveal hook
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal-block ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const features = [
  { emoji: '🎲', title: '«Velg for meg»', desc: 'Ett trykk, så foreslår appen en middag dere ikke har spist på lenge.' },
  { emoji: '💰', title: 'Ekte priser', desc: 'Hver rett viser hva den faktisk koster, med dagsferske butikkpriser.' },
  { emoji: '🛒', title: 'Handleliste etter hylle', desc: 'Lista er sortert etter din butikk. Bare følg rekkefølgen.' },
  { emoji: '👨‍👩‍👧', title: 'Del med husstanden', desc: 'Send en kode til samboeren. Dere ser det samme, alltid.' },
  { emoji: '⚖️', title: 'Skaler antall', desc: 'Trykk + eller −. Mengdene justeres automatisk.' },
  { emoji: '🏷', title: 'Smarte merker', desc: 'NYHET, RASK og BUDSJETTVINNER — appen merker rettene for deg.' },
];

export default function LandingPage() {
  const token = localStorage.getItem('middag_token');
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* ── NAV ── */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <span className="nav-logo">🍽️ Tallerken</span>
          <div className="nav-links">
            {token ? (
              <button className="btn-primary" onClick={() => navigate('/app')}>Åpne appen</button>
            ) : (
              <>
                <Link to="/login" className="nav-link">Logg inn</Link>
                <Link to="/register" className="btn-primary">Kom i gang</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO (brand teal) ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">Gratis å bruke</div>
          <h1 className="hero-title">
            Aldri lure på<br />
            <em>hva du skal lage</em><br />
            igjen
          </h1>
          <p className="hero-sub">
            Bla i rettene dine, trykk «Velg for meg», og få handlelista sortert
            etter butikkens hyller — med ekte priser. Fra null til klar på under ett minutt.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-hero">Start gratis →</Link>
            <Link to="/login" className="btn-ghost">Logg inn</Link>
          </div>
        </div>

        {/* Floating food emojis */}
        <div className="hero-deco" aria-hidden>
          <span className="deco deco-1">🍝</span>
          <span className="deco deco-2">🥩</span>
          <span className="deco deco-3">🌮</span>
          <span className="deco deco-4">🐟</span>
          <span className="deco deco-5">🥦</span>
          <span className="deco deco-6">🍕</span>
        </div>
      </section>

      {/* ── CARD PREVIEW (matches the in-app meal cards) ── */}
      <section className="preview-section">
        <Reveal>
          <div className="preview-card">
            <p className="preview-label">Slik ser det ut</p>

            <div className="mock-meal">
              <div className="mock-hero">
                <span className="mock-hero-emoji">🍝</span>
                <span className="mock-badge">NYHET</span>
                <span className="mock-time">⏱ 45 min</span>
              </div>
              <div className="mock-body">
                <p className="mock-name">Spaghetti Bolognese</p>
                <p className="mock-desc">Klassikeren hele familien elsker</p>
                <div className="mock-chips">
                  <span className="mock-chip">Hverdags</span>
                  <span className="mock-chip">Barnevennlig</span>
                  <span className="mock-chip mock-chip-price">ca. 187 kr</span>
                </div>
              </div>
            </div>

            <div className="mock-btn">🎲 Velg for meg</div>
          </div>
        </Reveal>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="steps-section">
        <Reveal>
          <h2 className="section-title">Fire steg. Ingen stress.</h2>
        </Reveal>
        <div className="steps-grid">
          {['Åpne appen i butikken', 'Velg middag — eller la appen velge', 'Velg butikk', 'Følg lista hyllevis'].map((text, i) => (
            <Reveal key={text} delay={i * 80}>
              <div className="step-card">
                <span className="step-num">{i + 1}</span>
                <p className="step-text">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <Reveal>
          <h2 className="section-title">Alt du trenger</h2>
        </Reveal>
        <div className="features-grid">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div className="feature-card">
                <span className="feature-emoji">{f.emoji}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <Reveal>
          <div className="cta-box">
            <span className="cta-emoji">🍽️</span>
            <h2 className="cta-title">Klar til å prøve?</h2>
            <p className="cta-sub">Gratis. Ingen kredittkort. Klar på 30 sekunder.</p>
            <Link to="/register" className="btn-hero">Opprett konto gratis →</Link>
          </div>
        </Reveal>
      </section>

      <footer className="landing-footer">© 2026 Tallerken</footer>

      <style>{`
        /* ── TOKENS ──
           Brand: deep teal #0e6b60 · apricot #e2772e · dark pills #1c1c1a */
        .landing {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
          background: #ffffff;
          color: #1c1c1a;
          overflow-x: hidden;
        }

        /* ── REVEAL ── */
        .reveal-block {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── NAV ── */
        .landing-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(14,107,96,0.97);
          backdrop-filter: blur(12px);
        }
        .nav-inner {
          max-width: 1100px; margin: 0 auto;
          padding: 16px 24px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo { font-size: 1.2rem; font-weight: 800; color: #fff; letter-spacing: -0.01em; }
        .nav-links { display: flex; align-items: center; gap: 12px; }
        .nav-link { color: rgba(255,255,255,0.85); font-size: 0.95rem; text-decoration: none; padding: 6px 12px; border-radius: 8px; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }

        /* ── BUTTONS ── */
        .btn-primary {
          background: #fff; color: #0e6b60;
          font-size: 0.95rem; font-weight: 700;
          padding: 9px 20px; border-radius: 999px; border: none;
          text-decoration: none; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s;
        }
        .btn-primary:hover { transform: scale(1.03); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
        .btn-hero {
          background: #1c1c1a; color: #fff;
          font-size: 1.05rem; font-weight: 800;
          padding: 16px 36px; border-radius: 999px; border: none;
          text-decoration: none; cursor: pointer; display: inline-block;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 8px 28px rgba(28,28,26,0.3);
        }
        .btn-hero:hover { background: #333330; transform: translateY(-2px); }
        .btn-ghost {
          color: #fff; font-size: 1rem; font-weight: 600;
          padding: 14px 24px; border-radius: 999px; border: 2px solid rgba(255,255,255,0.4);
          text-decoration: none; display: inline-block;
          transition: border-color 0.2s, background 0.2s;
        }
        .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.1); }

        /* ── HERO ── */
        .hero {
          position: relative;
          background: linear-gradient(170deg, #0e6b60 0%, #0a5048 100%);
          padding: 90px 24px 180px;
          overflow: hidden;
        }
        .hero-inner { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; }
        .hero-badge {
          display: inline-block;
          background: rgba(255,255,255,0.14); color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
          font-size: 0.78rem; font-weight: 700;
          padding: 5px 14px; border-radius: 999px; margin-bottom: 24px;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .hero-title {
          font-size: clamp(2.6rem, 6vw, 4.2rem);
          font-weight: 800; line-height: 1.08; color: #fff;
          letter-spacing: -0.03em; margin: 0 0 24px;
        }
        .hero-title em { font-style: normal; color: #f4b173; }
        .hero-sub {
          font-size: 1.12rem; color: rgba(255,255,255,0.85); line-height: 1.7;
          margin: 0 0 36px; max-width: 480px;
        }
        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

        /* Floating emojis */
        .hero-deco { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .deco {
          position: absolute; font-size: 2.5rem;
          animation: float 6s ease-in-out infinite;
          opacity: 0.25;
        }
        .deco-1 { top: 10%; right: 8%;  animation-delay: 0s;    font-size: 3.5rem; opacity: 0.3; }
        .deco-2 { top: 40%; right: 18%; animation-delay: 1.2s; }
        .deco-3 { top: 65%; right: 6%;  animation-delay: 0.6s;  font-size: 2rem; }
        .deco-4 { top: 20%; right: 35%; animation-delay: 2s;    font-size: 2rem; opacity: 0.16; }
        .deco-5 { top: 75%; right: 30%; animation-delay: 1.6s;  opacity: 0.18; }
        .deco-6 { top: 5%;  right: 52%; animation-delay: 0.4s;  font-size: 2rem; opacity: 0.14; }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50%       { transform: translateY(-18px) rotate(4deg); }
        }

        /* ── PREVIEW — overlaps the teal hero, mirrors in-app meal cards ── */
        .preview-section { max-width: 420px; margin: -130px auto 0; padding: 0 24px 80px; position: relative; z-index: 3; }
        .preview-card {
          background: #fff; border-radius: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05), 0 24px 70px rgba(0,0,0,0.18);
          padding: 22px; border: 1px solid #efefea;
        }
        .preview-label {
          font-size: 0.72rem; font-weight: 700;
          color: #94948c; text-transform: uppercase; letter-spacing: 0.08em;
          text-align: center; margin: 0 0 14px;
        }
        .mock-meal {
          border-radius: 18px; overflow: hidden;
          border: 1px solid #efefea;
          box-shadow: 0 2px 4px rgba(28,28,26,0.04), 0 10px 28px rgba(28,28,26,0.07);
        }
        .mock-hero {
          position: relative; height: 130px;
          background: linear-gradient(135deg, #fdf0d5 0%, #f7d9a8 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .mock-hero-emoji { font-size: 3.8rem; filter: drop-shadow(0 6px 12px rgba(28,28,26,0.18)); }
        .mock-badge {
          position: absolute; top: 10px; left: 10px;
          background: #0e6b60; color: #fff;
          font-size: 0.64rem; font-weight: 800; letter-spacing: 0.06em;
          padding: 4px 10px; border-radius: 6px;
        }
        .mock-time {
          position: absolute; bottom: 8px; right: 10px;
          background: rgba(255,255,255,0.85); color: #1c1c1a;
          font-size: 0.72rem; font-weight: 700;
          padding: 4px 10px; border-radius: 999px;
        }
        .mock-body { padding: 12px 14px 14px; }
        .mock-name { font-weight: 800; font-size: 1.05rem; color: #1c1c1a; margin: 0 0 2px; letter-spacing: -0.01em; }
        .mock-desc { font-size: 0.82rem; color: #56564f; margin: 0 0 10px; }
        .mock-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .mock-chip {
          font-size: 0.72rem; font-weight: 600; color: #56564f;
          background: #f1f1ec; border-radius: 8px; padding: 4px 10px;
        }
        .mock-chip-price { color: #0e6b60; background: #e6f1ef; }
        .mock-btn {
          margin-top: 14px; background: #1c1c1a; color: #fff;
          text-align: center; padding: 14px; border-radius: 999px;
          font-weight: 800; font-size: 0.95rem;
        }

        /* ── STEPS ── */
        .steps-section { background: #f7f7f3; padding: 80px 24px; }
        .steps-grid {
          max-width: 900px; margin: 40px auto 0;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px;
        }
        .step-card {
          background: #fff; border: 1px solid #e4e4df;
          border-radius: 20px; padding: 28px 20px; text-align: center;
        }
        .step-num {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 14px;
          background: #0e6b60; color: #fff;
          font-size: 1.2rem; font-weight: 800;
          margin: 0 auto 16px;
        }
        .step-text { font-size: 0.95rem; color: #56564f; margin: 0; }

        /* ── FEATURES ── */
        .features-section { max-width: 1100px; margin: 0 auto; padding: 80px 24px; }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px; margin-top: 40px;
        }
        .feature-card {
          background: #fff; border: 1px solid #e4e4df; border-radius: 20px;
          padding: 28px; transition: box-shadow 0.2s, transform 0.2s;
        }
        .feature-card:hover { box-shadow: 0 8px 32px rgba(28,28,26,0.08); transform: translateY(-2px); }
        .feature-emoji { font-size: 2rem; display: block; margin-bottom: 14px; }
        .feature-title { font-size: 1.05rem; font-weight: 700; margin: 0 0 8px; color: #1c1c1a; }
        .feature-desc { font-size: 0.88rem; color: #56564f; line-height: 1.6; margin: 0; }

        /* ── CTA ── */
        .cta-section { background: #0e6b60; padding: 80px 24px; }
        .cta-box {
          max-width: 540px; margin: 0 auto; text-align: center;
          background: #fff;
          border-radius: 28px; padding: 56px 40px;
          box-shadow: 0 12px 60px rgba(0,0,0,0.2);
        }
        .cta-emoji { font-size: 3rem; display: block; margin-bottom: 16px; }
        .cta-title { font-size: 2.2rem; font-weight: 800; margin: 0 0 12px; letter-spacing: -0.02em; }
        .cta-sub { color: #56564f; font-size: 1rem; margin: 0 0 32px; }

        /* ── SHARED ── */
        .section-title {
          font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800;
          letter-spacing: -0.03em; text-align: center; margin: 0;
        }

        /* ── FOOTER ── */
        .landing-footer {
          border-top: 1px solid #e4e4df; padding: 24px;
          text-align: center;
          font-size: 0.85rem; color: #94948c;
        }
      `}</style>
    </div>
  );
}

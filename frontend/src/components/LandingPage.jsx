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
  { emoji: '🎡', title: 'Spinnehjulet', desc: 'Scroll gjennom middager på sekunder. Ingen planlegging nødvendig.' },
  { emoji: '🛒', title: 'Handleliste etter hylle', desc: 'Lista er sortert etter din butikk. Bare følg rekkefølgen.' },
  { emoji: '👨‍👩‍👧', title: 'Del med husstanden', desc: 'Send en kode til samboeren. Dere ser det samme, alltid.' },
  { emoji: '⚖️', title: 'Skaler antall', desc: 'Trykk + eller −. Mengdene justeres automatisk.' },
  { emoji: '⏱', title: 'Sorter etter tid', desc: 'Dårlig tid? Se de raskeste rettene først.' },
  { emoji: '📅', title: 'Sjelden spist', desc: 'Appen husker. Få variasjon uten å tenke på det.' },
];

export default function LandingPage() {
  const token = localStorage.getItem('middag_token');
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* ── NAV ── */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <span className="nav-logo">🍽 Middagshjulet</span>
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

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">Gratis å bruke</div>
          <h1 className="hero-title">
            Aldri lure på<br />
            <em>hva du skal lage</em><br />
            igjen
          </h1>
          <p className="hero-sub">
            Snurr hjulet, velg middag, få handlelista sortert etter butikkens hyller.
            Fra null til klar på under ett minutt.
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

      {/* ── WHEEL PREVIEW ── */}
      <section className="preview-section">
        <Reveal>
          <div className="preview-card">
            <p className="preview-label">Slik ser det ut</p>
            <div className="wheel-mock">
              {[
                { e: '🌮', n: 'Tacos', t: '30 min', dim: true },
                { e: '🍝', n: 'Spaghetti Bolognese', t: '45 min', sel: true },
                { e: '🐟', n: 'Laksepasta', t: '25 min', dim: true },
              ].map(item => (
                <div key={item.n} className={`mock-row ${item.sel ? 'mock-selected' : 'mock-dim'}`}>
                  <span className="mock-emoji">{item.e}</span>
                  <div>
                    <p className="mock-name">{item.n}</p>
                    <p className="mock-time">⏱ {item.t}</p>
                  </div>
                  {item.sel && <span className="mock-dot" />}
                </div>
              ))}
            </div>
            <div className="mock-btn">Velg denne! 🍝</div>
          </div>
        </Reveal>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="steps-section">
        <Reveal>
          <h2 className="section-title">Fire steg. Ingen stress.</h2>
        </Reveal>
        <div className="steps-grid">
          {['Åpne appen i butikken', 'Snurr hjulet, velg middag', 'Velg butikk', 'Følg lista hyllevis'].map((text, i) => (
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
            <span className="cta-emoji">🍽</span>
            <h2 className="cta-title">Klar til å prøve?</h2>
            <p className="cta-sub">Gratis. Ingen kredittkort. Klar på 30 sekunder.</p>
            <Link to="/register" className="btn-hero">Opprett konto gratis →</Link>
          </div>
        </Reveal>
      </section>

      <footer className="landing-footer">© 2025 Middagshjulet</footer>

      <style>{`
        /* ── TOKENS ── */
        .landing {
          font-family: 'Georgia', 'Times New Roman', serif;
          background: #faf8f5;
          color: #1c1917;
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
          background: rgba(250,248,245,0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e7e5e2;
        }
        .nav-inner {
          max-width: 1100px; margin: 0 auto;
          padding: 18px 24px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo { font-size: 1.2rem; font-weight: 700; color: #1c1917; letter-spacing: -0.01em; }
        .nav-links { display: flex; align-items: center; gap: 12px; }
        .nav-link { color: #78716c; font-family: system-ui, sans-serif; font-size: 0.95rem; text-decoration: none; padding: 6px 12px; border-radius: 8px; transition: color 0.2s; }
        .nav-link:hover { color: #1c1917; }

        /* ── BUTTONS ── */
        .btn-primary {
          background: #c2410c; color: #fff;
          font-family: system-ui, sans-serif; font-size: 0.95rem; font-weight: 600;
          padding: 8px 20px; border-radius: 10px; border: none;
          text-decoration: none; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover { background: #b53b0a; transform: scale(1.02); }
        .btn-hero {
          background: #c2410c; color: #fff;
          font-family: system-ui, sans-serif; font-size: 1.1rem; font-weight: 700;
          padding: 16px 36px; border-radius: 14px; border: none;
          text-decoration: none; cursor: pointer; display: inline-block;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 8px 32px rgba(194,65,12,0.25);
        }
        .btn-hero:hover { background: #b53b0a; transform: translateY(-2px); box-shadow: 0 12px 40px rgba(194,65,12,0.32); }
        .btn-ghost {
          color: #78716c; font-family: system-ui, sans-serif; font-size: 1rem;
          padding: 14px 24px; border-radius: 14px; border: 2px solid #e7e5e2;
          text-decoration: none; display: inline-block;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-ghost:hover { border-color: #a8a29e; color: #1c1917; }

        /* ── HERO ── */
        .hero {
          position: relative;
          max-width: 1100px; margin: 0 auto;
          padding: 100px 24px 80px;
          overflow: hidden;
        }
        .hero-inner { position: relative; z-index: 2; max-width: 600px; }
        .hero-badge {
          display: inline-block;
          background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa;
          font-family: system-ui, sans-serif; font-size: 0.8rem; font-weight: 600;
          padding: 5px 14px; border-radius: 999px; margin-bottom: 24px;
          letter-spacing: 0.02em; text-transform: uppercase;
        }
        .hero-title {
          font-size: clamp(2.6rem, 6vw, 4.2rem);
          font-weight: 800; line-height: 1.1;
          letter-spacing: -0.03em; margin: 0 0 24px;
        }
        .hero-title em { font-style: italic; color: #c2410c; }
        .hero-sub {
          font-family: system-ui, sans-serif;
          font-size: 1.15rem; color: #78716c; line-height: 1.7;
          margin: 0 0 36px; max-width: 480px;
        }
        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

        /* Floating emojis */
        .hero-deco { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .deco {
          position: absolute; font-size: 2.5rem;
          animation: float 6s ease-in-out infinite;
          opacity: 0.18; filter: grayscale(0.2);
        }
        .deco-1 { top: 10%; right: 8%;  animation-delay: 0s;    font-size: 3.5rem; opacity: 0.22; }
        .deco-2 { top: 40%; right: 18%; animation-delay: 1.2s; }
        .deco-3 { top: 65%; right: 6%;  animation-delay: 0.6s;  font-size: 2rem; }
        .deco-4 { top: 20%; right: 35%; animation-delay: 2s;    font-size: 2rem; opacity: 0.12; }
        .deco-5 { top: 75%; right: 30%; animation-delay: 1.6s;  opacity: 0.14; }
        .deco-6 { top: 5%;  right: 52%; animation-delay: 0.4s;  font-size: 2rem; opacity: 0.1; }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50%       { transform: translateY(-18px) rotate(4deg); }
        }

        /* ── PREVIEW ── */
        .preview-section { max-width: 420px; margin: 0 auto; padding: 0 24px 80px; }
        .preview-card {
          background: #fff; border-radius: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08);
          padding: 28px; border: 1px solid #f0ede9;
        }
        .preview-label {
          font-family: system-ui, sans-serif; font-size: 0.75rem; font-weight: 600;
          color: #a8a29e; text-transform: uppercase; letter-spacing: 0.08em;
          text-align: center; margin: 0 0 16px;
        }
        .wheel-mock { display: flex; flex-direction: column; gap: 8px; }
        .mock-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 14px;
          transition: all 0.2s;
        }
        .mock-selected {
          background: #fff7ed; border: 2px solid #fed7aa;
          box-shadow: 0 4px 16px rgba(194,65,12,0.08);
        }
        .mock-dim { opacity: 0.4; border: 1px solid #f0ede9; background: #faf8f5; }
        .mock-emoji { font-size: 1.8rem; }
        .mock-name { font-weight: 700; font-size: 0.95rem; color: #1c1917; margin: 0 0 2px; }
        .mock-time { font-family: system-ui, sans-serif; font-size: 0.78rem; color: #a8a29e; margin: 0; }
        .mock-dot { width: 8px; height: 8px; border-radius: 50%; background: #c2410c; margin-left: auto; flex-shrink: 0; }
        .mock-btn {
          margin-top: 16px; background: #c2410c; color: #fff;
          text-align: center; padding: 13px; border-radius: 12px;
          font-family: system-ui, sans-serif; font-weight: 700; font-size: 0.95rem;
        }

        /* ── STEPS ── */
        .steps-section { background: #1c1917; padding: 80px 24px; }
        .steps-grid {
          max-width: 900px; margin: 40px auto 0;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px;
        }
        .step-card {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; padding: 28px 20px; text-align: center;
        }
        .step-num {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 14px;
          background: #c2410c; color: #fff;
          font-family: system-ui, sans-serif; font-size: 1.2rem; font-weight: 800;
          margin: 0 auto 16px;
        }
        .step-text { font-family: system-ui, sans-serif; font-size: 0.95rem; color: #d6d3d1; margin: 0; }

        /* ── FEATURES ── */
        .features-section { max-width: 1100px; margin: 0 auto; padding: 80px 24px; }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px; margin-top: 40px;
        }
        .feature-card {
          background: #fff; border: 1px solid #f0ede9; border-radius: 20px;
          padding: 28px; transition: box-shadow 0.2s, transform 0.2s;
        }
        .feature-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .feature-emoji { font-size: 2rem; display: block; margin-bottom: 14px; }
        .feature-title { font-size: 1.05rem; font-weight: 700; margin: 0 0 8px; color: #1c1917; }
        .feature-desc { font-family: system-ui, sans-serif; font-size: 0.88rem; color: #78716c; line-height: 1.6; margin: 0; }

        /* ── CTA ── */
        .cta-section { background: #fff7ed; padding: 80px 24px; }
        .cta-box {
          max-width: 540px; margin: 0 auto; text-align: center;
          background: #fff; border: 1px solid #fed7aa;
          border-radius: 28px; padding: 56px 40px;
          box-shadow: 0 4px 40px rgba(194,65,12,0.08);
        }
        .cta-emoji { font-size: 3rem; display: block; margin-bottom: 16px; }
        .cta-title { font-size: 2.2rem; font-weight: 800; margin: 0 0 12px; letter-spacing: -0.02em; }
        .cta-sub {
          font-family: system-ui, sans-serif; color: #78716c;
          font-size: 1rem; margin: 0 0 32px;
        }

        /* ── SHARED ── */
        .section-title {
          font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800;
          letter-spacing: -0.03em; text-align: center; margin: 0;
        }
        .steps-section .section-title { color: #fafaf9; }

        /* ── FOOTER ── */
        .landing-footer {
          border-top: 1px solid #e7e5e2; padding: 24px;
          text-align: center; font-family: system-ui, sans-serif;
          font-size: 0.85rem; color: #a8a29e;
        }
      `}</style>
    </div>
  );
}

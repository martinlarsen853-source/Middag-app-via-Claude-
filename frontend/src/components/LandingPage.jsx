import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ── Design tokens ──────────────────────────────────────────────────────────
const T = {
  bg:       '#0F0C0A',
  card:     '#1E1714',
  cardHi:   '#271D17',
  cream:    '#F5EDDF',
  cream70:  'rgba(245,237,223,0.70)',
  cream55:  'rgba(245,237,223,0.55)',
  cream15:  'rgba(245,237,223,0.15)',
  cream08:  'rgba(245,237,223,0.08)',
  terra:    '#E25A33',
  terraD:   '#C8431F',
  amber:    '#F0A35E',
  border:   'rgba(245,237,223,0.10)',
  paper:    '#F5EDDF',
  ink:      '#221A14',
};

const FRAUNCES = "'Fraunces', Georgia, 'Times New Roman', serif";
const INTER    = "'Inter', system-ui, -apple-system, sans-serif";
const MONO     = "'ui-monospace', 'Cascadia Mono', 'Consolas', monospace";

// ── Wheel data ──────────────────────────────────────────────────────────────
const WHEEL_MEALS = [
  { name: 'Tacos',               emoji: '🌮', time: 30, price: 250 },
  { name: 'Bolognese',           emoji: '🍝', time: 45, price: 180 },
  { name: 'Laksemiddag',         emoji: '🐟', time: 25, price: 290 },
  { name: 'Kyllingsuppe',        emoji: '🍲', time: 40, price: 150 },
  { name: 'Pizza',               emoji: '🍕', time: 35, price: 200 },
  { name: 'Biff & poteter',      emoji: '🥩', time: 30, price: 380 },
  { name: 'Nuddelwok',           emoji: '🍜', time: 20, price: 160 },
  { name: 'Kjøttkaker',          emoji: '🍖', time: 50, price: 220 },
];

// ── Receipt data ────────────────────────────────────────────────────────────
const RECEIPT_SECTIONS = [
  { label: 'FRUKT & GRØNT', items: [
    { name: 'Paprika',  price: 35 },
    { name: 'Tomat',    price: 28 },
    { name: 'Avokado',  price: 22 },
  ]},
  { label: 'MEIERI', items: [
    { name: 'Rømme',      price: 42 },
    { name: 'Revet ost',  price: 65 },
  ]},
  { label: 'TØRRVARER', items: [
    { name: 'Tacoskjell',         price: 38 },
    { name: 'Hermetiske bønner',  price: 25 },
  ]},
  { label: 'KJØTT', items: [
    { name: 'Karbonadedeig', price: 89 },
  ]},
];
const RECEIPT_TOTAL = RECEIPT_SECTIONS.flatMap(s => s.items).reduce((a, b) => a + b.price, 0);

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(d = new Date()) {
  return d.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
}
function norwegianDate() {
  const d = new Date();
  const days = ['søndag','mandag','tirsdag','onsdag','torsdag','fredag','lørdag'];
  const months = ['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember'];
  return `${days[d.getDay()]} ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Clock Badge ──────────────────────────────────────────────────────────────
function ClockBadge() {
  const [time, setTime] = useState(formatTime);
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      background: T.cream08, border: `1px solid ${T.border}`,
      borderRadius: 999, padding: '6px 16px',
      fontSize: '0.82rem', color: T.cream70, fontFamily: INTER,
      letterSpacing: '0.01em',
    }}>
      <span style={{ color: T.amber }}>🕐</span>
      Kl.&nbsp;{time} — vet du hva det blir til middag?
    </div>
  );
}

// ── Receipt ───────────────────────────────────────────────────────────────────
function Receipt() {
  const [checked, setChecked] = useState(new Set());
  const toggle = (k) => setChecked(p => {
    const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n;
  });

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Paper body */}
      <div style={{
        background: T.paper, color: T.ink,
        fontFamily: MONO, fontSize: '0.76rem', lineHeight: 1.85,
        padding: '18px 16px 14px',
        borderRadius: '4px 4px 0 0',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', paddingBottom: 10, marginBottom: 10, borderBottom: `1px dashed ${T.ink}50` }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.18em' }}>TALLERKEN</div>
          <div style={{ fontSize: '0.68rem', color: `${T.ink}90`, marginTop: 2 }}>🌮 Tacos · 2 pers</div>
          <div style={{ fontSize: '0.68rem', color: `${T.ink}80` }}>{norwegianDate()}</div>
        </div>

        {/* Sections */}
        {RECEIPT_SECTIONS.map(section => (
          <div key={section.label} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.10em', color: `${T.ink}99`, marginBottom: 1 }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const k = `${section.label}:${item.name}`;
              const done = checked.has(k);
              return (
                <div
                  key={k}
                  onClick={() => toggle(k)}
                  style={{
                    display: 'flex', alignItems: 'flex-end', gap: 3,
                    cursor: 'pointer', paddingLeft: 6,
                    color: done ? T.terra : T.ink,
                    textDecoration: done ? 'line-through' : 'none',
                    transition: 'color 0.15s',
                  }}
                >
                  <span style={{ flexShrink: 0 }}>{item.name}</span>
                  <span style={{
                    flex: 1, borderBottom: `1px dotted ${T.ink}40`,
                    margin: '0 3px 3px',
                  }}/>
                  <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>{item.price}&nbsp;kr</span>
                </div>
              );
            })}
          </div>
        ))}

        {/* Sum */}
        <div style={{ borderTop: `1px solid ${T.ink}40`, marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.82rem' }}>
          <span>SUM</span>
          <span>{RECEIPT_TOTAL}&nbsp;kr</span>
        </div>

        {/* Barcode */}
        <div style={{
          height: 32, marginTop: 12,
          background: `repeating-linear-gradient(90deg,
            ${T.ink} 0,${T.ink} 2px, transparent 2px, transparent 4px,
            ${T.ink} 4px,${T.ink} 5px, transparent 5px, transparent 8px,
            ${T.ink} 8px,${T.ink} 9px, transparent 9px, transparent 13px,
            ${T.ink} 13px,${T.ink} 14px, transparent 14px, transparent 16px
          )`,
          opacity: 0.55,
        }}/>
      </div>

      {/* Zigzag torn bottom — paper teeth pointing down */}
      <div style={{
        height: 14,
        backgroundImage: `linear-gradient(135deg, ${T.paper} 33.33%, transparent 33.33%), linear-gradient(225deg, ${T.paper} 33.33%, transparent 33.33%)`,
        backgroundSize: '14px 14px',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: '0 0, 7px 0',
      }}/>
    </div>
  );
}

// ── Wheel Carousel ────────────────────────────────────────────────────────────
function WheelCarousel({ reduced }) {
  const [rotation, setRotation]   = useState(0);
  const [autoSpin, setAutoSpin]   = useState(!reduced);
  const [spinning, setSpinning]   = useState(false);
  const [winner, setWinner]       = useState(null);
  const [burst, setBurst]         = useState([]);
  const [wheelZ, setWheelZ]       = useState(() =>
    typeof window !== 'undefined' ? Math.min(210, Math.max(140, window.innerWidth * 0.37)) : 180
  );

  const rotRef  = useRef(0);
  const rafRef  = useRef(null);
  const dragRef = useRef({ active: false, lastX: 0, velocity: 0, lastTime: 0 });
  const stageRef = useRef(null);

  // Unmount cleanup
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  // Responsive wheelZ
  useEffect(() => {
    const upd = () => setWheelZ(Math.min(210, Math.max(140, window.innerWidth * 0.37)));
    window.addEventListener('resize', upd, { passive: true });
    return () => window.removeEventListener('resize', upd);
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (!autoSpin || reduced) return;
    const loop = () => {
      rotRef.current -= 0.042;
      setRotation(rotRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [autoSpin, reduced]);

  const cancelRAF = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  };

  const animateTo = (from, to, dur, onDone) => {
    const t0 = performance.now();
    const go = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      const v = from + (to - from) * e;
      rotRef.current = v;
      setRotation(v);
      if (p < 1) { rafRef.current = requestAnimationFrame(go); }
      else { rotRef.current = to; setRotation(to); onDone?.(); }
    };
    rafRef.current = requestAnimationFrame(go);
  };

  const snapToNearest = (rot) => {
    const nearest = Math.round(rot / 45) * 45;
    if (Math.abs(rot - nearest) < 0.5) return;
    cancelRAF();
    animateTo(rot, nearest, 380);
  };

  const onPointerDown = (e) => {
    if (spinning) return;
    e.preventDefault();
    cancelRAF();
    setAutoSpin(false);
    setWinner(null);
    stageRef.current?.setPointerCapture(e.pointerId);
    dragRef.current = { active: true, lastX: e.clientX, velocity: 0, lastTime: e.timeStamp };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dt = e.timeStamp - dragRef.current.lastTime || 16;
    dragRef.current.velocity = dx / dt;
    dragRef.current.lastX    = e.clientX;
    dragRef.current.lastTime = e.timeStamp;
    rotRef.current += dx * 0.38;
    setRotation(rotRef.current);
  };

  const onPointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    let vel = dragRef.current.velocity * 55;
    const friction = 0.92;
    let cur = rotRef.current;
    cancelRAF();
    const coast = () => {
      vel *= friction;
      if (Math.abs(vel) > 0.25) {
        cur += vel; rotRef.current = cur; setRotation(cur);
        rafRef.current = requestAnimationFrame(coast);
      } else { snapToNearest(cur); }
    };
    rafRef.current = requestAnimationFrame(coast);
  };

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setWinner(null);
    cancelRAF();
    setAutoSpin(false);
    const targetIdx = Math.floor(Math.random() * 8);
    const cur = rotRef.current;
    const targetMod  = ((-targetIdx * 45) % 360 + 360) % 360;
    const currentMod = ((cur % 360) + 360) % 360;
    let delta = targetMod - currentMod;
    if (delta > 0) delta -= 360;
    const endRot = cur + delta - 5 * 360;
    animateTo(cur, endRot, 3000, () => {
      setSpinning(false);
      setWinner(targetIdx);
      if (!reduced) {
        if (navigator.vibrate) navigator.vibrate(20);
        const SPARKLES = ['✨','🎉','🌟','🎊','💫','⭐','🎯','✨'];
        setBurst(Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          ch: SPARKLES[i],
          x: (Math.random() - 0.5) * 220,
          y: (Math.random() - 0.5) * 220,
        })));
        setTimeout(() => setBurst([]), 1100);
      }
    });
  };

  return (
    <div style={{ position: 'relative', textAlign: 'center', marginTop: 32 }}>
      {/* 3D stage */}
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          perspective: '1100px',
          height: 280,
          position: 'relative',
          cursor: spinning ? 'default' : 'grab',
          touchAction: 'none',
          userSelect: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Ring */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 0, height: 0,
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotation}deg)`,
        }}>
          {WHEEL_MEALS.map((meal, i) => {
            const worldAngle = ((i * 45 + rotation) % 360 + 360) % 360;
            const opacity = Math.max(0, Math.cos((worldAngle * Math.PI) / 180));
            const isWin = winner === i;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 150, height: 210,
                  marginLeft: -75, marginTop: -105,
                  borderRadius: 16,
                  background: isWin ? T.cardHi : T.card,
                  border: isWin
                    ? `2px solid ${T.terra}`
                    : `1px solid rgba(245,237,223,0.07)`,
                  boxShadow: isWin
                    ? `0 0 0 4px ${T.terra}33, 0 8px 40px rgba(226,90,51,0.35)`
                    : '0 4px 24px rgba(0,0,0,0.5)',
                  transform: `rotateY(${i * 45}deg) translateZ(${wheelZ}px) scale(${isWin ? 1.05 : 1})`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  opacity,
                  transition: isWin ? 'transform 0.3s, box-shadow 0.3s' : 'none',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '12px 10px',
                  fontFamily: INTER,
                  pointerEvents: 'none',
                  willChange: 'transform',
                }}
              >
                <span style={{ fontSize: '3.2rem', lineHeight: 1, marginBottom: 10 }}>{meal.emoji}</span>
                <div style={{ color: T.cream, fontSize: '0.82rem', fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>
                  {meal.name}
                </div>
                <div style={{ color: T.cream55, fontSize: '0.7rem', textAlign: 'center' }}>
                  {meal.time} min · {meal.price} kr
                </div>
              </div>
            );
          })}
        </div>

        {/* Burst particles */}
        {burst.map(p => (
          <div key={p.id} style={{
            position: 'absolute', top: '50%', left: '50%',
            fontSize: '1.3rem', pointerEvents: 'none',
            animation: `lp-burst 1s ease-out forwards`,
            '--bx': `${p.x}px`, '--by': `${p.y}px`,
          }}>
            {p.ch}
          </div>
        ))}
      </div>

      {/* Winner text */}
      <div
        aria-live="polite"
        style={{
          minHeight: 44, marginTop: 10,
          fontSize: '0.95rem', fontFamily: INTER,
          color: winner !== null ? T.cream : 'transparent',
          transition: 'color 0.4s',
        }}
      >
        {winner !== null && (
          <>
            Det blir {WHEEL_MEALS[winner].emoji}&nbsp;
            <strong style={{ color: T.amber }}>{WHEEL_MEALS[winner].name}</strong>
            {' '}— {WHEEL_MEALS[winner].time} min · ca {WHEEL_MEALS[winner].price} kr
          </>
        )}
      </div>

      {/* Spin button */}
      <button
        onClick={spinWheel}
        disabled={spinning}
        style={{
          marginTop: 14,
          background: spinning
            ? `rgba(226,90,51,0.25)`
            : `linear-gradient(135deg, ${T.terra}, ${T.terraD})`,
          color: spinning ? T.cream55 : T.cream,
          border: 'none', borderRadius: 999,
          padding: '14px 36px',
          fontSize: '1rem', fontWeight: 700,
          cursor: spinning ? 'default' : 'pointer',
          fontFamily: INTER,
          boxShadow: spinning ? 'none' : `0 8px 32px rgba(226,90,51,0.35)`,
          transition: 'all 0.2s',
          letterSpacing: '-0.01em',
        }}
      >
        {spinning ? 'Snurrer…' : 'Snurr hjulet 🎲'}
      </button>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const token   = localStorage.getItem('middag_token');
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const reduced = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      background: T.bg, color: T.cream,
      minHeight: '100vh', fontFamily: INTER,
      overflowX: 'hidden', position: 'relative',
    }}>

      {/* Film grain */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        opacity: 0.05,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '200px 200px',
      }}/>

      {/* Radial glows */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -250, left: '50%', transform: 'translateX(-50%)',
          width: 900, height: 700,
          background: 'radial-gradient(ellipse at center, rgba(226,90,51,0.17) 0%, transparent 68%)',
        }}/>
        <div style={{
          position: 'absolute', top: -120, right: -100,
          width: 700, height: 600,
          background: 'radial-gradient(ellipse at center, rgba(240,163,94,0.09) 0%, transparent 68%)',
        }}/>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(15,12,10,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${T.border}` : '1px solid transparent',
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: FRAUNCES, fontSize: '1.25rem', fontWeight: 700, color: T.cream, letterSpacing: '-0.02em' }}>
            🛒 Handleklar
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {token ? (
              <button onClick={() => navigate('/app')} className="lp-btn-terra" style={{ fontSize: '0.9rem', padding: '9px 20px' }}>
                Åpne appen
              </button>
            ) : (
              <>
                <Link to="/login" style={{
                  color: T.cream70, fontSize: '0.9rem', textDecoration: 'none',
                  padding: '8px 12px', borderRadius: 8,
                  transition: 'color 0.2s',
                }}>
                  Logg inn
                </Link>
                <Link to="/register" className="lp-btn-terra" style={{ fontSize: '0.9rem', padding: '9px 20px' }}>
                  Start gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '64px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <ClockBadge />
          <h1 style={{
            fontFamily: FRAUNCES,
            fontWeight: 560,
            fontSize: 'clamp(2.7rem, 7.5vw, 4.8rem)',
            lineHeight: 1.05,
            color: T.cream,
            letterSpacing: '-0.03em',
            margin: '28px 0 22px',
          }}>
            Aldri lure på<br />
            <em style={{
              fontStyle: 'italic',
              background: `linear-gradient(95deg, ${T.terra} 0%, ${T.amber} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              hva du skal lage
            </em><br />
            igjen
          </h1>
          <p style={{ color: T.cream70, fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Snurr hjulet, velg middag, få handlelista sortert etter butikkens hyller.
            Fra null til klar på under ett minutt.
          </p>

          <WheelCarousel reduced={reduced} />
        </div>
      </section>

      {/* ── FACTS STRIPE ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        borderTop: `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
        padding: '16px 24px',
        display: 'flex', justifyContent: 'center',
        flexWrap: 'wrap', gap: 'clamp(16px, 5vw, 56px)',
      }}>
        {['Gratis å bruke', '15 norske klassikere', 'Rett i nettleseren'].map(f => (
          <span key={f} style={{
            fontSize: '0.73rem', fontWeight: 600, fontFamily: INTER,
            color: T.cream55, textTransform: 'uppercase', letterSpacing: '0.13em',
          }}>{f}</span>
        ))}
      </div>

      {/* ── HOW IT WORKS ── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '80px 24px 64px' }}>
        <h2 style={{
          fontFamily: FRAUNCES, fontWeight: 560,
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          color: T.cream, letterSpacing: '-0.03em',
          textAlign: 'center', margin: '0 0 56px',
        }}>
          Slik funker det
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
          alignItems: 'start',
        }}>

          {/* Step 01 */}
          <div style={{ background: T.card, borderRadius: 20, padding: '32px 28px', border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: FRAUNCES, fontSize: '3.6rem', color: T.terra, opacity: 0.28, lineHeight: 1, marginBottom: 18 }}>01</div>
            <h3 style={{ color: T.cream, fontSize: '1.2rem', fontWeight: 700, margin: '0 0 12px', fontFamily: INTER }}>Snurr</h3>
            <p style={{ color: T.cream70, fontSize: '0.9rem', lineHeight: 1.68, margin: 0 }}>
              Trykk «Snurr hjulet» og la appen velge en middagskandidat — eller bla gjennom rettene dine selv.
            </p>
          </div>

          {/* Step 02 */}
          <div style={{ background: T.card, borderRadius: 20, padding: '32px 28px', border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: FRAUNCES, fontSize: '3.6rem', color: T.terra, opacity: 0.28, lineHeight: 1, marginBottom: 18 }}>02</div>
            <h3 style={{ color: T.cream, fontSize: '1.2rem', fontWeight: 700, margin: '0 0 18px', fontFamily: INTER }}>Velg</h3>
            <div style={{
              background: T.cardHi, borderRadius: 14,
              padding: '14px 16px',
              border: `1px solid rgba(245,237,223,0.07)`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span style={{ fontSize: '2.4rem', lineHeight: 1 }}>🌮</span>
              <div>
                <div style={{ color: T.cream, fontWeight: 700, fontSize: '0.92rem', fontFamily: INTER }}>Tacos</div>
                <div style={{ color: T.cream55, fontSize: '0.74rem', marginTop: 3 }}>⏱ 30 min · ca 250 kr · 2 pers</div>
              </div>
            </div>
          </div>

          {/* Step 03 */}
          <div style={{ background: T.card, borderRadius: 20, padding: '32px 28px', border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: FRAUNCES, fontSize: '3.6rem', color: T.terra, opacity: 0.28, lineHeight: 1, marginBottom: 18 }}>03</div>
            <h3 style={{ color: T.cream, fontSize: '1.2rem', fontWeight: 700, margin: '0 0 18px', fontFamily: INTER }}>Handle</h3>
            <Receipt />
          </div>

        </div>
      </section>

      {/* ── CLOSING QUOTE ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '72px 24px 100px', textAlign: 'center' }}>
        <p style={{
          fontFamily: FRAUNCES, fontStyle: 'italic', fontWeight: 560,
          fontSize: 'clamp(1.9rem, 5.5vw, 3.4rem)',
          color: T.cream, letterSpacing: '-0.03em', lineHeight: 1.15,
          margin: '0 auto 44px', maxWidth: 660,
        }}>
          «Middagen er ett snurr unna.»
        </p>
        {token ? (
          <button onClick={() => navigate('/app')} className="lp-btn-terra" style={{ fontSize: '1.1rem', padding: '16px 44px' }}>
            Åpne appen
          </button>
        ) : (
          <Link to="/register" className="lp-btn-terra" style={{ fontSize: '1.1rem', padding: '16px 44px' }}>
            Start gratis
          </Link>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: `1px solid ${T.border}`,
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.82rem', color: T.cream55, fontFamily: INTER,
      }}>
        © 2026 Handleklar
      </footer>

      <style>{`
        .lp-btn-terra {
          display: inline-block;
          background: linear-gradient(135deg, ${T.terra}, ${T.terraD});
          color: ${T.cream};
          border: none;
          border-radius: 999px;
          padding: 10px 24px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          font-family: ${INTER};
          box-shadow: 0 6px 24px rgba(226,90,51,0.30);
          transition: transform 0.15s, box-shadow 0.2s;
          letter-spacing: -0.01em;
        }
        .lp-btn-terra:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 32px rgba(226,90,51,0.48);
        }
        @keyframes lp-burst {
          0%   { transform: translate(-50%, -50%) scale(1);   opacity: 1; }
          100% { transform: translate(calc(-50% + var(--bx, 0px)), calc(-50% + var(--by, 0px))) scale(0); opacity: 0; }
        }
        *:focus-visible {
          outline: 2px solid ${T.amber};
          outline-offset: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

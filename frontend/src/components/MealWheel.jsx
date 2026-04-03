import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeals, markEaten, updatePersons } from '../api.js';
import PersonCounter from './PersonCounter.jsx';

const CARD_HEIGHT = 110;
const CARD_GAP = 14;
const CARD_STEP = CARD_HEIGHT + CARD_GAP;
const VISIBLE_RADIUS = 260; // px, the cylinder radius

function priceLabel(level) {
  return 'kr'.repeat(level);
}

function PriceIcon({ level }) {
  return (
    <span className="text-xs font-semibold">
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className={i < level ? 'text-green-400' : 'text-white/20'}>kr</span>
      ))}
    </span>
  );
}

export default function MealWheel() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('random');
  const [persons, setPersons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('middag_user') || '{}').default_persons || 2;
    } catch { return 2; }
  });

  // Wheel state
  const containerRef = useRef(null);
  const angleRef = useRef(0);       // current visual angle (degrees)
  const targetAngleRef = useRef(0); // target angle
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayAngle, setDisplayAngle] = useState(0); // triggers re-render

  const ANGLE_PER_CARD = 18; // degrees between each card on the cylinder

  useEffect(() => {
    loadMeals(sort);
  }, [sort]);

  async function loadMeals(sortMode) {
    setLoading(true);
    try {
      const data = await getMeals(sortMode);
      setMeals(data);
      angleRef.current = 0;
      targetAngleRef.current = 0;
      setSelectedIndex(0);
      setDisplayAngle(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Animation loop
  const animate = useCallback(() => {
    const current = angleRef.current;
    const target = targetAngleRef.current;
    const diff = target - current;

    if (!isDraggingRef.current) {
      // Apply friction/lerp when not dragging
      if (Math.abs(velocityRef.current) > 0.05) {
        velocityRef.current *= 0.92;
        targetAngleRef.current += velocityRef.current;
      } else {
        velocityRef.current = 0;
      }
    }

    const newAngle = current + diff * 0.15;
    angleRef.current = newAngle;

    // Calculate which card is centered
    const rawIndex = Math.round(newAngle / ANGLE_PER_CARD);
    const clampedIndex = Math.max(0, Math.min(rawIndex, meals.length - 1));
    setSelectedIndex(clampedIndex);
    setDisplayAngle(newAngle);

    rafRef.current = requestAnimationFrame(animate);
  }, [meals.length]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  // Snap to nearest card
  function snapToNearest() {
    const rawIndex = Math.round(targetAngleRef.current / ANGLE_PER_CARD);
    const snapped = Math.max(0, Math.min(rawIndex, meals.length - 1));
    targetAngleRef.current = snapped * ANGLE_PER_CARD;
    velocityRef.current = 0;
  }

  // Mouse events
  function handleMouseDown(e) {
    isDraggingRef.current = true;
    lastYRef.current = e.clientY;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
    containerRef.current?.classList.add('no-select');
  }

  function handleMouseMove(e) {
    if (!isDraggingRef.current) return;
    const dy = e.clientY - lastYRef.current;
    const dt = Date.now() - lastTimeRef.current;
    const deltaAngle = (-dy / CARD_STEP) * ANGLE_PER_CARD;
    targetAngleRef.current += deltaAngle;

    // Track velocity
    if (dt > 0) {
      velocityRef.current = deltaAngle / (dt / 16);
    }

    lastYRef.current = e.clientY;
    lastTimeRef.current = Date.now();
  }

  function handleMouseUp() {
    isDraggingRef.current = false;
    containerRef.current?.classList.remove('no-select');
    snapToNearest();
  }

  // Touch events
  function handleTouchStart(e) {
    isDraggingRef.current = true;
    lastYRef.current = e.touches[0].clientY;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
  }

  function handleTouchMove(e) {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const dy = e.touches[0].clientY - lastYRef.current;
    const dt = Date.now() - lastTimeRef.current;
    const deltaAngle = (-dy / CARD_STEP) * ANGLE_PER_CARD;
    targetAngleRef.current += deltaAngle;
    if (dt > 0) velocityRef.current = deltaAngle / (dt / 16);
    lastYRef.current = e.touches[0].clientY;
    lastTimeRef.current = Date.now();
  }

  function handleTouchEnd() {
    isDraggingRef.current = false;
    snapToNearest();
  }

  // Wheel scroll
  function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY;
    const deltaAngle = (delta / CARD_STEP) * ANGLE_PER_CARD * 0.8;
    targetAngleRef.current += deltaAngle;
    velocityRef.current = deltaAngle * 0.3;
  }

  function goToIndex(index) {
    const clamped = Math.max(0, Math.min(index, meals.length - 1));
    targetAngleRef.current = clamped * ANGLE_PER_CARD;
    velocityRef.current = 0;
  }

  function handleSelectMeal() {
    if (!meals[selectedIndex]) return;
    const meal = meals[selectedIndex];
    markEaten(meal.id).catch(() => {});
    // Save persons
    updatePersons(persons).catch(() => {});
    const user = JSON.parse(localStorage.getItem('middag_user') || '{}');
    user.default_persons = persons;
    localStorage.setItem('middag_user', JSON.stringify(user));
    navigate(`/meal/${meal.id}`);
  }

  function handlePersonChange(p) {
    setPersons(p);
  }

  // Render cards in 3D
  function renderCards() {
    if (!meals.length) return null;

    return meals.map((meal, index) => {
      // Angle difference from selected
      const angleDiff = index * ANGLE_PER_CARD - displayAngle;
      const normalizedAngle = ((angleDiff % 360) + 360) % 360;
      const signedAngle = normalizedAngle > 180 ? normalizedAngle - 360 : normalizedAngle;

      // Hide cards that are too far away
      if (Math.abs(signedAngle) > 65) return null;

      const isSelected = index === selectedIndex;
      const absAngle = Math.abs(signedAngle);

      // 3D transform
      const rotateX = signedAngle;
      const scale = Math.cos((absAngle * Math.PI) / 180);
      const translateZ = VISIBLE_RADIUS * (scale - 1);
      const opacity = Math.max(0, 1 - (absAngle / 65) * 0.8);
      const brightness = 0.4 + 0.6 * scale;

      const transform = `rotateX(${rotateX}deg) translateZ(${translateZ}px) scale(${Math.max(0.6, scale)})`;

      return (
        <div
          key={meal.id}
          className={`wheel-card absolute left-0 right-0 mx-auto cursor-pointer`}
          style={{
            height: CARD_HEIGHT,
            transform,
            opacity,
            filter: `brightness(${brightness})`,
            top: '50%',
            marginTop: -(CARD_HEIGHT / 2),
            transition: isDraggingRef.current ? 'none' : undefined,
            zIndex: isSelected ? 10 : Math.round((1 - absAngle / 65) * 5)
          }}
          onClick={() => goToIndex(index)}
        >
          <div
            className={`h-full rounded-2xl px-4 flex items-center gap-4 transition-all duration-200 ${
              isSelected
                ? 'bg-white/15 border-2 border-green-500/60 shadow-lg shadow-green-500/20'
                : 'bg-white/8 border border-white/15'
            }`}
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              background: isSelected
                ? 'rgba(255,255,255,0.13)'
                : 'rgba(255,255,255,0.06)'
            }}
          >
            {/* Emoji */}
            <div className="text-5xl flex-shrink-0 leading-none">{meal.emoji}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base leading-tight truncate">
                {meal.name}
              </h3>
              <p className="text-gray-400 text-xs mt-0.5 truncate">{meal.category}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-gray-300 text-xs flex items-center gap-1">
                  <span>⏱</span>
                  <span>{meal.time_minutes} min</span>
                </span>
                <PriceIcon level={meal.price_level} />
              </div>
            </div>

            {/* Selected indicator */}
            {isSelected && (
              <div className="flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
              </div>
            )}
          </div>
        </div>
      );
    });
  }

  const sortButtons = [
    { key: 'random', label: '🎲 Tilfeldig' },
    { key: 'time', label: '⏱ Tid' },
    { key: 'price', label: '💰 Pris' },
    { key: 'rarely', label: '📅 Sjelden spist' }
  ];

  return (
    <div className="flex flex-col h-full max-w-md mx-auto w-full px-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <div>
          <h2 className="text-white font-bold text-lg">Hva blir det til middag?</h2>
          <p className="text-gray-500 text-xs">Dra for å spinne hjulet</p>
        </div>
        <PersonCounter value={persons} onChange={handlePersonChange} size="sm" />
      </div>

      {/* Sort buttons */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 no-select">
        {sortButtons.map(btn => (
          <button
            key={btn.key}
            onClick={() => setSort(btn.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              sort === btn.key
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Wheel area */}
      <div className="flex-1 relative flex flex-col items-center justify-center">
        {loading ? (
          <div className="text-center">
            <div className="text-5xl mb-4 animate-spin">🍽️</div>
            <p className="text-gray-400">Laster middag...</p>
          </div>
        ) : (
          <>
            {/* Selection highlight */}
            <div
              className="absolute left-0 right-0 pointer-events-none z-20"
              style={{
                top: '50%',
                height: CARD_HEIGHT + 4,
                marginTop: -(CARD_HEIGHT / 2 + 2),
                background: 'linear-gradient(to right, transparent, rgba(34,197,94,0.08) 20%, rgba(34,197,94,0.08) 80%, transparent)',
                borderTop: '1px solid rgba(34,197,94,0.3)',
                borderBottom: '1px solid rgba(34,197,94,0.3)'
              }}
            />

            {/* Top gradient fade */}
            <div
              className="absolute left-0 right-0 top-0 z-10 pointer-events-none"
              style={{
                height: '35%',
                background: 'linear-gradient(to bottom, #0f0f1a, transparent)'
              }}
            />
            {/* Bottom gradient fade */}
            <div
              className="absolute left-0 right-0 bottom-0 z-10 pointer-events-none"
              style={{
                height: '35%',
                background: 'linear-gradient(to top, #0f0f1a, transparent)'
              }}
            />

            {/* The wheel */}
            <div
              ref={containerRef}
              className="wheel-container relative w-full cursor-grab active:cursor-grabbing"
              style={{ height: 380, touchAction: 'none' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
            >
              {renderCards()}
            </div>
          </>
        )}
      </div>

      {/* Bottom action area */}
      {!loading && meals.length > 0 && (
        <div className="space-y-3 pt-2">
          {/* Selected meal name */}
          {meals[selectedIndex] && (
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-0.5">Valgt</p>
              <p className="text-white font-semibold text-sm">{meals[selectedIndex].name}</p>
            </div>
          )}

          {/* Choose button */}
          <button
            onClick={handleSelectMeal}
            disabled={!meals[selectedIndex]}
            className="w-full bg-green-500 hover:bg-green-400 active:bg-green-600 disabled:bg-green-500/30 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-green-500/30"
          >
            Velg denne! {meals[selectedIndex]?.emoji}
          </button>
        </div>
      )}
    </div>
  );
}

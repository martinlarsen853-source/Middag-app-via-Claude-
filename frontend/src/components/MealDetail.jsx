import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMeal } from '../api.js';
import PersonCounter from './PersonCounter.jsx';

const sectionColors = {
  'Frukt & grønt': 'bg-green-500/20 text-green-300',
  'Kjøtt & fisk': 'bg-red-500/20 text-red-300',
  'Meieri': 'bg-yellow-500/20 text-yellow-300',
  'Tørrmat': 'bg-orange-500/20 text-orange-300',
  'Frys': 'bg-blue-500/20 text-blue-300',
  'Bakeri': 'bg-amber-500/20 text-amber-300',
  'Krydder & sauser': 'bg-purple-500/20 text-purple-300',
  'Drikkevarer': 'bg-cyan-500/20 text-cyan-300',
  'Diverse': 'bg-gray-500/20 text-gray-300'
};

function PriceDots({ level }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className={`text-sm font-bold ${i < level ? 'text-green-400' : 'text-white/20'}`}>
          kr
        </span>
      ))}
    </div>
  );
}

export default function MealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [persons, setPersons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('middag_user') || '{}').default_persons || 2;
    } catch { return 2; }
  });

  useEffect(() => {
    getMeal(id)
      .then(setMeal)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleGoShopping() {
    // Save persons to localStorage
    const user = JSON.parse(localStorage.getItem('middag_user') || '{}');
    user.default_persons = persons;
    localStorage.setItem('middag_user', JSON.stringify(user));
    localStorage.setItem('middag_persons_' + id, persons);
    navigate(`/meal/${id}/shopping`);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-5xl animate-spin">🍽️</div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-center">
        <div>
          <p className="text-red-400 mb-4">{error || 'Måltid ikke funnet'}</p>
          <button onClick={() => navigate('/')} className="text-green-400 hover:underline">
            Tilbake til hjulet
          </button>
        </div>
      </div>
    );
  }

  const BASE_PERSONS = 4;
  const scale = persons / BASE_PERSONS;

  return (
    <div className="max-w-md mx-auto w-full px-4 py-6 space-y-6 animate-[fade-up_0.3s_ease-out]">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Tilbake til hjulet
      </button>

      {/* Hero card */}
      <div className="glass-strong rounded-3xl p-6 text-center">
        <div className="text-8xl mb-4 leading-none">{meal.emoji}</div>
        <h1 className="text-3xl font-bold text-white mb-1">{meal.name}</h1>
        <p className="text-gray-400 text-sm mb-4">{meal.category}</p>

        <p className="text-gray-300 text-sm leading-relaxed">{meal.description}</p>

        <div className="flex items-center justify-center gap-6 mt-5">
          <div className="text-center">
            <div className="text-2xl mb-1">⏱</div>
            <div className="text-white font-bold">{meal.time_minutes} min</div>
            <div className="text-gray-500 text-xs">tilbereding</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="mb-1"><PriceDots level={meal.price_level} /></div>
            <div className="text-white font-bold">
              {meal.price_level === 1 ? 'Billig' : meal.price_level === 2 ? 'Middels' : 'Dyrere'}
            </div>
            <div className="text-gray-500 text-xs">prisnivå</div>
          </div>
          {meal.last_eaten && (
            <>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl mb-1">📅</div>
                <div className="text-white font-bold text-sm">
                  {new Date(meal.last_eaten).toLocaleDateString('no-NO', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-gray-500 text-xs">sist spist</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Persons selector */}
      <div className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">Antall personer</h3>
            <p className="text-gray-500 text-xs mt-0.5">Justerer ingrediensene</p>
          </div>
          <PersonCounter value={persons} onChange={setPersons} size="md" />
        </div>
      </div>

      {/* Ingredients */}
      <div className="glass rounded-3xl p-5">
        <h3 className="text-white font-semibold mb-4">Ingredienser</h3>
        <div className="space-y-2">
          {meal.ingredients.map(ing => {
            const scaled = Math.round(ing.quantity * scale * 10) / 10;
            const colorClass = sectionColors[ing.section] || 'bg-gray-500/20 text-gray-300';
            return (
              <div key={ing.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${colorClass}`}>
                    {ing.section.split(' ')[0]}
                  </span>
                  <span className="text-white text-sm truncate">{ing.ingredient_name}</span>
                </div>
                <span className="text-gray-400 text-sm font-medium ml-2 flex-shrink-0">
                  {scaled} {ing.unit}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleGoShopping}
        className="w-full bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-green-500/30"
      >
        🛒 Gå til butikk
      </button>
    </div>
  );
}

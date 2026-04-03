import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMeal, getStores } from '../api.js';

const storeEmojis = {
  'Rema 1000': '🔴',
  'Kiwi': '🟡',
  'Coop Extra': '🟢'
};

const storeDescriptions = {
  'Rema 1000': 'Enkelt og billig hverdagshandel',
  'Kiwi': 'Godt utvalg til lavpris',
  'Coop Extra': 'Stort utvalg, god kvalitet'
};

const storeColors = {
  'Rema 1000': 'hover:border-red-500/50 hover:bg-red-500/10',
  'Kiwi': 'hover:border-yellow-500/50 hover:bg-yellow-500/10',
  'Coop Extra': 'hover:border-green-500/50 hover:bg-green-500/10'
};

export default function StoreSelector() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMeal(id), getStores()])
      .then(([m, s]) => {
        setMeal(m);
        setStores(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  function handleSelectStore(storeId) {
    navigate(`/meal/${id}/shopping/${storeId}`);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-5xl animate-spin">🛒</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full px-4 py-6 space-y-6 animate-[fade-up_0.3s_ease-out]">
      {/* Back */}
      <button
        onClick={() => navigate(`/meal/${id}`)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Tilbake
      </button>

      {/* Meal reminder */}
      {meal && (
        <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-3xl">{meal.emoji}</span>
          <div>
            <p className="text-gray-400 text-xs">Du lager</p>
            <p className="text-white font-semibold">{meal.name}</p>
          </div>
        </div>
      )}

      {/* Question */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Hvilken butikk er du i?</h1>
        <p className="text-gray-400 text-sm">Vi sorterer handlelisten etter butikkens rekkefølge</p>
      </div>

      {/* Store cards */}
      <div className="space-y-3">
        {stores.map(store => (
          <button
            key={store.id}
            onClick={() => handleSelectStore(store.id)}
            className={`w-full glass rounded-3xl p-5 flex items-center gap-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-white/15 ${storeColors[store.name] || 'hover:border-white/30 hover:bg-white/10'}`}
          >
            <div className="text-4xl">{storeEmojis[store.name] || '🏪'}</div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">{store.name}</h3>
              <p className="text-gray-400 text-sm mt-0.5">
                {storeDescriptions[store.name] || 'Norsk dagligvarebutikk'}
              </p>
            </div>
            <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <p className="text-center text-gray-600 text-xs">
        Handlelisten sorteres etter den valgte butikkens avdelingsrekkefølge
      </p>
    </div>
  );
}

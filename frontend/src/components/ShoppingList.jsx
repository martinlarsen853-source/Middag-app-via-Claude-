import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShoppingList } from '../api.js';
import PersonCounter from './PersonCounter.jsx';

const sectionConfig = {
  'Frukt & grønt': { icon: '🥦', color: 'text-green-400', bg: 'bg-green-500/15', border: 'border-green-500/30' },
  'Kjøtt & fisk': { icon: '🥩', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30' },
  'Meieri': { icon: '🥛', color: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
  'Tørrmat': { icon: '🌾', color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
  'Frys': { icon: '🧊', color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
  'Bakeri': { icon: '🍞', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
  'Krydder & sauser': { icon: '🫙', color: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
  'Drikkevarer': { icon: '🥤', color: 'text-cyan-400', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
  'Diverse': { icon: '🛒', color: 'text-gray-400', bg: 'bg-gray-500/15', border: 'border-gray-500/30' }
};

export default function ShoppingList() {
  const { id: mealId, storeId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [persons, setPersons] = useState(() => {
    try {
      const saved = localStorage.getItem('middag_persons_' + mealId);
      if (saved) return parseInt(saved);
      return JSON.parse(localStorage.getItem('middag_user') || '{}').default_persons || 2;
    } catch { return 2; }
  });

  // Checked state in localStorage
  const storageKey = `middag_checked_${mealId}_${storeId}`;
  const [checked, setChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch { return {}; }
  });

  const fetchList = useCallback(async (p) => {
    setLoading(true);
    try {
      const result = await getShoppingList(mealId, storeId, p);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [mealId, storeId]);

  useEffect(() => {
    fetchList(persons);
  }, [persons, fetchList]);

  // Persist checked state
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey]);

  function toggleItem(itemId) {
    setChecked(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  }

  function clearChecked() {
    setChecked({});
    localStorage.removeItem(storageKey);
  }

  function handlePersonChange(p) {
    setPersons(p);
    localStorage.setItem('middag_persons_' + mealId, p);
  }

  function handlePrint() {
    window.print();
  }

  const totalItems = data?.sections?.reduce((acc, s) => acc + s.items.length, 0) || 0;
  const checkedCount = Object.values(checked).filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-5xl animate-bounce">🛒</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-center">
        <div>
          <p className="text-red-400 mb-4">{error || 'Kunne ikke laste handleliste'}</p>
          <button onClick={() => navigate(-1)} className="text-green-400 hover:underline">
            Gå tilbake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full px-4 py-6 space-y-5 animate-[fade-up_0.3s_ease-out]">
      {/* Header - no-print hidden in print */}
      <div className="no-print">
        <button
          onClick={() => navigate(`/meal/${mealId}/shopping`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group mb-4"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Velg annen butikk
        </button>
      </div>

      {/* Title */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{data.store.name}</p>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>{data.meal.emoji}</span>
            <span>{data.meal.name}</span>
          </h1>
        </div>
        <div className="text-right no-print">
          <div className="text-green-400 font-bold text-sm">
            {checkedCount}/{totalItems}
          </div>
          <div className="text-gray-500 text-xs">i kurven</div>
        </div>
      </div>

      {/* Progress bar */}
      {totalItems > 0 && (
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden no-print">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(checkedCount / totalItems) * 100}%` }}
          />
        </div>
      )}

      {/* Persons + actions */}
      <div className="flex items-center justify-between no-print">
        <PersonCounter value={persons} onChange={handlePersonChange} size="sm" />
        <div className="flex gap-2">
          {checkedCount > 0 && (
            <button
              onClick={clearChecked}
              className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
            >
              Fjern avhukede
            </button>
          )}
          <button
            onClick={handlePrint}
            className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Skriv ut
          </button>
        </div>
      </div>

      {/* Shopping sections */}
      <div className="space-y-4 print-section">
        {data.sections.map(({ section, items }) => {
          const config = sectionConfig[section] || sectionConfig['Diverse'];
          const sectionChecked = items.filter(item => checked[item.id]).length;
          const allChecked = sectionChecked === items.length;

          return (
            <div key={section} className={`rounded-3xl overflow-hidden border ${config.border}`}>
              {/* Section header */}
              <div className={`${config.bg} px-4 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{config.icon}</span>
                  <h3 className={`font-bold text-sm ${config.color}`}>{section}</h3>
                </div>
                <span className={`text-xs font-medium ${allChecked ? 'text-green-400' : 'text-gray-500'}`}>
                  {sectionChecked}/{items.length}
                </span>
              </div>

              {/* Items */}
              <div className="bg-white/5 divide-y divide-white/5">
                {items.map(item => {
                  const isChecked = !!checked[item.id];
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 ${
                        isChecked ? 'opacity-50' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                        isChecked
                          ? 'bg-green-500 border-green-500'
                          : 'border-white/30 bg-transparent'
                      }`}>
                        {isChecked && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isChecked}
                        onChange={() => toggleItem(item.id)}
                      />
                      <span className={`flex-1 text-sm transition-all duration-150 ${
                        isChecked ? 'line-through text-gray-500' : 'text-white'
                      }`}>
                        {item.name}
                      </span>
                      <span className={`text-sm font-medium flex-shrink-0 transition-all duration-150 ${
                        isChecked ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        {item.quantity} {item.unit}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion celebration */}
      {checkedCount === totalItems && totalItems > 0 && (
        <div className="glass-strong rounded-3xl p-6 text-center animate-[fade-up_0.3s_ease-out] no-print">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-white font-bold text-xl mb-1">Alt er i kurven!</h3>
          <p className="text-gray-400 text-sm">God appetitt!</p>
        </div>
      )}

      {/* Done button */}
      <div className="no-print pb-4">
        <button
          onClick={() => navigate('/')}
          className="w-full bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-green-500/30"
        >
          Ferdig! 🏠
        </button>
      </div>
    </div>
  );
}

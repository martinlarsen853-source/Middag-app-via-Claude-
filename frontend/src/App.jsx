import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import LandingPage from './components/LandingPage.jsx';
import MealList from './components/MealList.jsx';
import MealDetail from './components/MealDetail.jsx';
import StoreSelector from './components/StoreSelector.jsx';
import ShoppingList from './components/ShoppingList.jsx';
import Navbar from './components/Navbar.jsx';
import BottomNav from './components/BottomNav.jsx';
import MealCreatePage from './components/MealCreatePage.jsx';
import IngredientListPage from './components/IngredientListPage.jsx';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('middag_token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname === '/app' ? location : { pathname: '/app' } }} replace />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '72px' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MealList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meal/:id"
          element={
            <ProtectedRoute>
              <MealDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meal/:id/shopping"
          element={
            <ProtectedRoute>
              <StoreSelector />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meal/:id/shopping/:storeId"
          element={
            <ProtectedRoute>
              <ShoppingList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meals/new"
          element={
            <ProtectedRoute>
              <MealCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meal/:id/edit"
          element={
            <ProtectedRoute>
              <MealCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ingredients"
          element={
            <ProtectedRoute>
              <IngredientListPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

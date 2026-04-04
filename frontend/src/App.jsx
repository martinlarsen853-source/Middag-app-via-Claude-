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

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('middag_token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname === '/app' ? location : { pathname: '/app' } }} replace />;
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import ScreenPage from './pages/Screen';
import GamePage from './pages/Game';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/screen" element={<ScreenPage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
        <Route path="*" element={<Navigate to="/screen" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
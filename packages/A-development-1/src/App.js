import React, { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Menu from './pages/Menu';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleLearnMore = () => {
    setCurrentPage('menu');
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  const handleBackToMenu = () => {
    setCurrentPage('menu');
  };

  const [selectedIndex, setSelectedIndex] = useState('select1');

  const handleNavigateToDetail = (index) => {
    setSelectedIndex(index);
    setCurrentPage('detail');
  };

  return (
    <div className="App">
      {currentPage === 'home' ? (
        <Home onLearnMore={handleLearnMore} />
      ) : currentPage === 'menu' ? (
        <Menu onBack={handleBack} onNavigateToDetail={handleNavigateToDetail} />
      ) : (
        <Detail name="城市居民委员会发展1" gallery="A馆" onBack={handleBackToMenu} index={selectedIndex} />
      )}
    </div>
  );
}

export default App;
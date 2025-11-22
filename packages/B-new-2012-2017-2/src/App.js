import React, { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleLearnMore = () => {
    setCurrentPage('detail');
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  return (
    <div className="App">
      {currentPage === 'home' ? (
        <Home onLearnMore={handleLearnMore} />
      ) : (
        <Detail name="新时代基层治理发展（2012年11月-2017年9月）-竖屏2" gallery="B馆" onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
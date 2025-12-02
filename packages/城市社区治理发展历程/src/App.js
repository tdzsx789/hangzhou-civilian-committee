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
      <div 
        className="page-container" 
        style={{ 
          opacity: currentPage === 'home' ? 1 : 0,
          pointerEvents: currentPage === 'home' ? 'auto' : 'none'
        }}
      >
        <Home onLearnMore={handleLearnMore} />
      </div>
      <div 
        className="page-container" 
        style={{ 
          opacity: currentPage === 'detail' ? 1 : 0,
          pointerEvents: currentPage === 'detail' ? 'auto' : 'none'
        }}
      >
        <Detail name="新中国第一个居民委员会" gallery="A馆" onBack={handleBack} />
      </div>
    </div>
  );
}

export default App;
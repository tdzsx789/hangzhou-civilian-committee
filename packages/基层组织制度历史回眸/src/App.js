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
        style={{ 
          opacity: currentPage === 'home' ? 1 : 0,
          pointerEvents: currentPage === 'home' ? 'auto' : 'none',
          position: 'absolute',
          width: '100%',
          height: '100%',
          transition: 'opacity 0.3s ease'
        }}
      >
        <Home onLearnMore={handleLearnMore} />
      </div>
      <div 
        style={{ 
          opacity: currentPage === 'detail' ? 1 : 0,
          pointerEvents: currentPage === 'detail' ? 'auto' : 'none',
          position: 'absolute',
          width: '100%',
          height: '100%',
          transition: 'opacity 0.3s ease'
        }}
      >
        <Detail name="基层组织制度历史回眸" gallery="A馆" onBack={handleBack} />
      </div>
    </div>
  );
}

export default App;
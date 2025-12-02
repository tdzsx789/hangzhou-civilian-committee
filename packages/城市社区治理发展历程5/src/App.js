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
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%' 
      }}>
        <div style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%',
          opacity: currentPage === 'home' ? 1 : 0,
          pointerEvents: currentPage === 'home' ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}>
          <Home onLearnMore={handleLearnMore} />
        </div>
        <div style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%',
          opacity: currentPage === 'detail' ? 1 : 0,
          pointerEvents: currentPage === 'detail' ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}>
          <Detail name="城市社区治理发展历程1" gallery="A馆" onBack={handleBack} />
        </div>
      </div>
    </div>
  );
}

export default App;
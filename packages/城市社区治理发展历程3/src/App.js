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
      <Home 
        onLearnMore={handleLearnMore} 
        style={{ opacity: currentPage === 'home' ? 1 : 0, pointerEvents: currentPage === 'home' ? 'auto' : 'none' }}
      />
      <Detail 
        name="城市社区治理发展历程1" 
        gallery="A馆" 
        onBack={handleBack}
        style={{ opacity: currentPage === 'detail' ? 1 : 0, pointerEvents: currentPage === 'detail' ? 'auto' : 'none' }}
      />
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Detail2 from './pages/Detail2';
import Detail3 from './pages/Detail3';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleLearnMore = () => {
    setCurrentPage('detail');
  };

  const handleLearnMore2 = () => {
    setCurrentPage('detail2');
  };

  const handleLearnMore3 = () => {
    setCurrentPage('detail3');
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  return (
    <div className="App">
      {currentPage === 'home' ? (
        <Home 
          onLearnMore={handleLearnMore} 
          onLearnMore2={handleLearnMore2}
          onLearnMore3={handleLearnMore3}
        />
      ) : currentPage === 'detail' ? (
        <Detail name="城市居民委员会发展2" gallery="A馆" onBack={handleBack} />
      ) : currentPage === 'detail2' ? (
        <Detail2 name="城市居民委员会发展2" gallery="A馆" onBack={handleBack} />
      ) : (
        <Detail3 name="城市居民委员会发展2" gallery="A馆" onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
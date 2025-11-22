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
        <Detail name=""基层组织选举"互动游戏" gallery="A馆" onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
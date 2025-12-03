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

  const pages = [
    {
      key: 'home',
      render: () => (
        <Home
          onLearnMore={handleLearnMore}
          onLearnMore2={handleLearnMore2}
          onLearnMore3={handleLearnMore3}
        />
      ),
    },
    {
      key: 'detail',
      render: (isActive) => (
        <Detail
          name="城市居民委员会发展2"
          gallery="A馆"
          onBack={handleBack}
          isActive={isActive}
        />
      ),
    },
    {
      key: 'detail2',
      render: (isActive) => (
        <Detail2
          name="城市居民委员会发展2"
          gallery="A馆"
          onBack={handleBack}
          isActive={isActive}
        />
      ),
    },
    {
      key: 'detail3',
      render: (isActive) => (
        <Detail3
          name="城市居民委员会发展2"
          gallery="A馆"
          onBack={handleBack}
          isActive={isActive}
        />
      ),
    },
  ];

  return (
    <div className="App">
      {pages.map(({ key, render }) => {
        const isActive = currentPage === key;
        return (
          <div
            key={key}
            className={`page-layer ${isActive ? 'active' : ''}`}
          >
            {render(isActive)}
          </div>
        );
      })}
    </div>
  );
}

export default App;
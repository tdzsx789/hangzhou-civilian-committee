import React, { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Detail2 from './pages/Detail2';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleLearnMore = () => {
    setCurrentPage('detail');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleEnterDetail2 = () => {
    setCurrentPage('detail2');
  };

  const handleBackToDetail = () => {
    setCurrentPage('detail');
  };

  let pageContent = null;

  if (currentPage === 'home') {
    pageContent = <Home onLearnMore={handleLearnMore} />;
  } else if (currentPage === 'detail') {
    pageContent = (
      <Detail
        name="新时代基层治理发展（2012年11月-2017年9月）-竖屏1"
        gallery="B馆"
        onBack={handleBackToHome}
        onOpenDetail2={handleEnterDetail2}
      />
    );
  } else {
    pageContent = <Detail2 onBack={handleBackToDetail} />;
  }

  return (
    <div className="App">
      {pageContent}
    </div>
  );
}

export default App;
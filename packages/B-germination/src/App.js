import React, { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail1 from './pages/Detail1';
import Detail2 from './pages/Detail2';
import Detail3 from './pages/Detail3';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleLearnMore = () => {
    setCurrentPage('detail1');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleEnterDetail2 = () => {
    setCurrentPage('detail2');
  };

  const handleEnterDetail3 = () => {
    setCurrentPage('detail3');
  };

  const handleBackToDetail = () => {
    setCurrentPage('detail1');
  };

  const handleBackToDetail2 = () => {
    setCurrentPage('detail2');
  };

  let pageContent = null;

  if (currentPage === 'home') {
    pageContent = <Home onLearnMore={handleLearnMore} />;
  } else if (currentPage === 'detail1') {
    pageContent = (
      <Detail1
        name="新时代基层治理发展（2012年11月-2017年9月）-竖屏1"
        gallery="B馆"
        onBack={handleBackToHome}
        onOpenDetail2={handleEnterDetail2}
        onOpenDetail3={handleEnterDetail3}
      />
    );
  } else if (currentPage === 'detail2') {
    pageContent = (
      <Detail2
        onBack={handleBackToDetail}
        onOpenDetail3={handleEnterDetail3}
      />
    );
  } else {
    pageContent = (
      <Detail3
        onBackToDetail1={handleBackToDetail}
        onOpenDetail2={handleBackToDetail2}
      />
    );
  }

  return (
    <div className="App">
      {pageContent}
    </div>
  );
}

export default App;
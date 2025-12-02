import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
// 预加载所有图片
import bg1 from './assets/bg1.jpg';
import button1 from './assets/button1.png';
import slides1 from './assets/slides1.png';
import startImg from './assets/start.png';
import coverImg from './assets/cover.jpg';
import backImg from './assets/back.png';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // 预加载所有图片
  useEffect(() => {
    const images = [bg1, button1, slides1, startImg, coverImg, backImg];
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

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
          pointerEvents: currentPage === 'home' ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      >
        <Home onLearnMore={handleLearnMore} />
      </div>
      <div 
        className="page-container" 
        style={{ 
          opacity: currentPage === 'detail' ? 1 : 0,
          pointerEvents: currentPage === 'detail' ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      >
        <Detail name="城市社区治理发展历程1" gallery="A馆" onBack={handleBack} />
      </div>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
// 预加载图片
import coverImg from './assets/cover.jpg';
import detailBg from './assets/detailBg.jpg';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // 预加载图片
  useEffect(() => {
    const img1 = new Image();
    img1.src = coverImg;
    const img2 = new Image();
    img2.src = detailBg;
  }, []);

  const handleLearnMore = () => {
    setCurrentPage('detail');
  };

  const handleBack = () => {
    setCurrentPage('home');
  };
  // 2分钟无交互自动返回Home页
  useEffect(() => {
    let autoReturnTimer = null;

    const resetTimer = () => {
      if (autoReturnTimer) {
        clearTimeout(autoReturnTimer);
      }
      autoReturnTimer = setTimeout(() => {
        setCurrentPage('home');
      }, 300000); // 2分钟 = 300000毫秒
    };

    const handleTouchStart = () => {
      resetTimer();
    };

    // 初始化定时器
    resetTimer();

    // 监听 touchstart 事件
    document.addEventListener('touchstart', handleTouchStart);

    // 清理函数
    return () => {
      if (autoReturnTimer) {
        clearTimeout(autoReturnTimer);
      }
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);


  return (
    <div className="App">
      <Home 
        onLearnMore={handleLearnMore} 
        className={currentPage === 'home' ? 'page-visible' : 'page-hidden'}
      />
      <Detail 
        onBack={handleBack} 
        className={currentPage === 'detail' ? 'page-visible' : 'page-hidden'}
      />
    </div>
  );
}

export default App;
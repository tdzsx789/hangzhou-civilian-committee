import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Menu from './pages/Menu';

// 导入所有图片用于预加载
import coverImg from './assets/cover.jpg';
import startImg from './assets/start.png';
import menuImg from './assets/menu.jpg';
import detailBgImg from './assets/detailBg.jpg';
import selectImg from './assets/select.png';
import select1Img from './assets/step1.png';
import select2Img from './assets/step2.png';
import select3Img from './assets/step3.png';
import select4Img from './assets/step4.png';
import page2Img from './assets/page2.png';
import page3Img from './assets/page3.png';
import page4Img from './assets/page4.png';
import slides1Img from './assets/slides1.png';
import slides2Img from './assets/slides2.png';
import handImg from './assets/hand.png';
import pageSlides1Img from './assets/pageSlides1.png';
import pageSlides2Img from './assets/pageSlides2.png';
import pageSlides3Img from './assets/pageSlides3.png';

// 预加载所有图片
const preloadImages = () => {
  const images = [
    coverImg,
    startImg,
    menuImg,
    detailBgImg,
    selectImg,
    select1Img,
    select2Img,
    select3Img,
    select4Img,
    page2Img,
    page3Img,
    page4Img,
    slides1Img,
    slides2Img,
    handImg,
    pageSlides1Img,
    pageSlides2Img,
    pageSlides3Img,
  ];

  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedIndex, setSelectedIndex] = useState('select1');

  // 预加载所有图片
  useEffect(() => {
    preloadImages();
  }, []);

  const handleLearnMore = () => {
    setCurrentPage('menu');
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  const handleBackToMenu = () => {
    setCurrentPage('menu');
  };

  const handleNavigateToDetail = (index) => {
    setSelectedIndex(index);
    setCurrentPage('detail');
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
      }, 120000); // 2分钟 = 120000毫秒
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
      <div className={`page-container ${currentPage === 'home' ? 'active' : 'inactive'}`}>
        <Home onLearnMore={handleLearnMore} />
      </div>
      <div className={`page-container ${currentPage === 'menu' ? 'active' : 'inactive'}`}>
        <Menu onBack={handleBack} onNavigateToDetail={handleNavigateToDetail} />
      </div>
      <div className={`page-container ${currentPage === 'detail' ? 'active' : 'inactive'}`}>
        <Detail name="城市居民委员会发展1" gallery="A馆" onBack={handleBackToMenu} index={selectedIndex} />
      </div>
    </div>
  );
}

export default App;
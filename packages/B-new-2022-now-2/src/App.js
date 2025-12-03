import React, { useState , useEffect} from 'react';
import './App.css';
import Home from './pages/Home';
import Detail1 from './pages/Detail1';
import Detail1Second from './pages/Detail1_2';
import Detail2 from './pages/Detail2';
import Detail2Second from './pages/Detail2_2';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleLearnMore = () => {
    setCurrentPage('detail1');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleEnterDetail1_2 = () => {
    setCurrentPage('detail1_2');
  };

  const handleEnterDetail2 = () => {
    setCurrentPage('detail2');
  };

  const handleEnterDetail2_2 = () => {
    setCurrentPage('detail2_2');
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
        onOpenDetail1_2={handleEnterDetail1_2}
      />
    );
  } else if (currentPage === 'detail1_2') {
    pageContent = (
      <Detail1Second
        name="新时代基层治理发展（2012年11月-2017年9月）-竖屏2"
        gallery="B馆"
        onBack={handleBackToDetail}
        onOpenDetail2={handleEnterDetail2}
      />
    );
  } else if (currentPage === 'detail2') {
    pageContent = (
      <Detail2
        onBack={handleBackToDetail}
        onOpenDetail2_2={handleEnterDetail2_2}
      />
    );
  } else {
    pageContent = (
      <Detail2Second
        onBackToDetail1={handleBackToDetail}
        onOpenDetail2={handleBackToDetail2}
      />
    );
  }
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
      {pageContent}
    </div>
  );
}

export default App;
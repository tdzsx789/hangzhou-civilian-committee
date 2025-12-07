import React, { useState , useEffect} from 'react';
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
      {/* 所有页面同时渲染，通过透明度控制显示 */}
      <div className={`page-container ${currentPage === 'home' ? 'active' : 'inactive'}`}>
        <Home 
          onLearnMore={handleLearnMore} 
          onLearnMore2={handleLearnMore2}
          onLearnMore3={handleLearnMore3}
        />
      </div>
      <div className={`page-container ${currentPage === 'detail' ? 'active' : 'inactive'}`}>
        <Detail name="城市居民委员会发展2" gallery="A馆" onBack={handleBack} />
      </div>
      <div className={`page-container ${currentPage === 'detail2' ? 'active' : 'inactive'}`}>
        <Detail2 name="城市居民委员会发展2" gallery="A馆" onBack={handleBack} />
      </div>
      <div className={`page-container ${currentPage === 'detail3' ? 'active' : 'inactive'}`}>
        <Detail3 name="城市居民委员会发展2" gallery="A馆" onBack={handleBack} />
      </div>
    </div>
  );
}

export default App;
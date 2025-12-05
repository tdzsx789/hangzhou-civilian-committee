import React, { useState , useEffect} from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Detail2 from './pages/Detail2';
import info1 from './assets/info1.png';
import info2 from './assets/info2.png';
import info3 from './assets/info3.png';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [detailInfoImage, setDetailInfoImage] = useState(null);

  const handleLearnMore = () => {
    setCurrentPage('detail');
  };

  const handleBackHome = () => {
    setCurrentPage('home');
  };

  const handleEnterDetail2 = (infoKey) => {
    if (!infoKey) return;
    const imageMap = {
      info1,
      info2,
      info3,
    };
    if (!imageMap[infoKey]) return;
    setDetailInfoImage(imageMap[infoKey]);
    setCurrentPage('detail2');
  };

  const handleBackToDetail = () => {
    setCurrentPage('detail');
    setDetailInfoImage(null);
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
      {currentPage === 'home' && <Home onLearnMore={handleLearnMore} />}
      {currentPage === 'detail' && (
        <Detail
          name="党建引领基层治理先进个人、先进组织"
          gallery="D馆"
          onBack={handleBackHome}
          onSelectDetail={handleEnterDetail2}
        />
      )}
      {currentPage === 'detail2' && detailInfoImage && (
        <Detail2 onBack={handleBackToDetail} infoImage={detailInfoImage} />
      )}
    </div>
  );
}

export default App;
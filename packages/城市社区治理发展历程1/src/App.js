import React, { useState , useEffect} from 'react';
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
      <div style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%',
        opacity: currentPage === 'home' ? 1 : 0,
        pointerEvents: currentPage === 'home' ? 'auto' : 'none',
        transition: 'opacity 0.3s ease'
      }}>
        <Home onLearnMore={handleLearnMore} />
      </div>
      <div style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%',
        opacity: currentPage === 'detail' ? 1 : 0,
        pointerEvents: currentPage === 'detail' ? 'auto' : 'none',
        transition: 'opacity 0.3s ease'
      }}>
        <Detail name="城市社区治理发展历程1" gallery="A馆" onBack={handleBack} />
      </div>
    </div>
  );
}

export default App;
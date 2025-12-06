import React, { useState , useEffect} from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Detail2 from './pages/Detail2';
import Detail3 from './pages/Detail3';
import Detail4 from './pages/Detail4';
import info1 from './assets/info1.png';
import info2 from './assets/info2.png';
import info3 from './assets/info3.png';
import { peopleData } from './assets/peopleData';
import { zuzhiData } from './assets/zuzhiData';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [detailInfoImage, setDetailInfoImage] = useState(null);
  const [detailChildData, setDetailChildData] = useState(null);

  const handleStart1Click = () => {
    setCurrentPage('detail');
  };

  const handleStart2Click = () => {
    setCurrentPage('detail3');
  };

  const handleBackHome = () => {
    setCurrentPage('home');
  };

  const handleEnterDetail2 = (childData) => {
    if (!childData) return;
    setDetailChildData(childData);
    setCurrentPage('detail2');
  };

  const handleBackToDetail = () => {
    setCurrentPage('detail');
    setDetailChildData(null);
  };

  const handleEnterDetail4 = (childData) => {
    if (!childData) return;
    setDetailChildData(childData);
    setCurrentPage('detail4');
  };

  const handleBackToDetail3 = () => {
    setCurrentPage('detail3');
    setDetailChildData(null);
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
      <div className={`page-container ${currentPage === 'home' ? 'active' : 'inactive'}`}>
        <Home onStart1Click={handleStart1Click} onStart2Click={handleStart2Click} />
      </div>
      <div className={`page-container ${currentPage === 'detail' ? 'active' : 'inactive'}`}>
        <Detail
          name="党建引领基层治理先进个人、先进组织"
          gallery="D馆"
          onBack={handleBackHome}
          onSelectDetail={handleEnterDetail2}
          data={peopleData}
        />
      </div>
      <div className={`page-container ${currentPage === 'detail2' ? 'active' : 'inactive'}`}>
        {detailChildData && (
          <Detail2 onBack={handleBackToDetail} childData={detailChildData} />
        )}
      </div>
      <div className={`page-container ${currentPage === 'detail3' ? 'active' : 'inactive'}`}>
        <Detail3
          name="党建引领基层治理先进个人、先进组织"
          gallery="D馆"
          onBack={handleBackHome}
          onSelectDetail={handleEnterDetail4}
          data={zuzhiData}
        />
      </div>
      <div className={`page-container ${currentPage === 'detail4' ? 'active' : 'inactive'}`}>
        {detailChildData && (
          <Detail4 onBack={handleBackToDetail3} childData={detailChildData} />
        )}
      </div>
    </div>
  );
}

export default App;
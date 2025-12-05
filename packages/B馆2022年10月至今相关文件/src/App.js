import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Detail2 from './pages/Detail2';
import { work1, work2, work3, work4, work5, work6, work7, work8, work9, work10 } from './works';

const data = [
  {
    name: '2022年10月，党的二十大报告《高举中国特色社会主义伟大旗帜 为全面建设社会主义现代化国家而团结奋斗》',
    work: work1,
  },
  {
    name: '2022年10月，党的二十大会议部分修改并通过的《中国共产党章程》',
    work: work2,
  },
  {
    name: '2023年3月，中共中央 国务院印发《党和国家机构改革方案》',
    work: work3,
  },
  {
    name: '2024年3月，《中共中央办公厅、国务院办公厅关于加强社区工作者队伍建设的意见》',
    work: work4
  },
  {
    name: '2024年4月，《中共中央办公厅 国务院办公厅关于健全新时代志愿服务体系的意见》',
    work: work5
  },
  {
    name: '2024年7月，党的二十届三中全会《中共中央关于进一步全面深化改革 推进中国式现代化的决定》',
    work: work6,
  },
  {
    name: '2024年11月，习近平总书记对社会工作作出重要指示',
    work: work7
  },
  {
    name: '2025年8月，中共中央办公厅、国务院办公厅印发《整治形式主义为基层减负若干规定》',
    work: work8
  },
  {
    name: '2025年10月，党的二十届四中全会《中共中央关于制定国民经济和社会发展第十五个五年规划的建议》',
    work: work9
  },
  {
    name: '2025年10月，第十四届全国人民代表大会常务委员会第十八次会议修订的《中华人民共和国城市居民委员会组织法》',
    work: work10
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLearnMore = () => {
    setCurrentPage('detail');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleEnterDetail2 = (index) => {
    setCurrentIndex(index);
    setCurrentPage('detail2');
  };

  const handleBackToDetail = () => {
    setCurrentPage('detail');
  };

  const handleNextWork = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < data.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrevWork = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const pageConfigs = [
    {
      key: 'home',
      element: <Home onLearnMore={handleLearnMore} />,
    },
    {
      key: 'detail',
      element: (
        <Detail
          name="新时代基层治理发展（2012年11月-2017年9月）-竖屏1"
          gallery="B馆"
          onBack={handleBackToHome}
          onOpenDetail2={handleEnterDetail2}
          data={data}
          isActive={currentPage === 'detail'}
        />
      ),
    },
    {
      key: 'detail2',
      element: (
        <Detail2
          onBack={handleBackToDetail}
          item={data[currentIndex]}
          currentIndex={currentIndex}
          total={data.length}
          onNext={handleNextWork}
          onPrev={handlePrevWork}
          isActive={currentPage === 'detail2'}
        />
      ),
    },
  ];
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
      {pageConfigs.map(({ key, element }) => (
        <div
          key={key}
          className={`page-layer ${currentPage === key ? 'page-layer--active' : ''}`}
        >
          {element}
        </div>
      ))}
    </div>
  );
}

export default App;
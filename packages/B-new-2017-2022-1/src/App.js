import React, { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Detail2 from './pages/Detail2';
import { work1, work2, work3, work4, work5, work6, work7 } from './works';

const data = [
  {
    name: '2017年10月，党的十九大报告《决胜全面建成小康社会 夺取新时代中国特色社会主义伟大胜利》',
    work: work1,
  },
  {
    name: '2019年10月，党的十九届四中全会《中共中央关于坚持和完善中国特色社会主义制度 推进国家治理体系和治理能力现代化若干重大问题的决定》',
    work: work2,
  },
  {
    name: '2020年10月，党的十九届五中全会《中共中央关于制定国民经济和社会发展第十四个五年规划和二〇三五年远景目标的建议》',
    work: work3,
  },
  {
    name: '2021年4月，《中共中央、国务院关于加强基层治理体系和治理能力现代化建设的意见》',
    work: work4,
  },
  {
    name: '2019年5月，中共中央办公厅《关于加强和改进城市基层党的建设工作的意见》',
    work: work5
  },
  {
    name: '2020年5月，《中华人民共和国民法典》',
    work: work6
  },
  {
    name: '2021年12月，国务院办公厅印发《“十四五”城乡社区服务体系建设规划》',
    work: work7
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
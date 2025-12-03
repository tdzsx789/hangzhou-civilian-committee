import React, { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Detail2 from './pages/Detail2';
import { work1, work2, work3, work4, work5, work6 } from './works';

const data = [
  {
    name: '2012年11月，党的十八大报告《坚定不移沿着中国特色社会主义道路前进 为全面建成小康社会而奋斗》',
    work: work1,
  },
  {
    name: '2013年11月，党的十八届三中全会《中共中央关于全面深化改革若干重大问题的决定》',
    work: work2,
  },
  {
    name: '2014年10月，党的十八届四中全会《中共中央关于全面推进依法治国若干重大问题的决定》',
    work: work3,
  },
  {
    name: '2015年10月，党的十八届五中全会《中共中央关于制定国民经济和社会发展第十三个五年规划的建议》',
    work: work4,
  },
  {
    name: '2017年6月，《中共中央、国务院关于加强和完善城乡社区治理的意见》',
    work: work5
  },
  {
    name: '2015年7月，中共中央办公厅、国务院办公厅印发《关于加强城乡社区协商的意见》',
    work: work6
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentItem, setCurrentItem] = useState(null);

  const handleLearnMore = () => {
    setCurrentPage('detail');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleEnterDetail2 = (item) => {
    setCurrentItem(item);
    setCurrentPage('detail2');
  };

  const handleBackToDetail = () => {
    setCurrentPage('detail');
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
          item={currentItem}
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
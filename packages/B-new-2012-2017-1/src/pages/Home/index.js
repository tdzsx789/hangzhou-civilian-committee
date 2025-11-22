import React from 'react';
import './index.css';
import startImg from '../../assets/start.png';
import coverImg from '../../assets/cover.jpg';

function Home({ onLearnMore }) {
  return (
    <div className="home-page" style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <header className="home-header">
        <h1>新时代基层治理发展（2012年11月-2017年9月）-竖屏1</h1>
        <p>B馆</p>
      </header>
      <div className="learn-more-btn" onClick={onLearnMore}>
        <img src={startImg} alt="了解更多" />
      </div>
    </div>
  );
}

export default Home;
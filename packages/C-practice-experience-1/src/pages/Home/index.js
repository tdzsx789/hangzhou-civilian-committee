import React from 'react';
import './index.css';
import startImg from '../../assets/start.png';
import coverImg from '../../assets/cover.jpg';

function Home({ onLearnMore }) {
  return (
    <div className="home-page" style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <header className="home-header">
        <h1>实践经验篇1</h1>
        <p>C馆</p>
      </header>
      <div className="learn-more-btn" onClick={onLearnMore}>
        <img src={startImg} alt="了解更多" />
      </div>
    </div>
  );
}

export default Home;
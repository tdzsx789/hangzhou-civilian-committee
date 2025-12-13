import React from 'react';
import './index.css';
import coverImg from '../../assets/cover.jpg';
import start1Img from '../../assets/start1.png';
import start2Img from '../../assets/start2.png';

function Home({ onStart1Click, onStart2Click }) {
  const handleStart1Click = (e) => {
    e.stopPropagation();
    if (onStart1Click) {
      onStart1Click();
    }
  };

  const handleStart2Click = (e) => {
    e.stopPropagation();
    if (onStart2Click) {
      onStart2Click();
    }
  };

  return (
    <div
      className="home-page"
      style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      <div className="learn-more-btn" onClick={handleStart1Click}>
        <img src={start1Img} alt="了解更多" />
      </div>
      <div className="learn-more-btn" onClick={handleStart2Click} style={{ top: '720px' }}>
        <img src={start2Img} alt="了解更多" />
      </div>
    </div>
  );
}

export default Home;
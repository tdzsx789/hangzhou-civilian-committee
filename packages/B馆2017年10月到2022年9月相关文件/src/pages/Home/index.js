import React from 'react';
import './index.css';
import startImgZh from '../../assets/start.png';
import coverImgZh from '../../assets/cover.jpg';
import startImgEn from '../../assets_english/start.png';
import coverImgEn from '../../assets_english/cover.jpg';

function Home({ onLearnMore, language, onToggleLanguage }) {
  const startImg = language === 'en' ? startImgEn : startImgZh;
  const coverImg = language === 'en' ? coverImgEn : coverImgZh;

  return (
    <div className="home-page" style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div 
        className="lang-btn" 
        onClick={onToggleLanguage}
        style={{
          position: 'absolute',
          width: '210px',
          height: '90px',
          top: '1720px',
          left: '820px',
        }}
      ></div>
      <div className="learn-more-btn" onClick={onLearnMore}>
        <img src={startImg} alt="了解更多" />
      </div>
    </div>
  );
}

export default Home;
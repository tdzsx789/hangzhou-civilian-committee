import React from 'react';
import './index.css';
import startImg from '../../assets/start.png';
import coverImg from '../../assets/cover.jpg';
import startImgEn from '../../assets_english/start.png';
import coverImgEn from '../../assets_english/cover.jpg';

function Home({ onLearnMore, language = 'zh', toggleLanguage }) {
  const currentCover = language === 'en' ? coverImgEn : coverImg;
  const currentStart = language === 'en' ? startImgEn : startImg;

  return (
    <div className="home-page" style={{ backgroundImage: `url(${currentCover})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="learn-more-btn" onClick={onLearnMore}>
        <img src={currentStart} alt="了解更多" />
      </div>
      <div 
        className="lang-btn" 
        onClick={toggleLanguage}
        style={{
          position: 'absolute',
          width: '210px',
          height: '90px',
          top: '1720px',
          left: '820px',
        }}
      ></div>
    </div>
  );
}

export default Home;

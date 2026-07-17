import React from 'react';
import './index.css';
import startImg from '../../assets/start.png';
import startImg2 from '../../assets/start2.png';
import startImg3 from '../../assets/start3.png';
import coverImg from '../../assets/cover.jpg';
import startImgEn from '../../assets_english/start.png';
import startImg2En from '../../assets_english/start2.png';
import coverImgEn from '../../assets_english/cover.jpg';
import cnBtn from '../../assets/button1.png';
import enBtn from '../../assets_english/button1.png';

function Home({ onLearnMore, onLearnMore2, onLearnMore3, language = 'zh', toggleLanguage }) {
  const currentStart = language === 'en' ? startImgEn : startImg;
  const currentStart2 = language === 'en' ? startImg2En : startImg2;
  const currentCover = language === 'en' ? coverImgEn : coverImg;

  return (
    <div className="home-page" style={{ backgroundImage: `url(${currentCover})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div 
        className="lang-switch" 
        onClick={toggleLanguage}
        style={{
          position: 'absolute',
          top: '930px',
          right: '70px',
          width: '200px',
          height: '75px',
          zIndex: 10,
        }}
      ></div>
      <div className="learn-more-btn" onClick={onLearnMore}>
        <img src={currentStart} alt="了解更多" />
      </div>
      <div className="learn-more-btn2" onClick={onLearnMore2}>
        <img src={currentStart2} alt="了解更多2" />
      </div>
      {/* <div className="learn-more-btn3" onClick={onLearnMore3}>
        <img src={startImg3} alt="了解更多3" />
      </div> */}
    </div>
  );
}

export default Home;
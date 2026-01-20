import React from 'react';
import './index.css';
import startImg from '../../assets/start.png';
import coverImg from '../../assets/cover.jpg';
import startImgEn from '../../assets_english/start.png';
import coverImgEn from '../../assets_english/cover.jpg';

function Home({ onLearnMore, language, setLanguage }) {
  const onToggleLanguage = (e) => {
    e.stopPropagation();
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="home-page" style={{ backgroundImage: `url(${language === 'en' ? coverImgEn : coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="learn-more-btn" onClick={onLearnMore}>
        <img src={language === 'en' ? startImgEn : startImg} alt="了解更多" />
      </div>
      <div className="language-toggle-btn" onClick={onToggleLanguage}></div>
    </div>
  );
}

export default Home;
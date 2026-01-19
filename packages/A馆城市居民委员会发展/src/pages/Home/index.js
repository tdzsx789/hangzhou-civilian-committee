import React from 'react';
import './index.css';
import startImgZh from '../../assets/start.png';
import startImgEn from '../../assets_english/start.png';
import coverImgZh from '../../assets/cover.jpg';
import coverImgEn from '../../assets_english/cover.jpg';

function Home({ onLearnMore, language, onToggleLanguage }) {
  const bgImg = language === 'zh' ? coverImgZh : coverImgEn;
  const startImg = language === 'zh' ? startImgZh : startImgEn;
  const altText = language === 'zh' ? '了解更多' : 'Learn More';

  return (
    <div className="home-page" style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="language-toggle-btn" onClick={onToggleLanguage}></div>
      <div className="learn-more-btn" onClick={onLearnMore}>
        <img src={startImg} alt={altText} />
      </div>
    </div>
  );
}

export default Home;
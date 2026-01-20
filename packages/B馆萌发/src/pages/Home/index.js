import React from 'react';
import './index.css';
import coverImgZh from '../../assets/cover.jpg';
import coverImgEn from '../../assets_english/cover.jpg';

function Home({ onLearnMore, language, setLanguage }) {
  const coverImg = language === 'zh' ? coverImgZh : coverImgEn;

  const handleToggleLanguage = (e) => {
    e.stopPropagation();
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="home-page" onClick={onLearnMore} style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div
        className="language-toggle-btn"
        onClick={handleToggleLanguage}
        style={{
          position: 'absolute',
          top: '1720px',
          left: '780px',
          width: '210px',
          height: '100px',
          zIndex: 1000,
        }}
      ></div>
    </div>
  );
}

export default Home;
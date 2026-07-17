import React from 'react';
import './index.css';
import startImg from '../../assets/start.png';
import startImg2 from '../../assets/start2.png';
import startImg3 from '../../assets/start3.png';
import coverImg from '../../assets/cover.jpg';

import startImgEn from '../../assets_english/start.png';
import startImg2En from '../../assets_english/start2.png';
import coverImgEn from '../../assets_english/cover.jpg';

function Home({ onLearnMore, onLearnMore2, onLearnMore3, language, onToggleLanguage }) {
  const isEn = language === 'en';

  return (
    <div className="home-page" style={{ backgroundImage: `url(${isEn ? coverImgEn : coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="language-toggle" onClick={onToggleLanguage}></div>
      <div className="learn-more-btn" onClick={onLearnMore}>
        <img src={isEn ? startImgEn : startImg} alt="了解更多" />
      </div>
      <div className="learn-more-btn2" onClick={onLearnMore2}>
        <img src={isEn ? startImg2En : startImg2} alt="了解更多2" />
      </div>
      {/* <div className="learn-more-btn3" onClick={onLearnMore3}>
        <img src={startImg3} alt="了解更多3" />
      </div> */}
    </div>
  );
}

export default Home;
import React from 'react';
import './index.css';
import bg2_2Zh from '../../assets/bg2_2.jpg';
import bg2_2En from '../../assets_english/bg2_2.jpg';
import startButtonZh from '../../assets/start.png';
import startButtonEn from '../../assets_english/start.png';

function Detail3({ onBackToDetail1, onOpenDetail2, language }) {
  const bg2_2 = language === 'zh' ? bg2_2Zh : bg2_2En;
  const startButton = language === 'zh' ? startButtonZh : startButtonEn;
  const handleBackToDetail1 = () => {
    if (onBackToDetail1) {
      onBackToDetail1();
    }
  };

  const handleEnterDetail2 = () => {
    if (onOpenDetail2) {
      onOpenDetail2();
    }
  };

  const handleKeyDown = (callback) => (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  const handleBackKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBackToDetail1();
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg2_2})` }}>
      <div
        className="back-button"
        role="button"
        tabIndex={0}
        onClick={handleBackToDetail1}
        onKeyDown={handleBackKeyDown}
      >
        <img src={startButton} alt="返回" />
      </div>
      <div
        className="link2_2"
        role="button"
        tabIndex={0}
        onClick={handleBackToDetail1}
        onKeyDown={handleKeyDown(handleBackToDetail1)}
      ></div>
      <div
        className="before2_2"
        role="button"
        tabIndex={0}
        onClick={handleEnterDetail2}
        onKeyDown={handleKeyDown(handleEnterDetail2)}
      ></div>
      <div
        className="after2_2"
        role="button"
        tabIndex={0}
        onClick={handleEnterDetail2}
        onKeyDown={handleKeyDown(handleEnterDetail2)}
      ></div>
    </div>
  );
}

export default Detail3;
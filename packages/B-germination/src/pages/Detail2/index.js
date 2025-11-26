import React from 'react';
import './index.css';
import bg2_1 from '../../assets/bg2_1.jpg';
import startButton from '../../assets/start.png';

function Detail2({ onBack, onOpenDetail3 }) {
  const handleBackToDetail1 = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleEnterDetail3 = () => {
    if (onOpenDetail3) {
      onOpenDetail3();
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
    <div className="detail-page" style={{ backgroundImage: `url(${bg2_1})` }}>
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
        className="link2"
        role="button"
        tabIndex={0}
        onClick={handleBackToDetail1}
        onKeyDown={handleKeyDown(handleBackToDetail1)}
      ></div>
      <div
        className="before2"
        role="button"
        tabIndex={0}
        onClick={handleEnterDetail3}
        onKeyDown={handleKeyDown(handleEnterDetail3)}
      ></div>
      <div
        className="after2"
        role="button"
        tabIndex={0}
        onClick={handleEnterDetail3}
        onKeyDown={handleKeyDown(handleEnterDetail3)}
      ></div>
    </div>
  );
}

export default Detail2;
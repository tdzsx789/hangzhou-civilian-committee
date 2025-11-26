import React from 'react';
import './index.css';
import bg2_1 from '../../assets/bg2_1.jpg';

function Detail2({ onBack, onOpenDetail2_2 }) {
  const handleBackToDetail1 = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleEnterDetail2_2 = () => {
    if (onOpenDetail2_2) {
      onOpenDetail2_2();
    }
  };

  const handleKeyDown = (callback) => (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg2_1})` }}>
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
        onClick={handleEnterDetail2_2}
        onKeyDown={handleKeyDown(handleEnterDetail2_2)}
      ></div>
      <div
        className="after2"
        role="button"
        tabIndex={0}
        onClick={handleEnterDetail2_2}
        onKeyDown={handleKeyDown(handleEnterDetail2_2)}
      ></div>
    </div>
  );
}

export default Detail2;
import React from 'react';
import './index.css';
import button1 from '../../assets/button1.png';

function Detail2({ onBack, infoImage }) {
  return (
    <div className="detail-page2">
      <div
        className="slide-button"
        style={{ backgroundImage: `url(${button1})` }}
        aria-label="返回首页"
      />
      <div className="detail2-back-btn" onClick={onBack} />
      {infoImage && (
        <img src={infoImage} alt="人物信息" className="detail2-info" />
      )}
    </div>
  );
}

export default Detail2;
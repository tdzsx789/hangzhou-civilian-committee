import React from 'react';
import './index.css';
import detailBg from '../../assets/detailBg.jpg';

function Detail({ onBack, className }) {
  return (
    <div className={`detail-page ${className || ''}`} style={{ backgroundImage: `url(${detailBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="learn-more-btn" onClick={onBack}>
      </div>
    </div>
  );
}

export default Detail;
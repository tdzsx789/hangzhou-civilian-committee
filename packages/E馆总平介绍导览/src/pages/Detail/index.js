import React from 'react';
import './index.css';
function Detail({ onBack, className, detailBg }) {
  return (
    <div className={`detail-page ${className || ''}`} style={{ backgroundImage: detailBg ? `url(${detailBg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="learn-more-btn" onClick={onBack}>
      </div>
    </div>
  );
}

export default Detail;
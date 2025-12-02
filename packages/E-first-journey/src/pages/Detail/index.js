import React from 'react';
import './index.css';

function Detail({ onBack }) {
  return (
    <div className="detail-page">
      <div className="detail-back-btn" onClick={onBack}>
      </div>
    </div>
  );
}

export default Detail;
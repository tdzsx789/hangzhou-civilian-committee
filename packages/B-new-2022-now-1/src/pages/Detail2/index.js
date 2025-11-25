import React from 'react';
import './index.css';
import bg3 from '../../assets/bg3.jpg';

function Detail2({ onBack }) {
  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg3})` }}>
      <div className="back-btn2" onClick={onBack}>
      </div>
    </div>
  );
}

export default Detail2;
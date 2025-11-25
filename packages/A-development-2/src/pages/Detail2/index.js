import React from 'react';
import './index.css';
import page2Img from '../../assets/page2.jpg';

function Detail2({ name, gallery, onBack }) {
  return (
    <div className="detail-page" style={{ backgroundImage: `url(${page2Img})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="back-btn" onClick={onBack}></div>
    </div>
  );
}

export default Detail2;
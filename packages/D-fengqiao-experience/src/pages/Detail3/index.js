import React from 'react';
import './index.css';
import page3Img from '../../assets/page3.jpg';

function Detail3({ name, gallery, onBack }) {
  return (
    <div className="detail-page" style={{ backgroundImage: `url(${page3Img})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="back-btn" onClick={onBack}></div>
    </div>
  );
}

export default Detail3;
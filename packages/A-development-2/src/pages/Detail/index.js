import React from 'react';
import './index.css';
import page1Img from '../../assets/page1.jpg';

function Detail({ name, gallery, onBack }) {
  return (
    <div className="detail-page" style={{ backgroundImage: `url(${page1Img})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="back-btn" onClick={onBack}></div>
    </div>
  );
}

export default Detail;
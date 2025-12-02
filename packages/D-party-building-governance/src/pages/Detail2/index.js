import React from 'react';
import './index.css';
import page2Img from '../../assets/page2.jpg';
import button1 from '../../assets/button1.png';


function Detail2({ name, gallery, onBack }) {
  return (
    <div className="detail-page" style={{ backgroundImage: `url(${page2Img})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="back-btn" onClick={onBack}></div>
      <button className="slide-button" style={{ backgroundImage: `url(${button1})` }}></button>
    </div>
  );
}

export default Detail2;
import React, { useEffect, useRef } from 'react';
import './index.css';
import page1Img from '../../assets/page1.jpg';
import slidesImg from '../../assets/slides.png';

import page1ImgEn from '../../assets_english/page1.jpg';
import slidesImgEn from '../../assets_english/slides.png';

function Detail({ name, gallery, onBack, visible, language }) {
  const scrollRef = useRef(null);
  const isEn = language === 'en';

  useEffect(() => {
    if (visible && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [visible]);

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${isEn ? page1ImgEn : page1Img})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="scroll-container" ref={scrollRef}>
        <img src={isEn ? slidesImgEn : slidesImg} alt="slides" />
      </div>
      <div className="back-btn" onClick={onBack}></div>
    </div>
  );
}

export default Detail;

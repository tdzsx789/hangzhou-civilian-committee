import React, { useEffect, useRef } from 'react';
import './index.css';
import page1Img from '../../assets/page1.jpg';
import slidesImg from '../../assets/slides.png';
import page1ImgEn from '../../assets_english/page1.jpg';
import slidesImgEn from '../../assets_english/slides.png';

function Detail({ name, gallery, onBack, visible, language }) {
  const scrollRef = useRef(null);
  const currentBg = language === 'en' ? page1ImgEn : page1Img;
  const currentSlides = language === 'en' ? slidesImgEn : slidesImg;

  useEffect(() => {
    if (visible && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [visible]);

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${currentBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="scroll-container" ref={scrollRef}>
        <img src={currentSlides} alt="slides" />
      </div>
      <div className="back-btn" onClick={onBack}></div>
    </div>
  );
}

export default Detail;

import React, { useEffect, useRef } from 'react';
import './index.css';
import page1Img from '../../assets/page1.jpg';
import slidesImg from '../../assets/slides.png';

function Detail({ name, gallery, onBack, visible }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (visible && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [visible]);

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${page1Img})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="scroll-container" ref={scrollRef}>
        <img src={slidesImg} alt="slides" />
      </div>
      <div className="back-btn" onClick={onBack}></div>
    </div>
  );
}

export default Detail;

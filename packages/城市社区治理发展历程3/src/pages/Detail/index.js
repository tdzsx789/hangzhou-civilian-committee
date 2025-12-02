import React, { useRef, useState } from 'react';
import './index.css';
import bg1 from '../../assets/bg1.jpg';
import button1 from '../../assets/button1.png';
import slides1 from '../../assets/slides1.png';
import back from '../../assets/back.png';

function Detail({ name, gallery, onBack, style }) {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 滚动速度倍数
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div 
      className="detail-page" 
      style={{ 
        ...style,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${bg1})`,
        transition: 'opacity 0.3s ease'
      }}
    >
      <div 
        className="slides-container"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <img src={slides1} alt="历史图片" className="slides-image" />
      </div>
      <div 
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '200px',
          height: '112px',
          backgroundImage: `url(${back})`
        }}
      />
      {/* <button className="slide-button" style={{ backgroundImage: `url(${button1})` }}></button> */}
    </div>
  );
}

export default Detail;
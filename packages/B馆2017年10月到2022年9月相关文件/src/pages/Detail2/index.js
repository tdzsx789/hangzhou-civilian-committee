import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import bg3 from '../../assets/bg3.jpg';
import handImg from '../../assets/hand.png';
import leftImg from '../../assets/left.png';
import rightImg from '../../assets/right.png';

function Detail2({ onBack, item, isActive, currentIndex = 0, total = 0, onNext, onPrev }) {
  const [showHand, setShowHand] = useState(true);
  const scrollContainerRef = useRef(null);

  // 重置滚动位置：切换页面或从Detail页进来时
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && isActive) {
      container.scrollTop = 0;
    }
  }, [isActive, currentIndex, item]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!isActive || !container) {
      setShowHand(false);
      return undefined;
    }

    setShowHand(true);
    const hideHand = () => setShowHand(false);
    const timer = setTimeout(hideHand, 6000);
    container.addEventListener('touchstart', hideHand);

    return () => {
      clearTimeout(timer);
      container.removeEventListener('touchstart', hideHand);
    };
  }, [isActive, item]);

  const renderWorkContent = () => {
    if (!item?.work) return null;
    if (typeof item.work === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: item.work }} />;
    }
    if (React.isValidElement(item.work)) {
      return React.cloneElement(item.work);
    }
    return item.work;
  };

  const isFirst = currentIndex <= 0;
  const isLast = total ? currentIndex >= total - 1 : true;

  const handlePrevClick = () => {
    if (!isFirst && onPrev) {
      onPrev();
    }
  };

  const handleNextClick = () => {
    if (!isLast && onNext) {
      onNext();
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg3})` }}>
      <div className="back-btn2" onClick={onBack}></div>
      <div className="detail2-scroll" ref={scrollContainerRef}>
        {renderWorkContent()}
      </div>
      <img
        src={leftImg}
        alt="上一页"
        className="detail2-nav-btn detail2-nav-btn-left"
        style={{
          position: 'absolute',
          left: '80px',
          top: '1598px',
          opacity: isFirst ? 0.5 : 1,
          pointerEvents: isFirst ? 'none' : 'auto',
        }}
        onClick={handlePrevClick}
      />
      <img
        src={rightImg}
        alt="下一页"
        className="detail2-nav-btn detail2-nav-btn-right"
        style={{
          position: 'absolute',
          left: '360px',
          top: '1598px',
          opacity: isLast ? 0.5 : 1,
          pointerEvents: isLast ? 'none' : 'auto',
        }}
        onClick={handleNextClick}
      />
      {showHand && (
        <img
          src={handImg}
          alt="hand"
          className="hand-swipe-animation"
          style={{ position: 'absolute', left: '520px', top: '1350px' }}
        />
      )}
    </div>
  );
}

export default Detail2;
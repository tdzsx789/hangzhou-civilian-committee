import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import bg3 from '../../assets/bg3.jpg';
import handImg from '../../assets/hand.png';

function Detail2({ onBack, item, isActive }) {
  const [showHand, setShowHand] = useState(true);
  const scrollContainerRef = useRef(null);

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

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg3})` }}>
      <div className="back-btn2" onClick={onBack}></div>
      <div className="detail2-scroll" ref={scrollContainerRef}>
        {renderWorkContent()}
      </div>
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
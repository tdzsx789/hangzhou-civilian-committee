import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import bg2 from '../../assets/bg2.jpg';
import slideBg from '../../assets/slideBg.png';
import handImg from '../../assets/hand.png';

function Detail({ name, gallery, onBack, onOpenDetail2, data = [], isActive = false }) {
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
  }, [isActive, data.length]);

  const handleEnterDetail2 = (index) => {
    if (onOpenDetail2) {
      onOpenDetail2(index);
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEnterDetail2(index);
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg2})` }}>
      <div className="page2-button-scroll" ref={scrollContainerRef}>
        {(data || []).map((item, idx) => {
          const numberLabel = String(idx + 1).padStart(2, '0');
          return (
            <div
              key={numberLabel}
              className="page2-button"
              role="button"
              tabIndex={0}
              onClick={() => handleEnterDetail2(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              style={{ backgroundImage: `url(${slideBg})` }}
            >
              <div className="page2-button-number">{numberLabel}</div>
              <div className="page2-button-name">{item?.name || ''}</div>
            </div>
          );
        })}
      </div>
      {showHand && (
        <img
          src={handImg}
          alt="hand"
          className="hand-swipe-animation"
          style={{
            position: 'absolute',
            left: '520px',
            top: '1200px'
          }}
        />
      )}
    </div>
  );
}

export default Detail;
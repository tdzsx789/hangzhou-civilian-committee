import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import bg2 from '../../assets/bg2.jpg';
import slideBg from '../../assets/slideBg.png';

function Detail({ name, gallery, onBack, onOpenDetail2, data = [], isActive = false }) {
  const scrollContainerRef = useRef(null);

  // 重置滚动位置：从其他页面进来时
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && isActive) {
      container.scrollTop = 0;
    }
  }, [isActive, data.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!isActive || !container) {
      return undefined;
    }

    return () => {
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
          const name = item?.name || '';
          const isLongName = name.length > 50;
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
              <div
                className="page2-button-name"
                style={isLongName ? { top: 95 } : undefined}
              >
                {name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Detail;
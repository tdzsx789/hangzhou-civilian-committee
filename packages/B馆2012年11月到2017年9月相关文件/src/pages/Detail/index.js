import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import bg2Zh from '../../assets/bg2.jpg';
import slideBgZh from '../../assets/slideBg.png';
import bg2En from '../../assets_english/bg2.jpg';
import slideBgEn from '../../assets_english/slideBg.png';
import backZh from '../../assets/back.png';
import backEn from '../../assets_english/back.png';

function Detail({ name, gallery, onBack, onOpenDetail2, data = [], isActive = false, language = 'zh' }) {
  const scrollContainerRef = useRef(null);

  const bg2 = language === 'en' ? bg2En : bg2Zh;
  const slideBg = language === 'en' ? slideBgEn : slideBgZh;

  // 重置滚动位置
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && isActive) {
      container.scrollTop = 0;
    }
  }, [isActive]);

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
          <div className="detail-back-btn2" onClick={onBack} style={{ backgroundImage: `url(${language === 'en' ? backEn : backZh})` }}></div>
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
              <div className={`page2-button-name ${language === 'en' ? 'en' : ''}`}>{language === 'en' ? (item?.name_en || '') : (item?.name_zh || '')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Detail;
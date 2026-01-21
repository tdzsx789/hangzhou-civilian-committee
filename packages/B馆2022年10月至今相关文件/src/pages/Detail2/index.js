import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import bg3Zh from '../../assets/bg3.jpg';
import leftImgZh from '../../assets/left.png';
import rightImgZh from '../../assets/right.png';
import bg3En from '../../assets_english/bg3.jpg';
import leftImgEn from '../../assets_english/left.png';
import rightImgEn from '../../assets_english/right.png';

function Detail2({ onBack, item, isActive, currentIndex = 0, total = 0, onNext, onPrev, language = 'zh' }) {
  const scrollContainerRef = useRef(null);

  const bg3 = language === 'en' ? bg3En : bg3Zh;
  const leftImg = language === 'en' ? leftImgEn : leftImgZh;
  const rightImg = language === 'en' ? rightImgEn : rightImgZh;

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
      return undefined;
    }

    return () => {
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
        alt={language === 'en' ? 'Previous' : '上一页'}
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
    </div>
  );
}

export default Detail2;
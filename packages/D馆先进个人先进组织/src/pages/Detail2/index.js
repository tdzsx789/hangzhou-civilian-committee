import React, { useState, useEffect } from 'react';
import './index.css';
import button1 from '../../assets/button1.png';
import leftBtn from '../../assets/left.png';
import rightBtn from '../../assets/right.png';

function Detail2({ onBack, childData }) {
  const images = childData?.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const showNavigation = images.length > 1;

  // 当 childData 变化时重置索引
  useEffect(() => {
    setCurrentIndex(0);
  }, [childData]);

  if (!childData) return null;

  const currentImage = images[currentIndex] || null;
  // 使用 process.env.PUBLIC_URL 来构建正确的路径（支持相对路径部署）
  // 当 homepage: "." 时，process.env.PUBLIC_URL 在构建时会被替换为 "."
  const imageUrl = currentImage ? (() => {
    const publicUrl = process.env.PUBLIC_URL || '';
    // 如果 PUBLIC_URL 是 "." 或空字符串，直接使用相对路径
    if (!publicUrl || publicUrl === '.') {
      return currentImage.url;
    }
    // 否则添加 PUBLIC_URL 前缀
    return `${publicUrl}/${currentImage.url}`.replace(/\/+/g, '/');
  })() : null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex === images.length - 1;

  return (
    <div className="detail-page2">
      {/* <div
        className="slide-button"
        style={{ backgroundImage: `url(${button1})` }}
        aria-label="返回首页"
      /> */}
      <div className="detail2-back-btn" onClick={onBack} />
      
      {/* child name */}
      <div className="detail2-name-title-container">
        <div className="detail2-child-name">{childData.address} {childData.people}</div>
        <div className="detail2-child-title">{childData.title}</div>
      </div>
      
      {/* child summary */}
      {childData.summary && (
        <div className="detail2-child-summary-scroll">
          <div className="detail2-child-summary">{childData.summary}</div>
        </div>
      )}
      
      {/* child image */}
      {imageUrl && (
        <>
          <div className="detail2-image-container">
            <div 
              className="detail2-child-image"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            {currentImage.name && (
              <div className="detail2-image-caption">{currentImage.name}</div>
            )}
          </div>

          {/* navigation buttons */}
          {showNavigation && (
            <>
              <div 
                className={`detail2-nav-btn2 detail2-nav-left2 ${isAtStart ? 'disabled' : ''}`}
                onClick={isAtStart ? undefined : handlePrev}
                style={{ 
                  backgroundImage: `url(${leftBtn})`,
                  opacity: isAtStart ? 0.3 : 1,
                }}
              />
              <div 
                className={`detail2-nav-btn2 detail2-nav-right2 ${isAtEnd ? 'disabled' : ''}`}
                onClick={isAtEnd ? undefined : handleNext}
                style={{ 
                  backgroundImage: `url(${rightBtn})`,
                  opacity: isAtEnd ? 0.3 : 1,
                }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Detail2;
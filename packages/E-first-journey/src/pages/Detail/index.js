import React, { useState } from 'react';
import './index.css';
import leftImg from '../../assets/left.png';
import rightImg from '../../assets/right.png';

function Detail({ onBack, list }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 过滤掉没有图片的项，只显示有图片的
  const itemsWithImages = list.filter(item => item.images && item.images.length > 0);
  
  // 如果没有数据，显示空状态
  if (itemsWithImages.length === 0) {
    return (
      <div className="detail-page">
        <div className="detail-back-btn" onClick={onBack}></div>
      </div>
    );
  }
  
  // 默认显示第一个有图片的项
  const currentItem = itemsWithImages[0];
  const images = currentItem.images.filter(img => img.url && img.name);
  const showNavigation = images.length > 4;
  const maxIndex = Math.max(0, images.length - 4);
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const visibleImages = images.slice(currentIndex, currentIndex + 4);
  
  return (
    <div className="detail-page">
      <div className="detail-back-btn" onClick={onBack}></div>
      
      <div className="detail-card-container">
        <div className="detail-card">
          <h1 className="detail-title">{currentItem.name}</h1>
          <p className="detail-summary">{currentItem.summary}</p>
          
          {images.length > 0 && (
            <div className="detail-images-wrapper">
              {showNavigation && (
                <button 
                  className={`detail-nav-btn detail-nav-left ${currentIndex === 0 ? 'disabled' : ''}`}
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  <img src={leftImg} alt="上一页" />
                </button>
              )}
              
              <div className="detail-images-grid">
                {visibleImages.map((image, index) => (
                  <div key={index} className="detail-image-card">
                    {image.url && (
                      <div 
                        className="detail-image"
                        style={{ backgroundImage: `url(${image.url})` }}
                      ></div>
                    )}
                    {image.name && (
                      <p className="detail-image-caption">{image.name}</p>
                    )}
                  </div>
                ))}
              </div>
              
              {showNavigation && (
                <button 
                  className={`detail-nav-btn detail-nav-right ${currentIndex >= maxIndex ? 'disabled' : ''}`}
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                >
                  <img src={rightImg} alt="下一页" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Detail;
import React, { useState } from 'react';
import './index.css';
import leftImg from '../../assets/left.png';
import rightImg from '../../assets/right.png';
import leftArrowImg from '../../assets/leftArrow.png';
import rightArrowImg from '../../assets/rightArrow.png';

function Detail({ onBack, list }) {
  // 显示所有项，包括没有图片的
  const allItems = list || [];
  
  // 计算中间卡片的索引（默认显示中间的卡片）
  const getInitialCardIndex = () => {
    const items = list || [];
    if (items.length === 0) return 0;
    return Math.floor((items.length - 1) / 2);
  };
  
  // 当前显示的卡片索引（list 中的项）
  const [cardIndex, setCardIndex] = useState(getInitialCardIndex);
  // 当前卡片内图片的索引（用于图片轮播）
  const [imageIndex, setImageIndex] = useState(0);
  
  // 如果没有数据，显示空状态
  if (allItems.length === 0) {
    return (
      <div className="detail-page">
        <div className="detail-back-btn" onClick={onBack}></div>
      </div>
    );
  }
  
  // 当前显示的项
  const currentItem = allItems[cardIndex];
  const images = (currentItem.images || []).filter(img => img.url && img.name);
  const showNavigation = images.length > 4;
  const maxImageIndex = Math.max(0, images.length - 4);
  
  // 切换卡片（上一张/下一张）
  const handleCardPrev = () => {
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
      setImageIndex(0); // 切换卡片时重置图片索引
    }
  };
  
  const handleCardNext = () => {
    if (cardIndex < allItems.length - 1) {
      setCardIndex(cardIndex + 1);
      setImageIndex(0); // 切换卡片时重置图片索引
    }
  };
  
  // 切换图片（当前卡片内的图片轮播）
  const handleImagePrev = () => {
    const newIndex = Math.max(0, imageIndex - 4);
    setImageIndex(newIndex);
  };
  
  const handleImageNext = () => {
    const newIndex = Math.min(maxImageIndex, imageIndex + 4);
    setImageIndex(newIndex);
  };
  
  const visibleImages = images.slice(imageIndex, imageIndex + 4);
  
  return (
    <div className="detail-page">
      <div className="detail-back-btn" onClick={onBack}></div>
      
      <div className="detail-card-container">
        <button 
          className={`detail-card-nav-btn detail-card-nav-left ${cardIndex === 0 ? 'disabled' : ''}`}
          onClick={handleCardPrev}
          disabled={cardIndex === 0}
        >
          <img src={leftArrowImg} alt="上一张卡片" />
        </button>
        
        <div className="detail-card">
          <h1 className="detail-title">{currentItem.name}</h1>
          <p className="detail-summary">{currentItem.summary}</p>
          
          {images.length > 0 && (
            <div className="detail-images-wrapper">
              {showNavigation && (
                <button 
                  className={`detail-nav-btn detail-nav-left ${imageIndex === 0 ? 'disabled' : ''}`}
                  onClick={handleImagePrev}
                  disabled={imageIndex === 0}
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
                  className={`detail-nav-btn detail-nav-right ${imageIndex >= maxImageIndex ? 'disabled' : ''}`}
                  onClick={handleImageNext}
                  disabled={imageIndex >= maxImageIndex}
                >
                  <img src={rightImg} alt="下一页" />
                </button>
              )}
            </div>
          )}
        </div>
        
        <button 
          className={`detail-card-nav-btn detail-card-nav-right ${cardIndex >= allItems.length - 1 ? 'disabled' : ''}`}
          onClick={handleCardNext}
          disabled={cardIndex >= allItems.length - 1}
        >
          <img src={rightArrowImg} alt="下一张卡片" />
        </button>
      </div>
    </div>
  );
}

export default Detail;
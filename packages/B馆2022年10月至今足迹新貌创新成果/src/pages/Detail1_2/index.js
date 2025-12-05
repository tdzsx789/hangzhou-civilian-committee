import React, { useRef, useState, useEffect, useCallback } from 'react';
import './index.css';
import bg1_2 from '../../assets/bg1_2.jpg';

function Detail({ name, gallery, onBack, onOpenDetail2, selectedItem, isActive = false }) {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef({ startY: 0, scrollTop: 0 });

  // 当页面激活时重置滚动位置
  useEffect(() => {
    if (isActive && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isActive]);

  const handleEnterDetail2 = () => {
    if (onOpenDetail2) {
      onOpenDetail2();
    }
  };

  const handleKeyDown = (callback) => (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  // 拖拽滚动处理
  const handleMouseDown = (e) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    dragStateRef.current.startY = e.pageY - scrollContainerRef.current.offsetTop;
    dragStateRef.current.scrollTop = scrollContainerRef.current.scrollTop;
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walk = (y - dragStateRef.current.startY) * 2;
    scrollContainerRef.current.scrollTop = dragStateRef.current.scrollTop - walk;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    dragStateRef.current.startY = e.touches[0].pageY - scrollContainerRef.current.offsetTop;
    dragStateRef.current.scrollTop = scrollContainerRef.current.scrollTop;
  };

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const y = e.touches[0].pageY - scrollContainerRef.current.offsetTop;
    const walk = (y - dragStateRef.current.startY) * 2;
    scrollContainerRef.current.scrollTop = dragStateRef.current.scrollTop - walk;
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  if (!selectedItem) {
    return (
      <div className="detail-page" style={{ backgroundImage: `url(${bg1_2})` }}>
        <div
          className="back-btn1_2"
          role="button"
          tabIndex={0}
          onClick={onBack}
          onKeyDown={handleKeyDown(onBack)}
        ></div>
      </div>
    );
  }

  const images = selectedItem.images || [];
  const hasTwoImages = images.length === 2;

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg1_2})` }}>
      <div className="content-wrapper">
        {/* 图片区域 */}
        {images.length > 0 && (
          <div className={`images-container ${hasTwoImages ? 'two-images' : 'one-image'}`}>
            {images.map((image, index) => (
              <div key={index} className="image-item">
                <div
                  className={`content-image ${hasTwoImages ? 'two-images' : 'one-image'}`}
                  style={{ backgroundImage: `url(${image.url})` }}
                ></div>
                {image.name && (
                  <div className="image-caption">{image.name}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 标题 */}
        {selectedItem.address && (
          <div className="content-title">{selectedItem.address}</div>
        )}

        {/* 正文滚动容器 */}
        {selectedItem.text && (
          <div
            ref={scrollContainerRef}
            className="text-scroll-container"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="content-text">
              {selectedItem.text.split('\n').map((paragraph, index) => (
                <p key={index} className="text-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
      <div
        className="back-btn1_2"
        role="button"
        tabIndex={0}
        onClick={onBack}
        onKeyDown={handleKeyDown(onBack)}
      ></div>
      <div
        className="link1_2"
        role="button"
        tabIndex={0}
        onClick={handleEnterDetail2}
        onKeyDown={handleKeyDown(handleEnterDetail2)}
      ></div>
    </div>
  );
}

export default Detail;
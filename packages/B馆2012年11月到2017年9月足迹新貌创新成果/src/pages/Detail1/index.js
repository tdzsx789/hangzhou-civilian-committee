import React, { useRef, useState, useEffect, useCallback } from 'react';
import './index.css';
import bg1_1 from '../../assets/bg1_1.jpg';
import bg1_1_en from '../../assets_english/bg1_1.jpg';
import back from '../../assets/back.png';
import back_en from '../../assets_english/back.png';

function Detail({ name, gallery, onBack, onOpenDetail2, onOpenDetail1_2, list = [], isActive = false, language = 'zh' }) {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef({ startY: 0, scrollTop: 0 });

  const currentBg = language === 'en' ? bg1_1_en : bg1_1;
  const currentBackButton = language === 'en' ? back_en : back;

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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEnterDetail2();
    }
  };

  const handleCardClick = (item) => {
    if (onOpenDetail1_2) {
      onOpenDetail1_2(item);
    }
  };

  const handleCardKeyDown = (event, item) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(item);
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

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${currentBg})` }}>
      <div className="detail-back-btn2" onClick={onBack} style={{ backgroundImage: `url(${currentBackButton})` }}></div>
      <div
        ref={scrollContainerRef}
        className="scroll-container"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {list.map((item, index) => (
          <div
            key={index}
            className="card-item"
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick(item)}
            onKeyDown={(e) => handleCardKeyDown(e, item)}
          >
            <div className="card-content">{language === 'en' ? (item.name_en || item.name) : item.name}</div>
          </div>
        ))}
      </div>
      <div
        className="link1"
        role="button"
        tabIndex={0}
        onClick={handleEnterDetail2}
        onKeyDown={handleKeyDown}
      ></div>
    </div>
  );
}

export default Detail;
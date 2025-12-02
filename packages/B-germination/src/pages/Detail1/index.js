import React, { useState, useRef, useCallback } from 'react';
import './index.css';
import bg1_1 from '../../assets/bg1_1.jpg';
import slides1 from '../../assets/slides1.png';
import startButton from '../../assets/start.png';

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
function Detail({ name, gallery, onBack, onOpenDetail2, onOpenDetail3 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScrollTop, setStartScrollTop] = useState(0);
  const scrollContainerRef = useRef(null);
  const imageWrapRef = useRef(null);
  const [imageHeight, setImageHeight] = useState(0);

  const handleEnterDetail2 = () => {
    if (onOpenDetail2) {
      onOpenDetail2();
    }
  };

  const handleEnterDetail3 = () => {
    if (onOpenDetail3) {
      onOpenDetail3();
    }
  };

  const handleButtonClick = (index) => {
    if (index === 1) {
      handleEnterDetail3();
    } else {
      handleEnterDetail2();
    }
  };

  const handleKeyDown1_2 = (index) => (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleButtonClick(index);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleBackKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBack();
    }
  };

  // 拖拽开始
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartScrollTop(scrollTop);
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartScrollTop(scrollTop);
    e.preventDefault();
  };

  // 拖拽中
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    const newScrollTop = startScrollTop - deltaY;
    const containerHeight = 1090; // 容器高度
    const maxScroll = Math.max(0, imageHeight - containerHeight);
    setScrollTop(Math.max(0, Math.min(newScrollTop, maxScroll)));
    e.preventDefault();
  }, [isDragging, startY, startScrollTop, imageHeight]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    const newScrollTop = startScrollTop - deltaY;
    const containerHeight = 1090; // 容器高度
    const maxScroll = Math.max(0, imageHeight - containerHeight);
    setScrollTop(Math.max(0, Math.min(newScrollTop, maxScroll)));
    e.preventDefault();
  }, [isDragging, startY, startScrollTop, imageHeight]);

  // 拖拽结束
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 内容加载完成后获取高度
  React.useEffect(() => {
    const updateHeight = () => {
      const wrap = imageWrapRef.current;
      if (wrap) {
        setImageHeight(wrap.offsetHeight);
      }
    };

    // 使用 setTimeout 确保 DOM 已渲染
    const timer = setTimeout(updateHeight, 0);

    // 监听图片加载
    const wrap = imageWrapRef.current;
    if (wrap) {
      const img = wrap.querySelector('img');
      if (img) {
        if (img.complete) {
          updateHeight();
        } else {
          img.addEventListener('load', updateHeight);
          return () => {
            clearTimeout(timer);
            img.removeEventListener('load', updateHeight);
          };
        }
      }
    }

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // 全局事件监听
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp, handleTouchEnd]);

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg1_1})` }}>
      <div
        className="back-button"
        role="button"
        tabIndex={0}
        onClick={handleBack}
        onKeyDown={handleBackKeyDown}
      >
        <img src={startButton} alt="返回" />
      </div>
      <div
        className="slides-container"
        ref={scrollContainerRef}
      >
        <div
          className='slides-image-wrap'
          ref={imageWrapRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            transform: `translateY(-${scrollTop}px)`,
          }}
        >
          <img
            src={slides1}
            alt="slides"
            className="slides-image"
          />
          {list.map((item, index) => {
            return <div
              key={index}
              className="page2-button"
              role="button"
              tabIndex={0}
              onClick={() => handleButtonClick(index)}
              onKeyDown={handleKeyDown1_2(index)}
              style={{ top: index * 158 + 'px' }}
            ></div>
          })}
        </div>
      </div>
    </div>
  );
}

export default Detail;
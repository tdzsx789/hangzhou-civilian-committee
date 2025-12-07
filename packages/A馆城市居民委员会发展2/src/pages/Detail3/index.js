import React, { useRef, useState, useEffect, useCallback } from 'react';
import './index.css';
import page3Img from '../../assets/page3.jpg';
import circleImg from '../../assets/circle.png';
import leftNoneImg from '../../assets/left-none.png';
import leftYesImg from '../../assets/left-yes.png';
import rightNoneImg from '../../assets/right-none.png';
import rightYesImg from '../../assets/right-yes.png';
import handImg from '../../assets/hand.png';

// 动态导入所有图片
const requireImage = (name) => {
  try {
    return require(`../../assets/director/${name}.png`);
  } catch (e) {
    return null;
  }
};

const list = [
  { name: '樊建华', url: '', date: '2000-2003.3', death: false },
  { name: '林渭龙', url: '', date: '2003.3-2006.9', death: false },
  { name: '李慧', url: '', date: '2006.9-2007.3', death: false },
  { name: '金春林', url: '', date: '2007.3-2007.10', death: false },
  { name: '陶燕', url: '', date: '2007.10-2008.6', death: false },
  { name: '林渭龙', url: '', date: '2008.6-2009.10', death: false },
  { name: '张建文', url: '', date: '2009.11-2012.4', death: false },
  { name: '芮佳南', url: '', date: '2012.6-2013.1', death: false },
  { name: '陈锋', url: '', date: '2013.4-2014.9', death: false },
  { name: '沈雪鸿', url: '', date: '2014.9-2016.3', death: false },
  { name: '邹紫娟', url: '', date: '2016.2-2020.9', death: false },
  { name: '郭子渊', url: '', date: '2020.9-至今', death: false },
]

function Detail3({ name, gallery, onBack, isActive }) {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isLeftAtStart, setIsLeftAtStart] = useState(true);
  const [isRightAtEnd, setIsRightAtEnd] = useState(false);
  const [showHand, setShowHand] = useState(true);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const isAtStart = scrollLeft <= 1; // 允许1px误差
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1; // 允许1px误差
      setIsLeftAtStart(isAtStart);
      setIsRightAtEnd(isAtEnd);
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 滚动速度倍数
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    checkScrollPosition();
  }, [isDragging, startX, scrollLeft, checkScrollPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    checkScrollPosition();
  }, [checkScrollPosition]);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 当进入 select1、select2、page2 或 page3 时显示 hand，6秒后隐藏
  useEffect(() => {
    setShowHand(true);
    const timer = setTimeout(() => {
      setShowHand(false);
    }, 6000);

    const handleScroll = () => {
      setShowHand(false);
    };

    scrollContainerRef.current.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
    };
  }, [isActive]);

  useEffect(() => {
    if (isActive && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      setIsLeftAtStart(true);
      setIsRightAtEnd(false);
      checkScrollPosition();
    }
  }, [isActive, checkScrollPosition]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('scroll', checkScrollPosition);

      // 初始检查
      checkScrollPosition();

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [handleMouseMove, handleMouseUp, handleMouseLeave, checkScrollPosition]);

  const handleScroll = () => {
    setShowHand(false);
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${page3Img})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="back-btn" onClick={onBack}></div>
      <img 
        src={isLeftAtStart ? leftNoneImg : leftYesImg} 
        alt="left" 
        className="nav-btn-left" 
      />
      <img 
        src={isRightAtEnd ? rightNoneImg : rightYesImg} 
        alt="right" 
        className="nav-btn-right" 
      />
      {
        showHand && (
          <img
            src={handImg}
            alt="hand"
            className={'hand-swipe-animation'}
            style={{
              position: 'absolute',
              left: 1200,
              top: 600,
              zIndex: 10
            }}
          />
        )}
      <div
        className="scroll-container"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
      >
        {list.map((item, index) => {
          const imageSrc = requireImage(item.name);
          return (
            <div key={index} className="director-item">
              <img src={circleImg} alt="circle" className="circle-img"></img>
              <div className="director-name-contrainer">
                <div className="bracket-top">【</div>
                <div className={`director-name-wrapper ${item.death ? 'death' : ''}`}>
                  <div className="director-name">{item.name}</div>
                </div>
                <div className="bracket-bottom">】</div>
              </div>
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={item.name}
                  className="director-image"
                />
              )}
              <div className="director-date">{item.date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Detail3;
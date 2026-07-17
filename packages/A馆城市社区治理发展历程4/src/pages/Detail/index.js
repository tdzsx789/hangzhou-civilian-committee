import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import bg1Zh from '../../assets/bg1.jpg';
import beforeZh from '../../assets/before.png';
import nextZh from '../../assets/next.png';
import backZh from '../../assets/back.png';
import bg1En from '../../assets_english/bg1.jpg';
import beforeEn from '../../assets_english/before.png';
import nextEn from '../../assets_english/next.png';
import backEn from '../../assets_english/back.png';
import Modal from '../Modal';
import defaultData from '../../defaultData.json';

export const imageList = []; // Kept for compatibility if imported elsewhere, but effectively empty

function Detail({ name, gallery, onBack, isVisible, language }) {
  const [imageList, setImageList] = useState(defaultData);
  
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data.json')
      .then(res => res.json())
      .then(data => setImageList(data))
      .catch(err => console.warn('Failed to load external config, using default data:', err));
  }, []);

  const bg1 = language === 'zh' ? bg1Zh : bg1En;
  const beforeImg = language === 'zh' ? beforeZh : beforeEn;
  const nextImg = language === 'zh' ? nextZh : nextEn;
  const backImg = language === 'zh' ? backZh : backEn;

  const localizedList = imageList.map(item => ({
    ...item,
    name: item.name === 'placeholder' ? 'placeholder' : item.name[language],
    url: process.env.PUBLIC_URL + item.url
  }));

  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [atLeft, setAtLeft] = useState(true);
  const [atRight, setAtRight] = useState(false);
  const updateEdges = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtLeft(el.scrollLeft <= 0);
    setAtRight(el.scrollLeft >= Math.max(0, max - 1));
  };
  const handlePrev = () => {
    if (!scrollContainerRef.current) return;
    const step = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollBy({ left: -step, behavior: 'smooth' });
  };
  const handleNext = () => {
    if (!scrollContainerRef.current) return;
    const step = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollBy({ left: step, behavior: 'smooth' });
  };

  // 进入页面时重置滚动位置
  useEffect(() => {
    if (isVisible && scrollContainerRef.current) {
      // 使用 requestAnimationFrame 确保 DOM 已渲染
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = 0;
          updateEdges();
        }
      });
    }
  }, [isVisible]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => updateEdges();
    el.addEventListener('scroll', onScroll);
    updateEdges();
    return () => {
      el.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 滚动速度倍数
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleImageClick = (item) => {
    setSelectedImage(item);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const isMultiLine = (text) => {
    // 假设每行大约20个汉字（根据字体大小和宽度估算，width 400px, font 18px）
    // 这是一个粗略的估算，实际渲染可能因字符宽度而异
    return text.length > 24; 
  };

  const getCaptionStyle = (text) => {
    const style = {};
    if (language === 'en' && text.length > 150) {
      style.fontSize = '14px';
      style.lineHeight = '16px';
    }
    if (language !== 'zh') {
      style.textIndent = '0';
    }
    return style;
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg1})` }}>
      <div
        className="slides-container"
        style={{ height: language === 'en' ? '842px' : '806px', top: language === 'en' ? '100px' : '150px' }}
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {/* <img src={slides1} alt="历史图片" className="slides-image" /> */}

        <div className="nanjing-grid">
          {(() => {
            const firstFour = localizedList.slice(0, 4);
            const rest = localizedList.slice(4);

            return (
              <>
                <div className="special-layout-container">
                  <div className="special-layout-top">
                    {firstFour.slice(0, 2).map((item) => (
                      <div className="nanjing-item" key={item.url}>
                        <img
                          src={item.url}
                          alt={item.name}
                          className="nanjing-thumb clickable-image"
                          onClick={() => handleImageClick(item)}
                        />
                        <div className={`nanjing-caption ${isMultiLine(item.name) ? 'multi-line' : 'single-line'}`} style={getCaptionStyle(item.name)}>{item.name}</div>
                      </div>
                    ))}
                  </div>
                  <div className="special-layout-bottom">
                    {firstFour.slice(2).map((item) => (
                      <div className="nanjing-item" key={item.url}>
                        <img
                          src={item.url}
                          alt={item.name}
                          className="nanjing-thumb clickable-image"
                          onClick={() => handleImageClick(item)}
                        />
                        <div className={`nanjing-caption ${isMultiLine(item.name) ? 'multi-line' : 'single-line'}`} style={getCaptionStyle(item.name)}>{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {rest.map((item) => (
                  <div className="nanjing-item" key={item.url}>
                    <img
                      src={item.url}
                      alt={item.name}
                      className="nanjing-thumb clickable-image"
                      onClick={() => handleImageClick(item)}
                    />
                    <div className={`nanjing-caption ${isMultiLine(item.name) ? 'multi-line' : 'single-line'}`} style={getCaptionStyle(item.name)}>{item.name}</div>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      </div>
      <div className="slide-button">
        <button
          className={`slide-button-prev ${atLeft ? 'edge-left-transparent' : ''}`}
          style={{ backgroundImage: `url(${beforeImg})`, opacity: atLeft ? 0.7 : 1 }}
          onClick={handlePrev}
        ></button>
        <button
          className={`slide-button-next ${atRight ? 'edge-right-transparent' : ''}`}
          style={{ backgroundImage: `url(${nextImg})`, opacity: atRight ? 0.7 : 1 }}
          onClick={handleNext}
        ></button>
      </div>
      <div
        className="back-to-home-btn"
        onClick={onBack}
        style={{ backgroundImage: `url(${backImg})` }}
      ></div>
      {selectedImage && (
        <Modal image={selectedImage} onClose={handleCloseModal} language={language} />
      )}
    </div>
  );
}

export default Detail;

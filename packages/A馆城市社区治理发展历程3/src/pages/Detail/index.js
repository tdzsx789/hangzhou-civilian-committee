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
import defaultData from '../../defaultData.json';
import Modal from '../Modal';

export const imageList = [];

const formatCaption = (text, language) => {
  if (language !== 'en' || !text || typeof text !== 'string') return text;

  const targets = [
    "The Circular of the General Office of the CPC Central Committee and the General Office of the State Council on Forwarding the Opinions of the Ministry of Civil Affairs on Promoting Urban Community Construction Nationwide",
    "The Circular of the General Office of the CPC Central Committee Forwarding the Opinions of the Organization Department of the CPC Central Committee on Further Strengthening and Improving the Party Building Work in Sub-districts and Communities"
  ];

  let parts = [text];
  
  targets.forEach(target => {
    const newParts = [];
    parts.forEach(part => {
      if (typeof part === 'string') {
        const split = part.split(target);
        split.forEach((s, i) => {
          if (s) newParts.push(s);
          if (i < split.length - 1) {
            newParts.push(<i key={target + i}>{target}</i>);
          }
        });
      } else {
        newParts.push(part);
      }
    });
    parts = newParts;
  });

  return parts;
};

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
    name: item.name === 'placeholder' ? 'placeholder' : item.name[language] || item.name['zh'],
    url: item.url ? process.env.PUBLIC_URL + item.url : ''
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
        style={{ height: language === 'en' ? '906px' : '806px', top: language === 'en' ? '70px' : '150px' }}
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {/* <img src={slides1} alt="历史图片" className="slides-image" /> */}

        <div className="nanjing-grid">
          {localizedList.map((item, index) => {
            if (item.name === 'placeholder') {
              return <div key={index} style={{ width: item.width, height: 1 }}></div>;
            }

            const renderItem = (itemData, isWide, alignment = 'center') => {
              const content = (
                <div className="nanjing-item" key={itemData.url}>
                  <img
                    src={itemData.url}
                    alt={itemData.name}
                    className="nanjing-thumb clickable-image"
                    onClick={() => handleImageClick(itemData)}
                  />
                  <div className="nanjing-caption" style={getCaptionStyle(itemData.name)}>{formatCaption(itemData.name, language)}</div>
                </div>
              );

              if (isWide) {
                return (
                  <div className="wide-wrapper" key={itemData.url} style={{ justifyContent: alignment }}>
                    {content}
                  </div>
                );
              }

              return content;
            };

            if (index === 0) {
              return (
                <div className="special-layout-container" key="special-layout">
                  <div className="special-layout-top">
                    {renderItem(localizedList[0], true, 'flex-end')}
                    {renderItem(localizedList[1], true, 'flex-start')}
                  </div>
                  <div className="special-layout-bottom">
                    {renderItem(localizedList[2], false)}
                    {renderItem(localizedList[3], false)}
                    {renderItem(localizedList[4], false)}
                  </div>
                </div>
              );
            }

            if (index > 0 && index < 5) {
              return null;
            }

            return renderItem(item, false);
          })}
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

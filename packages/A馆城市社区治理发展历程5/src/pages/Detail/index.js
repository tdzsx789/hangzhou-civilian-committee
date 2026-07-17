import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import bg1 from '../../assets/bg1.jpg';
import beforeImg from '../../assets/before.png';
import nextImg from '../../assets/next.png';
import backImg from '../../assets/back.png';
import bg1En from '../../assets_english/bg1.jpg';
import beforeImgEn from '../../assets_english/before.png';
import nextImgEn from '../../assets_english/next.png';
import backImgEn from '../../assets_english/back.png';
import Modal from '../Modal';
import defaultData from '../../defaultData.json';

const formatCaption = (text, language) => {
  if (language !== 'en' || !text || typeof text !== 'string') return text;

  const targets = [
    "The Opinions of the CPC Central Committee and the State Council on Strengthening and Improving Urban and Rural Community Governance",
    "The Opinions on Strengthening and Improving the Construction of the Party at the Urban Community Level issued by the General Office of the CPC Central Committee",
    "The Opinions of the CPC Central Committee and the State Council on Strengthening the Modernization of the Community-Level Governance System and Governance Capacity"
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

  const localizedList = imageList.map(item => ({
    ...item,
    name: item.name && item.name[language] ? item.name[language] : (item.name['zh'] || item.name),
    url: item.url ? process.env.PUBLIC_URL + item.url : ''
  }));

  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [atLeft, setAtLeft] = useState(true);
  const [atRight, setAtRight] = useState(false);
  
  const getCaptionStyle = (text) => {
    const style = {};
    if (language === 'en' && text && text.length > 120) {
      style.fontSize = '14px';
      style.lineHeight = '16px';
    }
    if (language !== 'zh') {
      style.textIndent = '0';
    }
    return style;
  };

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

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${language === 'en' ? bg1En : bg1})` }}>
      <div
        className="slides-container"
        style={{ height: language === 'en' ? '880px' : '806px', top: language === 'en' ? '100px' : '150px' }}
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {/* <img src={slides1} alt="历史图片" className="slides-image" /> */}

        <div className="nanjing-grid">
          <div className="special-first-group">
            <div className="special-row-top">
              {[0, 2, 4].map((i) => {
                const item = localizedList[i];
                if (!item) return null;
                return (
                  <div className="nanjing-item" key={item.url}>
                    <img
                      src={item.url}
                      alt={item.name}
                      className="nanjing-thumb clickable-image"
                      onClick={() => handleImageClick(item)}
                    />
                    <div className="nanjing-caption" style={getCaptionStyle(item.name)}>{formatCaption(item.name, language)}</div>
                  </div>
                );
              })}
            </div>
            <div className="special-row-bottom">
              {[1, 3, 5].map((i) => {
                const item = localizedList[i];
                if (!item) return null;
                return (
                  <div className="nanjing-item small-item" key={item.url}>
                    <img
                      src={item.url}
                      alt={item.name}
                      className="nanjing-thumb clickable-image"
                      onClick={() => handleImageClick(item)}
                    />
                    <div className="nanjing-caption" style={getCaptionStyle(item.name)}>{formatCaption(item.name, language)}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {localizedList.slice(6).map((item) => (
            <div className="nanjing-item" key={item.url}>
              <img
                src={item.url}
                alt={item.name}
                className="nanjing-thumb clickable-image"
                onClick={() => handleImageClick(item)}
              />
              <div className="nanjing-caption" style={getCaptionStyle(item.name)}>{formatCaption(item.name, language)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="slide-button">
        <button
          className={`slide-button-prev ${atLeft ? 'edge-left-transparent' : ''}`}
          style={{ backgroundImage: `url(${language === 'en' ? beforeImgEn : beforeImg})`, opacity: atLeft ? 0.7 : 1 }}
          onClick={handlePrev}
        ></button>
        <button
          className={`slide-button-next ${atRight ? 'edge-right-transparent' : ''}`}
          style={{ backgroundImage: `url(${language === 'en' ? nextImgEn : nextImg})`, opacity: atRight ? 0.7 : 1 }}
          onClick={handleNext}
        ></button>
      </div>
      <div
        className="back-to-home-btn"
        onClick={onBack}
        style={{ backgroundImage: `url(${language === 'en' ? backImgEn : backImg})` }}
      ></div>
      {selectedImage && (
        <Modal image={selectedImage} onClose={handleCloseModal} language={language} />
      )}
    </div>
  );
}

export default Detail;

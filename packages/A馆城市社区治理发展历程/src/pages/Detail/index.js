import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import bg1Zh from '../../assets/bg1.jpg';
import beforeZh from '../../assets/before.png';
import nextZh from '../../assets/next.png';
import backZh from '../../assets/back.png';

import bg1En from '../../assets_english/bg1.jpg';
import beforeEn from '../../assets_english/before.png';
import nextEn from '../../assets_english/next.png';
import slides1En from '../../assets_english/slides1.png';
import backEn from '../../assets_english/back.png';

import Modal from '../Modal';
import defaultData from '../../defaultData.json';

const publicUrl = process.env.PUBLIC_URL || '';
const slides1Zh = `${publicUrl}/images/slides1.png`;

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
  const slides1 = language === 'zh' ? slides1Zh : slides1En;
  const backImg = language === 'zh' ? backZh : backEn;

  const localizedList = imageList.map(item => ({
    ...item,
    name: item.name && item.name[language] ? item.name[language] : (item.name['zh'] || item.name),
    url: item.url ? (process.env.PUBLIC_URL || '') + '/' + item.url : ''
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

  const handleImageClick = (e, image) => {
    e.stopPropagation();
    if (!image.url) return;
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    // 当页面变为可见时重置滚动位置到 0
    if (isVisible && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      updateEdges();
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

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg1})` }}>
      <div className="back-button" onClick={onBack} style={{ backgroundImage: `url(${backImg})` }}></div>
      <div
        className="slides-container"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {localizedList.map((ele, i) => {
          return <div
            key={i}
            className="buttonImage"
            style={{
              width: ele.width || 400,
              left: ele.left,
              top: ele.top
            }}
            onClick={(e) => handleImageClick(e, ele)}
          ></div>
        })}
        <img src={slides1} alt="历史图片" className="slides-image" />
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
      <Modal image={selectedImage} onClose={handleCloseModal} />
    </div>
  );
}

export default Detail;

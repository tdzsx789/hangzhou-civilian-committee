import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import bg1 from '../../assets/bg1.jpg';
import beforeImg from '../../assets/before.png';
import nextImg from '../../assets/next.png';
import slides1 from '../../assets/slides1.png';
import cpc14thCongress from '../../assets/images/cpc-14th-congress.jpg';
import urbanPopulationChart from '../../assets/images/urban-population-chart.jpg';
import urbanCountChart from '../../assets/images/urban-count-chart.jpg';
import neighborhoodCommittee from '../../assets/images/neighborhood-committee.jpg';
import urbanizationAcceleration from '../../assets/images/urbanization-acceleration.jpg';
import migrantWorkers from '../../assets/images/migrant-workers.jpg';
import socialSecuritySystem from '../../assets/images/social-security-system.jpg';
import gudangEvolution from '../../assets/images/gudang-evolution.jpg';
import shaoxingMarket from '../../assets/images/shaoxing-market.jpg';
import Modal from '../Modal';

const list = [
  // { name: '全国城市数量发展变化图', url: urbanCountChart, left: 0, top: 0 },
  // { name: '全国城市人口数量发展变化图', url: urbanPopulationChart, left: 430, top: 0 },
  { name: '同志，有事情找居民委员会', url: neighborhoodCommittee, left: 186, top: 8 },
  { name: '城市化进程加。', url: urbanizationAcceleration, left: 692, top: 8 },
  { name: '日新月异——1982年、1998年、2004年三个时期的杭州市古荡（组图展示）', url: gudangEvolution, width: 1260, left: 0, top: 400 },
  { name: '党的十四大明确提出了我国经济体制改革的目标是建立社会主义市场经济体制。图为党的十四大会议现场', url: cpc14thCongress, left: 1290, top: 8 },
  { name: '绍兴集镇交易市场', url: shaoxingMarket, left: 1720, top: 8 },
  { name: '建立独立于企业事业单位之外的社会保障体系和社会化服务网络，需要社区发挥作用', url: socialSecuritySystem, left: 1290, top: 400 },
  { name: '大量民工涌向城市', url: migrantWorkers, left: 1720, top: 400 },
  { name: 'placeholder', url: '', left: 2120, top: 0, width: 420 },
]

function Detail({ name, gallery, onBack, isVisible }) {
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
      <div className="back-button" onClick={onBack}></div>
      <div
        className="slides-container"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {list.map((ele, i) => {
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

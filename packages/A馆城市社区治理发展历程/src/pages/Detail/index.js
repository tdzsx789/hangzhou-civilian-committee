import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import bg1 from '../../assets/bg1.jpg';
import button1 from '../../assets/button1.png';
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
  { name: '全国城市数量发展变化图', url: urbanCountChart, left: 0, top: 0 },
  { name: '全国城市人口数量发展变化图', url: urbanPopulationChart, left: 430, top: 0 },
  { name: '城市化进程加快。', url: urbanizationAcceleration, left: 860, top: 0 },
  { name: '党的十四大明确提出了我国经济体制改革的目标是建立社会主义市场经济体制。图为党的十四大会议现场。', url: cpc14thCongress, left: 1290, top: 0 },
  { name: '同志，有事情找居民委员会。', url: neighborhoodCommittee, left: 1720, top: 0 },
  { name: '绍兴集镇交易市场。', url: shaoxingMarket, left: 2150, top: 0 },
  { name: '日新月异——1982年、1998年、2004年三个时期的杭州市古荡（组图展示）。', url: gudangEvolution, width: 1260, left: 0, top: 400 },
  { name: '建立独立于企业事业单位之外的社会保障体系和社会化服务网络，需要社区发挥作用。', url: socialSecuritySystem, left: 1290, top: 400 },
  { name: '大量民工涌向城市。', url: migrantWorkers, left: 1720, top: 400 },
]

function Detail({ name, gallery, onBack, isVisible }) {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

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
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    // 当页面变为可见时重置滚动位置到 0
    if (isVisible && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [isVisible]);

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
      <button className="slide-button" style={{ backgroundImage: `url(${button1})` }}></button>
      <Modal image={selectedImage} onClose={handleCloseModal} />
    </div>
  );
}

export default Detail;
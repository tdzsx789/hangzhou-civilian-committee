import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import bg1 from '../../assets/bg1.jpg';
import button1 from '../../assets/button1.png';
import backImg from '../../assets/back.png';
import Modal from '../Modal';
import image1 from '../../assets/images/image1.jpg';
import image2 from '../../assets/images/image2.jpg';
import image3 from '../../assets/images/image3.jpg';
import image4 from '../../assets/images/image4.png';
import image5 from '../../assets/images/image5.jpg';
import image6 from '../../assets/images/image6.jpg';
import image7 from '../../assets/images/image7.jpg';
import image8 from '../../assets/images/image8.jpg';

export const imageList = [
  {
    name: '2013年，全国社区公共服务综合信息平台建设推进会在上海召开',
    url: image8
  },
  {
    name: '2015年，《民政部关于同意将北京市东城区等31个单位确认为"全国社区治理和服务创新实验区"的批复》。',
    url: image7
  },
  {
    name: '2017年，《中共中央 国务院关于加强和完善城乡社区治理的意见》',
    url: image6
  },
  {
    name: '2017年10月，中国共产党第十九次全国代表大会。',
    url: image5
  },
  {
    name: '2019年，中共中央办公厅印发《关于加强和改进城市基层党的建设工作的意见》',
    url: image4
  },
  {
    name: '全面加强纪律建设,把纪律挺在前面,严明政治纪律和政治规矩,运用监督执纪"四种形态",真抓真严、敢管敢严、长管长严。图为基层党员宣讲《廉洁自律准则》和《党纪处分条例》。',
    url: image3
  },
  {
    name: '社会治理转型升级。图为派出所人员走访社区。',
    url: image2
  },
  {
    name: '深入开展党的群众路线教育实践活动、"三严三实"专题教育和"两学一做"学习教育,党员干部"四个意识"显著增强。图为社区党员在学习党章。',
    url: image1
  },
];

function Detail({ name, gallery, onBack, isVisible }) {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  // 进入页面时重置滚动位置
  useEffect(() => {
    if (isVisible && scrollContainerRef.current) {
      // 使用 requestAnimationFrame 确保 DOM 已渲染
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = 0;
        }
      });
    }
  }, [isVisible]);

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
    <div className="detail-page" style={{ backgroundImage: `url(${bg1})` }}>
      <div
        className="slides-container"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {/* <img src={slides1} alt="历史图片" className="slides-image" /> */}

        <div className="nanjing-grid">
          {imageList.map((item) => (
            <div className="nanjing-item" key={item.url}>
              <img
                src={item.url}
                alt={item.name}
                className="nanjing-thumb clickable-image"
                onClick={() => handleImageClick(item)}
              />
              <div className="nanjing-caption">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="slide-button" style={{ backgroundImage: `url(${button1})` }}></button>
      <div
        className="back-to-home-btn"
        onClick={onBack}
        style={{ backgroundImage: `url(${backImg})` }}
      ></div>
      {selectedImage && (
        <Modal image={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default Detail;
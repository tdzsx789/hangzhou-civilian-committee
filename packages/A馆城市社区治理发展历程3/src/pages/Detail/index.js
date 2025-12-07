import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import bg1 from '../../assets/bg1.jpg';
import button1 from '../../assets/button1.png';
import backImg from '../../assets/back.png';
import Modal from '../Modal';
import image20001119 from '../../assets/images/image-2000-11-19.jpg';
import image200012 from '../../assets/images/image-2000-12.jpg';
import image20010427 from '../../assets/images/image-2001-04-27.jpg';
import image200107 from '../../assets/images/image-2001-07.jpg';
import image200209 from '../../assets/images/image-2002-09.jpg';
import image20030926 from '../../assets/images/image-2003-09-26.jpg';
import image20041004 from '../../assets/images/image-2004-10-04.jpg';

export const imageList = [
  {
    name: '2000年11月19日，《中共中央办公厅、国务院办公厅关于转发民政部关于在全国推进城市社区建设的意见的通知》。',
    url: image20001119
  },
  {
    name: '2000年12月，新疆维吾尔自治区社区建设现场会',
    url: image200012
  },
  {
    name: '2001年4月27日，时任民政部部长多吉才让在黑龙江省哈尔滨市道里区视察社区建设工作。',
    url: image20010427
  },
  {
    name: '2001年7月民政部在青岛召开全国城市社区建设工作会议。',
    url: image200107
  },
  {
    name: '2002年9月民政部召开全国城市社区建设四平现场会议。',
    url: image200209
  },
  {
    name: '2003年9月26日，为构建学习型社会，推进学习型社区建设，民政部、中央文明办、国家新闻出版总署、国家广播电影电视总局组织开展"全国万家社区图书室援建和万家社区读书活动"',
    url: image20030926
  },
  {
    name: '2004年10月4日，《中共中央办公厅转发中共中央组织部关于进一步加强和改进街道社区党的建设工作的意见的通知》。',
    url: image20041004
  }
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
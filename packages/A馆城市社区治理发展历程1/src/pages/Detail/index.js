import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import bg1 from '../../assets/bg1.jpg';
import button1 from '../../assets/button1.png';
import backImg from '../../assets/back.png';
import image1989 from '../../assets/images/image1989.jpg';
import image1990 from '../../assets/images/image1990.jpg';
import image1991_03 from '../../assets/images/image1991_03.jpg';
import image1991_07 from '../../assets/images/image1991_07.jpg';
import image1992_06 from '../../assets/images/image1992_06.jpg';
import image1993_05 from '../../assets/images/image1993_05.jpg';
import image1993_09 from '../../assets/images/image1993_09.jpg';
import Modal from '../Modal';

export const imageList = [
  {
    name: '1989年，时任民政部副部长张德江调研浙江省杭州市小营巷居委会社区服务工作。',
    url: image1989
  },
  {
    name: '1990年，广东省广州市先进居民委员会及工作者表彰大会。',
    url: image1990
  },
  {
    name: '1991年3月，浙江省杭州市拱墅区长征桥居民区召开第一次居民代表大会。',
    url: image1991_03
  },
  {
    name: '1991年7月，时任民政部部长崔乃夫题词"发展社区服务，建立新型邻里关系"。',
    url: image1991_07
  },
  {
    name: '1992年6月，民政部基层政权建设司在天津市河北区召开第一个"全国城市街道社区建设研讨会"。',
    url: image1992_06
  },
  {
    name: '1993年5月，时任全国人大常委会副委员长、著名社会学家雷洁琼题词："凝聚社会力量，推动社区发展"。',
    url: image1993_05
  },
  {
    name: '1993年9月十四部委关于加快发展社区服务业的意见。',
    url: image1993_09
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
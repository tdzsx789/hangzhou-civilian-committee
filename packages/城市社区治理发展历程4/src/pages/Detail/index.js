import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import bg1 from '../../assets/bg1.jpg';
import button1 from '../../assets/button1.png';
import backImg from '../../assets/back.png';
import Modal from '../Modal';
import image001 from '../../assets/images/image001.jpg';
import image002 from '../../assets/images/image002.jpg';
import image003 from '../../assets/images/image003.jpg';
import image004 from '../../assets/images/image004.jpg';
import image005 from '../../assets/images/image005.jpg';
import image006 from '../../assets/images/image006.jpg';
import image007 from '../../assets/images/image007.jpg';
import image008 from '../../assets/images/image008.jpg';
import image009 from '../../assets/images/image009.jpg';
import image010 from '../../assets/images/image010.jpg';
import image011 from '../../assets/images/image011.jpg';
import image012 from '../../assets/images/image012.jpg';
import image013 from '../../assets/images/image013.jpg';
import image014 from '../../assets/images/image014.jpg';
import image015 from '../../assets/images/image015.jpg';
import image016 from '../../assets/images/image016.jpg';
import image017 from '../../assets/images/image017.jpg';

export const imageList = [
  {
    name: '2005年8月，民政部在长春召开了全国社区建设工作会议，会议以"三个代表"重要思想为指导，总结交流自全面推进社区建设以来(001)',
    url: image001
  },
  {
    name: '2006年10月15日，时任中央政治局委员、国务院副总理回良玉同志视察上海市杨浦区殷行街道社区"阳光之家"。',
    url: image002
  },
  {
    name: '2006年，《国务院关于加强和改进社区服务工作的意见》。',
    url: image003
  },
  {
    name: '2006年，全国部分省市社区信息化工作经验交流会在大连召开。',
    url: image004
  },
  {
    name: '2007年，《国家发展改革委、民政部关于印发"十一五"社区服务体系发展规划的通知》。',
    url: image008
  },
  {
    name: '原中央政治局常委、全国人大常委会委员长吴邦国同志题词：和谐社区。',
    url: image017
  },
  {
    name: '2007年3月，民政部在青岛召开全国农村社区建设座谈会。',
    url: image007
  },
  {
    name: '2007年3月29日，民政部关于印发《全国农村社区建设实验县（市、区）工作实施方案》的通知。',
    url: image006
  },
  {
    name: '2007年10月，党的十七大把基层群众自治制度确定为我国基本政治制度的重要组成部分。',
    url: image005
  },
  {
    name: '2007年，民政部关于发放全国农村社区建设实验县（市、区）牌匾的通知。',
    url: image009
  },
  {
    name: '2008年6月28日，国家民政部在杭州宣布成立于1949年10月23日的杭州市上城区上羊市街居民委员会是新中国第一个居民委员会',
    url: image012
  },
  {
    name: '2008年10月13日，在浙江省杭州市召开全国和谐社区建设理论研讨会暨首届城区论坛。',
    url: image010
  },
  {
    name: '2008年10月，福建省沙县凤岗街道城东社区召开社区治安分析会。',
    url: image011
  },
  {
    name: '2009年全国和谐社区建设工作会议。',
    url: image015
  },
  {
    name: '2009年6月2日，时任民政部副部长孙绍骋同志视察广西省柳州市天鹅湖社区。',
    url: image013
  },
  {
    name: '2009年7月，杭州市城乡和谐社区建设结对签约仪式。',
    url: image014
  },
  {
    name: '2010年12月21日，中国社区建设展示中心落成典礼',
    url: image016
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
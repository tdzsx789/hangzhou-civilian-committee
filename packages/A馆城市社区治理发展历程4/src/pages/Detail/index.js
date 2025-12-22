import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import bg1 from '../../assets/bg1.jpg';
import beforeImg from '../../assets/before.png';
import nextImg from '../../assets/next.png';
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
import image018 from '../../assets/images/image018.jpg';

export const imageList = [
  {
    name: '2007年10月，党的十七大把基层群众自治制度确定为我国基本政治制度之一',
    url: image005
  },
  // {
  //   name: '2009年6月2日，时任民政部副部长孙绍骋同志视察广西壮族自治区柳州市天鹅湖社区',
  //   url: image013
  // },
  {
    name: '2009年10月，民政部在苏州召开全国和谐社区建设工作会议',
    url: image015
  },
  {
    name: '2008年6月28日，民政部在杭州宣布成立于1949年10月23日的杭州市上城区上羊市街居民委员会是新中国第一个居民委员会',
    url: image012
  },
  {
    name: '2009年12月21日，中国社区建设展示中心落成',
    url: image016
  },
  {
    name: '2009年12月21日，时任中共杭州市委副书记、市长蔡奇同志主持中国社区建设展示中心落成典礼',
    url: image018
  },
  {
    name: '2009年7月，杭州市城乡和谐社区建设结对签约仪式',
    url: image014
  },
  {
    name: '2005年8月，民政部在长春召开全国社区建设工作会议',
    url: image001
  },
  {
    name: '2006年10月15日，时任中央政治局委员、国务院副总理回良玉同志视察上海市杨浦区殷行街道社区“阳光之家”',
    url: image002
  },
  {
    name: '2006年，《国务院关于加强和改进社区服务工作的意见》',
    url: image003
  },
  {
    name: '2006年，全国部分省市社区信息化工作经验交流会在大连召开',
    url: image004
  },
  {
    name: '2007年，《国家发展改革委、民政部关于印发“十一五”社区服务体系发展规划的通知》',
    url: image008
  },
  {
    name: '原中央政治局常委、全国人大常委会委员长吴邦国同志题词：和谐社区',
    url: image017
  },
  {
    name: '2007年3月，民政部在青岛召开全国农村社区建设座谈会',
    url: image007
  },
  {
    name: '2007年3月29日，民政部关于印发《全国农村社区建设实验县（市、区）工作实施方案》的通知',
    url: image006
  },
  {
    name: '2007年，民政部关于发放全国农村社区建设实验县（市、区）牌匾的通知',
    url: image009
  },
  {
    name: '2008年10月13日，在浙江省杭州市召开全国和谐社区建设理论研讨会暨首届城区论坛',
    url: image010
  },
  {
    name: '2008年10月，福建省沙县凤岗街道城东社区召开社区治安分析会',
    url: image011
  },
];

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
          {(() => {
            const firstFour = imageList.slice(0, 4);
            const rest = imageList.slice(4);

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
                        <div className={`nanjing-caption ${isMultiLine(item.name) ? 'multi-line' : 'single-line'}`}>{item.name}</div>
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
                        <div className={`nanjing-caption ${isMultiLine(item.name) ? 'multi-line' : 'single-line'}`}>{item.name}</div>
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
                    <div className={`nanjing-caption ${isMultiLine(item.name) ? 'multi-line' : 'single-line'}`}>{item.name}</div>
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
        <Modal image={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default Detail;

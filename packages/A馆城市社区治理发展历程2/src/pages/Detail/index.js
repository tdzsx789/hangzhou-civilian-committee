import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import bg1 from '../../assets/bg1.jpg';
import beforeImg from '../../assets/before.png';
import nextImg from '../../assets/next.png';
import backImg from '../../assets/back.png';
import image1933 from '../../assets/images/image1933.jpg';
import image1996 from '../../assets/images/image1996.jpg';
import image1997 from '../../assets/images/image1997.jpg';
import image1998_06 from '../../assets/images/image1998_06.jpg';
import image1999 from '../../assets/images/image1999.jpg';
import image1999_08 from '../../assets/images/image1999_08.jpg';
import image1999_10 from '../../assets/images/image1999_10.jpg';
import new2 from '../../assets/images/new2.jpg';
import Modal from '../Modal';

export const imageList = [
  {
    name: '1998年6月，国务院机构改革“三定方案”赋予民政部“推动社区建设”的职能',
    url: image1998_06
  },
  {
    name: '民政部批复社区建设实验区文件',
    url: new2
  },
  {
    name: '1999年8月，民政部在浙江省杭州市召开全国社区建设实验区工作座谈会',
    url: image1999_08
  },
  {
    name: '1999年10月社区体制改革——沈阳模式专家论证会',
    url: image1999_10
  },
  {
    name: '1996年，山东省淄博市博山区新坦社区工作人员记事本及合影',
    url: image1996
  },
  {
    name: '1997年，上海市积极开展创建文明社区，文明小区活动。上海黄浦区人民广场街道有一支由7000多人组成的志愿者队伍，他们设立了10多个服务网点，热忱为市民排忧解难',
    url: image1997
  },
  {
    name: '1933年，社会学家费孝通等第一次将“community”一词译成“社区”，成为中国社会学的通用术语。图为费孝通先生与宁波市海曙区社区工作者合影',
    url: image1933
  },
  {
    name: 'placeholder',
    url: '',
    width: 880
  }
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
          {imageList.map((item, index) => {
            if (item.name === 'placeholder') {
              return <div key={index} style={{ width: item.width, height: 1 }}></div>;
            }

            const content = (
              <div className="nanjing-item" key={index >= 4 ? item.url : undefined}>
                <img
                  src={item.url}
                  alt={item.name}
                  className="nanjing-thumb clickable-image"
                  onClick={() => handleImageClick(item)}
                />
                <div className="nanjing-caption">{item.name}</div>
              </div>
            );

            if (index < 4) {
              return (
                <div className="wide-wrapper" key={item.url}>
                  {content}
                </div>
              );
            }

            return content;
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
        <Modal image={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default Detail;

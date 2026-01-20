import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import bg1Zh from '../../assets/bg1.jpg';
import beforeZh from '../../assets/before.png';
import nextZh from '../../assets/next.png';
import backZh from '../../assets/back.png';
import bg1En from '../../assets_english/bg1.jpg';
import beforeEn from '../../assets_english/before.png';
import nextEn from '../../assets_english/next.png';
import backEn from '../../assets_english/back.png';
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
    name: {
      zh: '1989年10月，时任民政部副部长张德江调研浙江省杭州市小营巷居民委员会社区服务工作',
      en: 'In 1989, Zhang Dejiang, then Vice Minister of Civil Affairs, inspected the community services at the Xiaoyingxiang Neighborhood Committee in Hangzhou, Zhejiang Province'
    },
    url: image1989
  },
  {
    name: {
      zh: '1991年7月，时任民政部部长崔乃夫题词“发展社区服务，建立新型邻里关系”',
      en: 'In July 1991, Cui Naifu, then Minister of Civil Affairs, wrote an inscription calling for “developing community services and establishing a new model of neighborhood relations'
    },
    url: image1991_07
  },
  {
    name: {
      zh: '1992年6月，民政部基层政权和社区建设司在天津市河西区召开“全国城市街道社区建设研讨会”',
      en: 'In June 1992, the Department of Grassroots Governance and Community Building of the Ministry of Civil Affairs held the National Seminar on Urban Sub-district Community Construction in Hexi District, Tianjin'
    },
    url: image1992_06
  },
  {
    name: {
      zh: '1993年5月，时任全国人大常委会副委员长、著名社会学家雷洁琼题词：“凝集社会力量，推动社区发展”',
      en: `In May 1993, Lei Jieqiong, then Vice Chairperson of the Standing Committee of the National People's Congress and a famous sociologist, wrote an inscription calling for the "mobilizing of social forces to promote community development."`
    },
    url: image1993_05
  },
  {
    name: {
      zh: '1990年，广东省广州市先进居民委员会及工作者表彰大会',
      en: `In 1990, a commendation ceremony was held in Guangzhou, Guangdong Province, to honor outstanding residents' committees and their workers`
    },
    url: image1990
  },
  {
    name: {
      zh: '1991年3月，浙江省杭州市拱墅区长征桥居民区召开第一次居民代表大会',
      en: `In March 1991, the first residents' representative assembly was held in the Changzheng Bridge residential area of ​​Gongshu District, Hangzhou City, Zhejiang Province`
    },
    url: image1991_03
  },
  {
    name: {
      zh: '1993年9月十四部委关于加快发展社区服务业的意见',
      en: `Opinions of fourteen ministries and commissions in September 1993 on accelerating the development of community service industries`
    },
    url: image1993_09
  },
  {
    name: {
      zh: 'placeholder',
      en: 'placeholder'
    },
    url: '',
    width: 880
  }
];

function Detail({ name, gallery, onBack, isVisible, language }) {
  const bg1 = language === 'zh' ? bg1Zh : bg1En;
  const beforeImg = language === 'zh' ? beforeZh : beforeEn;
  const nextImg = language === 'zh' ? nextZh : nextEn;
  const backImg = language === 'zh' ? backZh : backEn;

  const localizedList = imageList.map(item => ({
    ...item,
    name: item.name === 'placeholder' ? 'placeholder' : item.name[language]
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
          {localizedList.map((item, index) => {
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

import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import bg1 from '../../assets/bg1.jpg';
import beforeImg from '../../assets/before.png';
import nextImg from '../../assets/next.png';
import backImg from '../../assets/back.png';
import bg1En from '../../assets_english/bg1.jpg';
import beforeImgEn from '../../assets_english/before.png';
import nextImgEn from '../../assets_english/next.png';
import backImgEn from '../../assets_english/back.png';
import Modal from '../Modal';
import image1 from '../../assets/images/image1.jpg';
import image2 from '../../assets/images/image2.jpg';
import image3 from '../../assets/images/image3.jpg';
import image4 from '../../assets/images/4.jpg';
import image5 from '../../assets/images/image5.jpg';
import image6 from '../../assets/images/image6.jpg';
import image7 from '../../assets/images/image7.jpg';
import image8 from '../../assets/images/image8.jpg';
import image9 from '../../assets/images/image9.jpg';
import new4 from '../../assets/images/4.jpg';
import new5 from '../../assets/images/5.jpg';
import new6 from '../../assets/images/6.jpg';
import tupian1 from '../../assets/images/tupian1.jpg';
import tupian2 from '../../assets/images/tupian2.jpg';
import tupian3 from '../../assets/images/tupian3.jpg';
import tupian4 from '../../assets/images/tupian4.jpg';
import tupian5 from '../../assets/images/tupian5.jpg';
import tupian6 from '../../assets/images/tupian6.jpg';

export const imageList = [
  {
    name: {
      zh: '2012年11月，中国共产党第十八次全国代表大会在北京召开',
      en: 'In November 2012, the 18th National Congress of the Communist Party of China was held in Beijing'
    },
    url: tupian1
  },
  {
    name: {
      zh: '2017年6月，《中共中央、国务院关于加强和完善城乡社区治理的意见》印发',
      en: 'In June 2017, the "Opinions of the CPC Central Committee and the State Council on Strengthening and Improving Urban and Rural Community Governance" was issued'
    },
    url: tupian4
  },
  {
    name: {
      zh: '2017年10月，中国共产党第十九次全国代表大会在北京召开',
      en: 'In October 2017, the 19th National Congress of the Communist Party of China was held in Beijing'
    },
    url: tupian2
  },
  {
    name: {
      zh: '2021年4月，《中共中央、国务院关于加强基层治理体系和治理能力现代化建设的意见》印发',
      en: 'In April 2021, the "Opinions of the CPC Central Committee and the State Council on Strengthening the Construction of Modernization of Grassroots Governance System and Governance Capacity" was issued'
    },
    url: tupian5
  },
  {
    name: {
      zh: '2022年10月，中国共产党第二十次全国代表大会在北京召开',
      en: 'In October 2022, the 20th National Congress of the Communist Party of China was held in Beijing'
    },
    url: tupian3
  },
  {
    name: {
      zh: '2019年5月，中共中央办公厅印发《关于加强和改进城市基层党的建设工作的意见》',
      en: 'In May 2019, the General Office of the CPC Central Committee issued the "Opinions on Strengthening and Improving Urban Grassroots Party Building Work"'
    },
    url: tupian6
  },
  // {
  //   name: '2017年10月，中国共产党第十九次全国代表大会在北京召开',
  //   url: image5
  // },
  // {
  //   name: '2019年5月，中共中央办公厅印发《关于加强和改进城市基层党的建设工作的意见》',
  //   url: new4
  // },
  // {
  //   name: '2017年，《中共中央 国务院关于加强和完善城乡社区治理的意见》印发',
  //   url: image6
  // },
  {
    name: {
      zh: '2019年2月,中央宣传部、民政部在湖北省武汉市向全社会公开发布2018年“最美城乡社区工作者”先进事迹',
      en: 'In February 2019, the Publicity Department of the CPC Central Committee and the Ministry of Civil Affairs publicly released the advanced deeds of the 2018 "Most Beautiful Urban and Rural Community Workers" in Wuhan, Hubei Province'
    },
    url: new5
  },
  // {
  //   name: '2015年，《民政部关于同意将北京市西城区等40个单位确认为全国社区治理和服务创新实验区的批复》印发',
  //   url: image7
  // },
  {
    name: {
      zh: '2013年11月25日，全国社区公共服务综合信息平台建设推进会在上海召开',
      en: 'On November 25, 2013, the National Community Public Service Integrated Information Platform Construction Promotion Meeting was held in Shanghai'
    },
    url: new6
  },
  {
    name: {
      zh: '建立更加公平更可持续的社会保障制度,实施全民参保计划,基本实现法定人员全覆盖。图为群众在医院一站式服务窗口办理报销结算。',
      en: 'Establish a fairer and more sustainable social security system, implement the universal social insurance plan, and basically achieve full coverage of statutory personnel. The picture shows people handling reimbursement settlements at the one-stop service window in the hospital.'
    },
    url: image9
  },
  {
    name: {
      zh: '社会治理转型升级。图为派出所人员走访社区',
      en: 'Transformation and upgrading of social governance. The picture shows police station staff visiting the community'
    },
    url: image2
  },
  {
    name: {
      zh: '全面加强纪律建设,把纪律挺在前面,严明政治纪律和政治规矩,运用监督执纪“四种形态”,真抓真严、敢管敢严、长管长严。图为基层党员宣讲《廉洁自律准则》和《党纪处分条例》',
      en: 'Comprehensively strengthen discipline construction, put discipline in front, strictly enforce political discipline and political rules, use the "four forms" of supervision and discipline execution, really grasp and really be strict, dare to manage and dare to be strict, and manage for a long time and be strict. The picture shows grassroots party members preaching the "Code of Integrity and Self-discipline" and the "Regulations on Disciplinary Action"'
    },
    url: image3
  },
  {
    name: {
      zh: '2013年，全国社区公共服务综合信息平台建设推进会在上海召开',
      en: 'In 2013, the National Community Public Service Integrated Information Platform Construction Promotion Meeting was held in Shanghai'
    },
    url: image8
  },
  // {
  //   name: '2019年，中共中央办公厅印发《关于加强和改进城市基层党的建设工作的意见》',
  //   url: image4
  // },
  {
    name: {
      zh: '深入开展党的群众路线教育实践活动、“三严三实”专题教育和“两学一做”学习教育,党员干部“四个意识”显著增强。图为社区党员在学习党章',
      en: 'Deeply carry out the mass line education and practice activities of the Party, the "Three Stricts and Three Earnests" special education and the "Two Studies and One Action" learning education, and the "four consciousnesses" of party members and cadres have been significantly enhanced. The picture shows community party members studying the Party Constitution'
    },
    url: image1
  },
];

function Detail({ name, gallery, onBack, isVisible, language }) {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [atLeft, setAtLeft] = useState(true);
  const [atRight, setAtRight] = useState(false);
  
  const getCaptionStyle = (text) => {
    if (language === 'en' && text.length > 120) {
      return {
        fontSize: '14px',
        lineHeight: '16px'
      };
    }
    return {};
  };

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
    <div className="detail-page" style={{ backgroundImage: `url(${language === 'en' ? bg1En : bg1})` }}>
      <div
        className="slides-container"
        style={{ height: language === 'en' ? '880px' : '806px', top: language === 'en' ? '100px' : '150px' }}
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {/* <img src={slides1} alt="历史图片" className="slides-image" /> */}

        <div className="nanjing-grid">
          <div className="special-first-group">
            <div className="special-row-top">
              {[0, 2, 4].map((i) => {
                const item = imageList[i];
                return (
                  <div className="nanjing-item" key={item.url}>
                    <img
                      src={item.url}
                      alt={item.name[language]}
                      className="nanjing-thumb clickable-image"
                      onClick={() => handleImageClick(item)}
                    />
                    <div className="nanjing-caption" style={getCaptionStyle(item.name[language])}>{item.name[language]}</div>
                  </div>
                );
              })}
            </div>
            <div className="special-row-bottom">
              {[1, 3, 5].map((i) => {
                const item = imageList[i];
                return (
                  <div className="nanjing-item small-item" key={item.url}>
                    <img
                      src={item.url}
                      alt={item.name[language]}
                      className="nanjing-thumb clickable-image"
                      onClick={() => handleImageClick(item)}
                    />
                    <div className="nanjing-caption" style={getCaptionStyle(item.name[language])}>{item.name[language]}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {imageList.slice(6).map((item) => (
            <div className="nanjing-item" key={item.url}>
              <img
                src={item.url}
                alt={item.name[language]}
                className="nanjing-thumb clickable-image"
                onClick={() => handleImageClick(item)}
              />
              <div className="nanjing-caption" style={getCaptionStyle(item.name[language])}>{item.name[language]}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="slide-button">
        <button
          className={`slide-button-prev ${atLeft ? 'edge-left-transparent' : ''}`}
          style={{ backgroundImage: `url(${language === 'en' ? beforeImgEn : beforeImg})`, opacity: atLeft ? 0.7 : 1 }}
          onClick={handlePrev}
        ></button>
        <button
          className={`slide-button-next ${atRight ? 'edge-right-transparent' : ''}`}
          style={{ backgroundImage: `url(${language === 'en' ? nextImgEn : nextImg})`, opacity: atRight ? 0.7 : 1 }}
          onClick={handleNext}
        ></button>
      </div>
      <div
        className="back-to-home-btn"
        onClick={onBack}
        style={{ backgroundImage: `url(${language === 'en' ? backImgEn : backImg})` }}
      ></div>
      {selectedImage && (
        <Modal image={selectedImage} onClose={handleCloseModal} language={language} />
      )}
    </div>
  );
}

export default Detail;

import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import Modal from '../Modal';
import detailBgImgZh from '../../assets/detailBg.jpg';
import detailBgImgEn from '../../assets_english/detailBg.jpg';
import selectImgZh from '../../assets/select.png';
import selectImgEn from '../../assets_english/select.png';
import select1ImgEn from '../../assets_english/step1.png';
import select2ImgEn from '../../assets_english/step2.png';
import select3ImgEn from '../../assets_english/step3.png';
import select4ImgEn from '../../assets_english/step4.png';
import page2ImgEn from '../../assets_english/page2.png';
import page3ImgEn from '../../assets_english/page3.png';
import page4ImgEn from '../../assets_english/page4.png';
import beforeImgZh from '../../assets/before.png';
import beforeImgEn from '../../assets_english/before.png';
import nextImgZh from '../../assets/next.png';
import nextImgEn from '../../assets_english/next.png';

import defaultData from '../../defaultData.json';

const publicUrl = process.env.PUBLIC_URL || '';
const select1ImgZh = `${publicUrl}/images/step1.png`;
const select2ImgZh = `${publicUrl}/images/step2.png`;
const select3ImgZh = `${publicUrl}/images/step3.png`;
const select4ImgZh = `${publicUrl}/images/step4.png`;
const page2ImgZh = `${publicUrl}/images/page2.png`;
const page3ImgZh = `${publicUrl}/images/page3.png`;
const page4ImgZh = `${publicUrl}/images/page4.png`;

const selectList = [
  {
    name: { zh: '初步建立阶段', en: 'Initial Development Stage' },
    period: { zh: '1949-1956年', en: '1949-1956' },
    top: 442,
    selectKey: 'select1'
  },
  {
    name: { zh: '探索与曲折发展阶段', en: 'Exploration and Tortuous \nDevelopment Stage' },
    period: { zh: '1956-1978年', en: '1956-1978' },
    top: 597,
    selectKey: 'page2'
  },
  {
    name: { zh: '恢复与发展阶段', en: ' Restoration and \nDevelopment Stage' },
    period: { zh: '1978-2012年', en: '1978-2012' },
    top: 752,
    selectKey: 'page3'
  },
  {
    name: { zh: '新时代创新发展阶段', en: 'The Innovative Development \nStage in the New Era' },
    period: { zh: '2012年至今', en: '2012-Present' },
    top: 907,
    selectKey: 'page4'
  },
]

const selectParams = {
  select1: {
    left: 60, top: 101, url: { zh: select1ImgZh, en: select1ImgEn }, downButtonLeft: 1390, downButtonTop: 875, upButtonTop: 815, upButtonLeft: 1330, beforeButtonTop: 850, beforeButtonRight: 1020
  },
  select2: {
    left: 60, top: 101, url: { zh: select2ImgZh, en: select2ImgEn }, downButtonLeft: 1125, downButtonTop: 875, upButtonTop: 815, upButtonLeft: 1330, beforeButtonTop: 850, beforeButtonRight: 1020
  },
  select3: {
    left: 60, top: 101, url: { zh: select3ImgZh, en: select3ImgEn }, downButtonLeft: 1390, downButtonTop: 805,
  },
  select4: {
    left: 60, top: 101, url: { zh: select4ImgZh, en: select4ImgEn }, downButtonLeft: 950, downButtonTop: 960,
  },
  page2: {
    left: 60, top: 101, url: { zh: page2ImgZh, en: page2ImgEn }, beforeButtonTop: 920, beforeButtonRight: 1020
  },
  page3: {
    left: 60, top: 101, url: { zh: page3ImgZh, en: page3ImgEn }, beforeButtonTop: 1000, beforeButtonRight: 1020
  },
  page4: {
    left: 60, top: 101, url: { zh: page4ImgZh, en: page4ImgEn }, beforeButtonTop: 886, beforeButtonRight: 1020
  },
}

// 动画时长配置（单位：毫秒）
const ANIMATION_DURATION = 150;

function Detail({ name, gallery, onBack, index = 'select1', language }) {
  const [galleryImages, setGalleryImages] = useState(defaultData);

  useEffect(() => {
    const dataUrl = (process.env.PUBLIC_URL || '') + '/data.json';
    fetch(dataUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(jsonData => {
        if (jsonData && Array.isArray(jsonData)) {
          setGalleryImages(jsonData);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const [selectedSelectKey, setSelectedSelectKey] = useState(index);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const galleryContainerRef = useRef(null);
  const page2Container1Ref = useRef(null);
  const page2Container2Ref = useRef(null);
  const page3ContainerRef = useRef(null);
  const [atLeft, setAtLeft] = useState(true);
  const [atRight, setAtRight] = useState(false);

  const [explanationMode, setExplanationMode] = useState(false);
  const [explanationStep, setExplanationStep] = useState(0); // 1-based index
  const EXPLANATION_STEPS = ['select1', 'select2', 'select3', 'select4', 'page2', 'page3', 'page4'];

  const localizedSelectList = selectList.map((item) => ({
    ...item,
    name: item.name[language],
    period: item.period[language]
  }));

  const localizedGalleryImages = galleryImages.map((item) => ({
    ...item,
    name: item.name[language],
  }));

  const detailBgImg = language === 'zh' ? detailBgImgZh : detailBgImgEn;
  const selectImg = language === 'zh' ? selectImgZh : selectImgEn;
  const beforeImg = language === 'zh' ? beforeImgZh : beforeImgEn;
  const nextImg = language === 'zh' ? nextImgZh : nextImgEn;

  const handleSpeekGo = () => {
    if (!explanationMode) {
      setExplanationMode(true);
      setExplanationStep(1);
      setSelectedSelectKey(EXPLANATION_STEPS[0]);
    } else {
      if (explanationStep < EXPLANATION_STEPS.length) {
        const nextStep = explanationStep + 1;
        setExplanationStep(nextStep);
        setSelectedSelectKey(EXPLANATION_STEPS[nextStep - 1]);
      } else {
        // Exit explanation mode
        setExplanationMode(false);
        setExplanationStep(0);
      }
    }
  };

  const handleSpeekBack = () => {
    if (explanationStep === 1) {
      setExplanationMode(false);
      setExplanationStep(0);
    } else if (explanationStep > 1) {
      const prevStep = explanationStep - 1;
      setExplanationStep(prevStep);
      setSelectedSelectKey(EXPLANATION_STEPS[prevStep - 1]);
    }
  };

  const getActiveScrollElement = () => {
    const el = (selectedSelectKey === 'select1' || selectedSelectKey === 'select2')
      ? galleryContainerRef.current
      : (selectedSelectKey === 'page2')
        ? page2Container1Ref.current
        : (selectedSelectKey === 'page3' || selectedSelectKey === 'page4')
          ? page3ContainerRef.current
          : null;
    return el;
  };

  const updateEdges = () => {
    const el = getActiveScrollElement();
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtLeft(el.scrollLeft <= 0);
    setAtRight(el.scrollLeft >= Math.max(0, max - 1));
  };

  useEffect(() => {
    setSelectedSelectKey(index);
  }, [index]);

  useEffect(() => {
    if ((selectedSelectKey === 'select1' || selectedSelectKey === 'select2') && galleryContainerRef.current) {
      if (selectedSelectKey === 'select2') {
        galleryContainerRef.current.scrollLeft = 1821;
      } else {
        galleryContainerRef.current.scrollLeft = 0;
      }
      updateEdges();
    }
    if (selectedSelectKey === 'page2') {
      if (page2Container1Ref.current) {
        page2Container1Ref.current.scrollLeft = 0;
      }
      if (page2Container2Ref.current) {
        page2Container2Ref.current.scrollLeft = 0;
      }
      updateEdges();
    }
    if ((selectedSelectKey === 'page3' || selectedSelectKey === 'page4') && page3ContainerRef.current) {
      page3ContainerRef.current.scrollLeft = 0;
      updateEdges();
    }
  }, [selectedSelectKey]);

  // 监听滚动事件，拖拽滚动时隐藏 hand
  useEffect(() => {
    const containers = [];

    if (selectedSelectKey === 'select1' || selectedSelectKey === 'select2') {
      if (galleryContainerRef.current) {
        containers.push(galleryContainerRef.current);
      }
    } else if (selectedSelectKey === 'page2') {
      if (page2Container1Ref.current) {
        containers.push(page2Container1Ref.current);
      }
      if (page2Container2Ref.current) {
        containers.push(page2Container2Ref.current);
      }
    } else if (selectedSelectKey === 'page3' || selectedSelectKey === 'page4') {
      if (page3ContainerRef.current) {
        containers.push(page3ContainerRef.current);
      }
    }

    const handleScroll = (e) => {
      updateEdges();
    };

    containers.forEach(container => {
      container.addEventListener('scroll', handleScroll);
    });

    return () => {
      containers.forEach(container => {
        container.removeEventListener('scroll', handleScroll);
      });
    };
  }, [selectedSelectKey]);

  const selectedItem = localizedSelectList.find(item => item.selectKey === selectedSelectKey) || localizedSelectList[0];
  const currentImageParam = selectParams[selectedSelectKey];

  // 判断文字是否可能换行（估算：324px宽度，16px字体，大约可容纳15-18个中文字符）
  const isMultiLine = (text) => {
    // 粗略估算：如果文字长度超过18个字符，可能换行
    // 英文大约 2 倍字符数
    return language === 'zh' ? text.length > 18 : text.length > 36;
  };



  // 根据 selectKey 获取对应的图片列表
  const getImagesBySelectKey = (selectKey) => {
    if (selectKey === 'select1' || selectKey === 'select2') {
      return localizedGalleryImages.filter(img => img.from === 'chubujianli');
    }
    if (selectKey === 'page2') {
      return localizedGalleryImages.filter(img => img.from === 'quzhefazhan');
    }
    if (selectKey === 'page3') {
      return localizedGalleryImages.filter(img => img.from === 'huifu');
    }
    if (selectKey === 'page4') {
      return localizedGalleryImages.filter(img => img.from === 'xinshidai');
    }
    return [];
  };

  const handleSelectClick = (selectKey) => {
    if (selectKey !== selectedSelectKey) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedSelectKey(selectKey);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, ANIMATION_DURATION);
    }
  };

  const handleDownButtonClick = () => {
    let newKey;
    if (selectedSelectKey === 'select1') {
      newKey = 'select2';
    } else if (selectedSelectKey === 'select2') {
      newKey = 'select1';
    } else if (selectedSelectKey === 'select3') {
      newKey = 'select4';
    } else if (selectedSelectKey === 'select4') {
      newKey = 'select3';
    }

    if (newKey) {
      handleSelectClick(newKey);
    }
  };

  const handlePrev = () => {
    const el = getActiveScrollElement();
    if (!el) return;
    const step = 4 * (324 + 40);
    el.scrollBy({ left: -step, behavior: 'smooth' });
  };

  const handleNext = () => {
    const el = getActiveScrollElement();
    if (!el) return;
    const step = 4 * (324 + 40) + 4;
    el.scrollBy({ left: step, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    if (selectedSelectKey === 'select3' || selectedSelectKey === 'select4') {
      handleSelectClick('select1');
    } else {
      onBack();
    }
  };

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <div className={`detail-page ${isTransitioning ? 'page-transitioning' : ''} ${language === 'en' ? 'en' : ''}`} style={{
      backgroundImage: `url(${detailBgImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      '--transition-duration': `${ANIMATION_DURATION}ms`
    }}>
      <div className="select-image" style={{ top: `${selectedItem.top}px` }}>
        <img src={selectImg} alt="select" />
        <div className="select-text">
          <div className={`select-text-line1 ${language === 'en' ? 'en' : ''}`}>{selectedItem.name}</div>
          <div className={`select-text-line2 ${language === 'en' ? 'en' : ''}`}>{selectedItem.period}</div>
        </div>
      </div>
      {currentImageParam && (
        <img
          src={currentImageParam.url[language]}
          alt={'currentImageParam'}
          style={{
            position: 'absolute',
            left: `${currentImageParam.left}px`,
            top: `${currentImageParam.top}px`,
            pointerEvents: 'none'
          }}
        />
      )}
      {currentImageParam && currentImageParam.upButtonTop && (
        <div
          className="upButton"
          onClick={() => handleSelectClick('select3')}
          style={{
            position: 'absolute',
            width: '200px',
            height: '65px',
            top: '815px',
            left: "1330px",
            zIndex: 10
          }}
        />
      )}
      {currentImageParam && currentImageParam.downButtonLeft && (
        <div
          className='downButton'
          onClick={handleDownButtonClick}
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            left: `${currentImageParam.downButtonLeft}px`,
            top: `${currentImageParam.downButtonTop}px`,
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            // background: 'red'
          }}
        />
      )}
      {(selectedSelectKey === 'select1' || selectedSelectKey === 'select2') && (
        <div
          ref={galleryContainerRef}
          style={{
            position: 'absolute',
            left: '50px',
            top: '460px',
            width: '1440px',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="slides-container"
        >
          <div className="gallery-images-list">
            {(() => {
              const images = getImagesBySelectKey(selectedSelectKey);
              const firstThree = images.slice(0, 3);
              const rest = images.slice(3);

              return (
                <>
                  {firstThree.map((img, index) => {
                    const multiLine = isMultiLine(img.name);
                    return (
                      <div key={img.url} className="wide-item-wrapper">
                        <div className="gallery-image-item">
                          <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                            <img
                              src={img.url}
                              alt={img.name}
                              className="gallery-image"
                            />
                          </div>
                          <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                            {img.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {rest.map((img, index) => {
                    const multiLine = isMultiLine(img.name);
                    return (
                      <div key={img.url} className="gallery-image-item">
                        <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                          <img
                            src={img.url}
                            alt={img.name}
                            className="gallery-image"
                          />
                        </div>
                        <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                          {img.name}
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
        </div>
      )}
      {(selectedSelectKey === 'page2') && (
        <div className="gellery-scroll-wrap2" ref={page2Container1Ref}>
          <div className="gallery-images-list">
            {getImagesBySelectKey(selectedSelectKey).map((img, index) => {
              const multiLine = isMultiLine(img.name);
              return (
                <div key={index} className="gallery-image-item">
                  <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="gallery-image"
                    />
                  </div>
                  <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                    {img.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {(selectedSelectKey === 'page3') && (
        <div className="gellery-scroll-wrap2" ref={page3ContainerRef} style={{ top: 575 }}>
          <div className="gallery-images-list">
            {getImagesBySelectKey(selectedSelectKey).map((img, index) => {
              const multiLine = isMultiLine(img.name);
              if (index === 2) {
                return (
                  <div key={index} className="double-slot">
                    <div className="gallery-image-item">
                      <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="gallery-image"
                        />
                      </div>
                      <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                        {img.name}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={index} className="gallery-image-item">
                  <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="gallery-image"
                    />
                  </div>
                  <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                    {img.name}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
      {(selectedSelectKey === 'page4') && (
        <div className="gellery-scroll-wrap2" ref={page3ContainerRef} style={{ top: 520 }}>
          <div className="gallery-images-list page4">
            {getImagesBySelectKey(selectedSelectKey).map((img, index) => {
              const multiLine = isMultiLine(img.name);
              const isFirstTwo = index < 2;
              if (isFirstTwo) {
                const containerAlign = index === 0 ? 'align-right' : 'align-left';
                return (
                  <div key={index} className={`double-slot ${containerAlign}`}>
                    <div className="gallery-image-item">
                      <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="gallery-image"
                        />
                      </div>
                      <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                        {img.name}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={index} className="gallery-image-item">
                  <div className="gallery-image-wrapper" onClick={() => handleImageClick(img)} >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="gallery-image"
                    />
                  </div>
                  <div className={`gallery-image-caption ${multiLine ? 'multi-line' : ''} ${language === 'en' ? 'en' : ''}`}>
                    {img.name}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
      {currentImageParam && currentImageParam.beforeButtonTop && (
        <>
          <img
            src={beforeImg}
            alt="prev"
            onClick={handlePrev}
            style={{
              position: 'absolute', width: 125, height: 60,
              right: (currentImageParam.beforeButtonRight + 125), top: currentImageParam.beforeButtonTop,
              cursor: 'pointer', userSelect: 'none',
              opacity: atLeft ? 0.5 : 1,
            }}
          />
          <img
            src={nextImg}
            alt="next"
            onClick={handleNext}
            style={{
              position: 'absolute', width: 125, height: 60,
              right: currentImageParam.beforeButtonRight, top: currentImageParam.beforeButtonTop,
              cursor: 'pointer', userSelect: 'none',
              opacity: atRight ? 0.5 : 1,
            }}
          />
        </>
      )}
      {explanationMode && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 9, background: 'rgba(0,0,0,0)'
        }} onClick={(e) => e.stopPropagation()}></div>
      )}
      <div className="back-btn2" onClick={handleBackClick}></div>
      {selectList.map((ele, i) => {
        return <div key={i} className={`selectButton${i + 1}`} onClick={() => handleSelectClick(ele.selectKey)}></div>
      })}
      {showModal && <Modal image={selectedImage} onClose={handleCloseModal} language={language} />}
    </div>
  );
}

export default Detail;

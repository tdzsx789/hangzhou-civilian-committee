import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import detailBgImg from '../../assets/detailBg.jpg';
import selectImg from '../../assets/select.png';
import select1Img from '../../assets/step1.png';
import select2Img from '../../assets/step2.png';
import select3Img from '../../assets/step3.png';
import select4Img from '../../assets/step4.png';
import page2Img from '../../assets/page2.png';
import page3Img from '../../assets/page3.png';
import page4Img from '../../assets/page4.png';
import slides1Img from '../../assets/slides1.png';
import slides2Img from '../../assets/slides2.png';
import handImg from '../../assets/hand.png';
import pageSlides1Img from '../../assets/pageSlides1.png';
import pageSlides2Img from '../../assets/pageSlides2.png';
import pageSlides3Img from '../../assets/pageSlides3.png';

const selectList = [
  { name: '初步建立阶段', period: '1949-1956年', top: 442, selectKey: 'select1' },
  { name: '探索与曲折发展阶段', period: '1957-1978年', top: 597, selectKey: 'page2' },
  { name: '恢复与拓展阶段', period: '1979-2011年', top: 752, selectKey: 'page3' },
  { name: '新时代转型完善阶段', period: '2012年至今', top: 907, selectKey: 'page4' },
]

const selectParams = {
  select1: {
    left: 444, top: 101, url: select1Img, downButtonLeft: 1252, downButtonTop: 822, upButtonTop: 253, upButtonRight: 50
  },
  select2: {
    left: 444, top: 101, url: select2Img, downButtonLeft: 987, downButtonTop: 910,
  },
  select3: {
    left: 444, top: 101, url: select3Img, downButtonLeft: 1252, downButtonTop: 822,
  },
  select4: {
    left: 444, top: 101, url: select4Img, downButtonLeft: 987, downButtonTop: 972,
  },
  page2: {
    left: 444, top: 101, url: page2Img
  },
  page3: {
    left: 444, top: 101, url: page3Img
  },
  page4: {
    left: 444, top: 101, url: page4Img
  },
}

function Detail({ name, gallery, onBack, index = 'select1' }) {
  const [selectedSelectKey, setSelectedSelectKey] = useState(index);
  const [showHand, setShowHand] = useState(false);
  const slidesContainerRef = useRef(null);
  const page2Container1Ref = useRef(null);
  const page2Container2Ref = useRef(null);
  const page3ContainerRef = useRef(null);

  useEffect(() => {
    setSelectedSelectKey(index);
  }, [index]);

  // 当进入 select1、select2、page2 或 page3 时显示 hand，6秒后隐藏
  useEffect(() => {
    if (selectedSelectKey === 'select1' || selectedSelectKey === 'select2' || 
        selectedSelectKey === 'page2' || selectedSelectKey === 'page3') {
      setShowHand(true);
      const timer = setTimeout(() => {
        setShowHand(false);
      }, 6000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setShowHand(false);
    }
  }, [selectedSelectKey]);

  // 监听滚动事件，拖拽滚动时隐藏 hand
  useEffect(() => {
    const containers = [];
    
    if (selectedSelectKey === 'select1' || selectedSelectKey === 'select2') {
      if (slidesContainerRef.current) {
        containers.push(slidesContainerRef.current);
      }
    } else if (selectedSelectKey === 'page2') {
      if (page2Container1Ref.current) {
        containers.push(page2Container1Ref.current);
      }
      if (page2Container2Ref.current) {
        containers.push(page2Container2Ref.current);
      }
    } else if (selectedSelectKey === 'page3') {
      if (page3ContainerRef.current) {
        containers.push(page3ContainerRef.current);
      }
    }

    const handleScroll = () => {
      setShowHand(false);
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

  const selectedItem = selectList.find(item => item.selectKey === selectedSelectKey) || selectList[0];
  const currentImageParam = selectParams[selectedSelectKey];

  const handleSelectClick = (selectKey) => {
    setSelectedSelectKey(selectKey);
  };

  const handleDownButtonClick = () => {
    if (selectedSelectKey === 'select1') {
      setSelectedSelectKey('select2');
    } else if (selectedSelectKey === 'select2') {
      setSelectedSelectKey('select1');
    } else if (selectedSelectKey === 'select3') {
      setSelectedSelectKey('select4');
    } else if (selectedSelectKey === 'select4') {
      setSelectedSelectKey('select3');
    }
  };

  const handleBackClick = () => {
    if (selectedSelectKey === 'select3' || selectedSelectKey === 'select4') {
      setSelectedSelectKey('select1');
    } else {
      onBack();
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${detailBgImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="select-image" style={{ top: `${selectedItem.top}px` }}>
        <img src={selectImg} alt="select" />
        <div className="select-text">
          <div className="select-text-line1">{selectedItem.name}</div>
          <div className="select-text-line2">{selectedItem.period}</div>
        </div>
      </div>
      {currentImageParam && (
        <img
          src={currentImageParam.url}
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
            width: '100px',
            height: '35px',
            top: `${currentImageParam.upButtonTop}px`,
            right: `${currentImageParam.upButtonRight}px`,
          }}
        />
      )}
      {currentImageParam && currentImageParam.downButtonLeft && (
        <div
          className='downButton'
          onClick={handleDownButtonClick}
          style={{
            position: 'absolute',
            width: '70px',
            height: '70px',
            left: `${currentImageParam.downButtonLeft}px`,
            top: `${currentImageParam.downButtonTop}px`,
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none'
          }}
        />
      )}
      {(selectedSelectKey === 'select1') && (
        <div
          ref={slidesContainerRef}
          style={{
            position: 'absolute',
            left: '444px',
            top: '470px',
            width: '1420px',
            height: '316px',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="slides-container"
        >
          <img
            src={slides1Img}
            alt="slides"
            style={{
              height: '100%',
              width: 'auto'
            }}
          />
        </div>
      )}
      {(selectedSelectKey === 'select2') && (
        <div
          ref={slidesContainerRef}
          style={{
            position: 'absolute',
            left: '444px',
            top: '460px',
            width: '1420px',
            height: '386px',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="slides-container"
        >
          <img
            src={slides2Img}
            alt="slides"
            style={{
              height: '100%',
              width: 'auto'
            }}
          />
        </div>
      )}
      {(selectedSelectKey === 'page2') && (
        <>
          <div
            ref={page2Container1Ref}
            style={{
              position: 'absolute',
              left: '444px',
              top: '470px',
              width: '688px',
              height: '327px',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="slides-container"
          >
            <img
              src={pageSlides1Img}
              alt="pageSlides1"
              style={{
                height: '100%',
                width: 'auto'
              }}
            />
          </div>
          <div
            ref={page2Container2Ref}
            style={{
              position: 'absolute',
              left: '1172px',
              top: '470px',
              width: '688px',
              height: '418px',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="slides-container"
          >
            <img
              src={pageSlides2Img}
              alt="pageSlides2"
              style={{
                height: '100%',
                width: 'auto'
              }}
            />
          </div>
        </>
      )}
      {(selectedSelectKey === 'page3') && (
        <>
          <div
            ref={page3ContainerRef}
            style={{
              position: 'absolute',
              left: '444px',
              top: '600px',
              width: '688px',
              height: '403px',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="slides-container"
          >
            <img
              src={pageSlides3Img}
              alt="pageSlides1"
              style={{
                height: '100%',
                width: 'auto'
              }}
            />
          </div>
        </>
      )}
      {(selectedSelectKey === 'select1' || selectedSelectKey === 'select2' || 
        selectedSelectKey === 'page2' || selectedSelectKey === 'page3') && showHand && (
        <img
          src={handImg}
          alt="hand"
          className={selectedSelectKey === 'page3' ? 'hand-swipe-animation-page3' : 'hand-swipe-animation'}
          style={{
            position: 'absolute',
            left: selectedSelectKey === 'page3' ? '1000px' : '1400px',
            top: selectedSelectKey === 'page3' ? '820px' : '690px'
          }}
        />
      )}
      <div className="back-btn2" onClick={handleBackClick}></div>
      {selectList.map((ele, i) => {
        return <div key={i} className={`selectButton${i + 1}`} onClick={() => handleSelectClick(ele.selectKey)}></div>
      })}
    </div>
  );
}

export default Detail;
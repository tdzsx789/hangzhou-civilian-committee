import React, { useRef, useState, useEffect } from 'react';
import './index.css';
import Modal from '../Modal';
import bg1Zh from '../../assets/bg1.jpg';
import bg1En from '../../assets_english/bg1.jpg';
import button1Zh from '../../assets/button1.png';
import button1En from '../../assets_english/button1.png';
import slides1En from '../../assets_english/slides1.png';
import backZh from '../../assets/back.png';
import backEn from '../../assets_english/back.png';
import slidesNanjingEn from '../../assets_english/nanjing.png';
import slidesGcdEn from '../../assets_english/gongchandang.png';
import slideButtonZh from '../../assets/slideButton.png';
import slideButtonEn from '../../assets_english/slideButton.png';

function Detail({ name, gallery, onBack, active, language }) {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [modalData, setModalData] = useState(null);
  const [data, setData] = useState([]);

  const bg1Img = language === 'zh' ? bg1Zh : bg1En;
  const backImg = language === 'zh' ? backZh : backEn;
  const button1Img = language === 'zh' ? button1Zh : button1En;
  
  const slides1Img = language === 'zh' ? (process.env.PUBLIC_URL || '') + '/images/slides1.png' : slides1En;
  const slidesNanjingImg = language === 'zh' ? (process.env.PUBLIC_URL || '') + '/images/nanjing.png' : slidesNanjingEn;
  const slidesGcdImg = language === 'zh' ? (process.env.PUBLIC_URL || '') + '/images/gongchandang.png' : slidesGcdEn;
  
  const slideButtonImg = language === 'zh' ? slideButtonZh : slideButtonEn;

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
          setData(jsonData);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const localizedImageList = data.map((item) => ({
    ...item,
    name: item.name[language],
  }));

  const nanjingList = localizedImageList.filter((item) => item.from === 'nanjing');
  const gongchandangList = localizedImageList.filter((item) => item.from === 'gongchandang');
  const qitaList = localizedImageList.filter((item) => item.from === 'qita');

  useEffect(() => {
    if (active && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      setScrollLeft(0);
    }
  }, [active]);

  const openModal = (payload) => {
    setModalData(payload);
  };

  const closeModal = () => {
    setModalData(null);
  };

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

  const handleJumpTo7835 = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 6850;
    }
  };

  const getCaptionStyle = (text) => {
    if (!text) return {};
    let length = 0;
    for (let i = 0; i < text.length; i++) {
      if (text.charCodeAt(i) > 255) {
        length += 1;
      } else {
        length += 0.6;
      }
    }
    
    // 容器宽度 312px，字体 16px，一行大约容纳 19.5 个汉字
    // 考虑到标点符号等，取 19 作为阈值
    if (length <= 19) {
      return { textAlign: 'center', textIndent: '0' };
    } else {
      return { textAlign: 'justify', textIndent: language === 'zh' ? '2em' : '0' };
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg1Img})` }}>
      <div
        className="back-button"
        onClick={onBack}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '200px',
          height: '112px',
          backgroundImage: `url(${backImg})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      <div
        className="jump-button"
        onClick={handleJumpTo7835}
        style={{
          position: 'absolute',
          left: '1300px',
          top: '100px',
          width: '487px',
          height: '48px',
          backgroundImage: `url(${slideButtonImg})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          cursor: 'pointer',
        }}
      ></div>
      <div
        className="slides-container"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <img
          src={slides1Img}
          alt={language === 'zh' ? '历史图片1' : 'Historical Image 1'}
          className="slides-image clickable-image"
          onClick={() =>
            openModal({
              url: slides1Img,
              name: language === 'zh' ? '历史图片1' : 'Historical Image 1',
            })
          }
        />
        {qitaList.map((ele) => {
          return <div key={ele.url} className="qita-item" style={{ position: 'absolute', left: ele.left, top: ele.top }} onClick={() => openModal(ele)}></div>
        })}
        <img
          src={slidesNanjingImg}
          alt={language === 'zh' ? '历史图片2' : 'Historical Image 2'}
          className="nanjing-image clickable-image"
          onClick={() =>
            openModal({
              url: slidesNanjingImg,
              name: language === 'zh' ? '历史图片2' : 'Historical Image 2',
            })
          }
        />
        <div className="nanjing-grid">
          {nanjingList.map((item) => (
            <div className="nanjing-item" key={item.url}>
              <img
                src={item.url}
                alt={item.name}
                className="nanjing-thumb clickable-image"
                onClick={() => openModal(item)}
              />
              <div className="nanjing-caption" style={getCaptionStyle(item.name)}>{item.name}</div>
            </div>
          ))}
        </div>
        <img
          src={slidesGcdImg}
          alt={language === 'zh' ? '历史图片3' : 'Historical Image 3'}
          className="gongchandang-image clickable-image"
          onClick={() =>
            openModal({
              url: slidesGcdImg,
              name: language === 'zh' ? '历史图片3' : 'Historical Image 3',
            })
          }
        />
        <div className="gongchandang-grid">
          {(() => {
            const first = gongchandangList[0];
            const secondAndThird = gongchandangList.slice(1, 3);
            const rest = gongchandangList.slice(3);

            return (
              <>
                <div className="special-layout-column">
                  {/* 第一张图 */}
                  {first && (
                    <div className="wide-wrapper">
                      <div className="gongchandang-item" key={first.url}>
                        <img
                          src={first.url}
                          alt={first.name}
                          className="gongchandang-thumb clickable-image"
                          onClick={() => openModal(first)}
                        />
                        <div className="gongchandang-caption" style={getCaptionStyle(first.name)}>
                          {first.name}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 第二、三张图 */}
                  <div className="sub-row">
                    {secondAndThird.map((item) => (
                      <div className="gongchandang-item" key={item.url}>
                        <img
                          src={item.url}
                          alt={item.name}
                          className="gongchandang-thumb clickable-image"
                          onClick={() => openModal(item)}
                        />
                        <div className="gongchandang-caption" style={getCaptionStyle(item.name)}>
                          {item.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 其余图片 */}
                {rest.map((item) => (
                  <div className="gongchandang-item" key={item.url}>
                    <img
                      src={item.url}
                      alt={item.name}
                      className="gongchandang-thumb clickable-image"
                      onClick={() => openModal(item)}
                    />
                    <div className="gongchandang-caption" style={getCaptionStyle(item.name)}>
                      {item.name}
                    </div>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      </div>
      <button className="slide-button" style={{ backgroundImage: `url(${button1Img})` }}></button>
      {modalData && (
        <Modal image={modalData} onClose={closeModal} language={language} />
      )}
    </div>
  );
}

export default Detail;

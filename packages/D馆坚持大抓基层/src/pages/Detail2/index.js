import React, { useState, useEffect } from 'react';
import './index.css';
import page2Img from '../../assets/page2.jpg';
import button1 from '../../assets/button1.png';
import leftArrow from '../../assets/leftArrow.png';
import rightArrow from '../../assets/rightArrow.png';
import page2ImgEn from '../../assets_english/page2.jpg';
import leftArrowEn from '../../assets_english/leftArrow.png';
import rightArrowEn from '../../assets_english/rightArrow.png';

function Detail2({ name, gallery, onBack, currentIndex = 0, visible, language }) {
  const [index, setIndex] = useState(currentIndex);
  const [data, setData] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const isEn = language === 'en';
  const currentBg = isEn ? page2ImgEn : page2Img;

  useEffect(() => {
    const baseUrl = process.env.PUBLIC_URL || '';
    const dataUrl = `${baseUrl}/data.json?_=${Date.now()}`;
    fetch(dataUrl, { cache: 'no-store' })
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

  useEffect(() => {
    if (visible) {
      setIndex(0);
      setIsImageModalOpen(false);
      setModalImage(null);
    }
  }, [visible]);

  const allList = data;
  const currentItem = allList[index] || allList[0];
  const firstImage = currentItem?.images?.[0];
  const isFirst = index === 0;
  const isLast = allList.length === 0 || index === allList.length - 1;
  const titleText = isEn && currentItem?.name_en ? currentItem.name_en : currentItem?.name || '';
  const summaryText = isEn && currentItem?.summary_en ? currentItem.summary_en : currentItem?.summary || '';
  const captionText = isEn && firstImage?.name_en ? firstImage.name_en : firstImage?.name;
  const mediaUrl = firstImage?.url
    ? ((process.env.PUBLIC_URL || '') + '/' + String(firstImage.url).replace(/^\/+/, ''))
    : '';
  const safeMediaUrl = mediaUrl ? encodeURI(mediaUrl) : '';
  const isVideo = Boolean(mediaUrl) && /\.(mp4|webm|ogg)(\?.*)?$/i.test(mediaUrl);

  useEffect(() => {
    setIsImageModalOpen(false);
    setModalImage(null);
  }, [index]);

  useEffect(() => {
    if (!isImageModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsImageModalOpen(false);
        setModalImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageModalOpen]);

  const openImageModal = () => {
    if (!safeMediaUrl) return;
    setModalImage({ url: safeMediaUrl, name: captionText, type: isVideo ? 'video' : 'image' });
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImage(null);
  };

  const handlePrev = () => {
    if (!isFirst) {
      setIndex(index - 1);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      setIndex(index + 1);
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${currentBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <img className="detail-bg" src={currentBg} alt="" aria-hidden="true" />
      <div className="back-btn" onClick={onBack}></div>

      {currentItem && (
        <>
          {/* 标题 */}
          <div className="card-title">
            {titleText.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < titleText.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>

          {/* 正文 */}
          <div className={`card-summary ${isEn ? 'en' : ''}`}>
            {summaryText
              .split('\n')
              .filter((paragraph) => paragraph.trim() !== '')
              .map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
          </div>

          {/* 图片和注释 */}
          {safeMediaUrl && (
            <>
              {!isVideo ? (
                <div
                  className="card-image"
                  style={{ backgroundImage: `url("${safeMediaUrl}")` }}
                  onClick={openImageModal}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') openImageModal();
                  }}
                ></div>
              ) : (
                <video
                  className="card-media"
                  src={safeMediaUrl}
                  muted
                  playsInline
                  autoPlay
                  loop
                  onClick={openImageModal}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') openImageModal();
                  }}
                />
              )}
              {captionText && (
                <div
                  className={`card-image-caption ${isEn ? 'en' : ''}`}
                  onClick={openImageModal}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') openImageModal();
                  }}
                >
                  {captionText}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* 左切换按钮 */}
      <button
        className={`nav-button nav-button-left ${isFirst ? 'disabled' : ''}`}
        onClick={handlePrev}
        disabled={isFirst}
        style={{ backgroundImage: `url(${isEn ? leftArrowEn : leftArrow})` }}
      ></button>

      {/* 右切换按钮 */}
      <button
        className={`nav-button nav-button-right ${isLast ? 'disabled' : ''}`}
        onClick={handleNext}
        disabled={isLast}
        style={{ backgroundImage: `url(${isEn ? rightArrowEn : rightArrow})` }}
      ></button>

      {isImageModalOpen && modalImage?.url && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            {modalImage.type === 'video' ? (
              <video
                className="image-modal-video"
                src={modalImage.url}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img className="image-modal-img" src={modalImage.url} alt={modalImage.name || ''} />
            )}
            {modalImage.name && (
              <div className={`image-modal-caption ${isEn ? 'en' : ''}`}>
                {modalImage.name}
              </div>
            )}
          </div>
        </div>
      )}

      {/* <button className="slide-button" style={{ backgroundImage: `url(${button1})` }}></button> */}
    </div>
  );
}

export default Detail2;

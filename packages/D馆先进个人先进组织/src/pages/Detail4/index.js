import React, { useState, useEffect } from 'react';
import './index.css';
import leftBtn from '../../assets/left.png';
import rightBtn from '../../assets/right.png';
// import button1 from '../../assets/button1.png';

function Detail4({ onBack, childData }) {
  const images = childData?.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasSummary = childData?.summary;
  const showTextOnlyLayout = images.length === 0;
  
  // 如果有 summary，使用 Detail2 的展示形式（单张图片切换）
  // 如果没有 summary，使用多图片展示形式（每页3张）
  const imagesPerPage = hasSummary ? 1 : 3;
  const showNavigation = hasSummary ? images.length > 1 : images.length > imagesPerPage;

  // 当 childData 变化时重置索引
  useEffect(() => {
    setCurrentIndex(0);
  }, [childData]);

  if (!childData) return null;

  // 获取当前页要显示的图片
  const currentImages = hasSummary 
    ? [images[currentIndex]].filter(Boolean) // 单张图片模式
    : images.slice(currentIndex, currentIndex + imagesPerPage); // 多图片模式

  const handlePrev = () => {
    if (hasSummary) {
      // 单张图片模式：每次切换一张
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } else {
      // 多图片模式：每次切换一页
      if (currentIndex > 0) {
        setCurrentIndex(Math.max(0, currentIndex - imagesPerPage));
      }
    }
  };

  const handleNext = () => {
    if (hasSummary) {
      // 单张图片模式：每次切换一张
      if (currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      // 多图片模式：每次切换一页
      if (currentIndex + imagesPerPage < images.length) {
        setCurrentIndex(Math.min(currentIndex + imagesPerPage, images.length - imagesPerPage));
      }
    }
  };

  const isAtStart = currentIndex === 0;
  const isAtEnd = hasSummary 
    ? currentIndex === images.length - 1 
    : currentIndex + imagesPerPage >= images.length;

  return (
    <div className={`detail-page2 ${showTextOnlyLayout ? 'detail-page2--text-only' : ''}`}>
      {/* <div
        className="slide-button"
        style={{ backgroundImage: `url(${button1})` }}
        aria-label="返回首页"
      /> */}
      <div className="detail2-back-btn" onClick={onBack} />

      {/* child name and title */}
      <div className="detail2-name-title-container">
        <div className="detail2-child-name">{childData.name}</div>
        {childData.title && (
          <div className="detail2-child-title">{childData.title}</div>
        )}
      </div>

      {/* child summary */}
      {hasSummary && (
        <div className="detail2-child-summary-scroll">
          <div className="detail2-child-summary">
            {childData.summary.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index}>{paragraph.trim()}</p>
              )
            ))}
          </div>
        </div>
      )}

      {/* child images */}
      {images.length > 0 && (
        <>
          {hasSummary ? (
            // 有 summary：使用 Detail2 的展示形式（单张图片，右侧显示）
            <>
              {currentImages[0] && (() => {
                const image = currentImages[0];
                const imageUrl = (() => {
                  const publicUrl = process.env.PUBLIC_URL || '';
                  let finalUrl = '';
                  
                  if (!publicUrl || publicUrl === '.') {
                    finalUrl = image.url.startsWith('/') ? image.url.substring(1) : image.url;
                  } else {
                    finalUrl = `${publicUrl}${image.url.startsWith('/') ? image.url : '/' + image.url}`.replace(/\/+/g, '/');
                  }
                  return encodeURI(finalUrl);
                })();

                return (
                  <>
                    <div className="detail2-image-container">
                      <div 
                        className="detail2-child-image"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                      {image.name && (
                        (() => {
                          const caption = String(image.name || '').replace(/^\s*\d+\.\s*/, '');
                          return <div className="detail2-image-caption">{caption}</div>;
                        })()
                      )}
                    </div>

                    {/* navigation buttons */}
                    {showNavigation && (
                      <>
                        <div 
                          className={`detail2-nav-btn2 detail2-nav-left2 ${isAtStart ? 'disabled' : ''}`}
                          onClick={isAtStart ? undefined : handlePrev}
                          style={{ 
                            backgroundImage: `url(${leftBtn})`,
                            opacity: isAtStart ? 0.3 : 1,
                          }}
                        />
                        <div 
                          className={`detail2-nav-btn2 detail2-nav-right2 ${isAtEnd ? 'disabled' : ''}`}
                          onClick={isAtEnd ? undefined : handleNext}
                          style={{ 
                            backgroundImage: `url(${rightBtn})`,
                            opacity: isAtEnd ? 0.3 : 1,
                          }}
                        />
                      </>
                    )}
                  </>
                );
              })()}
            </>
          ) : (
            // 没有 summary：使用多图片展示形式（每页3张，下方显示）
            <>
              <div className="detail2-images-wrapper">
                <div className="detail2-images-container">
                  {currentImages.map((image, idx) => {
                    const imageUrl = (() => {
                      const publicUrl = process.env.PUBLIC_URL || '';
                      let finalUrl = '';
                      
                      if (!publicUrl || publicUrl === '.') {
                        finalUrl = image.url.startsWith('/') ? image.url.substring(1) : image.url;
                      } else {
                        finalUrl = `${publicUrl}${image.url.startsWith('/') ? image.url : '/' + image.url}`.replace(/\/+/g, '/');
                      }
                      return encodeURI(finalUrl);
                    })();

                    return (
                      <div key={idx} className="detail2-image-item">
                        <div
                          className="detail2-child-image"
                          style={{ backgroundImage: `url("${imageUrl}")` }}
                        />
                        {image.name && (
                          (() => {
                            const caption = String(image.name || '').replace(/^\s*\d+\.\s*/, '');
                            return <div className="detail2-image-caption">{caption}</div>;
                          })()
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* navigation buttons */}
              {showNavigation && (
                <>
                  <div
                    className={`detail2-nav-btn detail2-nav-left ${isAtStart ? 'disabled' : ''}`}
                    onClick={isAtStart ? undefined : handlePrev}
                    style={{
                      backgroundImage: `url(${leftBtn})`,
                      opacity: isAtStart ? 0.3 : 1,
                    }}
                  />
                  <div
                    className={`detail2-nav-btn detail2-nav-right ${isAtEnd ? 'disabled' : ''}`}
                    onClick={isAtEnd ? undefined : handleNext}
                    style={{
                      backgroundImage: `url(${rightBtn})`,
                      opacity: isAtEnd ? 0.3 : 1,
                    }}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Detail4;

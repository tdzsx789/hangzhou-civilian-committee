import React, { useState, useEffect } from 'react';
import './index.css';
import button1 from '../../assets/button1.png';
import leftBtn from '../../assets/left.png';
import rightBtn from '../../assets/right.png';

function Detail2({ onBack, childData }) {
  const images = childData?.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasImages = images.length > 0;
  const showTextOnlyLayout = !hasImages;
  const showNavigation = images.length > 1;

  // 当 childData 变化时重置索引
  useEffect(() => {
    setCurrentIndex(0);
  }, [childData]);

  // 组件挂载时强制重置（确保每次进入页面都是第一张）
  useEffect(() => {
    setCurrentIndex(0);
  }, []);

  if (!childData) return null;

  const currentImage = images[currentIndex] || null;
  // 使用 process.env.PUBLIC_URL 来构建正确的路径（支持相对路径部署）
  // 当 homepage: "." 时，process.env.PUBLIC_URL 在构建时会被替换为 "."
  const imageUrl = currentImage ? (() => {
    const publicUrl = process.env.PUBLIC_URL || '';
    let finalUrl = '';
    
    // 如果 PUBLIC_URL 是 "." 或空字符串，需要处理绝对路径
    if (!publicUrl || publicUrl === '.') {
      // 如果路径以 / 开头，去掉开头的 / 使其成为相对路径
      // 这样可以避免在 file:// 协议下被解析为 file:///zuzhiImages/...
      finalUrl = currentImage.url.startsWith('/') ? currentImage.url.substring(1) : currentImage.url;
    } else {
      // 否则添加 PUBLIC_URL 前缀
      // 确保路径格式正确，去掉重复的斜杠
      finalUrl = `${publicUrl}${currentImage.url.startsWith('/') ? currentImage.url : '/' + currentImage.url}`.replace(/\/+/g, '/');
    }
    // 对 URL 进行编码，确保中文字符在 CSS url() 中正确显示
    return encodeURI(finalUrl);
  })() : null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex === images.length - 1;

  return (
    <div className={`detail-page2 ${showTextOnlyLayout ? 'detail-page2--text-only' : ''}`}>
      {/* <div
        className="slide-button"
        style={{ backgroundImage: `url(${button1})` }}
        aria-label="返回首页"
      /> */}
      <div className="detail2-back-btn" onClick={onBack} />
      
      {showTextOnlyLayout ? (
        <div className="detail2-text-only-layout">
          <div className="detail2-text-only-inner">
            <div className="detail2-name-title-container detail2-name-title-container--center">
              <div className="detail2-child-name">{childData.address} {childData.people}</div>
              <div className="detail2-child-title">{childData.title}</div>
            </div>

            {childData.summary && (
              <div className="detail2-child-summary-scroll detail2-child-summary-scroll--centered">
                <div className="detail2-child-summary">
                  {childData.summary.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index}>{paragraph.trim()}</p>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* child name */}
          <div className="detail2-name-title-container">
            <div className="detail2-child-name">{childData.address} {childData.people}</div>
            <div className="detail2-child-title">{childData.title}</div>
          </div>
          
          {/* child summary */}
          {childData.summary && (
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
          
          {/* child image */}
          {imageUrl && (
            <>
              <div className="detail2-image-container">
                <div
                  className="detail2-child-image"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
                {currentImage.name && (
                  <div className="detail2-image-caption">{currentImage.name}</div>
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
          )}
        </>
      )}
    </div>
  );
}

export default Detail2;

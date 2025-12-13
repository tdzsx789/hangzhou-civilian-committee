import React, { useState, useEffect } from 'react';
import './index.css';
import leftBtn from '../../assets/left.png';
import rightBtn from '../../assets/right.png';
// import button1 from '../../assets/button1.png';

function Detail4({ onBack, childData }) {
  const images = childData?.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const imagesPerPage = 3;
  const showNavigation = images.length > imagesPerPage;

  // 当 childData 变化时重置索引
  useEffect(() => {
    setCurrentIndex(0);
  }, [childData]);

  if (!childData) return null;

  // 获取当前页要显示的图片
  const currentImages = images.slice(currentIndex, currentIndex + imagesPerPage);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(Math.max(0, currentIndex - imagesPerPage));
    }
  };

  const handleNext = () => {
    if (currentIndex + imagesPerPage < images.length) {
      setCurrentIndex(Math.min(currentIndex + imagesPerPage, images.length - imagesPerPage));
    }
  };

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex + imagesPerPage >= images.length;

  return (
    <div className="detail-page2">
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

      {/* child images */}
      {images.length > 0 && (
        <>
          <div className="detail2-images-wrapper">
            <div className="detail2-images-container">
              {currentImages.map((image, idx) => {
                // 使用 process.env.PUBLIC_URL 来构建正确的路径（支持相对路径部署）
                // 当 homepage: "." 时，process.env.PUBLIC_URL 在构建时会被替换为 "."
                const imageUrl = (() => {
                  const publicUrl = process.env.PUBLIC_URL || '';
                  let finalUrl = '';
                  
                  // 如果 PUBLIC_URL 是 "." 或空字符串，需要处理绝对路径
                  if (!publicUrl || publicUrl === '.') {
                    // 如果路径以 / 开头，去掉开头的 / 使其成为相对路径
                    // 这样可以避免在 file:// 协议下被解析为 file:///zuzhiImages/...
                    finalUrl = image.url.startsWith('/') ? image.url.substring(1) : image.url;
                  } else {
                    // 否则添加 PUBLIC_URL 前缀
                    // 确保路径格式正确，去掉重复的斜杠
                    finalUrl = `${publicUrl}${image.url.startsWith('/') ? image.url : '/' + image.url}`.replace(/\/+/g, '/');
                  }
                  // 对 URL 进行编码，确保中文字符在 CSS url() 中正确显示
                  return encodeURI(finalUrl);
                })();

                return (
                  <div key={idx} className="detail2-image-item">
                    <div
                      className="detail2-child-image"
                      style={{ backgroundImage: `url("${imageUrl}")` }}
                    />
                    {image.name && (
                      <div className="detail2-image-caption">{image.name}</div>
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
    </div>
  );
}

export default Detail4;
import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import bg2_1 from '../../assets/bg2_1.jpg';
import backButton from '../../assets/backButton.png';
import * as mammoth from 'mammoth';
const list = [
  { name: '一、第一至第四批全国社区治理和服务创新实验区名单及主题。', file: 'result1.docx' },
  { name: '二、中国社区治理十大创新成果（2013-2015）', file: 'result2.docx' },
  { name: '三、社区建设、居民自治、社区议事协商、网格化管理、城乡发展一体化、“三社联动”相关图表', file: 'result3.docx' }
]

const docxFiles = {
  'result1.docx': process.env.PUBLIC_URL + '/images/result1.docx',
  'result2.docx': process.env.PUBLIC_URL + '/images/result2.docx',
  'result3.docx': process.env.PUBLIC_URL + '/images/result3.docx'
};

function Detail2({ onBack, onOpenDetail2_2, isActive = false }) {
  const [docxContent, setDocxContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const scrollContainerRef = useRef(null);
  const listScrollContainerRef = useRef(null);

  // 当页面激活时重置滚动位置和选中状态
  useEffect(() => {
    if (isActive) {
      if (listScrollContainerRef.current) {
        listScrollContainerRef.current.scrollTop = 0;
      }
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      setSelectedItem(null);
      setDocxContent('');
    }
  }, [isActive]);

  const loadDocx = async (fileName) => {
    setLoading(true);
    setDocxContent('');
    try {
      // 使用映射对象加载文件
      const docxFile = docxFiles[fileName];
      if (!docxFile) {
        throw new Error(`File ${fileName} not found`);
      }
      const response = await fetch(docxFile);
      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setDocxContent(result.value);
      setLoading(false);
    } catch (error) {
      console.error('Error loading docx file:', error);
      setLoading(false);
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    loadDocx(item.file);
  };

  const handleCardKeyDown = (event, item) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(item);
    }
  };

  const handleBackToDetail1 = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleBackButton = () => {
    setSelectedItem(null);
    setDocxContent('');
  };

  const handleKeyDown = (callback) => (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg2_1})` }}>
      {!selectedItem ? (
        <div
          ref={listScrollContainerRef}
          className="scroll-container-doc"
        >
          {list.map((item, index) => (
            <div
              key={index}
              className="card-item"
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(item)}
              onKeyDown={(e) => handleCardKeyDown(e, item)}
            >
              <div className="card-content">{item.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div ref={scrollContainerRef} className="docx-scroll-container">
            {loading ? (
              <div className="loading-text">加载中...</div>
            ) : (
              <div
                className="docx-content"
                dangerouslySetInnerHTML={{ __html: docxContent }}
              />
            )}
          </div>
          <div
            className="back-button"
            role="button"
            tabIndex={0}
            onClick={handleBackButton}
            onKeyDown={handleKeyDown(handleBackButton)}
          >
            <img src={backButton} alt="返回" />
          </div>
        </>
      )}
      <div
        className="link2"
        role="button"
        tabIndex={0}
        onClick={handleBackToDetail1}
        onKeyDown={handleKeyDown(handleBackToDetail1)}
      ></div>
    </div>
  );
}

export default Detail2;
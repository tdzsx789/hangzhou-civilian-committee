import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import bg2_1 from '../../assets/bg2_1.jpg';
import backButton from '../../assets/backButton.png';
import * as mammoth from 'mammoth';
import result1Docx from '../../assets/result1.docx';
import result2Docx from '../../assets/result2.docx';

const list = [
  { name: '一、优秀社区工作法100例', file: 'result1.docx' },
  { name: '二、多方参与基层治理、"三治融合"、基层赋能减负、"五社联动"、社会组织相关图表', file: 'result2.docx' },
]

const docxFiles = {
  'result1.docx': result1Docx,
  'result2.docx': result2Docx
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
            className="back-button-doc"
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
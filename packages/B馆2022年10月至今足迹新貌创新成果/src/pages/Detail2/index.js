import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import bg2_1 from '../../assets/bg2_1.jpg';
import * as mammoth from 'mammoth';

function Detail2({ onBack, onOpenDetail2_2, isActive = false }) {
  const [docxContent, setDocxContent] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  // 当页面激活时重置滚动位置
  useEffect(() => {
    if (isActive && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isActive]);

  useEffect(() => {
    const loadDocx = async () => {
      try {
        // 使用 require 动态加载文件
        const result1Docx = require('../../assets/result3.docx');
        const response = await fetch(result1Docx);
        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setDocxContent(result.value);
        setLoading(false);
      } catch (error) {
        console.error('Error loading docx file:', error);
        setLoading(false);
      }
    };

    loadDocx();
  }, []);

  const handleBackToDetail1 = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleKeyDown = (callback) => (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg2_1})` }}>
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
        className="link2"
        role="button"
        tabIndex={0}
        onClick={handleBackToDetail1}
        onKeyDown={handleKeyDown(handleBackToDetail1)}
      ></div>
      {/* <div
        className="before2"
        role="button"
        tabIndex={0}
        onClick={handleEnterDetail2_2}
        onKeyDown={handleKeyDown(handleEnterDetail2_2)}
      ></div>
      <div
        className="after2"
        role="button"
        tabIndex={0}
        onClick={handleEnterDetail2_2}
        onKeyDown={handleKeyDown(handleEnterDetail2_2)}
      ></div> */}
    </div>
  );
}

export default Detail2;
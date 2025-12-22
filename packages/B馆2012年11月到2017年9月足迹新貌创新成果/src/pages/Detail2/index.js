import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import bg2_1 from '../../assets/bg2_1.jpg';
import backButton from '../../assets/backButton.png';
import buttonBg from '../../assets/buttonBg.png';
import * as mammoth from 'mammoth';
import result1Docx from '../../assets/result1.docx';
import result2Docx from '../../assets/result2.docx';
import result3Docx from '../../assets/result3.docx';
import Modal from '../Modal';

const list = [
  { name: '一、第一至第三批全国社区治理和服务创新实验区名单及主题。', file: 'result1.docx' },
  { name: '二、中国社区治理十大创新成果（2013-2015）', file: 'result2.docx' },
  { name: '三、社区建设、居民自治、社区议事协商、网格化管理、城乡发展一体化、“三社联动”相关图表', file: 'result3.docx' }
]

const docxFiles = {
  'result1.docx': result1Docx,
  'result2.docx': result2Docx,
  'result3.docx': result3Docx
};

const processResult3Html = (html, otherItems = [], buttonBgImage) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;
  const resultContainer = document.createElement('div');
  
  const children = Array.from(body.childNodes);
  let currentGrid = null;

  // Prepend buttons if any
  if (otherItems && otherItems.length > 0) {
    currentGrid = document.createElement('div');
    currentGrid.className = 'result3-grid';
    resultContainer.appendChild(currentGrid);

    otherItems.forEach(item => {
        const wrapper = document.createElement('div');
        wrapper.className = 'result3-item';

        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'result3-button';
        buttonDiv.setAttribute('data-file', item.file);
        if (buttonBgImage) {
            buttonDiv.style.backgroundImage = `url('${buttonBgImage}')`;
        }
        buttonDiv.textContent = item.name;
        
        wrapper.appendChild(buttonDiv);
        currentGrid.appendChild(wrapper);
    });
  }
  
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    let img = null;
    
    // Check if node is an image or contains an image
    if (node.nodeName === 'IMG') {
      img = node;
    } else if (node.nodeType === Node.ELEMENT_NODE && (node.nodeName === 'P' || node.nodeName === 'DIV')) {
      img = node.querySelector('img');
    }
    
    if (img) {
      if (!currentGrid) {
        currentGrid = document.createElement('div');
        currentGrid.className = 'result3-grid';
        resultContainer.appendChild(currentGrid);
      }
      
      const wrapper = document.createElement('div');
      wrapper.className = 'result3-item';
      
      // Create background image div instead of img tag
      const imgDiv = document.createElement('div');
      imgDiv.className = 'result3-img-div';
      imgDiv.style.backgroundImage = `url('${img.src}')`;
      wrapper.appendChild(imgDiv);
      
      // Check next node for caption
      let captionText = '';
      if (i + 1 < children.length) {
        const nextNode = children[i + 1];
        // Ensure next node is not an image
        let nextHasImg = false;
        if (nextNode.nodeName === 'IMG') nextHasImg = true;
        else if (nextNode.nodeType === Node.ELEMENT_NODE) nextHasImg = !!nextNode.querySelector('img');
        
        if (!nextHasImg && nextNode.textContent && nextNode.textContent.trim()) {
           captionText = nextNode.textContent.trim();
           i++; // Consume next node
        }
      }
      
      if (captionText) {
        const captionDiv = document.createElement('div');
        captionDiv.className = 'result3-caption';
        captionDiv.textContent = captionText;
        
        // Check text length to determine alignment
        // Width 380px, font-size 18px => approx 21 chars per line
        if (captionText.length > 21) {
          captionDiv.classList.add('multi-line');
        } else {
          captionDiv.classList.add('single-line');
        }
        
        wrapper.appendChild(captionDiv);
      }
      
      currentGrid.appendChild(wrapper);
    } else {
      // Not an image, append as is
      resultContainer.appendChild(node.cloneNode(true));
      currentGrid = null; // Break grid
    }
  }
  
  return resultContainer.innerHTML;
};

function Detail2({ onBack, onOpenDetail2_2, isActive = false }) {
  const [docxContent, setDocxContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalData, setModalData] = useState(null);
  const scrollContainerRef = useRef(null);
  const listScrollContainerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      if (listScrollContainerRef.current) {
        listScrollContainerRef.current.scrollTop = 0;
      }
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      // Default to result3.docx (index 2)
      const defaultItem = list[2];
      setSelectedItem(defaultItem);
      loadDocx(defaultItem.file);
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
      
      let htmlContent = result.value;
      // Special handling for result3.docx
      if (fileName === 'result3.docx') {
        const otherItems = list.filter(item => item.file !== 'result3.docx');
        htmlContent = processResult3Html(htmlContent, otherItems, buttonBg);
      }
      
      setDocxContent(htmlContent);
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
    // Return to result3.docx (main view)
    const defaultItem = list[2];
    setSelectedItem(defaultItem);
    loadDocx(defaultItem.file);
  };

  const handleViewMore = () => {
    setSelectedItem(null);
    if (listScrollContainerRef.current) {
      listScrollContainerRef.current.scrollTop = 0;
    }
  };

  const handleKeyDown = (callback) => (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  const handleDocxContentClick = (e) => {
    // Handle button clicks
    const button = e.target.closest('.result3-button');
    if (button) {
      const fileName = button.getAttribute('data-file');
      if (fileName) {
        const item = list.find(l => l.file === fileName);
        if (item) {
          handleCardClick(item);
        }
      }
      return;
    };

    // Handle image clicks in result3
    const imgDiv = e.target.closest('.result3-img-div');
    if (imgDiv) {
      const style = imgDiv.style.backgroundImage;
      if (style) {
        // Extract URL from 'url("...")' or 'url(...)'
        const match = style.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) {
          const url = match[1];
          // Try to find caption
          let name = '';
          const wrapper = imgDiv.closest('.result3-item');
          if (wrapper) {
            const captionDiv = wrapper.querySelector('.result3-caption');
            if (captionDiv) {
              name = captionDiv.textContent;
            }
          }
          setModalData({ url, name });
        }
      }
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
                onClick={handleDocxContentClick}
              />
            )}
          </div>
          {selectedItem && selectedItem.file !== 'result3.docx' && (
            <div
              className="back-button"
              role="button"
              tabIndex={0}
              onClick={handleBackButton}
              onKeyDown={handleKeyDown(handleBackButton)}
            >
              <img src={backButton} alt="返回" />
            </div>
          )}
        </>
      )}
      <div
        className="link2"
        role="button"
        tabIndex={0}
        onClick={handleBackToDetail1}
        onKeyDown={handleKeyDown(handleBackToDetail1)}
      ></div>
      <Modal
        image={modalData}
        onClose={() => setModalData(null)}
      />
    </div>
  );
}

export default Detail2;

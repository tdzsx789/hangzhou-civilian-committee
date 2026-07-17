import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import bg2_1 from '../../assets/bg2_1.jpg';
import backButton from '../../assets/backButton.png';
import buttonBg from '../../assets/buttonBg.png';
import bg2_1En from '../../assets_english/bg2_1.jpg';
import backButtonEn from '../../assets_english/backButton.png';
import buttonBgEn from '../../assets_english/buttonBg.png';
import * as mammoth from 'mammoth';
import Modal from '../Modal';

const list = [
  { name: '一、优秀社区工作法100例', file: 'result1.docx' },
  { name: '二、多方参与基层治理、“三治融合”、基层赋能减负、“五社联动”、社会组织相关图表', file: 'result2.docx' },
  { name: '三、第四批全国社区治理和服务创新实验区（31个）', file: 'result3.docx' },
]

const docxFiles = {
  'result1.docx': process.env.PUBLIC_URL + '/images/result1.docx',
  'result2.docx': process.env.PUBLIC_URL + '/images/result2.docx',
  'result3.docx': process.env.PUBLIC_URL + '/images/result3.docx'
};

const processResult2Html = (html, otherItems = [], buttonBgImage) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;
  const resultContainer = document.createElement('div');
  
  const children = Array.from(body.childNodes);
  let currentGrid = null;

  // Prepend buttons if any
  if (otherItems && otherItems.length > 0) {
    currentGrid = document.createElement('div');
    currentGrid.className = 'result2-grid';
    resultContainer.appendChild(currentGrid);

    otherItems.forEach(item => {
        const wrapper = document.createElement('div');
        wrapper.className = 'result2-item';

        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'result2-button';
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
        currentGrid.className = 'result2-grid';
        resultContainer.appendChild(currentGrid);
      }
      
      const wrapper = document.createElement('div');
      wrapper.className = 'result2-item';
      
      // Create background image div instead of img tag
      const imgDiv = document.createElement('div');
      imgDiv.className = 'result2-img-div';
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
        captionDiv.className = 'result2-caption';
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

function Detail2({ onBack, onOpenDetail2_2, isActive = false, language = 'zh' }) {
  const [allDocxContent, setAllDocxContent] = useState({});
  const [rawDocxContent, setRawDocxContent] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalData, setModalData] = useState(null);
  const scrollContainerRef = useRef(null);
  const listScrollContainerRef = useRef(null);
  const currentBg = language === 'en' ? bg2_1En : bg2_1;
  const currentBackButton = language === 'en' ? backButtonEn : backButton;

  // 预加载所有文件
  useEffect(() => {
    const loadAllDocs = async () => {
      const contentMap = {};
      const promises = Object.entries(docxFiles).map(async ([fileName, fileUrl]) => {
        try {
          const response = await fetch(fileUrl);
          const arrayBuffer = await response.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          contentMap[fileName] = result.value;
        } catch (error) {
          console.error(`Error loading ${fileName}:`, error);
        }
      });

      await Promise.all(promises);
      setRawDocxContent(contentMap);
    };

    loadAllDocs();
  }, []);

  useEffect(() => {
    const currentButtonBg = language === 'en' ? buttonBgEn : buttonBg;
    const newContent = {};
    Object.entries(rawDocxContent).forEach(([fileName, html]) => {
      if (fileName === 'result2.docx') {
        const otherItems = list.filter(item => item.file !== 'result2.docx');
        newContent[fileName] = processResult2Html(html, otherItems, currentButtonBg);
      } else {
        newContent[fileName] = html;
      }
    });
    setAllDocxContent(newContent);
  }, [rawDocxContent, language]);

  // 当页面激活时，默认展示第3项内容（list[2]）；若不存在则展示最后一项
  useEffect(() => {
    if (isActive) {
      if (listScrollContainerRef.current) {
        listScrollContainerRef.current.scrollTop = 0;
      }
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      const defaultItem = list[1];
      setSelectedItem(defaultItem);
    }
  }, [isActive]);

  const handleCardClick = (item) => {
    setSelectedItem(item);
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
    // Return to result2.docx
    const defaultItem = list[1];
    setSelectedItem(defaultItem);
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
    const button = e.target.closest('.result2-button');
    if (button) {
      const fileName = button.getAttribute('data-file');
      if (fileName) {
        const item = list.find(l => l.file === fileName);
        if (item) {
          handleCardClick(item);
        }
      }
      return;
    }

    // Handle image clicks in result2
    const imgDiv = e.target.closest('.result2-img-div');
    if (imgDiv) {
      const style = imgDiv.style.backgroundImage;
      if (style) {
        // Extract URL from 'url("...")' or 'url(...)'
        const match = style.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) {
          const url = match[1];
          // Try to find caption
          let name = '';
          const wrapper = imgDiv.closest('.result2-item');
          if (wrapper) {
            const captionDiv = wrapper.querySelector('.result2-caption');
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
    <div className="detail-page" style={{ backgroundImage: `url(${currentBg})` }}>
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
          {/* {selectedItem && selectedItem === list[1] && (
            <div
              className="view-more-button"
              role="button"
              tabIndex={0}
              onClick={handleViewMore}
              onKeyDown={handleKeyDown(handleViewMore)}
            >
              查看更多
            </div>
          )} */}
          <div ref={scrollContainerRef} className="docx-scroll-container">
            <div
              className="docx-content"
              dangerouslySetInnerHTML={{ __html: allDocxContent[selectedItem.file] || '' }}
              onClick={handleDocxContentClick}
            />
          </div>
          {selectedItem && selectedItem !== list[1] && (
            <div
              className="back-button"
              role="button"
              tabIndex={0}
              onClick={handleBackButton}
              onKeyDown={handleKeyDown(handleBackButton)}
            >
              <img src={currentBackButton} alt="返回" />
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

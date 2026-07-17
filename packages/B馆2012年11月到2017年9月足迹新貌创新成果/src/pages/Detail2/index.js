import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import bg2_1 from '../../assets/bg2_1.jpg';
import backButton from '../../assets/backButton.png';
import buttonBg from '../../assets/buttonBg.png';
import bg2_1_en from '../../assets_english/bg2_1.jpg';
import backButton_en from '../../assets_english/backButton.png';
import buttonBg_en from '../../assets_english/buttonBg.png';
import * as mammoth from 'mammoth';
import Modal from '../Modal';

const listData = [
  { 
    name: '一、第一至第三批全国社区治理和服务创新实验区名单及主题。', 
    name_en: 'I. List and Themes of the First to Third Batches of National Community Governance and Service Innovation Experimental Zones',
    file: 'result1.docx' 
  },
  { 
    name: '二、中国社区治理十大创新成果（2013-2015）', 
    name_en: 'II. Top Ten Innovation Achievements in Community Governance in China (2013-2015)',
    file: 'result2.docx' 
  },
  { 
    name: '三、社区建设、居民自治、社区议事协商、网格化管理、城乡发展一体化、“三社联动”相关图表', 
    name_en: 'III. Charts related to Community Construction, Resident Autonomy, Community Consultation, Grid Management, Urban-Rural Integrated Development, and "Three-Community Linkage"',
    file: 'result3.docx' 
  }
];

const publicUrl = process.env.PUBLIC_URL || '';
const docxFiles = {
  'result1.docx': `${publicUrl}/images/result1.docx`,
  'result2.docx': `${publicUrl}/images/result2.docx`,
  'result3.docx': `${publicUrl}/images/result3.docx`
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

function Detail2({ onBack, onOpenDetail2_2, isActive = false, language = 'zh' }) {
  const [allDocxContent, setAllDocxContent] = useState({});
  const [rawDocxContent, setRawDocxContent] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalData, setModalData] = useState(null);
  const scrollContainerRef = useRef(null);
  const listScrollContainerRef = useRef(null);

  const list = listData;
  const currentBg = language === 'en' ? bg2_1_en : bg2_1;
  const currentBackButton = language === 'en' ? backButton_en : backButton;
  const currentButtonBg = language === 'en' ? buttonBg_en : buttonBg;

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

  // Process raw content when language or raw content changes
  useEffect(() => {
    if (Object.keys(rawDocxContent).length === 0) return;

    const processedMap = { ...rawDocxContent };
    
    // Process result3.docx specifically
    if (processedMap['result3.docx']) {
        const otherItems = list.filter(item => item.file !== 'result3.docx');
        processedMap['result3.docx'] = processResult3Html(processedMap['result3.docx'], otherItems, currentButtonBg);
    }

    setAllDocxContent(processedMap);
  }, [rawDocxContent, language, list, currentButtonBg]);

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
    // Return to result3.docx (main view)
    const defaultItem = list[2];
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
              <div className="card-content">{language === 'en' ? (item.name_en || item.name) : item.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div ref={scrollContainerRef} className="docx-scroll-container">
            <div
              className="docx-content"
              dangerouslySetInnerHTML={{ __html: allDocxContent[selectedItem.file] || '' }}
              onClick={handleDocxContentClick}
            />
          </div>
          {selectedItem && selectedItem.file !== 'result3.docx' && (
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

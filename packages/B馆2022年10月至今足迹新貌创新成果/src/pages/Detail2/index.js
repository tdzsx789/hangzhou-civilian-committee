import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import bg2_1 from '../../assets/bg2_1.jpg';
import bg2_1En from '../../assets_english/bg2_1.jpg';
import backButton from '../../assets/backButton.png';
import backButtonEn from '../../assets_english/backButton.png';
import buttonBg from '../../assets/buttonBg.png';
import Modal from '../Modal';
import * as mammoth from 'mammoth';

const list = [
  { name: '成果展示一', file: 'result1.docx' },
  { name: '成果展示二', file: 'result2.docx' },
  { name: '成果展示三', file: 'result3.docx' },
  // { name: '成果展示四', file: 'result4.docx' }
];

const docxFiles = {
  'result1.docx': process.env.PUBLIC_URL + '/images/result1.docx',
  'result2.docx': process.env.PUBLIC_URL + '/images/result2.docx',
  'result3.docx': process.env.PUBLIC_URL + '/images/result3.docx',
  // 'result4.docx': process.env.PUBLIC_URL + '/images/result4.docx'
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
          
          if (fileName === 'result3.docx') {
              const otherItems = list.filter(item => item.file !== 'result3.docx');
              const processedHtml = processResult3Html(result.value, otherItems, buttonBg);
              contentMap[fileName] = processedHtml;
          } else {
              contentMap[fileName] = result.value;
          }
        } catch (error) {
          console.error(`Error loading ${fileName}:`, error);
        }
      });

      await Promise.all(promises);
      setAllDocxContent(contentMap);
    };

    loadAllDocs();
  }, []);

  useEffect(() => {
    if (isActive) {
      if (listScrollContainerRef.current) {
        listScrollContainerRef.current.scrollTop = 0;
      }
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
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
    // If we are not on result3.docx, go back to result3.docx (the default view)
    if (selectedItem && selectedItem.file !== 'result3.docx') {
        const defaultItem = list[2];
        setSelectedItem(defaultItem);
    } else {
        setSelectedItem(null);
    }
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
        const item = list.find(i => i.file === fileName);
        if (item) {
            handleCardClick(item);
        }
        return;
    }
    
    // Handle image clicks for modal
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
              <div className="card-content">{item.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* {selectedItem && selectedItem.file === 'result3.docx' && (
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

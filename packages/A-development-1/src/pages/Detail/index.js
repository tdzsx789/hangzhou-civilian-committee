import React, { useState, useEffect } from 'react';
import './index.css';
import detailBgImg from '../../assets/detailBg.jpg';
import selectImg from '../../assets/select.png';
import select1Img from '../../assets/step1.png';
import select2Img from '../../assets/step2.png';
import select3Img from '../../assets/step3.png';
import select4Img from '../../assets/step4.png';
import page2Img from '../../assets/page2.png';
import page3Img from '../../assets/page3.png';
import page4Img from '../../assets/page4.png';

const selectList = [
  { name: '初步建立阶段', period: '1949-1956年', top: 442, selectKey: 'select1' },
  { name: '探索与曲折发展阶段', period: '1957-1978年', top: 597, selectKey: 'page2' },
  { name: '恢复与拓展阶段', period: '1979-2011年', top: 752, selectKey: 'page3' },
  { name: '新时代转型完善阶段', period: '2012年至今', top: 907, selectKey: 'page4' },
]

const selectParams = {
  select1: {
    left: 444, top: 101, url: select1Img, downButtonLeft: 1252, downButtonTop: 822, upButtonTop: 253, upButtonRight: 50
  },
  select2: {
    left: 444, top: 101, url: select2Img, downButtonLeft: 987, downButtonTop: 910,
  },
  select3: {
    left: 444, top: 101, url: select3Img, downButtonLeft: 1252, downButtonTop: 822,
  },
  select4: {
    left: 444, top: 101, url: select4Img, downButtonLeft: 987, downButtonTop: 972,
  },
  page2: {
    left: 444, top: 101, url: page2Img
  },
  page3: {
    left: 444, top: 101, url: page3Img
  },
  page4: {
    left: 444, top: 101, url: page4Img
  },
}

function Detail({ name, gallery, onBack, index = 'select1' }) {
  const [selectedSelectKey, setSelectedSelectKey] = useState(index);

  useEffect(() => {
    setSelectedSelectKey(index);
  }, [index]);

  const selectedItem = selectList.find(item => item.selectKey === selectedSelectKey) || selectList[0];
  const currentImageParam = selectParams[selectedSelectKey];

  const handleSelectClick = (selectKey) => {
    setSelectedSelectKey(selectKey);
  };

  const handleDownButtonClick = () => {
    if (selectedSelectKey === 'select1') {
      setSelectedSelectKey('select2');
    } else if (selectedSelectKey === 'select2') {
      setSelectedSelectKey('select1');
    } else if (selectedSelectKey === 'select3') {
      setSelectedSelectKey('select4');
    } else if (selectedSelectKey === 'select4') {
      setSelectedSelectKey('select3');
    }
  };

  const handleBackClick = () => {
    if (selectedSelectKey === 'select3' || selectedSelectKey === 'select4') {
      setSelectedSelectKey('select1');
    } else {
      onBack();
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${detailBgImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="select-image" style={{ top: `${selectedItem.top}px` }}>
        <img src={selectImg} alt="select" />
        <div className="select-text">
          <div className="select-text-line1">{selectedItem.name}</div>
          <div className="select-text-line2">{selectedItem.period}</div>
        </div>
      </div>
      {currentImageParam && (
        <img
          src={currentImageParam.url}
          alt={'currentImageParam'}
          style={{
            position: 'absolute',
            left: `${currentImageParam.left}px`,
            top: `${currentImageParam.top}px`,
            pointerEvents: 'none'
          }}
        />
      )}
      {currentImageParam && currentImageParam.upButtonTop && (
        <div
          className="upButton"
          onClick={() => handleSelectClick('select3')}
          style={{
            position: 'absolute',
            width: '100px',
            height: '35px',
            top: `${currentImageParam.upButtonTop}px`,
            right: `${currentImageParam.upButtonRight}px`,
          }}
        />
      )}
      {currentImageParam && currentImageParam.downButtonLeft && (
        <div
          className='downButton'
          onClick={handleDownButtonClick}
          style={{
            position: 'absolute',
            width: '70px',
            height: '70px',
            left: `${currentImageParam.downButtonLeft}px`,
            top: `${currentImageParam.downButtonTop}px`,
            cursor: 'pointer',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none'
          }}
        />
      )}
      <div className="back-btn2" onClick={handleBackClick}></div>
      {selectList.map((ele, i) => {
        return <div key={i} className={`selectButton${i + 1}`} onClick={() => handleSelectClick(ele.selectKey)}></div>
      })}
    </div>
  );
}

export default Detail;
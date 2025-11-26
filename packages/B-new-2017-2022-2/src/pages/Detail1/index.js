import React from 'react';
import './index.css';
import bg1_1 from '../../assets/bg1_1.jpg';

const list = [1, 2, 3, 4, 5, 6, 7, 8];
function Detail({ name, gallery, onBack, onOpenDetail2, onOpenDetail1_2 }) {
  const handleEnterDetail2 = () => {
    if (onOpenDetail2) {
      onOpenDetail2();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEnterDetail2();
    }
  };
  const handleEnterDetail1_2 = () => {
    if (onOpenDetail2) {
      onOpenDetail1_2();
    }
  };

  const handleKeyDown1_2 = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleEnterDetail1_2();
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg1_1})` }}>
      {list.map((item, index) => {
        return <div key={index} className="page2-button" role="button" tabIndex={0} onClick={handleEnterDetail1_2} onKeyDown={handleKeyDown1_2}
          style={{ top: 530 + index * 152 + 'px' }}
        ></div>
      })}
      <div
        className="link1"
        role="button"
        tabIndex={0}
        onClick={handleEnterDetail2}
        onKeyDown={handleKeyDown(handleKeyDown)}
      ></div>
    </div>
  );
}

export default Detail;
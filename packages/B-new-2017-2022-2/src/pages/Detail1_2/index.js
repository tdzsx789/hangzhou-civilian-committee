import React from 'react';
import './index.css';
import bg1_2 from '../../assets/bg1_2.jpg';

function Detail({ name, gallery, onBack, onOpenDetail2 }) {
  const handleEnterDetail2 = () => {
    if (onOpenDetail2) {
      onOpenDetail2();
    }
  };

  const handleKeyDown = (callback) => (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg1_2})` }}>
      <div
        className="back-btn1_2"
        role="button"
        tabIndex={0}
        onClick={onBack}
        onKeyDown={handleKeyDown(onBack)}
      ></div>
      <div
        className="link1_2"
        role="button"
        tabIndex={0}
        onClick={handleEnterDetail2}
        onKeyDown={handleKeyDown(handleEnterDetail2)}
      ></div>
    </div>
  );
}

export default Detail;
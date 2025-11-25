import React from 'react';
import './index.css';
import bg2 from '../../assets/bg2.jpg';

function Detail({ name, gallery, onBack, onOpenDetail2 }) {
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

  return (
    <div className="detail-page" style={{ backgroundImage: `url(${bg2})` }}>
      <div className="page2-button1" role="button" tabIndex={0} onClick={handleEnterDetail2} onKeyDown={handleKeyDown}></div>
      <div className="page2-button2" role="button" tabIndex={0} onClick={handleEnterDetail2} onKeyDown={handleKeyDown}></div>
      <div className="page2-button3" role="button" tabIndex={0} onClick={handleEnterDetail2} onKeyDown={handleKeyDown}></div>
      <div className="page2-button4" role="button" tabIndex={0} onClick={handleEnterDetail2} onKeyDown={handleKeyDown}></div>
    </div>
  );
}

export default Detail;
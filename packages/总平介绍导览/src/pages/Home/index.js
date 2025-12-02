import React from 'react';
import './index.css';
import coverImg from '../../assets/cover.jpg';

function Home({ onLearnMore, className }) {
  return (
    <div className={`home-page ${className || ''}`} style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="learn-more-btn" onClick={onLearnMore}>
      </div>
    </div>
  );
}

export default Home;
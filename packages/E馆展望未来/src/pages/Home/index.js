import React from 'react';
import './index.css';

function Home({ onEnter, coverImage }) {
  return (
    <div 
      className="home-page" 
      onClick={onEnter}
      style={{
        backgroundImage: coverImage ? `url(${coverImage})` : undefined
      }}
    >
    </div>
  );
}

export default Home;

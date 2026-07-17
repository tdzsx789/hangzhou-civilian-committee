import React from 'react';
import './index.css';
function Home({ onLearnMore, className, coverImg }) {
  return (
    <div className={`home-page ${className || ''}`} style={{ backgroundImage: coverImg ? `url(${coverImg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* <div className="learn-more-btn" onClick={onLearnMore}></div> */}
    </div>
  );
}

export default Home;
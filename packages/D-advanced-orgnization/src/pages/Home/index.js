import React from 'react';
import './index.css';
import coverImg from '../../assets/cover.jpg';

function Home({ onLearnMore }) {
  return (
    <div
      className="home-page"
      style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      onClick={onLearnMore}
    >
    </div>
  );
}

export default Home;
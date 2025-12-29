import React from 'react';
import './index.css';
import coverImg from '../../assets/cover.jpg';

function Home({ onEnter }) {
  return (
    <div className="home-page" onClick={onEnter}>
    </div>
  );
}

export default Home;
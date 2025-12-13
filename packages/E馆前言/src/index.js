import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 全局禁止右键、长按和文本选择，并隐藏光标
const setupGlobalGuards = () => {
  const preventDefault = (e) => e.preventDefault();
  document.addEventListener('contextmenu', preventDefault, { passive: false });
  document.addEventListener('selectstart', preventDefault, { passive: false });
  document.addEventListener('dragstart', preventDefault, { passive: false });
  document.addEventListener('mousedown', (e) => {
    if (e.button === 2) {
      e.preventDefault();
    }
  }, { passive: false });
  let touchTimer;
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
    touchTimer = setTimeout(() => e.preventDefault(), 500);
  }, { passive: false });
  document.addEventListener('touchend', () => {
    clearTimeout(touchTimer);
  });
  document.addEventListener('touchmove', () => {
    clearTimeout(touchTimer);
  });
};

setupGlobalGuards();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
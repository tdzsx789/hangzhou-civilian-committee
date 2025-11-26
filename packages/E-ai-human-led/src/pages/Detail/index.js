import React from 'react';
import './index.css';

function Detail({ name, gallery, onBack }) {
  return (
    <div className="detail-page">
      <header className="detail-header">
        <button className="back-btn" onClick={onBack}>返回</button>
        <h1>总前言墙LED多媒体大屏</h1>
        <p>公区更新 - 详情页</p>
      </header>
      <div className="detail-content">
        <p>这里是详情页内容</p>
      </div>
    </div>
  );
}

export default Detail;
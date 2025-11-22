import React from 'react';
import './index.css';

function Detail({ name, gallery, onBack }) {
  return (
    <div className="detail-page">
      <header className="detail-header">
        <button className="back-btn" onClick={onBack}>返回</button>
        <h1>提高社会化、法治化、智能化、专业化水平，构建富有活力和效率的新型基层社会治理体系</h1>
        <p>D馆 - 详情页</p>
      </header>
      <div className="detail-content">
        <p>这里是详情页内容</p>
      </div>
    </div>
  );
}

export default Detail;
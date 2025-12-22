import React from 'react';
import './App.css';

function App() {
  // const labels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'PAUSE', 'START', 'FORWARD', 'BACK', 'UP', 'DOWN', 'P1-2', 'P2-2'];
  const labels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'AUTO', 'P1-2', 'P2-2', 'UP', 'DOWN', 'START', 'PAUSE', 'FORWARD', 'BACK',
    '“141”体系夯实基层治理根基', //ZJS
    '打造“最美红巷”治理品牌', //ZJSHZS
    '“民呼我为”擦亮幸福底色', //ZJSHZS1
    '“三大路径”深化基层民主实践', //SHS
    '社区基金会激活基层治理新动能', //SCSCDS
    '专题概述1',
    '专题概述2',
    '专题概述3',
    '专题概述4',
    '退出C馆中控' //QUIT
  ];
  const sendUdp = (label) => {
    const url = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_UDP_SERVER_URL) || 'http://localhost:5050/send';
    
    const mapping = {
      '“141”体系夯实基层治理根基': 'ZJS',
      '打造“最美红巷”治理品牌': 'ZJSHZS',
      '“民呼我为”擦亮幸福底色': 'ZJSHZS1',
      '“三大路径”深化基层民主实践': 'SHS',
      '社区基金会激活基层治理新动能': 'SCSCDS',
      '退出C馆中控': 'QUIT',
      '放大图片': 'LARGE',
      "缩小图片": 'SMALL',
      '专题概述1': 'ZTGS1',
      '专题概述2': 'ZTGS2',
      '专题概述3': 'ZTGS3',
      '专题概述4': 'ZTGS4',
    };

    const payload = mapping[label] || label;

    console.log('SEND', label, '->', payload, '->', url);
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: String(payload)
    })
      .then((res) => {
        console.log('SENT', payload, 'status', res.status);
      })
      .catch((err) => {
        console.error('SEND_FAIL', payload, err);
      });
  };
  return (
    <div className="App" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', width: '60%', maxWidth: '1200px' }}>
        {labels.map(label => (
          <button
            key={label}
            onClick={() => sendUdp(label)}
            style={{
              padding: '24px',
              fontSize: '28px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#f0f0f0'
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;

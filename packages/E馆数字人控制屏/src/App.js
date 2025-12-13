import React from 'react';
import './App.css';

function App() {
  // const labels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'PAUSE', 'START', 'FORWARD', 'BACK', 'UP', 'DOWN', 'P1-2', 'P2-2'];
  const labels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'AUTO', 'P1-2', 'P2-2'];
  const sendUdp = (label) => {
    const url = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_UDP_SERVER_URL) || 'http://localhost:5050/send';
    console.log('SEND', label, '->', url);
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: String(label)
    })
      .then((res) => {
        console.log('SENT', label, 'status', res.status);
      })
      .catch((err) => {
        console.error('SEND_FAIL', label, err);
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

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Home from './pages/Home';
import Visitor from './pages/Visitor';
import P1 from './assets/P1.jpg';
import P2 from './assets/P2.png';
import P4 from './assets/P4.png';
import P5 from './assets/P5.png';
import P6 from './assets/P6.png';
import P3 from './assets/P3.mp4';
import P3_LONG from './assets/P3_LONG.mp4';

function App() {


  

    // 密码输入功能
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const lastTouchTimeRef = useRef(0);
  const redButtonRef = useRef(null);
  const [showVisitor, setShowVisitor] = useState(false);
  const [visitorImage, setVisitorImage] = useState(null);
  const [visitorVideo, setVisitorVideo] = useState(null);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('app_volume');
    return saved !== null ? parseFloat(saved) : 1;
  });
  const [playbackCmd, setPlaybackCmd] = useState(null);

  useEffect(() => {
    localStorage.setItem('app_volume', volume);
  }, [volume]);

  // 使用原生事件监听器，设置 passive: false 以允许 preventDefault
  useEffect(() => {
    const buttonElement = redButtonRef.current;
    if (!buttonElement) return;

    // 处理触摸双击检测（1秒内两次touchstart）
    const handleRedButtonTouch = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const currentTime = Date.now();
      if (currentTime - lastTouchTimeRef.current < 1000 && lastTouchTimeRef.current > 0) {
        // 双击检测成功
        setShowPasswordInput(true);
        setPasswordInput('');
        lastTouchTimeRef.current = 0;
      } else {
        lastTouchTimeRef.current = currentTime;
      }
    };

    buttonElement.addEventListener('touchstart', handleRedButtonTouch, { passive: false });
    return () => {
      buttonElement.removeEventListener('touchstart', handleRedButtonTouch);
    };
  }, []);


  useEffect(() => {
    const url = process.env.REACT_APP_SSE_URL || 'http://localhost:5280/events';
    const es = new EventSource(url);
    es.onmessage = (e) => {
      const cmd = String(e.data).trim().toUpperCase();
      if (cmd === 'AUTO') {
        setShowVisitor(false);
        setVisitorImage(null);
        setVisitorVideo(null);
        return;
      }
      if (cmd === 'UP') {
        setVolume((v) => Math.min(1, parseFloat((v + 0.1).toFixed(1))));
        return;
      }
      if (cmd === 'DOWN') {
        setVolume((v) => Math.max(0, parseFloat((v - 0.1).toFixed(1))));
        return;
      }
      if (['PAUSE', 'START', 'FORWARD', 'BACK'].includes(cmd)) {
        setPlaybackCmd({ type: cmd, t: Date.now() });
        return;
      }
      setShowVisitor(true);
      if (cmd === 'P3') {
        setVisitorVideo(P3_LONG);
        setVisitorImage(null);
      } else if (cmd === 'P3V20S') {
        setVisitorVideo(P3);
        setVisitorImage(null);
      } else {
        setVisitorVideo(null);
        if (cmd === 'P1') setVisitorImage(P1);
        else if (cmd === 'P2') setVisitorImage(P2);
        else if (cmd === 'P4') setVisitorImage(P4);
        else if (cmd === 'P5') setVisitorImage(P5);
        else if (cmd === 'P6') setVisitorImage(P6);
        else setVisitorImage(null);
      }
    };
    return () => {
      es.close();
    };
  }, []);


  return (
    <div className="App">
      {showVisitor ? <Visitor image={visitorImage} video={visitorVideo} volume={volume} playbackCmd={playbackCmd} /> : <Home volume={volume} playbackCmd={playbackCmd} />}
    </div>
  );
}

export default App;

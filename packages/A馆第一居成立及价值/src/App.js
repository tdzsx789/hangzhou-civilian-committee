import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Home from './pages/Home';
import Visitor from './pages/Visitor';
import defaultData from './defaultData.json';

function App() {
  const [assetsData, setAssetsData] = useState(defaultData);

  useEffect(() => {
    const dataUrl = (process.env.PUBLIC_URL || '') + '/data.json';
    fetch(dataUrl)
      .then(res => {
        if(!res.ok) throw new Error('Failed to load data');
        return res.json();
      })
      .then(data => {
        if(data) setAssetsData(data);
      })
      .catch(e => console.error(e));
  }, []);

  const getPublicPath = (path) => {
    if (!path) return null;
    return (process.env.PUBLIC_URL || '') + '/' + path;
  };


  

    // 密码输入功能
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const lastTouchTimeRef = useRef(0);
  const redButtonRef = useRef(null);
  const [showVisitor, setShowVisitor] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const [visitorImageKey, setVisitorImageKey] = useState(null);
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
      
      if (cmd === 'ENGLISH') {
        setIsEnglish(true);
        return;
      }
      if (cmd === 'CHINESE') {
        setIsEnglish(false);
        return;
      }

      if (cmd === 'AUTO') {
        setShowVisitor(false);
        setVisitorImageKey(null);
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
        setVisitorVideo(getPublicPath(assetsData.videos.P3_LONG));
        setVisitorImageKey(null);
      } else if (cmd === 'P3V20S') {
        setVisitorVideo(getPublicPath(assetsData.videos.P3));
        setVisitorImageKey(null);
      } else {
        setVisitorVideo(null);
        if (cmd === 'P1') setVisitorImageKey('P1');
        else if (cmd === 'P2') setVisitorImageKey('P2');
        else if (cmd === 'P4') setVisitorImageKey('P4');
        else if (cmd === 'P5') setVisitorImageKey('P5');
        else if (cmd === 'P6') setVisitorImageKey('P6');
        else setVisitorImageKey(null);
      }
    };
    return () => {
      es.close();
    };
  }, []);


  const currentLang = isEnglish ? 'en' : 'zh';
  const visitorImage = visitorImageKey ? getPublicPath(assetsData.assets[currentLang][visitorImageKey]) : null;
  const defaultVisitorImage = getPublicPath(assetsData.assets[currentLang]['P1']);

  return (
    <div className="App">
      {showVisitor ? (
        <Visitor 
          image={visitorImage} 
          defaultImage={defaultVisitorImage}
          video={visitorVideo} 
          volume={volume} 
          playbackCmd={playbackCmd} 
        />
      ) : (
        <Home 
          volume={volume} 
          playbackCmd={playbackCmd} 
          videoSrc={getPublicPath(assetsData.videos.aihuman)}
        />
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Visitor from './pages/Visitor';
import P1 from './assets/P1.jpg';
import Video from './assets/video.mp4';

function App() {
    // 密码输入功能
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const lastTouchTimeRef = useRef(0);
  const redButtonRef = useRef(null);

  const [showVisitor, setShowVisitor] = useState(true);
  const [visitorImage, setVisitorImage] = useState(P1);
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

  // 处理密码提交
  const handlePasswordSubmit = () => {
    if (passwordInput === '20251212') {
      // 退出整个浏览器/应用
      // 优先尝试 Electron 的退出方法
      if (typeof window.electron !== 'undefined') {
        // 尝试多种 Electron 退出方式
        if (window.electron.ipcRenderer) {
          // 通过 IPC 发送退出信号（需要主进程监听 'quit-app' 事件）
          window.electron.ipcRenderer.send('quit-app');
        } else if (window.electron.remote && window.electron.remote.app) {
          // Electron 旧版本 API
          window.electron.remote.app.quit();
        } else if (window.electron.quit) {
          window.electron.quit();
        } else if (window.electron.exit) {
          window.electron.exit();
        } else if (window.electron.app && window.electron.app.quit) {
          window.electron.app.quit();
        }
      } else if (window.require) {
        // 尝试通过 require 获取 Electron 模块
        try {
          const { ipcRenderer } = window.require('electron');
          ipcRenderer.send('quit-app');
        } catch (e) {
          try {
            const { remote } = window.require('electron');
            if (remote && remote.app) {
              remote.app.quit();
            }
          } catch (e2) {
            // 如果都不行，尝试关闭窗口
            window.close();
          }
        }
      } else {
        // 普通浏览器环境：尝试关闭窗口
        // 注意：JavaScript 无法直接关闭整个浏览器，只能关闭由脚本打开的窗口
        window.close();
        // 如果 window.close() 不起作用，延迟后尝试其他方法
        setTimeout(() => {
          window.location.href = 'about:blank';
        }, 100);
      }
    } else {
      alert('密码错误');
      setPasswordInput('');
    }
  };

  useEffect(() => {
    const url = process.env.REACT_APP_SSE_URL || 'http://localhost:5280/events';
    const es = new EventSource(url);
    es.onmessage = (e) => {
      const cmd = String(e.data).trim().toUpperCase();
      if (cmd === 'AUTO') {
        setVisitorImage(P1);
        setVisitorVideo(null);
        setShowVisitor(true);
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
      if (cmd === 'P2') {
        setVisitorVideo(Video);
        setVisitorImage(null);
        setShowVisitor(true);
      } else if (cmd === 'P1') {
        setVisitorImage(P1);
        setVisitorVideo(null);
        setShowVisitor(true);
      }
    };
    return () => {
      es.close();
    };
  }, []);

  return (
    <div className="App">
      <Visitor image={visitorImage} video={visitorVideo} onBack={() => setShowVisitor(false)} volume={volume} playbackCmd={playbackCmd} />
    </div>
  );
}

export default App;

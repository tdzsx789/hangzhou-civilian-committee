import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import defaultData from './defaultData.json';

function App() {
  const [assetsData, setAssetsData] = useState(defaultData);

  const getPublicPath = (path) => {
    if (!path) return null;
    const publicUrl = process.env.PUBLIC_URL;
    if (publicUrl === '.' || !publicUrl) {
      return path;
    }
    return publicUrl + '/' + path;
  };

  useEffect(() => {
    const dataUrl = getPublicPath('data.json');
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

  const [showDetail, setShowDetail] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('app_volume');
    return saved !== null ? parseFloat(saved) : 1;
  });
  const [playbackCmd, setPlaybackCmd] = useState(null);

  useEffect(() => {
    localStorage.setItem('app_volume', volume);
  }, [volume]);

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
        setShowDetail(false);
      } else if (cmd === 'P1') {
        setShowDetail(false);
      } else if (cmd === 'P2') {
        setShowDetail(true);
      } else if (cmd === 'UP') {
        setVolume((v) => Math.min(1, parseFloat((v + 0.1).toFixed(1))));
      } else if (cmd === 'DOWN') {
        setVolume((v) => Math.max(0, parseFloat((v - 0.1).toFixed(1))));
      } else if (['START', 'PAUSE', 'FORWARD', 'BACK'].includes(cmd)) {
        setPlaybackCmd({ type: cmd, t: Date.now() });
      }
    };
    return () => {
      es.close();
    };
  }, []);

  // 密码输入功能
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const lastTouchTimeRef = useRef(0);
  const redButtonRef = useRef(null);

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

  const currentLang = isEnglish ? 'en' : 'zh';
  const currentCover = getPublicPath(assetsData.assets[currentLang].cover);

  return (
    <div className="App">
      {showDetail ? (
        <Detail onBack={() => setShowDetail(false)} volume={volume} playbackCmd={playbackCmd} videoSrc={getPublicPath(assetsData.videos.future)} />
      ) : (
        <Home onEnter={() => setShowDetail(true)} coverImage={currentCover} />
      )}
      
      {/* 密码输入框 - 保持在最上层 */}
      {showPasswordInput && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          <div style={{ color: 'white', marginBottom: 20, fontSize: 24 }}>请输入密码退出程序</div>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ fontSize: 24, padding: 10, marginBottom: 20 }}
          />
          <div>
            <button onClick={handlePasswordSubmit} style={{ fontSize: 24, padding: '10px 20px', marginRight: 20 }}>确认</button>
            <button onClick={() => setShowPasswordInput(false)} style={{ fontSize: 24, padding: '10px 20px' }}>取消</button>
          </div>
        </div>
      )}
      
      {/* 隐藏的退出触发区域 - 保持在最上层 */}
      <div 
        ref={redButtonRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 50,
          height: 50,
          zIndex: 9998,
          // backgroundColor: 'rgba(255,0,0,0.3)' // 调试时打开
        }}
      />
    </div>
  );
}

export default App;

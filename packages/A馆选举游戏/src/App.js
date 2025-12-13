import React, { useEffect, useRef, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import ScreenPage from './pages/Screen';
import GamePage from './pages/Game';

// 根据构建目标计算默认路由
function getDefaultPath() {
  const buildTarget = process.env.REACT_APP_BUILD_TARGET || '';
  console.log('Build target:', buildTarget); // 调试信息

  if (buildTarget === 'screen') {
    return '/screen';
  } else if (buildTarget && buildTarget.startsWith('game')) {
    const gameId = buildTarget.replace('game', '');
    return `/game/${gameId}`;
  }
  return '/screen'; // 默认路由
}

// 自动跳转组件
function AutoRedirect() {
  useEffect(() => {
    const defaultPath = getDefaultPath();

    // 如果当前路径是根路径，则跳转到默认路径
    // 使用 window.location.hash 避免 file:// 协议下的安全错误
    const currentHash = window.location.hash;
    if (currentHash === '' || currentHash === '#' || currentHash === '#/') {
      window.location.hash = defaultPath;
    }
  }, []);

  return null;
}

function App() {

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

  // 处理密码提交

  const defaultPath = getDefaultPath();

  return (
    <HashRouter>
      <AutoRedirect />
      <Routes>
        <Route path="/screen" element={<ScreenPage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
        <Route path="*" element={<Navigate to={defaultPath} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
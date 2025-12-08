import React, { useEffect } from 'react';
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
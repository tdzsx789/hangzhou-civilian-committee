import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail1 from './pages/Detail1';
import Detail1Second from './pages/Detail1_2';
import Detail2 from './pages/Detail2';
import Detail2Second from './pages/Detail2_2';
import defaultData from './defaultData.json';

function App() {
  const redButtonRef = useRef(null);
  const lastTouchTimeRef = useRef(0);

  // 密码输入功能
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // 红色按钮双击逻辑
  useEffect(() => {
    const buttonElement = redButtonRef.current;
    if (!buttonElement) return;

    const handleRedButtonTouch = (e) => {
      // 阻止默认行为，防止缩放等
      // e.preventDefault(); // 注释掉，以免影响点击
      
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastTouchTimeRef.current;

      if (timeDiff < 300 && timeDiff > 0) {
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

  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('zh');
  const [listData, setListData] = useState(defaultData);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  // Fetch data from public/data.json
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data.json')
      .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
            setListData(data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // 处理 list，添加 public URL 前缀
  const processedList = useMemo(() => {
    return listData.map(item => ({
      ...item,
      images: item.images.map(image => {
        let url = image.url;
        // 如果是相对路径且不以 / 开头，添加 PUBLIC_URL
        if (url && !url.startsWith('http') && !url.startsWith('/')) {
            // process.env.PUBLIC_URL 在开发环境通常是空字符串，生产环境可能是 /subpath
            // 如果是空字符串，需要加 /，如果 url 已经是 images/... 则变成 /images/...
            url = (process.env.PUBLIC_URL || '') + '/' + url;
        }
        return {
          ...image,
          url: url
        };
      })
    }));
  }, [listData]);

  const handleLearnMore = () => {
    setCurrentPage('detail1');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const [selectedItem, setSelectedItem] = useState(null);

  const handleEnterDetail1_2 = (item) => {
    setSelectedItem(item);
    setCurrentPage('detail1_2');
  };

  const handleEnterDetail2 = () => {
    setCurrentPage('detail2');
  };

  const handleEnterDetail2_2 = () => {
    setCurrentPage('detail2_2');
  };

  const handleBackToDetail = () => {
    setCurrentPage('detail1');
  };

  const handleBackToDetail2 = () => {
    setCurrentPage('detail2');
  };

  // 1个小时无交互自动返回Home页
  useEffect(() => {
    let autoReturnTimer = null;

    const resetTimer = () => {
      if (autoReturnTimer) {
        clearTimeout(autoReturnTimer);
      }
      autoReturnTimer = setTimeout(() => {
        setCurrentPage('home');
      }, 3600000); // 1个小时 = 3600000毫秒
    };

    const handleTouchStart = () => {
      resetTimer();
    };

    // 初始化定时器
    resetTimer();

    // 监听 touchstart 事件
    document.addEventListener('touchstart', handleTouchStart);

    // 清理函数
    return () => {
      if (autoReturnTimer) {
        clearTimeout(autoReturnTimer);
      }
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <div className="App">

      {/* 红色按钮 - 双击打开密码输入 */}
      <div
        ref={redButtonRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '150px',
          height: '150px',
          backgroundColor: 'transparent',
          zIndex: 99999,
          cursor: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      />

      {/* 密码输入界面 */}
      {showPasswordInput && (
        <div
          className="password-input-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPasswordInput(false);
              setPasswordInput('');
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 10000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              left: '10px',
              top: '160px',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              minWidth: '350px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{
              fontSize: '20px',
              marginBottom: '15px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>请输入密码</div>
            <div style={{
              fontSize: '28px',
              textAlign: 'center',
              marginBottom: '15px',
              minHeight: '35px',
              letterSpacing: '6px',
              fontFamily: 'monospace',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '5px'
            }}>{passwordInput || ''}</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '8px'
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => setPasswordInput(prev => prev + String(num))}
                  style={{
                    padding: '15px',
                    fontSize: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    cursor: 'none',
                    backgroundColor: '#f0f0f0',
                    transition: 'background-color 0.2s',
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                  }}
                  onTouchEnd={(e) => {
                    e.target.style.backgroundColor = '#f0f0f0';
                  }}
                  onTouchStart={(e) => {
                    e.target.style.backgroundColor = '#e0e0e0';
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px'
            }}>
              <button
                onClick={() => setPasswordInput(prev => prev + '0')}
                style={{
                  padding: '15px',
                  fontSize: '20px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'none',
                  backgroundColor: '#f0f0f0',
                  transition: 'background-color 0.2s',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
                onTouchEnd={(e) => {
                  e.target.style.backgroundColor = '#f0f0f0';
                }}
                onTouchStart={(e) => {
                  e.target.style.backgroundColor = '#e0e0e0';
                }}
              >
                0
              </button>
              <button
                onClick={() => setPasswordInput(prev => prev.slice(0, -1))}
                style={{
                  padding: '15px',
                  fontSize: '18px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'none',
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  transition: 'background-color 0.2s',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
                onTouchEnd={(e) => {
                  e.target.style.backgroundColor = '#ff6b6b';
                }}
                onTouchStart={(e) => {
                  e.target.style.backgroundColor = '#ff5252';
                }}
              >
                删除
              </button>
              <button
                onClick={handlePasswordSubmit}
                style={{
                  padding: '15px',
                  fontSize: '18px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'none',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  transition: 'background-color 0.2s',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
                onTouchEnd={(e) => {
                  e.target.style.backgroundColor = '#4caf50';
                }}
                onTouchStart={(e) => {
                  e.target.style.backgroundColor = '#45a049';
                }}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`page-container ${currentPage === 'home' ? 'active' : ''}`}
      >
        <Home
          onLearnMore={handleLearnMore}
          language={language}
          toggleLanguage={toggleLanguage}
        />
      </div>
      <div
        className={`page-container ${currentPage === 'detail1' ? 'active' : ''}`}
      >
        <Detail1
          name="新时代基层治理发展（2012年11月-2017年9月）-竖屏1"
          gallery="B馆"
          onBack={handleBackToHome}
          onOpenDetail2={handleEnterDetail2}
          onOpenDetail1_2={handleEnterDetail1_2}
          list={processedList}
          isActive={currentPage === 'detail1'}
          language={language}
        />
      </div>
      <div
        className={`page-container ${currentPage === 'detail1_2' ? 'active' : ''}`}
      >
        <Detail1Second
          name="新时代基层治理发展（2012年11月-2017年9月）-竖屏2"
          gallery="B馆"
          onBack={handleBackToDetail}
          onOpenDetail2={handleEnterDetail2}
          selectedItem={selectedItem}
          isActive={currentPage === 'detail1_2'}
          language={language}
        />
      </div>
      <div
        className={`page-container ${currentPage === 'detail2' ? 'active' : ''}`}
      >
        <Detail2
          onBack={handleBackToDetail}
          onOpenDetail2_2={handleEnterDetail2_2}
          isActive={currentPage === 'detail2'}
          language={language}
        />
      </div>
      <div
        className={`page-container ${currentPage === 'detail2_2' ? 'active' : ''}`}
      >
        <Detail2Second
          onBackToDetail1={handleBackToDetail}
          onOpenDetail2={handleBackToDetail2}
          language={language}
        />
      </div>
    </div>
  );
}

export default App;

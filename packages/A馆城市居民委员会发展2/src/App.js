import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Detail2 from './pages/Detail2';
import Detail3 from './pages/Detail3';

function App() {

  // 密码输入功能
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const lastTouchTimeRef = useRef(0);

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

  // 处理密码提交
  const handlePasswordSubmit = () => {
    if (passwordInput === '20251212') {
      // 退出程序
      window.close();
      // 如果 window.close() 不起作用，尝试其他方法
      if (typeof window.electron !== 'undefined') {
        window.electron.exit();
      } else {
        // 尝试关闭窗口的其他方法
        window.location.href = 'about:blank';
      }
    } else {
      alert('密码错误');
      setPasswordInput('');
    }
  };


  const [currentPage, setCurrentPage] = useState('home');

  const handleLearnMore = () => {
    setCurrentPage('detail');
  };

  const handleLearnMore2 = () => {
    setCurrentPage('detail2');
  };

  const handleLearnMore3 = () => {
    setCurrentPage('detail3');
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  const pages = [
    {
      key: 'home',
      render: () => (
        <Home
          onLearnMore={handleLearnMore}
          onLearnMore2={handleLearnMore2}
          onLearnMore3={handleLearnMore3}
        />
      ),
    },
    {
      key: 'detail',
      render: (isActive) => (
        <Detail
          name="城市居民委员会发展2"
          gallery="A馆"
          onBack={handleBack}
          isActive={isActive}
        />
      ),
    },
    {
      key: 'detail2',
      render: (isActive) => (
        <Detail2
          name="城市居民委员会发展2"
          gallery="A馆"
          onBack={handleBack}
          isActive={isActive}
        />
      ),
    },
    {
      key: 'detail3',
      render: (isActive) => (
        <Detail3
          name="城市居民委员会发展2"
          gallery="A馆"
          onBack={handleBack}
          isActive={isActive}
        />
      ),
    },
  ];
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
        onTouchStart={handleRedButtonTouch}
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


      {pages.map(({ key, render }) => {
        const isActive = currentPage === key;
        return (
          <div
            key={key}
            className={`page-layer ${isActive ? 'active' : ''}`}
          >
            {render(isActive)}
          </div>
        );
      })}
    </div>
  );
}

export default App;
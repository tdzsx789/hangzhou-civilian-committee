import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Detail2 from './pages/Detail2';
// import Detail3 from './pages/Detail3';
import Detail4 from './pages/Detail4';
import info1 from './assets/info1.png';
import info2 from './assets/info2.png';
import info3 from './assets/info3.png';
import { newPeopleData } from './assets/newPeopleData';
import { zuzhiData } from './assets/zuzhiData';

// 辅助排序函数：按指定字段开头的数字进行升序排序
const sortChildrenByNumericPrefix = (data, keyField) => {
  if (!Array.isArray(data)) return data;

  return data.map(province => {
    // 如果没有 children 或 children 不是数组，直接返回原对象
    if (!province.children || !Array.isArray(province.children)) return province;

    // 浅拷贝并排序 children
    const sortedChildren = [...province.children].sort((a, b) => {
      const getNum = (str) => {
        // 匹配开头的数字
        const match = String(str || '').match(/^\s*(\d+)/);
        // 如果有数字则解析，否则设为最大值放到最后（或者根据需求设为0放到最前）
        return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
      };
      const numA = getNum(a[keyField]);
      const numB = getNum(b[keyField]);
      return numA - numB;
    });

    return { ...province, children: sortedChildren };
  });
};

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





  const [currentPage, setCurrentPage] = useState('home');

  // 使用 useMemo 对数据进行排序
  const sortedPeopleData = useMemo(() => {
    const rawData = Array.isArray(newPeopleData) ? newPeopleData : (newPeopleData.peopleData || []);
    return sortChildrenByNumericPrefix(rawData, 'name');
  }, []);

  const sortedZuzhiData = useMemo(() => {
    return sortChildrenByNumericPrefix(zuzhiData, 'originName');
  }, []);

  const [detailData, setDetailData] = useState(sortedPeopleData);
  const [selectedProvinceName, setSelectedProvinceName] = useState(null);
  const [detailInfoImage, setDetailInfoImage] = useState(null);
  const [detailChildData, setDetailChildData] = useState(null);
  const [shouldResetDetailScroll, setShouldResetDetailScroll] = useState(false);

  const handleStart1Click = () => {
    setDetailData(sortedPeopleData);
    setSelectedProvinceName(null);
    setShouldResetDetailScroll(true);
    setCurrentPage('detail');
  };

  const handleStart2Click = () => {
    setCurrentPage('detail3');
  };

  const handleBackHome = () => {
    setCurrentPage('home');
    setDetailData(sortedPeopleData);
    setSelectedProvinceName(null);
  };

  const handleEnterDetail2 = (childData) => {
    if (!childData) return;
    setDetailChildData(childData);
    setCurrentPage('detail2');
  };

  const handleBackToDetail = () => {
    setShouldResetDetailScroll(false);
    setCurrentPage('detail');
    setDetailChildData(null);
  };

  const handleEnterDetail4 = (childData) => {
    if (!childData) return;
    setDetailChildData(childData);
    setCurrentPage('detail4');
  };

  const handleBackToDetail3 = () => {
    setCurrentPage('detail3');
    setDetailChildData(null);
  };
  const handleMarkerClick = (provinceName) => {
    setSelectedProvinceName(provinceName || null);
    setShouldResetDetailScroll(true);
    setCurrentPage('detail');
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


      <div className={`page-container ${currentPage === 'home' ? 'active' : 'inactive'}`}>
        <Home onStart1Click={handleStart1Click} onStart2Click={handleStart2Click} onMarkerClick={handleMarkerClick} />
      </div>
      <div className={`page-container ${currentPage === 'detail' ? 'active' : 'inactive'}`}>
        <Detail
          name="党建引领基层治理先进个人、先进组织"
          gallery="D馆"
          onBack={handleBackHome}
          onSelectDetail={handleEnterDetail2}
          onSelectOrgDetail={handleEnterDetail4}
          data={detailData}
          orgData={sortedZuzhiData}
          selectedProvinceName={selectedProvinceName}
          isActive={currentPage === 'detail'}
          shouldResetScroll={shouldResetDetailScroll}
        />
      </div>
      <div className={`page-container ${currentPage === 'detail2' ? 'active' : 'inactive'}`}>
        {detailChildData && (
          <Detail2 onBack={handleBackToDetail} childData={detailChildData} />
        )}
      </div>
      {/* <div className={`page-container ${currentPage === 'detail3' ? 'active' : 'inactive'}`}>
        <Detail3
          name="党建引领基层治理先进个人、先进组织"
          gallery="D馆"
          onBack={handleBackHome}
          onSelectDetail={handleEnterDetail4}
          data={zuzhiData}
          isActive={currentPage === 'detail3'}
        />
      </div> */}
      <div className={`page-container ${currentPage === 'detail4' ? 'active' : 'inactive'}`}>
        {detailChildData && (
          <Detail4 onBack={handleBackToDetail} childData={detailChildData} />
        )}
      </div>
    </div>
  );
}

export default App;

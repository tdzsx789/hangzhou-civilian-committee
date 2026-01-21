import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Detail2 from './pages/Detail2';
import { work1, work2, work3, work4, work5, work6, work7 } from './works';

const data = [
  {
    name_zh: '2017年10月，党的十九大报告《决胜全面建成小康社会 夺取新时代中国特色社会主义伟大胜利》',
    name_en: `Report to the 19th National Congress of the CPC: Securing a Decisive Victory in Building a Moderately Prosperous Society in All Respects and Striving for the Great Victory of Socialism with Chinese Characteristics for a New Era delivered in October 2017.`,
    work: work1,
  },
  {
    name_zh: '2019年10月，中国共产党第十九届中央委员会第四次全体会议通过的《中共中央关于坚持和完善中国特色社会主义制度 推进国家治理体系和治理能力现代化若干重大问题的决定》',
    name_en: `Decision of the Central Committee of the CPC on Some Major Issues Concerning Upholding and Improving the System of Socialism with Chinese Characteristics and Modernizing the National Governance System and Governance Capacity adopted at the Fourth Plenary Session of the 19th Central Committee of the CPC in October 2019`,
    work: work2,
  },
  {
    name_zh: '2020年10月，中国共产党第十九届中央委员会第五次全体会议通过的《中共中央关于制定国民经济和社会发展第十四个五年规划和二〇三五年远景目标的建议》',
    name_en: `Proposals of the Central Committee of the CPC on Formulating the 14th Five-Year Plan for National Economic and Social Development and the Long-Range Objectives Through the Year 2035 adopted at the Fifth Plenary Session of the 19th Central Committee of the CPC in October 2020.`,
    work: work3,
  },
  {
    name_zh: '2021年4月，《中共中央、国务院关于加强基层治理体系和治理能力现代化建设的意见》',
    name_en: `Opinions of the Central Committee of the CPC and the State Council on Strengthening the Modernization of the Grassroots Governance System and Governance Capacity issued in April 2021.`,
    work: work4,
  },
  {
    name_zh: '2019年5月，中共中央办公厅印发《关于加强和改进城市基层党的建设工作的意见》',
    name_en: `Circular on Addressing Prominent Formalist Issues to Alleviate the Burden on the Grassroots issued by the General Office of the Central Committee of the CPC in March 2019.`,
    work: work5
  },
  {
    name_zh: '2020年5月，《中华人民共和国民法典》',
    name_en: `Opinions on Strengthening and Improving the Party Building Work at the Urban Community Level issued by the General Office of the Central Committee of the CPC in May 2019.`,
    work: work6
  },
  {
    name_zh: '2021年12月，国务院办公厅印发《“十四五”城乡社区服务体系建设规划》',
    name_en: `The 14th Five-Year Plan for the Construction of Urban and Rural Community Service Systems issued by the General Office of the State Council in December 2021.`,
    work: work7
  }
];

function App() {
  const [language, setLanguage] = useState('zh');
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

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
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLearnMore = () => {
    setCurrentPage('detail');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleEnterDetail2 = (index) => {
    setCurrentIndex(index);
    setCurrentPage('detail2');
  };

  const handleBackToDetail = () => {
    setCurrentPage('detail');
  };

  const handleNextWork = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < data.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrevWork = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const pageConfigs = [
    {
      key: 'home',
      element: <Home onLearnMore={handleLearnMore} language={language} onToggleLanguage={toggleLanguage} />,
    },
    {
      key: 'detail',
      element: (
        <Detail
          name="新时代基层治理发展（2012年11月-2017年9月）-竖屏1"
          gallery="B馆"
          onBack={handleBackToHome}
          onOpenDetail2={handleEnterDetail2}
          data={data}
          isActive={currentPage === 'detail'}
          language={language}
        />
      ),
    },
    {
      key: 'detail2',
      element: (
        <Detail2
          onBack={handleBackToDetail}
          item={data[currentIndex]}
          currentIndex={currentIndex}
          total={data.length}
          onNext={handleNextWork}
          onPrev={handlePrevWork}
          isActive={currentPage === 'detail2'}
          language={language}
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


      {pageConfigs.map(({ key, element }) => (
        <div
          key={key}
          className={`page-layer ${currentPage === key ? 'page-layer--active' : ''}`}
        >
          {element}
        </div>
      ))}
    </div>
  );
}

export default App;
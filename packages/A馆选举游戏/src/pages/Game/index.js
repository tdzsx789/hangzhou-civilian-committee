import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { STAGE, STAGE_LABEL } from '../../constants/stages';
import { useElectionChannel } from '../../hooks/useElectionChannel';
import gameWaitingImg from '../../assets/game_waiting.jpg';
import gamePrepareImg from '../../assets/game_prepare.jpg';
import gameCompleteImg from '../../assets/game_complete.jpg';
import photoBgImg from '../../assets/photo_bg.jpg';
import takePhotoImg from '../../assets/takephoto.png';
import waitForPhotoImg from '../../assets/wait_for_photo.jpg';
import gameGamingBgImg from '../../assets/game_gaming_bg.jpg';
import headDashImg from '../../assets/head_dash.png';
import './index.css';
import comeTakePhotoMp3 from '../../assets/audios/come_take_photo.MP3';
import startGameMp3 from '../../assets/audios/start_game.MP3';
import clickAudioMp3 from '../../assets/audios/click.MP3';
import finishAudioMp3 from '../../assets/audios/finish.MP3';
import bgMp3 from '../../assets/audios/bg.MP3';
import otherCompleteImg from '../../assets/other_complete.jpg';

import video1 from '../../assets/shortVideos/背箱法.mp4';
import video2 from '../../assets/shortVideos/豆选法.mp4';
import video3 from '../../assets/shortVideos/喊选法.mp4';
import video4 from '../../assets/shortVideos/举手法.mp4';
import video5 from '../../assets/shortVideos/票选法.mp4';
import video6 from '../../assets/shortVideos/烧洞法.mp4';
import video7 from '../../assets/shortVideos/投纸团法.mp4';
import avatar1 from '../../assets/头像1.jpg';
import avatar2 from '../../assets/头像2.jpg';
import avatar3 from '../../assets/头像3.jpg';
import avatar4 from '../../assets/头像4.jpg';
import avatar5 from '../../assets/头像5.jpg';

const videoList = [
  { name: '背箱法', url: video1 },
  { name: '豆选法', url: video2 },
  { name: '喊选法', url: video3 },
  { name: '举手法', url: video4 },
  { name: '票选法', url: video5 },
  { name: '烧洞法', url: video6 },
  { name: '投纸团法', url: video7 },
]

function StageDescription({ stage, countdown, photoCountdown, completeCountdown }) {
  if (stage === STAGE.PREPARE) {
    return (
      <p className="stage-description">
        摄影师即将就位，请保持站姿
      </p>
    );
  }
  if (stage === STAGE.PHOTO) {
    return (
      <p className="stage-description">
        正在拍照，将在 {photoCountdown}s 后进入结果页
      </p>
    );
  }
  if (stage === STAGE.COMPLETE) {
    return (
      <p className="stage-description">
        本轮互动结束，将在 {completeCountdown}s 后自动返回首页
      </p>
    );
  }
  return <p className="stage-description">{STAGE_LABEL[stage]}</p>;
}

const ELECTION_METHODS = [
  '豆选法',
  '票选法',
  '投纸团法',
  '背箱法',
  '举手法',
  '烧洞法',
  '喊选法',
];

function GamePage() {
  const params = useParams();
  const hash = typeof window !== 'undefined' ? window.location.hash || '' : '';
  const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams('');
  const hashMatch = hash.match(/\/game\/(\d+)/);
  const gameId = (params?.gameId || search.get('game') || search.get('playerId') || (hashMatch ? hashMatch[1] : ''));
  const [countdown, setCountdown] = useState(15);
  const [photoCountdown, setPhotoCountdown] = useState(15);
  const [completeCountdown, setCompleteCountdown] = useState(15);
  const [gamingCountdown, setGamingCountdown] = useState(1500);
  const [hasAnnouncedPhoto, setHasAnnouncedPhoto] = useState(false);
  const [photoCompleteSent, setPhotoCompleteSent] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [hasClickedStart, setHasClickedStart] = useState(false);
  const [electionMethod, setElectionMethod] = useState('');
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [gamingPhotoAnimated, setGamingPhotoAnimated] = useState(false);
  const [showGamingText, setShowGamingText] = useState(false);
  const [needsUserAction, setNeedsUserAction] = useState(false);
  const videoRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const preCaptureTimerRef = useRef(null);
  const photoAudioRef = useRef(null);
  const photoAudioPlayedRef = useRef(false);
  const startGameAudioRef = useRef(null);
  const startGameAudioPlayedRef = useRef(false);
  const clickAudioRef = useRef(null);
  const clickAudioPlayedRef = useRef(false);
  const finishAudioRef = useRef(null);
  const finishAudioPlayedRef = useRef(false);
  const bgAudioRef = useRef(null);
  const bgAudioPlayedRef = useRef(false);
  const [isBgPlaying, setIsBgPlaying] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const lastTouchTimeRef = useRef(0);
  const redButtonRef = useRef(null);
  const {
    stage,
    send,
    meta: { connectionState, retryCount },
    playlist,
    sendPhotoBinary,
    roles,
    waitingCountdown,
    photoCountdown: serverPhotoCountdown,
    champion,
  } = useElectionChannel({ role: 'game', playerId: /^([1-5])$/.test(String(gameId || '')) ? gameId : '' });

  const [localStage, setLocalStage] = useState(stage);

  useEffect(() => {
    if (serverPhotoCountdown !== null && serverPhotoCountdown !== undefined) {
      setPhotoCountdown(serverPhotoCountdown);
    }
  }, [serverPhotoCountdown]);

  useEffect(() => {
    if (stage === STAGE.WAITING) {
      setLocalStage(STAGE.WAITING);
    } else if (stage === STAGE.PHOTO) {
      if (hasClickedStart) {
        setLocalStage(STAGE.PHOTO);
      } else {
        setLocalStage(STAGE.WAITING);
      }
    } else {
      setLocalStage(stage);
    }
  }, [stage, hasClickedStart]);
  const isWaiting = localStage === STAGE.WAITING;
  const isPhoto = localStage === STAGE.PHOTO;
  const isGaming = localStage === STAGE.GAMING;
  const isElection = localStage === STAGE.ELECTION;
  const isComplete = localStage === STAGE.COMPLETE;
  const isHuman = hasClickedStart || (Array.isArray(roles?.humans) && roles.humans.includes(gameId));
  const isNpc = !isHuman && Array.isArray(roles?.npcs) && roles.npcs.includes(gameId);
  const isChampion = String(champion) === String(gameId);

  const buttonCopy = useMemo(() => {
    if (connectionState !== 'connected' && connectionState !== 'idle') {
      return '正在重连...';
    }
    if (isWaiting) {
      return '开始';
    }
    if (isPhoto) {
      return `拍照倒计时 (${photoCountdown}s)`;
    }
    if (isComplete) {
      return resetRequested ? '已请求返回首页' : `返回首页 (${completeCountdown}s)`;
    }
    return '拍照进行中';
  }, [
    connectionState,
    isComplete,
    isPhoto,
    isWaiting,
    photoCountdown,
    resetRequested,
    completeCountdown,
  ]);

  useEffect(() => {
    if (!photoAudioRef.current) {
      photoAudioRef.current = new Audio(comeTakePhotoMp3);
    }
    if (!startGameAudioRef.current) {
      startGameAudioRef.current = new Audio(startGameMp3);
    }
    if (!clickAudioRef.current) {
      clickAudioRef.current = new Audio(clickAudioMp3);
    }
    if (!finishAudioRef.current) {
      finishAudioRef.current = new Audio(finishAudioMp3);
    }

    if (bgAudioRef.current) {
      bgAudioRef.current.volume = 0.1;
    }

    const buttonElement = redButtonRef.current;
    if (!buttonElement) return;
    const handleRedButtonTouch = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const currentTime = Date.now();
      if (currentTime - lastTouchTimeRef.current < 1000 && lastTouchTimeRef.current > 0) {
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
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handlePasswordSubmit = () => {
    if (passwordInput === '20251212') {
      if (typeof window.electron !== 'undefined') {
        if (window.electron.ipcRenderer) {
          window.electron.ipcRenderer.send('quit-app');
        } else if (window.electron.remote && window.electron.remote.app) {
          window.electron.remote.app.quit();
        } else if (window.electron.quit) {
          window.electron.quit();
        } else if (window.electron.exit) {
          window.electron.exit();
        } else if (window.electron.app && window.electron.app.quit) {
          window.electron.app.quit();
        }
      } else if (window.require) {
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
            window.close();
          }
        }
      } else {
        window.close();
        setTimeout(() => {
          window.location.href = 'about:blank';
        }, 100);
      }
    } else {
      alert('密码错误');
      setPasswordInput('');
    }
  };

  const handleBgAudioPlay = useCallback(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.play().then(() => {
        bgAudioPlayedRef.current = true;
      }).catch((err) => {
        console.error('Background audio play error:', err);
      });
    }
  }, []);

  const handleStart = useCallback(() => {
    if (!isWaiting) return;
    if (!/^([1-5])$/.test(String(gameId || ''))) return;
    setHasClickedStart(true);

    send('game:start', { playerId: gameId });
  }, [gameId, isWaiting, send]);

  useEffect(() => {
    // 移除 prepare 阶段设置 election method 的逻辑
    if (!/^([1-5])$/.test(String(gameId || ''))) return;
    const playerIndex = parseInt(gameId, 10) - 1;
    if (playerIndex >= 0 && playerIndex < 5) {
      const methodName = Array.isArray(playlist) && playlist.length >= 5
        ? playlist[playerIndex]
        : null;
      if (methodName) {
        const chosen = videoList.find(v => v.name === methodName) || null;
        setElectionMethod(chosen ? chosen.name : '');
        setSelectedVideo(chosen);
      } else {
        const shuffled = [...videoList];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const mustIndex = shuffled.findIndex(v => v.name === '豆选法');
        if (mustIndex !== -1 && mustIndex >= 5) {
          const targetIndex = 0;
          [shuffled[targetIndex], shuffled[mustIndex]] = [shuffled[mustIndex], shuffled[targetIndex]];
        }
        const chosen = shuffled[playerIndex];
        setElectionMethod(chosen ? chosen.name : '');
        setSelectedVideo(chosen);
      }
    }
  }, [gameId, playlist]);

  useEffect(() => {
    setHasAnnouncedPhoto(false);
    setNeedsUserAction(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    return undefined;
  }, [hasAnnouncedPhoto]);

  useEffect(() => {
    if (isGaming) {
      setGamingPhotoAnimated(true);
      const t = setTimeout(() => {
        setShowGamingText(true);
        send('gaming:show', { playerId: gameId });
        if (isHuman && !startGameAudioPlayedRef.current && startGameAudioRef.current) {
          startGameAudioRef.current.currentTime = 0;
          startGameAudioRef.current.play().catch(() => { });
          startGameAudioPlayedRef.current = true;
        }
      }, 1000);
      return () => clearTimeout(t);
    } else {
      setGamingPhotoAnimated(false);
      if (!isElection) setShowGamingText(false);
      startGameAudioPlayedRef.current = false;
    }
  }, [isGaming, isElection, isHuman]);

  useEffect(() => {
    if (isElection && isHuman && !clickAudioPlayedRef.current) {
      const el = clickAudioRef.current;
      if (el) {
        el.currentTime = 0;
        el.play().catch(() => { });
        clickAudioPlayedRef.current = true;
      }
    }
    if (!isElection) {
      clickAudioPlayedRef.current = false;
    }
  }, [isElection, isHuman]);

  // 启动摄像头
  useEffect(() => {
    let currentStream = null;

    if (!isPhoto) {
      // 离开 photo 阶段时停止摄像头
      setIsPhotoCaptured(false);
      return undefined;
    }
    if (isNpc) {
      return undefined;
    }

    // 进入 photo 阶段时启动摄像头
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 685, height: 685 }
        });
        currentStream = mediaStream;
        setStream(mediaStream);
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('无法访问摄像头:', err);
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isPhoto, isNpc]);

  const capturePhoto = useCallback(() => {
    if (!cameraVideoRef.current) return false;

    const video = cameraVideoRef.current;
    if (!video.videoWidth || !video.videoHeight) {
      return false;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 685;
    canvas.height = 685;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoDataUrl = canvas.toDataURL('image/png');
    setCapturedPhoto(photoDataUrl);
    setIsPhotoCaptured(true);

    return true;
  }, [gameId]);

  useEffect(() => {
    if (!isPhoto) {
      if (preCaptureTimerRef.current) {
        clearTimeout(preCaptureTimerRef.current);
        preCaptureTimerRef.current = null;
      }
      return undefined;
    }
    if (!isPhotoCaptured && !isNpc) {
      preCaptureTimerRef.current = setTimeout(() => {
        capturePhoto();
      }, 14500);
    }
    return () => {
      if (preCaptureTimerRef.current) {
        clearTimeout(preCaptureTimerRef.current);
        preCaptureTimerRef.current = null;
      }
    };
  }, [isPhoto, isPhotoCaptured, capturePhoto, isNpc]);

  useEffect(() => {
    if (!isPhoto || !isNpc) return;
    const avatarMap = {
      '1': avatar1,
      '2': avatar2,
      '3': avatar3,
      '4': avatar4,
      '5': avatar5,
    };
    const src = avatarMap[gameId] || avatar1;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 685;
      canvas.height = 685;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedPhoto(dataUrl);
      setIsPhotoCaptured(true);
    };
    img.src = src;
  }, [isPhoto, isNpc, gameId]);

  const gamingPhotoSentRef = useRef(false);
  const dataUrlToArrayBuffer = useCallback(async (src) => {
    if (!src) return null;
    if (src.startsWith('data:')) {
      const parts = src.split(',');
      if (parts.length < 2) return null;
      const b64 = parts[1];
      const raw = atob(b64);
      const arr = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
      return arr.buffer;
    }
    try {
      const res = await fetch(src);
      const buf = await res.arrayBuffer();
      return buf;
    } catch (_) {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!isGaming) {
      setGamingCountdown(1500);
      gamingPhotoSentRef.current = false;
      return undefined;
    }
    setGamingCountdown(1500);
    const interval = setInterval(() => {
      setGamingCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    if (!gamingPhotoSentRef.current && isHuman) {
      const src = capturedPhoto || '';
      Promise.resolve(dataUrlToArrayBuffer(src)).then((buf) => {
        if (buf) {
          sendPhotoBinary(buf, 'image/png');
          gamingPhotoSentRef.current = true;
        }
      });
    }
    return () => clearInterval(interval);
  }, [isGaming, capturedPhoto, gameId, sendPhotoBinary, dataUrlToArrayBuffer, isHuman]);

  useEffect(() => {
    if (!isPhoto) {
      setPhotoCountdown(10);
      setPhotoCompleteSent(false);
      return undefined;
    }

    setPhotoCountdown(10);
    const interval = setInterval(() => {
      setPhotoCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPhoto]);

  // 处理视频播放结束事件
  const handleVideoEnded = useCallback(() => {
    if (!hasAnnouncedPhoto) {
      setHasAnnouncedPhoto(true);
      send('game:photo', { playerId: gameId, timestamp: Date.now() });
    }
  }, [gameId, hasAnnouncedPhoto, send]);

  // 阻止视频的右键菜单和其他交互
  const handleVideoContextMenu = useCallback((e) => {
    e.preventDefault();
    return false;
  }, []);

  useEffect(() => {
    if (isPhoto && isHuman && !photoAudioPlayedRef.current) {
      const el = photoAudioRef.current;
      if (el) {
        el.currentTime = 0;
        el.play().catch(() => { });
        photoAudioPlayedRef.current = true;
      }
    }
    if (!isPhoto) {
      photoAudioPlayedRef.current = false;
    }
  }, [isPhoto, isHuman]);


  useEffect(() => {
    if (!isPhoto || photoCompleteSent) return;
    if (photoCountdown === 0) {
      if (!isPhotoCaptured && cameraVideoRef.current) {
        capturePhoto();
      }
      setPhotoCompleteSent(true);
      send('game:photoDone', { playerId: gameId, timestamp: Date.now() });
    }
  }, [gameId, isPhoto, photoCompleteSent, photoCountdown, send, isPhotoCaptured, capturePhoto]);

  useEffect(() => {
    if (!isComplete) {
      setCompleteCountdown(15);
      return undefined;
    }

    setCompleteCountdown(15);
    const interval = setInterval(() => {
      setCompleteCountdown((prev) => {
        const next = Math.max(prev - 1, 0);
        if (next === 0) {
          // 倒计时结束时，如果还没有手动重置，可以触发自动重置
          // 但实际重置由服务器控制，这里只是更新显示
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isComplete]);

  useEffect(() => {
    if (isComplete && isChampion && !finishAudioPlayedRef.current) {
      const el = finishAudioRef.current;
      if (el) {
        el.currentTime = 0;
        el.play().catch(() => { });
        finishAudioPlayedRef.current = true;
      }
    }
    if (!isComplete) {
      finishAudioPlayedRef.current = false;
    }
  }, [isComplete, isChampion]);

  useEffect(() => {
    if (stage === STAGE.WAITING) {
      setResetRequested(false);
      setHasClickedStart(false);
      // Reset and stop background music
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current.currentTime = 0;
        setIsBgPlaying(false);
      }
    } else if (stage === STAGE.PHOTO) {
      // Start background music
      if (bgAudioRef.current) {
        bgAudioRef.current.currentTime = 0;
        bgAudioRef.current.play().catch(console.error);
        setIsBgPlaying(true);
      }
    }
  }, [stage]);

  const handleReset = useCallback(() => {
    if (resetRequested || !isComplete) return;
    setResetRequested(true);
    send('game:reset', { playerId: gameId, timestamp: Date.now() });
  }, [gameId, isComplete, resetRequested, send]);

  // 手动拍照按钮处理
  const handleCapturePhoto = useCallback(() => {
    if (!stream) return;

    const success = capturePhoto();
    if (success) {
      // 停止摄像头
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream, capturePhoto]);

  // 重拍功能
  const handleRetakePhoto = useCallback(async () => {
    setIsPhotoCaptured(false);
    setCapturedPhoto(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 685, height: 685 }
      });
      setStream(mediaStream);
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('无法访问摄像头:', err);
    }
  }, []);



  return (
    <div
      className={`game-page ${isWaiting ? 'game-page-waiting' : ''}`}
      style={
        isWaiting
          ? {
            backgroundImage: `url(${gameWaitingImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }
          : isPhoto
            ? {
              backgroundImage: `url(${photoBgImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
            : (isGaming || isElection)
              ? {
                backgroundImage: `url(${gameGamingBgImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }
              : isComplete
                ? {
                  backgroundImage: `url(${gameCompleteImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }
                : {}
      }
    >
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

      <audio
        ref={bgAudioRef}
        src={bgMp3}
        loop
        style={{ display: 'none' }}
        onPlay={() => setIsBgPlaying(true)}
        onPause={() => setIsBgPlaying(false)}
      />

      {!isBgPlaying && !isWaiting && (
        <button
          className="bg-audio-btn"
          onClick={handleBgAudioPlay}
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            zIndex: 9999,
            padding: '8px 16px',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            opacity: 0
          }}
        >
          点击播放背景音乐
        </button>
      )}

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


      {isPhoto && (
        <>
          <div className="countdown-display">倒计时：{photoCountdown}秒</div>
          {isNpc ? (
            <img src={capturedPhoto} alt="已拍摄" className="captured-photo" />
          ) : (
            <>
              {!isPhotoCaptured && (
                <>
                  <video
                    ref={cameraVideoRef}
                    className="camera-video"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div
                    style={{
                      position: 'absolute',
                      width: '685px',
                      height: '685px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      top: '280px',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      pointerEvents: 'none',
                      zIndex: 10
                    }}
                  >
                    <img
                      src={headDashImg}
                      alt=""
                      style={{
                        position: 'absolute',
                        top: '10%',
                        left: '0%',
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                </>
              )}
              {isPhotoCaptured && (
                <img src={capturedPhoto} alt="已拍摄" className="captured-photo" />
              )}
              <div
                className="photo-btn"
                onClick={isPhotoCaptured ? handleRetakePhoto : handleCapturePhoto}
                style={{ backgroundImage: `url(${takePhotoImg})` }}
              >
                {isPhotoCaptured ? '重拍' : '拍照'}
              </div>
            </>
          )}
        </>
      )}

      {isGaming && capturedPhoto && (
        <img src={capturedPhoto} alt="已拍摄" className={`captured-photo ${gamingPhotoAnimated ? 'gaming-photo-anim' : ''}`} />
      )}

      {(isGaming || isElection) && showGamingText && (
        <div className={`gaming-center-text gaming-center-text-show`}>
          {"请看大屏幕，\n豆选法游戏现在开始"}
        </div>
      )}

      {isComplete && (
        isChampion ? (
          <>
            <div className="countdown-display">
              倒计时：{completeCountdown}秒
            </div>
            {capturedPhoto && (
              <img
                src={capturedPhoto}
                alt="拍摄结果"
                className="complete-photo"
              />
            )}
            <div className="complete-date">
              {(() => {
                const d = new Date();
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}年${m}月${day}日`;
              })()}
            </div>
          </>
        ) : (
          <img
            src={otherCompleteImg}
            alt="完成"
            className="complete-bg"
          />
        )
      )}

      {isWaiting && (
        <>
          {typeof waitingCountdown === 'number' && waitingCountdown > 0 && (
            <div className="countdown-display">倒计时：{waitingCountdown}秒</div>
          )}
          <div className="primary-btn" onClick={handleStart}>
          </div>
          {hasClickedStart && (
            <div className="waiting-others-btn"></div>
          )}
        </>
      )}

      {(connectionState === 'connecting' || connectionState === 'error' || connectionState === 'closed') && (
        <div className="connecting-hint">连接服务端中...（{retryCount}）</div>
      )}
    </div>
  );
}

export default GamePage;

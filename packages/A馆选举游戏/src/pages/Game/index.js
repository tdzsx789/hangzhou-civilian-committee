import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { STAGE, STAGE_LABEL } from '../../constants/stages';
import { useElectionChannel } from '../../hooks/useElectionChannel';
import gameWaitingImg from '../../assets/game_waiting.jpg';
import wait1Img from '../../assets/wait1.jpg';
import wait2Img from '../../assets/wait2.jpg';
import wait3Img from '../../assets/wait3.jpg';
import wait4Img from '../../assets/wait4.jpg';
import wait5Img from '../../assets/wait5.jpg';
import gamePrepareImg from '../../assets/game_prepare.jpg';
import gameCompleteImg from '../../assets/game_complete.jpg';
import photoBgImg from '../../assets/photo_bg.jpg';
import takePhotoImg from '../../assets/takephoto.png';
import waitForPhotoImg from '../../assets/wait_for_photo.jpg';
import gameGamingBgImg from '../../assets/game_gaming_bg.jpg';
import headDashImg from '../../assets/head_dash.png';
import './index.css';
import handSvg from '../../assets/hand.svg';
import comeTakePhotoMp3 from '../../assets/audios/come_take_photo.MP3';
import startGameMp3 from '../../assets/audios/start_game.MP3';
import clickAudioMp3 from '../../assets/audios/click.MP3';
import finishAudioMp3 from '../../assets/audios/finish.MP3';
import bgMp3 from '../../assets/audios/bg.MP3';
import waitMp3 from '../../assets/audios/wait.MP3';
import otherCompleteImg from '../../assets/other_complete.jpg';

import avatar1 from '../../assets/头像1.jpg';
import avatar2 from '../../assets/头像2.jpg';
import avatar3 from '../../assets/头像3.jpg';
import avatar4 from '../../assets/头像4.jpg';
import avatar5 from '../../assets/头像5.jpg';

// ==========================================
// 摄像头画面调整参数（可在此处调整）
// ==========================================
// 放大系数 (1.0 = 原始大小, 1.5 = 放大1.5倍)
// 因为摄像头离得远，人脸小，建议放大
const CAMERA_SCALE = 1.6;

// 垂直偏移 (像素)
// 负数 = 画面向上移动 (从而显示原始画面的下方区域)
// 正数 = 画面向下移动 (从而显示原始画面的上方区域)
// 因为人脸在照片下方，需要把画面向上提，所以用负数
const CAMERA_OFFSET_Y = -80;
// ==========================================

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
  const [photoCountdown, setPhotoCountdown] = useState(null);
  const [completeCountdown, setCompleteCountdown] = useState(9);
  const [gamingCountdown, setGamingCountdown] = useState(1500);
  const [hasAnnouncedPhoto, setHasAnnouncedPhoto] = useState(false);
  const [photoCompleteSent, setPhotoCompleteSent] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [hasClickedStart, setHasClickedStart] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);
  const [gamingPhotoAnimated, setGamingPhotoAnimated] = useState(false);
  const [showGamingText, setShowGamingText] = useState(false);
  const [needsUserAction, setNeedsUserAction] = useState(false);
  const cameraVideoRef = useRef(null);

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
  const waitAudioRef = useRef(null);
  const waitAudioPlayedRef = useRef(false);
  const [isBgPlaying, setIsBgPlaying] = useState(false);
  const [showHandHint, setShowHandHint] = useState(true);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const lastTouchTimeRef = useRef(0);
  const redButtonRef = useRef(null);
  const {
    stage,
    send,
    meta: { connectionState, retryCount },
    sendPhotoBinary,
    roles,
    waitingCountdown,
    photoCountdown: serverPhotoCountdown,
    isPhotoWaiting,
    waitingForPhotos,
    champion,
    lastMessage,
  } = useElectionChannel({ role: 'game', playerId: /^([1-5])$/.test(String(gameId || '')) ? gameId : '' });

  const prevWaitingForPhotos = useRef(false);

  useEffect(() => {
    if (!prevWaitingForPhotos.current && waitingForPhotos) {
      if (!isPhotoCaptured) {
        setHasClickedStart(false);
      }
    }
    prevWaitingForPhotos.current = waitingForPhotos;
  }, [waitingForPhotos, isPhotoCaptured]);

  // 如果是在等待其他玩家拍照（waitingForPhotos），且自己还没拍照，则强制显示为 WAITING 状态
  // 这样没有拍照的玩家会看到首页，而已经拍照的玩家会继续留在 PHOTO 界面并看到“请等待其他玩家加入”
  // 注意：如果玩家点击了开始（hasClickedStart），说明是新加入或重新加入，允许进入 PHOTO 界面进行拍照
  const effectiveStage = useMemo(() => {
    // 对于 UDPPHOTO，直接穿透，不受 waitingForPhotos 的 WAITING 降级影响
    if (stage === STAGE.UDPPHOTO) {
      return STAGE.UDPPHOTO;
    }

    if (stage === STAGE.PHOTO && waitingForPhotos && !isPhotoCaptured) {
      if (hasClickedStart) {
        return stage;
      }
      return STAGE.WAITING;
    }
    return stage;
  }, [stage, waitingForPhotos, isPhotoCaptured, hasClickedStart]);

  const localStage = useMemo(() => {
    if (effectiveStage === STAGE.WAITING) {
      return STAGE.WAITING;
    }
    // UDPPHOTO 不需要检查 hasClickedStart
    if (effectiveStage === STAGE.UDPPHOTO) {
      return effectiveStage;
    }
    if (effectiveStage === STAGE.PHOTO) {
      return hasClickedStart ? effectiveStage : STAGE.WAITING;
    }
    return effectiveStage;
  }, [effectiveStage, hasClickedStart]);

  useEffect(() => {
    if (serverPhotoCountdown !== null && serverPhotoCountdown !== undefined) {
      setPhotoCountdown(serverPhotoCountdown);
    }
  }, [serverPhotoCountdown]);
  const isWaiting = localStage === STAGE.WAITING;
  const isPhoto = localStage === STAGE.PHOTO;
  const isUdpPhoto = localStage === STAGE.UDPPHOTO;
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
    if (isUdpPhoto) {
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
    isUdpPhoto,
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
    if (!waitAudioRef.current) {
      waitAudioRef.current = new Audio(waitMp3);
    }

    if (bgAudioRef.current) {
      bgAudioRef.current.volume = 0.03;
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
      bgAudioRef.current.volume = 0.03;
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
    setHasAnnouncedPhoto(false);
    setNeedsUserAction(false);
    return undefined;
  }, [hasAnnouncedPhoto]);

  useEffect(() => {
    if (isGaming) {
      if (isPhotoCaptured) {
        setGamingPhotoAnimated(true);
      }
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
  }, [isGaming, isElection, isHuman, isPhotoCaptured]);

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
      // 注意：不要在这里重置 setIsPhotoCaptured(false)，因为 GAMING 阶段可能需要显示已拍摄的照片
      // 状态重置统一在 STAGE.WAITING 时处理
      return undefined;
    }
    if (isNpc) {
      return undefined;
    }

    // 进入 photo 阶段时启动摄像头
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 800, height: 800 }
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

  // UDPPHOTO 摄像头逻辑（复制自 PHOTO）
  useEffect(() => {
    let currentStream = null;

    if (!isUdpPhoto) {
      // 离开 photo 阶段时停止摄像头
      // 注意：不要在这里重置 setIsPhotoCaptured(false)，因为 GAMING 阶段可能需要显示已拍摄的照片
      // 状态重置统一在 STAGE.WAITING 时处理
      return undefined;
    }
    if (isNpc) {
      return undefined;
    }

    // 进入 photo 阶段时启动摄像头
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 800, height: 800 }
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
  }, [isUdpPhoto, isNpc]);

  const capturePhoto = useCallback(() => {
    if (!cameraVideoRef.current) return false;

    const video = cameraVideoRef.current;
    if (!video.videoWidth || !video.videoHeight) {
      return false;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // 应用缩放和位移参数
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(CAMERA_SCALE, CAMERA_SCALE);
    ctx.translate(0, CAMERA_OFFSET_Y);

    // 计算保持比例的绘制尺寸 (模拟 object-fit: cover)
    // 如果直接用 canvas.width/height 绘制，会导致非 1:1 的视频源变形（如变窄）
    const videoAspect = video.videoWidth / video.videoHeight;
    const canvasAspect = canvas.width / canvas.height;

    let drawW, drawH;
    if (videoAspect > canvasAspect) {
      // 视频比画布更宽（例如 4:3 或 16:9），以高度为基准填满，宽度自然延伸
      drawH = canvas.height;
      drawW = drawH * videoAspect;
    } else {
      // 视频比画布更高，以宽度为基准
      drawW = canvas.width;
      drawH = drawW / videoAspect;
    }

    // 绘制图片，保持比例居中绘制
    ctx.drawImage(video, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // 简单的色彩校正：降低红色通道，修复红背景导致的偏色
    // 之前 0.85 导致偏青，说明减红太多。现在改为 0.92 左右，并提升整体亮度。
    const brightness = 1.2; // 整体提亮 20%
    const redAdjustment = 0.85; // 红色通道在提亮的基础上打 92 折，相当于净提升 1.2*0.92 = 1.104
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // data[i] is Red, data[i+1] is Green, data[i+2] is Blue
      data[i] = Math.min(data[i] * brightness * redAdjustment, 255);
      data[i+1] = Math.min(data[i+1] * brightness, 255);
      data[i+2] = Math.min(data[i+2] * brightness, 255);
    }
    ctx.putImageData(imageData, 0, 0);

    const photoDataUrl = canvas.toDataURL('image/png');
    setCapturedPhoto(photoDataUrl);
    setIsPhotoCaptured(true);

    return true;
  }, [gameId]);

  useEffect(() => {
    if (lastMessage?.type === 'game:capture') {
      console.log('[game] received capture command via socket');
      capturePhoto();
    }
  }, [lastMessage, capturePhoto]);



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
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedPhoto(dataUrl);
      setIsPhotoCaptured(true);
    };
    img.src = src;
  }, [isPhoto, isNpc, gameId]);

  // UDPPHOTO 头像逻辑（复制自 PHOTO）
  useEffect(() => {
    if (!isUdpPhoto || !isNpc) return;
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
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedPhoto(dataUrl);
      setIsPhotoCaptured(true);
    };
    img.src = src;
  }, [isUdpPhoto, isNpc, gameId]);

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
      // 只有在已拍照的情况下才发送照片
      if (isPhotoCaptured && capturedPhoto) {
        const src = capturedPhoto;
        Promise.resolve(dataUrlToArrayBuffer(src)).then((buf) => {
          if (buf) {
            sendPhotoBinary(buf, 'image/png');
            gamingPhotoSentRef.current = true;
          }
        });
      } else {
        // 如果没有拍照，也标记为已发送，避免重复尝试（虽然实际并未发送）
        // 或者也可以不标记，但这取决于是否允许后续补发。根据当前需求，似乎是"如果没有的话不上传"
        console.log('[game] no photo captured, skip uploading');
        gamingPhotoSentRef.current = true;
      }
    }
    return () => clearInterval(interval);
  }, [isGaming, capturedPhoto, gameId, sendPhotoBinary, dataUrlToArrayBuffer, isHuman, isPhotoCaptured]);

  useEffect(() => {
    if (!isPhoto) {
      setPhotoCountdown(null);
      setPhotoCompleteSent(false);
      return undefined;
    }
  }, [isPhoto]);

  // UDPPHOTO 倒计时清除逻辑（复制自 PHOTO）
  useEffect(() => {
    if (!isUdpPhoto) {
      setPhotoCountdown(null);
      setPhotoCompleteSent(false);
      return undefined;
    }
  }, [isUdpPhoto]);

  useEffect(() => {
    if (isPhoto && !isPhotoWaiting && isHuman && !photoAudioPlayedRef.current) {
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
  }, [isPhoto, isHuman, isPhotoWaiting]);

  // UDPPHOTO 音效逻辑
  useEffect(() => {
    if (isUdpPhoto && isHuman && !photoAudioPlayedRef.current) {
      const el = photoAudioRef.current;
      if (el) {
        el.currentTime = 0;
        el.play().catch(() => { });
        photoAudioPlayedRef.current = true;
      }
    }
    if (!isUdpPhoto) {
      photoAudioPlayedRef.current = false;
    }
  }, [isUdpPhoto, isHuman]);

  useEffect(() => {
    if (isPhoto && isPhotoWaiting && isHuman && !waitAudioPlayedRef.current) {
      const el = waitAudioRef.current;
      if (el) {
        el.currentTime = 0;
        el.play().catch(() => { });
        waitAudioPlayedRef.current = true;
      }
    }
    if ((!isPhoto || !isPhotoWaiting) && waitAudioPlayedRef.current) {
      const el = waitAudioRef.current;
      if (el) {
        el.pause();
        el.currentTime = 0;
      }
      waitAudioPlayedRef.current = false;
    }
  }, [isPhoto, isPhotoWaiting, isHuman]);

  // UDPPHOTO 等待音效逻辑（禁用其他MP3）
  useEffect(() => {
    // 禁用 UDPPHOTO 阶段的音效，只保留背景音乐
  }, []);

  useEffect(() => {
    let t = null;
    if (isPhoto && !isNpc) {
      setShowHandHint(true);
      t = setInterval(() => {
        setShowHandHint((prev) => !prev);
      }, 3000);
    } else {
      setShowHandHint(false);
    }
    return () => {
      if (t) clearInterval(t);
    };
  }, [isPhoto, isNpc]);

  // UDPPHOTO 手势提示逻辑（复制自 PHOTO）
  useEffect(() => {
    let t = null;
    if (isUdpPhoto && !isNpc) {
      setShowHandHint(true);
      t = setInterval(() => {
        setShowHandHint((prev) => !prev);
      }, 3000);
    } else {
      setShowHandHint(false);
    }
    return () => {
      if (t) clearInterval(t);
    };
  }, [isUdpPhoto, isNpc]);


  useEffect(() => {
    if (!isPhoto || photoCompleteSent) return;
    if (photoCountdown === 0) {
      setPhotoCompleteSent(true);
      send('game:photoDone', { playerId: gameId, timestamp: Date.now(), hasPhoto: isPhotoCaptured });
    }
  }, [gameId, isPhoto, photoCompleteSent, photoCountdown, send, isPhotoCaptured]);

  // UDPPHOTO 拍照完成逻辑（复制自 PHOTO）
  useEffect(() => {
    if (!isUdpPhoto || photoCompleteSent) return;
    if (photoCountdown === 0) {
      setPhotoCompleteSent(true);
      send('game:photoDone', { playerId: gameId, timestamp: Date.now(), hasPhoto: isPhotoCaptured });
    }
  }, [gameId, isUdpPhoto, photoCompleteSent, photoCountdown, send, isPhotoCaptured]);

  // 当处于等待其他玩家拍照的状态时，如果自己的拍照状态发生变化，实时通知服务端
  useEffect(() => {
    if (isPhoto && isPhotoWaiting) {
      send('game:photoDone', { playerId: gameId, hasPhoto: isPhotoCaptured });
    }
  }, [isPhoto, isPhotoWaiting, isPhotoCaptured, gameId, send]);

  // UDPPHOTO 拍照等待状态同步逻辑（复制自 PHOTO）
  useEffect(() => {
    if (isUdpPhoto && isPhotoWaiting) {
      send('game:photoDone', { playerId: gameId, hasPhoto: isPhotoCaptured });
    }
  }, [isUdpPhoto, isPhotoWaiting, isPhotoCaptured, gameId, send]);

  useEffect(() => {
    if (!isComplete) {
      setCompleteCountdown(9);
      return undefined;
    }

    setCompleteCountdown(9);
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
      setCapturedPhoto(null);
      setIsPhotoCaptured(false);

      // Reset and stop background music
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current.currentTime = 0;
        setIsBgPlaying(false);
      }
    } else if (stage === STAGE.PHOTO || stage === STAGE.UDPPHOTO) {
      // Start background music
      if (bgAudioRef.current) {
        bgAudioRef.current.volume = 0.03;
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
    // 拍照成功后不关闭摄像头，让照片直接覆盖在视频上
  }, [stream, capturePhoto]);

  // 重拍功能
  const handleRetakePhoto = useCallback(async () => {
    setIsPhotoCaptured(false);
    setCapturedPhoto(null);
    // 不需要重新打开摄像头，因为从未关闭
  }, []);

  useEffect(() => {
    if (lastMessage?.type === 'game:recapture') {
      console.log('[game] received recapture command via socket');
      handleRetakePhoto();
    } else if (lastMessage?.type === 'game:capture') {
      console.log('[game] received capture command via socket');
      handleCapturePhoto();
    }
  }, [lastMessage, handleRetakePhoto, handleCapturePhoto]);



  return (
    <div
      className={`game-page ${isWaiting ? 'game-page-waiting' : ''}`}
      style={
        isWaiting
          ? {
            backgroundImage: `url(${{
              '1': wait1Img,
              '2': wait2Img,
              '3': wait3Img,
              '4': wait4Img,
              '5': wait5Img,
            }[gameId] || gameWaitingImg
              })`,
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
            : isUdpPhoto
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
        onLoadedMetadata={(e) => { e.currentTarget.volume = 0.03; }}
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
          {isPhotoWaiting ? (
            <div className="photo-countdown-display">请等待其他玩家加入</div>
          ) : (
            photoCountdown !== null && <div className="photo-countdown-display">拍照倒计时：{photoCountdown}秒</div>
          )}
          {isNpc ? (
            <img src={capturedPhoto} alt="已拍摄" className="captured-photo" />
          ) : (
            <>
              {/* 始终显示摄像头画面，不要销毁 */}
              <div className="camera-video" style={{ overflow: 'hidden' }}>
                <video
                  ref={cameraVideoRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${CAMERA_SCALE}) translateY(${CAMERA_OFFSET_Y}px)`
                  }}
                  autoPlay
                  playsInline
                  muted
                />
              </div>

              {!isPhotoCaptured && (
                <div
                  style={{
                    position: 'absolute',
                    width: '800px',
                    height: '800px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: '200px',
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
              )}
              {isPhotoCaptured && (
                <img src={capturedPhoto} alt="已拍摄" className="captured-photo" style={{ zIndex: 11 }} />
              )}
              <div
                className="photo-btn"
                onClick={isPhotoCaptured ? handleRetakePhoto : handleCapturePhoto}
                style={{ backgroundImage: `url(${takePhotoImg})`, zIndex: 12, cursor: 'pointer' }}
              >
                {isPhotoCaptured ? '重拍' : '拍照'}
              </div>
              {showHandHint && (
                <img
                  src={handSvg}
                  alt=""
                  className="hand-hint"
                  style={{ pointerEvents: 'none' }}
                />
              )}
            </>
          )}
        </>
      )}

      {isUdpPhoto && (
        <>
          {photoCountdown !== null ? (
            <div className="photo-countdown-display">拍照倒计时：{photoCountdown}秒</div>
          ) : (
            <div className="photo-countdown-display">请看小屏幕拍照</div>
          )}
          {isNpc ? (
            <img src={capturedPhoto} alt="已拍摄" className="captured-photo" />
          ) : (
            <>
              {/* 始终显示摄像头画面，不要销毁 */}
              <div className="camera-video" style={{ overflow: 'hidden' }}>
                <video
                  ref={cameraVideoRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${CAMERA_SCALE}) translateY(${CAMERA_OFFSET_Y}px)`
                  }}
                  autoPlay
                  playsInline
                  muted
                />
              </div>

              {!isPhotoCaptured && (
                <div
                  style={{
                    position: 'absolute',
                    width: '800px',
                    height: '800px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: '200px',
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
              )}
              {isPhotoCaptured && (
                <img src={capturedPhoto} alt="已拍摄" className="captured-photo" style={{ zIndex: 11 }} />
              )}
              <div
                className="photo-btn"
                onClick={isPhotoCaptured ? handleRetakePhoto : handleCapturePhoto}
                style={{ backgroundImage: `url(${takePhotoImg})`, zIndex: 12, cursor: 'pointer' }}
              >
                {isPhotoCaptured ? '重拍' : '拍照'}
              </div>
              {showHandHint && (
                <img
                  src={handSvg}
                  alt=""
                  className="hand-hint"
                  style={{ pointerEvents: 'none' }}
                />
              )}
            </>
          )}
        </>
      )}

      {isGaming && capturedPhoto && isPhotoCaptured && (
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
          <div className="primary-btn" onClick={handleStart}>
          </div>
        </>
      )}

      {(connectionState === 'connecting' || connectionState === 'error' || connectionState === 'closed') && (
        <div className="connecting-hint">连接服务端中...（{retryCount}）</div>
      )}
    </div>
  );
}

export default GamePage;

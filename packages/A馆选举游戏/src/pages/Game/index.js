import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { STAGE, STAGE_LABEL } from '../../constants/stages';
import { useElectionChannel } from '../../hooks/useElectionChannel';
import gameWaitingImg from '../../assets/game_waiting.jpg';
import gamePrepareImg from '../../assets/game_prepare.jpg';
import gameCompleteImg from '../../assets/game_complete.jpg';
import photoBgImg from '../../assets/photo_bg.jpg';
import gameDemoVideo from '../../assets/gameDemo.mp4';
import takePhotoImg from '../../assets/takephoto.png';
import './index.css';

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
  const { gameId = '1' } = useParams();
  const [countdown, setCountdown] = useState(15);
  const [photoCountdown, setPhotoCountdown] = useState(15);
  const [completeCountdown, setCompleteCountdown] = useState(15);
  const [hasAnnouncedPhoto, setHasAnnouncedPhoto] = useState(false);
  const [photoCompleteSent, setPhotoCompleteSent] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [hasClickedStart, setHasClickedStart] = useState(false);
  const [electionMethod, setElectionMethod] = useState('');
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);
  const videoRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const {
    stage,
    send,
    meta: { connectionState },
  } = useElectionChannel({ role: 'game', playerId: gameId });

  const isWaiting = stage === STAGE.WAITING;
  const isPrepare = stage === STAGE.PREPARE;
  const isPhoto = stage === STAGE.PHOTO;
  const isComplete = stage === STAGE.COMPLETE;

  const buttonCopy = useMemo(() => {
    if (connectionState !== 'connected' && connectionState !== 'idle') {
      return '正在重连...';
    }
    if (isWaiting) {
      return '开始';
    }
    if (isPrepare) {
      return '准备拍照';
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
    isPrepare,
    isWaiting,
    photoCountdown,
    resetRequested,
    completeCountdown,
  ]);

  const handleStart = useCallback(() => {
    if (!isWaiting) return;
    setHasClickedStart(true);
    send('game:start', { playerId: gameId });
  }, [gameId, isWaiting, send]);

  // 在进入 PREPARE 阶段时，为每个终端分配一个不重复的方法
  useEffect(() => {
    if (isPrepare && !electionMethod) {
      const playerIndex = parseInt(gameId, 10) - 1;
      if (playerIndex >= 0 && playerIndex < 5) {
        // 使用一个基于当前分钟和阶段的确定性种子来打乱方法列表
        // 这样所有终端在同一个时间段内会得到相同的打乱顺序
        const seed = Math.floor(Date.now() / (1000 * 60)); // 每分钟变化一次
        const methodsToUse = ELECTION_METHODS.slice(0, 7);
        
        // 创建一个确定性但看起来随机的打乱顺序（改进的 Fisher-Yates 洗牌）
        const shuffledMethods = [...methodsToUse];
        for (let i = shuffledMethods.length - 1; i > 0; i--) {
          // 使用种子生成一个伪随机索引
          const pseudoRandom = ((seed * 7919 + i * 9973) % 2147483647) % (i + 1);
          [shuffledMethods[i], shuffledMethods[pseudoRandom]] = [
            shuffledMethods[pseudoRandom],
            shuffledMethods[i],
          ];
        }
        
        // 每个终端根据 playerIndex 选择对应的方法（取前5个，确保不重复）
        setElectionMethod(shuffledMethods[playerIndex]);
      }
    } else if (!isPrepare) {
      setElectionMethod('');
    }
  }, [isPrepare, gameId, electionMethod]);

  useEffect(() => {
    if (!isPrepare) {
      setHasAnnouncedPhoto(false);
      setHasClickedStart(false);
      // 离开 PREPARE 阶段时暂停视频
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // 重置视频到开始位置
      }
      return undefined;
    }

    // 进入 PREPARE 阶段时播放视频
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // 确保从开始播放
      videoRef.current.play().catch((err) => {
        console.warn('Video autoplay failed:', err);
      });
    }
  }, [isPrepare]);

  // 启动摄像头
  useEffect(() => {
    let currentStream = null;

    if (!isPhoto) {
      // 离开 photo 阶段时停止摄像头
      setIsPhotoCaptured(false);
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
  }, [isPhoto]);

  useEffect(() => {
    if (!isPhoto) {
      setPhotoCountdown(15);
      setPhotoCompleteSent(false);
      return undefined;
    }

    setPhotoCountdown(15);
    const interval = setInterval(() => {
      setPhotoCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPhoto]);

  // 处理视频播放结束事件
  const handleVideoEnded = useCallback(() => {
    if (isPrepare && !hasAnnouncedPhoto) {
      setHasAnnouncedPhoto(true);
      send('game:photo', { playerId: gameId, timestamp: Date.now() });
    }
  }, [gameId, hasAnnouncedPhoto, isPrepare, send]);

  // 阻止视频的右键菜单和其他交互
  const handleVideoContextMenu = useCallback((e) => {
    e.preventDefault();
    return false;
  }, []);

  // 拍照功能（通用函数，可用于手动和自动拍照）
  const capturePhoto = useCallback(() => {
    if (!cameraVideoRef.current) return false;
    
    const video = cameraVideoRef.current;
    // 如果视频还没有加载或没有流，尝试使用当前的 stream
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
    
    // 保存到 localStorage
    const storageKey = `photo_${gameId}`;
    localStorage.setItem(storageKey, photoDataUrl);
    
    return true;
  }, [gameId]);

  useEffect(() => {
    if (!isPhoto || photoCompleteSent) return;
    if (photoCountdown === 0) {
      // 如果还没有拍照，自动拍摄最后一帧
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
    if (stage === STAGE.WAITING) {
      setResetRequested(false);
      setHasClickedStart(false);
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

  // 从 localStorage 加载照片（用于 COMPLETE 阶段显示）
  useEffect(() => {
    if (isComplete) {
      const storageKey = `photo_${gameId}`;
      const savedPhoto = localStorage.getItem(storageKey);
      if (savedPhoto) {
        setCapturedPhoto(savedPhoto);
      }
    }
  }, [isComplete, gameId]);

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
          : isPrepare
          ? {
            backgroundImage: `url(${gamePrepareImg})`,
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
      {!isWaiting && !isPrepare && !isPhoto && !isComplete && (
        <>
          <header>
            <p className="sub-title">终端 {gameId}</p>
            <h1>基层组织选举互动 - 参赛端</h1>
          </header>

          <section className="card">
            <h2>{STAGE_LABEL[stage]}</h2>
            <StageDescription
              stage={stage}
              countdown={countdown}
              photoCountdown={photoCountdown}
              completeCountdown={completeCountdown}
            />
          </section>

          <footer>
            <p>当前连接状态：{connectionState}</p>
            <small>所有信息通过 WebSocket 实时同步。</small>
          </footer>
        </>
      )}

      {isPrepare && (
        <>
          <video
            ref={videoRef}
            className="game-demo-video"
            src={gameDemoVideo}
            autoPlay
            // muted
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            onEnded={handleVideoEnded}
            onContextMenu={handleVideoContextMenu}
          />
          {electionMethod && (
            <div className="election-method-text">{electionMethod}</div>
          )}
        </>
      )}

      {isPhoto && (
        <>
          <div className="countdown-display">
            倒计时：{photoCountdown}秒
          </div>
          {!isPhotoCaptured && (
            <>
              <video
                ref={cameraVideoRef}
                className="camera-video"
                autoPlay
                playsInline
                muted
              />
              <button 
                className="photo-btn" 
                onClick={handleCapturePhoto}
                style={{
                  backgroundImage: `url(${takePhotoImg})`,
                }}
              >
                拍照
              </button>
            </>
          )}
          {isPhotoCaptured && (
            <>
              <img
                src={capturedPhoto}
                alt="已拍摄"
                className="captured-photo"
              />
              <button 
                className="photo-btn" 
                onClick={handleRetakePhoto}
                style={{
                  backgroundImage: `url(${takePhotoImg})`,
                }}
              >
                重拍
              </button>
            </>
          )}
        </>
      )}

      {isComplete && (
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
        </>
      )}

      {isWaiting && (
        <>
          <div className="primary-btn" onClick={handleStart}>
          </div>
          {hasClickedStart && (
            <div className="waiting-others-btn"></div>
          )}
        </>
      )}
    </div>
  );
}

export default GamePage;


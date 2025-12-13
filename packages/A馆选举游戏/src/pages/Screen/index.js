import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import coverImg from '../../assets/cover.jpg';
import screenStartImg from '../../assets/screen_start.jpg';
import screenPrepareImg from '../../assets/screen_prepare.jpg';
import screenPhotoImg from '../../assets/screen_photo.jpg';
import screenCompleteImg from '../../assets/screen_complete.jpg';
import { STAGE, STAGE_LABEL } from '../../constants/stages';
import { useElectionChannel } from '../../hooks/useElectionChannel';

import video1 from '../../assets/videos/背箱法.mp4';
import video2 from '../../assets/videos/豆选法.mp4';
import video3 from '../../assets/videos/喊选法.mp4';
import video4 from '../../assets/videos/举手法.mp4';
import video5 from '../../assets/videos/票选法.mp4';
import video6 from '../../assets/videos/烧洞法.mp4';
import video7 from '../../assets/videos/投纸团法.mp4';

const videoList = [
  { name: '背箱法', url: video1 },
  { name: '豆选法', url: video2 },
  { name: '喊选法', url: video3 },
  { name: '举手法', url: video4 },
  { name: '票选法', url: video5 },
  { name: '烧洞法', url: video6 },
  { name: '投纸团法', url: video7 },
]

function ScreenPage() {
  const {
    stage,
    meta: { readyPlayers = [], totalPlayers, connectionState },
  } = useElectionChannel({ role: 'screen' });

  const [shuffledVideos, setShuffledVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const [needsUserAction, setNeedsUserAction] = useState(false);

  const timeline = [
    { key: STAGE.WAITING, label: '等待开始' },
    { key: STAGE.PREPARE, label: '准备拍照' },
    { key: STAGE.PHOTO, label: '拍照倒计时' },
    { key: STAGE.COMPLETE, label: '本轮结束' },
  ];

  const isWaiting = stage === STAGE.WAITING;
  const isPrepare = stage === STAGE.PREPARE;
  const isPhoto = stage === STAGE.PHOTO;
  const isComplete = stage === STAGE.COMPLETE;
  
  useEffect(() => {
    if (isWaiting) {
      const arr = [...videoList];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      setShuffledVideos(arr);
      setCurrentVideoIndex(0);
      setNeedsUserAction(false);
    }
  }, [isWaiting]);

  useEffect(() => {
    if (!isWaiting) return;
    const el = videoRef.current;
    if (!el) return;
    const run = async () => {
      try {
        el.muted = false;
        el.volume = 1;
        await el.play();
        setNeedsUserAction(false);
      } catch (e) {
        try {
          el.muted = true;
          await el.play();
        } catch (_) {}
        setNeedsUserAction(true);
      }
    };
    run();
    return () => {
      el.pause();
    };
  }, [isWaiting, currentVideoIndex, shuffledVideos]);

  const playNext = () => {
    setCurrentVideoIndex((idx) => {
      const len = shuffledVideos.length || 1;
      return (idx + 1) % len;
    });
  };

  let backgroundImage = coverImg;
  if (isWaiting) {
    backgroundImage = screenStartImg;
  } else if (isPrepare) {
    backgroundImage = screenPrepareImg;
  } else if (isPhoto) {
    backgroundImage = screenPhotoImg;
  } else if (isComplete) {
    backgroundImage = screenCompleteImg;
  }

  const shouldShowContent = !isWaiting && !isPrepare && !isPhoto && !isComplete;

  return (
    <div
      className="screen-page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {isWaiting && shuffledVideos.length > 0 && (
        <video
          key={shuffledVideos[currentVideoIndex]?.url}
          className="screen-video"
          src={shuffledVideos[currentVideoIndex]?.url}
          autoPlay
          ref={videoRef}
          playsInline
          controls={false}
          onEnded={playNext}
          onError={playNext}
        />
      )}
      {isWaiting && needsUserAction && (
        <button
          className="sound-btn"
          onClick={async () => {
            const el = videoRef.current;
            if (!el) return;
            try {
              el.muted = false;
              el.volume = 1;
              await el.play();
              setNeedsUserAction(false);
            } catch (_) {}
          }}
        >
          点击开启声音
        </button>
      )}
      {shouldShowContent && <div className="screen-overlay" />}
      {shouldShowContent && (
        <div className="screen-content">
          <header>
            <p className="sub-title">A 馆 - 基层组织选举互动</p>
            <h1>{STAGE_LABEL[stage]}</h1>
            <p className="connection">WebSocket 状态：{connectionState}</p>
          </header>

          <section className="status-panel">
            <div className="status-card">
              <p className="value">
                {readyPlayers.length}/{totalPlayers}
              </p>
              <p className="label">已准备终端</p>
            </div>
            <div className="status-card">
              <p className="value">{stageName(stage)}</p>
              <p className="label">当前阶段</p>
            </div>
          </section>

          <section className="timeline">
            {timeline.map((item) => (
              <TimelineItem
                key={item.key}
                item={item}
                active={item.key === stage}
                passed={stageOrder(item.key) < stageOrder(stage)}
              />
            ))}
          </section>

          <section className="players">
            {[...Array(totalPlayers)].map((_, index) => {
              const playerId = String(index + 1);
              const ready = readyPlayers.includes(playerId);
              return (
                <div key={playerId} className={`player ${ready ? 'ready' : ''}`}>
                  <span>终端 {playerId}</span>
                  <strong>{ready ? '已准备' : '等待中'}</strong>
                </div>
              );
            })}
          </section>
        </div>
      )}
    </div>
  );
}

function TimelineItem({ item, active, passed }) {
  return (
    <div className={`timeline-item ${active ? 'active' : ''} ${passed ? 'passed' : ''}`}>
      <div className="bullet" />
      <span>{item.label}</span>
    </div>
  );
}

function stageName(stage) {
  if (stage === STAGE.WAITING) return '等待';
  if (stage === STAGE.PREPARE) return '准备';
  if (stage === STAGE.PHOTO) return '拍照';
  if (stage === STAGE.COMPLETE) return '完成';
  return '未知';
}

function stageOrder(stage) {
  return [STAGE.WAITING, STAGE.PREPARE, STAGE.PHOTO, STAGE.COMPLETE].indexOf(stage);
}

export default ScreenPage;

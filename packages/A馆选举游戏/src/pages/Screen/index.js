import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import coverImg from '../../assets/cover.jpg';
import screenStartImg from '../../assets/screen_start.jpg';
import screenPrepareImg from '../../assets/screen_prepare.jpg';
import screenPhotoImg from '../../assets/screen_photo.jpg';
import gameCompleteImg from '../../assets/game_complete.jpg';
import beforeGameImg from '../../assets/beforegame.jpg';
import gamingImg from '../../assets/gaming.jpg';
import bowlImg from '../../assets/bowl.png';
import bean1 from '../../assets/beans/bean1.png';
import bean2 from '../../assets/beans/bean2.png';
import bean3 from '../../assets/beans/bean3.png';
import bean4 from '../../assets/beans/bean4.png';
import bean5 from '../../assets/beans/bean5.png';
import bean6 from '../../assets/beans/bean6.png';
import bean7 from '../../assets/beans/bean7.png';
import bean8 from '../../assets/beans/bean8.png';
import bean9 from '../../assets/beans/bean9.png';
import bean10 from '../../assets/beans/bean10.png';
import bean11 from '../../assets/beans/bean11.png';
import bean12 from '../../assets/beans/bean12.png';
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
    photosBin,
    gamingShowPlayers,
    roles,
    send,
    champion,
  } = useElectionChannel({ role: 'screen' });

  const [shuffledVideos, setShuffledVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const [needsUserAction, setNeedsUserAction] = useState(false);
  const [photoItems, setPhotoItems] = useState([]); // { playerId, url }
  const [completeCountdown, setCompleteCountdown] = useState(15);

  const timeline = [
    { key: STAGE.WAITING, label: '等待开始' },
    { key: STAGE.PREPARE, label: '准备拍照' },
    { key: STAGE.PHOTO, label: '拍照倒计时' },
    { key: STAGE.GAMING, label: '游戏中' },
    { key: STAGE.COMPLETE, label: '本轮结束' },
  ];

  const isWaiting = stage === STAGE.WAITING;
  const isPrepare = stage === STAGE.PREPARE;
  const isPhoto = stage === STAGE.PHOTO;
  const isGaming = stage === STAGE.GAMING;
  const isElection = stage === STAGE.ELECTION;
  const isComplete = stage === STAGE.COMPLETE;
  const [beanItems, setBeanItems] = useState([]);
  const championSentRef = useRef('');
  const [showGamingOverlay, setShowGamingOverlay] = useState(false);
  const [gamingOverlayFading, setGamingOverlayFading] = useState(false);
  const [showElectionContainer, setShowElectionContainer] = useState(false);
  const [electionContainerFading, setElectionContainerFading] = useState(false);
  useEffect(() => {
    const items = (Array.isArray(photosBin) ? photosBin : []).map((p) => {
      const blob = new Blob([p.buffer], { type: p.mime || 'image/png' });
      const url = URL.createObjectURL(blob);
      return { playerId: String(p.playerId || ''), url };
    });
    setPhotoItems(items);
    return () => {
      items.forEach((it) => URL.revokeObjectURL(it.url));
    };
  }, [photosBin]);
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
    if (!isComplete) {
      setCompleteCountdown(15);
      return undefined;
    }
    setCompleteCountdown(15);
    const interval = setInterval(() => {
      setCompleteCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isComplete]);

  useEffect(() => {
    if (isGaming) {
      setShowGamingOverlay(true);
      setGamingOverlayFading(false);
    }
  }, [isGaming]);

  useEffect(() => {
    if (isElection && showGamingOverlay) {
      setGamingOverlayFading(true);
      const t = setTimeout(() => {
        setShowGamingOverlay(false);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [isElection, showGamingOverlay]);

  useEffect(() => {
    if (!isGaming && !isElection) {
      setShowGamingOverlay(false);
      setGamingOverlayFading(false);
    }
  }, [isGaming, isElection]);

  useEffect(() => {
    if (isElection) {
      setShowElectionContainer(true);
      setElectionContainerFading(false);
    }
  }, [isElection]);

  useEffect(() => {
    if (isComplete && showElectionContainer) {
      setElectionContainerFading(true);
      const t = setTimeout(() => {
        setShowElectionContainer(false);
        setBeanItems([]);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [isComplete, showElectionContainer]);

  useEffect(() => {
    if (!isElection && !isComplete) {
      setShowElectionContainer(false);
      setElectionContainerFading(false);
      setBeanItems([]);
    }
  }, [isElection, isComplete]);

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
        } catch (_) { }
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
  } else if (isGaming) {
    backgroundImage = beforeGameImg;
  } else if (isElection) {
    backgroundImage = gamingImg;
  } else if (isComplete) {
    backgroundImage = gameCompleteImg;
  }

  const shouldShowContent = !isWaiting && !isPrepare && !isPhoto && !isGaming && !isElection && !isComplete;


  useEffect(() => {
    if (!isElection) {
      return;
    }
    const imgs = [bean1, bean2, bean3, bean4, bean5, bean6, bean7, bean8, bean9, bean10, bean11, bean12];
    const anchors = [
      { left: 577, top: 699 },
      { left: 776, top: 703 },
      { left: 970, top: 698 },
      { left: 1172, top: 715 },
      { left: 1367, top: 702 },
    ];
    const items = [];
    const npcCount = 10;
    const hrangeNpcBase = 50;
    const vMaxNpc = 10;
    const order = ['1', '2', '3', '4', '5'];
    const humans = Array.isArray(roles?.humans) ? roles.humans : [];
    const npcs = Array.isArray(roles?.npcs) ? roles.npcs : [];
    const humanGroupIndices = anchors
      .map((_, i) => {
        const pid = order[i];
        const isHuman = humans.includes(pid);
        const isNpc = npcs.includes(pid);
        return isHuman || (!isNpc && !isHuman) ? i : null;
      })
      .filter((i) => i !== null);
    const largeHumanIdx = humanGroupIndices.length > 0
      ? humanGroupIndices[Math.floor(Math.random() * humanGroupIndices.length)]
      : null;
    if (largeHumanIdx !== null) {
      const championPid = order[largeHumanIdx];
      if (championSentRef.current !== championPid) {
        send('champion:update', { playerId: championPid });
        championSentRef.current = championPid;
      }
    }
    anchors.forEach((anchor, gIdx) => {
      const pid = order[gIdx];
      const isHuman = humans.includes(pid);
      const isNpc = npcs.includes(pid);
      if (isHuman || (!isNpc && !isHuman)) {
        const count = gIdx === largeHumanIdx ? 40 : 20;
        const hrHumanBase = 50;
        const vMaxHuman = count;
        for (let i = 0; i < count; i++) {
          const src = imgs[Math.floor(Math.random() * imgs.length)];
          const vOffset = count > 1 ? Math.round((i / (count - 1)) * vMaxHuman) : 0;
          const left = anchor.left + (Math.random() * (hrHumanBase * 2) - hrHumanBase);
          const top = anchor.top - vOffset;
          const rotate = Math.floor(Math.random() * 360);
          const delay = i * 0.2;
          items.push({ src, left: Math.round(left), top: Math.round(top), rotate, delay, g: gIdx, type: 'human' });
        }
      } else {
        for (let i = 0; i < npcCount; i++) {
          const src = imgs[Math.floor(Math.random() * imgs.length)];
          const vOffset = npcCount > 1 ? Math.round((i / (npcCount - 1)) * vMaxNpc) : 0;
          const left = anchor.left + (Math.random() * (hrangeNpcBase * 2) - hrangeNpcBase);
          const top = anchor.top - vOffset;
          const rotate = Math.floor(Math.random() * 360);
          const delay = i * 0.2;
          items.push({ src, left: Math.round(left), top: Math.round(top), rotate, delay, g: gIdx, type: 'npc' });
        }
      }
    });
    const t = setTimeout(() => {
      setBeanItems(items);
    }, 1000);
    return () => clearTimeout(t);
  }, [isElection, roles]);

  return (
    <div
      className={`screen-page ${isGaming ? 'gaming' : ''}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {showGamingOverlay && (
        <div
          className={`screen-bg-layer ${gamingOverlayFading ? 'fade-out' : ''}`}
          style={{ backgroundImage: `url(${beforeGameImg})` }}
        />
      )}
      {isGaming && (() => {
        const positions = {
          '1': { left: 315, top: 236 },
          '2': { left: 588, top: 202 },
          '3': { left: 882, top: 189 },
          '4': { left: 1199, top: 203 },
          '5': { left: 1545, top: 250 },
        };
        const urlByPlayer = photoItems.reduce((acc, it) => {
          acc[it.playerId] = it.url;
          return acc;
        }, {});
        const order = ['1', '2', '3', '4', '5'];
        const humans = Array.isArray(roles?.humans) ? roles.humans : [];
        return order.map((pid) => {
          const isHuman = humans.includes(pid);
          const show = isHuman && gamingShowPlayers.includes(pid) && urlByPlayer[pid];
          if (!show) return null;
          const pos = positions[pid] || { left: 100, top: 100 };
          return (
            <img
              key={pid}
              src={urlByPlayer[pid]}
              alt="参赛终端照片"
              className="screen-photo-item screen-photo-item-show"
              style={{ left: `${pos.left}px`, top: `${pos.top}px` }}
            />
          );
        });
      })()}
      {showElectionContainer && (
        <div className={`election-container ${electionContainerFading ? 'container-fade-out' : ''}`}>
          <img
            src={bowlImg}
            alt="选举碗"
            style={{ position: 'absolute', left: '463px', top: '656px', zIndex: 10 }}
          />
          {beanItems.map((it, idx) => (
            <img
              key={`bean-${idx}`}
              src={it.src}
              alt="豆"
              className="bean-item bean-item-show"
              style={{ left: `${it.left}px`, top: `${it.top}px`, transform: `rotate(${it.rotate}deg) scale(0.3)`, transformOrigin: 'top left', animationDelay: `${it.delay}s` }}
            />
          ))}
          {(() => {
            const positions = {
              '1': { left: 238, top: 147 },
              '2': { left: 529, top: 122 },
              '3': { left: 854, top: 122 },
              '4': { left: 1166, top: 125 },
              '5': { left: 1487, top: 116 },
            };
            const urlByPlayer = photoItems.reduce((acc, it) => {
              acc[it.playerId] = it.url;
              return acc;
            }, {});
            const order = ['1', '2', '3', '4', '5'];
            const humans = Array.isArray(roles?.humans) ? roles.humans : [];
            return order.map((pid) => {
              const isHuman = humans.includes(pid);
              const show = isHuman && gamingShowPlayers.includes(pid) && urlByPlayer[pid];
              if (!show) return null;
              const pos = positions[pid] || { left: 100, top: 100 };
              return (
                <img
                  key={pid}
                  src={urlByPlayer[pid]}
                  alt="参赛终端照片"
                  className="screen-photo-item screen-photo-item-show"
                  style={{ left: `${pos.left}px`, top: `${pos.top}px` }}
                />
              );
            });
          })()}
        </div>
      )}
      {isComplete && (() => {
        const championPhoto = photoItems.find((p) => p.playerId === champion);
        const src = championPhoto ? championPhoto.url : '';
        return (
          <>
            <div className="countdown-display">倒计时：{completeCountdown}秒</div>
            {src && (
              <img src={src} alt="拍摄结果" className="complete-photo" />
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
        );
      })()}
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
            } catch (_) { }
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
  if (stage === STAGE.GAMING) return '游戏中';
  if (stage === STAGE.ELECTION) return '选举';
  if (stage === STAGE.COMPLETE) return '完成';
  return '未知';
}

function stageOrder(stage) {
  return [STAGE.WAITING, STAGE.PREPARE, STAGE.PHOTO, STAGE.GAMING, STAGE.ELECTION, STAGE.COMPLETE].indexOf(stage);
}

export default ScreenPage;

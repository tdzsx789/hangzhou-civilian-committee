import React from 'react';
import './index.css';
import coverImg from '../../assets/cover.jpg';
import screenStartImg from '../../assets/screen_start.jpg';
import screenPrepareImg from '../../assets/screen_prepare.jpg';
import screenPhotoImg from '../../assets/screen_photo.jpg';
import screenCompleteImg from '../../assets/screen_complete.jpg';
import { STAGE, STAGE_LABEL } from '../../constants/stages';
import { useElectionChannel } from '../../hooks/useElectionChannel';

function ScreenPage() {
  const {
    stage,
    meta: { readyPlayers = [], totalPlayers, connectionState },
  } = useElectionChannel({ role: 'screen' });

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
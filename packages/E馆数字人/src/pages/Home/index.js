import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import videoSrc from '../../assets/aihuman.mp4';
import { useVideoDebugControls } from './utils';

const isTest = false;

function Home() {
  const videoRef = useRef(null);
  const [needsUserAction, setNeedsUserAction] = useState(false);
  const { getVideoInfo } = useVideoDebugControls(videoRef, isTest);
  const [videoInfo, setVideoInfo] = useState({ left: 0, top: 0, width: 1080, height: 1080 });
  const [sseStatus, setSseStatus] = useState('disconnected');

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const playVideo = async () => {
      try {
        videoEl.muted = false;
        videoEl.volume = 1;
        await videoEl.play();
      } catch (err) {
        try {
          videoEl.muted = true;
          await videoEl.play();
        } catch (e) {
          // ignore if autoplay still blocked
        }
        setNeedsUserAction(true);
      }
    };

    playVideo();

    return () => {
      videoEl.pause();
    };
  }, []);

  useEffect(() => {
    const url = process.env.REACT_APP_SSE_URL || 'http://localhost:5280/events';
    const es = new EventSource(url);
    es.onopen = () => setSseStatus('connected');
    es.onerror = () => setSseStatus('error');
    es.onmessage = () => {};
    return () => {
      es.close();
    };
  }, []);

  // 更新视频信息显示（仅在测试模式下）
  useEffect(() => {
    if (!isTest) return;

    const updateInfo = () => {
      const info = getVideoInfo();
      setVideoInfo(info);
    };

    updateInfo();
    const interval = setInterval(updateInfo, 100);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getVideoInfo]);

  return (
    <div className="home-page">
      <video
        ref={videoRef}
        className="home-bg-video"
        src={videoSrc}
        autoPlay
        loop
        playsInline
        controls={false}
      />
      {isTest && (
        <div className="video-debug-info">
          <div>left: {videoInfo.left}px</div>
          <div>top: {videoInfo.top}px</div>
          <div>width: {videoInfo.width}px</div>
          <div>height: {videoInfo.height}px</div>
          <div>sse: {sseStatus}</div>
        </div>
      )}
      {needsUserAction && (
        <button
          className="sound-btn"
          onClick={async () => {
            const videoEl = videoRef.current;
            if (!videoEl) return;
            try {
              videoEl.muted = false;
              videoEl.volume = 1;
              await videoEl.play();
              setNeedsUserAction(false);
            } catch (err) {
              // 依然失败则维持提示
            }
          }}
        >
          点击开启声音
        </button>
      )}
    </div>
  );
}

export default Home;

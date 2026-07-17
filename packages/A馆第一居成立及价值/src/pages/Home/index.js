import React, { useEffect, useRef, useState } from 'react';
import './index.css';

function Home({ volume = 1, playbackCmd, videoSrc }) {
  const videoRef = useRef(null);
  const [needsUserAction, setNeedsUserAction] = useState(false);
  const [udpLog, setUdpLog] = useState([]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl && playbackCmd) {
      const cmd = playbackCmd.type;
      if (cmd === 'PAUSE') {
        videoEl.pause();
      } else if (cmd === 'START') {
        videoEl.play().catch(() => {});
      } else if (cmd === 'FORWARD') {
        if (Number.isFinite(videoEl.duration)) {
          videoEl.currentTime = Math.min(videoEl.duration, videoEl.currentTime + 5);
        }
      } else if (cmd === 'BACK') {
        videoEl.currentTime = Math.max(0, videoEl.currentTime - 5);
      }
    }
  }, [playbackCmd]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    let isMounted = true;
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const playVideo = async () => {
      try {
        videoEl.muted = false;
        videoEl.volume = volume;
        await videoEl.play();
      } catch (err) {
        if (!isMounted) return;
        try {
          videoEl.muted = true;
          await videoEl.play();
        } catch (e) {
          // ignore if autoplay still blocked
        }
        if (isMounted) {
          setNeedsUserAction(true);
        }
      }
    };

    playVideo();

    return () => {
      isMounted = false;
      videoEl.pause();
    };
  }, []);

  useEffect(() => {
    const url = process.env.REACT_APP_SSE_URL || 'http://localhost:5280/events';
    const es = new EventSource(url);
    es.onopen = () => {
      console.log('SSE open', url);
    };
    es.onmessage = (e) => {
      const text = e.data;
      console.log('SSE message', text);
      const cmd = String(text).trim().toUpperCase();
      const v = videoRef.current;
      if (v) {
        if (cmd === 'PAUSE') {
          v.pause();
        } else if (cmd === 'START') {
          v.play().catch(() => setNeedsUserAction(true));
        }
      }
      setUdpLog((prev) => [text, ...prev].slice(0, 5));
    };
    es.onerror = (e) => {
      console.log('SSE error', e);
    };
    return () => {
      es.close();
    };
  }, []);

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
      {needsUserAction && (
        <button
          className="sound-btn"
          onClick={async () => {
            const videoEl = videoRef.current;
            if (!videoEl) return;
            try {
              videoEl.muted = false;
              videoEl.volume = volume;
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

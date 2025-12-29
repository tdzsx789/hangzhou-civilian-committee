import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import videoSrc from '../../assets/aihuman.mp4';

function Home({ volume = 1, playbackCmd }) {
  const videoRef = useRef(null);
  const [needsUserAction, setNeedsUserAction] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = volume;
  }, [volume]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !playbackCmd) return;
    const { type } = playbackCmd;
    if (type === 'PAUSE') {
      el.pause();
    } else if (type === 'START') {
      el.play().catch(() => {});
    } else if (type === 'FORWARD') {
      el.currentTime = Math.min(el.duration, el.currentTime + 5);
    } else if (type === 'BACK') {
      el.currentTime = Math.max(0, el.currentTime - 5);
    }
  }, [playbackCmd]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const playVideo = async () => {
      try {
        videoEl.muted = false;
        videoEl.volume = volume;
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
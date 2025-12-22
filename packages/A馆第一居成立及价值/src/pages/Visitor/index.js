import './index.css';
import React, { useEffect, useRef, useState } from 'react';
import P1 from '../../assets/P1.jpg';


function Visitor({ image, video, className, volume = 1, playbackCmd }) {
  const videoRef = useRef(null);
  const [needsUserAction, setNeedsUserAction] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (el && playbackCmd) {
      const cmd = playbackCmd.type;
      if (cmd === 'PAUSE') {
        el.pause();
      } else if (cmd === 'START') {
        el.play().catch(() => {});
      } else if (cmd === 'FORWARD') {
        el.currentTime = Math.min(el.duration, el.currentTime + 5);
      } else if (cmd === 'BACK') {
        el.currentTime = Math.max(0, el.currentTime - 5);
      }
    }
  }, [playbackCmd]);

  useEffect(() => {
    const el = videoRef.current;
    if (el) {
      el.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const el = videoRef.current;
    if (!video || !el) return;
    const playVideo = async () => {
      try {
        el.muted = false;
        el.volume = volume;
        await el.play();
      } catch (err) {
        try {
          el.muted = true;
          await el.play();
        } catch (e) {}
        setNeedsUserAction(true);
      }
    };
    playVideo();
    return () => {
      el.pause();
    };
  }, [video]);

  return (
    <div className={`visitor-page ${className || ''}`}>
      {video ? (
        <>
          <video
            ref={videoRef}
            className="visitor-video-el"
            src={video}
            autoPlay
            playsInline
            controls={false}
            onEnded={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                // Ensure it stays paused at the first frame
                videoRef.current.pause(); 
              }
            }}
          />
          {needsUserAction && (
            <button
              className="visitor-sound-btn"
              onClick={async () => {
                const el = videoRef.current;
                if (!el) return;
                try {
                  el.muted = false;
                  el.volume = 1;
                  await el.play();
                  setNeedsUserAction(false);
                } catch (err) {}
              }}
            >
              点击开启声音
            </button>
          )}
        </>
      ) : image ? (
        <img className="visitor-image" src={image} alt="visitor" />
      ) : (
        <img className="visitor-image" src={P1} alt="visitor" />
      )}
    </div>
  );
}

export default Visitor;

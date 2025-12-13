import React, { useEffect, useRef, useState } from 'react';
import './index.css';

function Visitor({ image, video, onBack, className }) {
  const videoRef = useRef(null);
  const [needsUserAction, setNeedsUserAction] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !video) return;
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
      el && el.pause();
    };
  }, [video]);

  return (
    <div className={`visitor-page ${className || ''}`} style={{ position: 'absolute', inset: 0 }}>
      {image && (
        <img src={image} alt="visitor" className="visitor-media" />
      )}
      {video && (
        <video
          ref={videoRef}
          src={video}
          autoPlay
          loop
          playsInline
          controls={false}
          className="visitor-media"
        />
      )}
      {needsUserAction && (
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
          style={{ position: 'absolute', right: 16, bottom: 16 }}
        >
          点击开启声音
        </button>
      )}
      {onBack && (
        <div
          onClick={onBack}
          style={{ position: 'absolute', left: 0, top: 0, width: 150, height: 150, zIndex: 2 }}
        />
      )}
    </div>
  );
}

export default Visitor;

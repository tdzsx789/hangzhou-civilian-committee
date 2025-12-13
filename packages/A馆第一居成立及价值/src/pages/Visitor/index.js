import './index.css';
import React, { useEffect, useRef, useState } from 'react';
import P1 from '../../assets/P1.jpg';


function Visitor({ image, video, className }) {
  const videoRef = useRef(null);
  const [needsUserAction, setNeedsUserAction] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!video || !el) return;
    const playVideo = async () => {
      try {
        el.muted = false;
        el.volume = 1;
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
            loop
            playsInline
            controls={false}
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

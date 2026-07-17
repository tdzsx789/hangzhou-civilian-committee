import React, { useRef, useEffect } from 'react';
import './index.css';

function Detail({ onBack, volume = 1, playbackCmd, videoSrc }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
  }, [volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playbackCmd) return;
    const { type } = playbackCmd;
    if (type === 'START') {
      video.play().catch(() => {});
    } else if (type === 'PAUSE') {
      video.pause();
    } else if (type === 'FORWARD') {
      if (Number.isFinite(video.duration)) {
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
      }
    } else if (type === 'BACK') {
      video.currentTime = Math.max(0, video.currentTime - 5);
    }
  }, [playbackCmd]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 自动播放逻辑
    const playVideo = async () => {
      try {
        // 尝试有声播放
        video.muted = false;
        video.volume = volume;
        await video.play();
      } catch (err) {
        console.log('Autoplay with sound failed, trying muted', err);
        // 失败则静音播放
        video.muted = true;
        try {
          await video.play();
        } catch (e) {
          console.error('Autoplay failed', e);
        }
      }
    };

    playVideo();

    // 播放结束停留在最后一帧
    const handleEnded = () => {
      video.pause();
    };

    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="detail-page">
      <video
        ref={videoRef}
        src={videoSrc}
        className="detail-video"
        controls={false}
        playsInline
        autoPlay
        muted
        preload="auto"
      />
      {/* 点击任意位置返回首页，或者预留返回区域 */}
      <div 
        className="back-mask" 
        onClick={onBack} 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1
        }}
      />
    </div>
  );
}

export default Detail;

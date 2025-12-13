import { useEffect, useState, useCallback } from 'react';

// 调试工具：视频位置和尺寸调整
export function useVideoDebugControls(videoRef, enabled = false) {
  const [position, setPosition] = useState({ left: 0, top: 0 }); // 像素
  const [size, setSize] = useState({ width: 1080, height: 1080 });

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      const videoEl = videoRef.current;
      if (!videoEl) return;

      const step = 2; // 移动步长（像素）
      const sizeStep = 2; // 尺寸调整步长（像素）

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setPosition((prev) => ({
            ...prev,
            top: Math.max(0, prev.top - step),
          }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setPosition((prev) => ({
            ...prev,
            top: prev.top + step,
          }));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setPosition((prev) => ({
            ...prev,
            left: Math.max(0, prev.left - step),
          }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setPosition((prev) => ({
            ...prev,
            left: prev.left + step,
          }));
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          setSize((prev) => ({
            width: prev.width + sizeStep,
            height: prev.width + sizeStep, // 保持正方形
          }));
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setSize((prev) => ({
            width: Math.max(100, prev.width - sizeStep),
            height: Math.max(100, prev.width - sizeStep), // 保持正方形
          }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoRef, enabled]);

  // 应用样式到视频元素
  useEffect(() => {
    if (!enabled) return;

    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.style.left = `${position.left}px`;
    videoEl.style.top = `${position.top}px`;
    videoEl.style.width = `${size.width}px`;
    videoEl.style.height = `${size.height}px`;
  }, [position, size, videoRef, enabled]);

  // 获取当前视频的实际位置和尺寸（用于显示）
  const getVideoInfo = useCallback(() => {
    const videoEl = videoRef.current;
    if (!videoEl) {
      return {
        left: position.left,
        top: position.top,
        width: size.width,
        height: size.height,
      };
    }

    const rect = videoEl.getBoundingClientRect();
    return {
      left: Math.round(rect.left),
      top: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  }, [position, size, videoRef]);

  return { position, size, getVideoInfo };
}


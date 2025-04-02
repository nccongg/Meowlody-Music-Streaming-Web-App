import { useEffect, useCallback, useRef } from 'react';

interface VideoPerformanceOptions {
  shouldPlay?: boolean;
  quality?: 'low' | 'medium' | 'high';
  maxFPS?: number;
}

type QualitySettings = {
  [key in Required<VideoPerformanceOptions>['quality']]: {
    playbackRate: number;
    resolution: number;
  };
};

const qualityMap: QualitySettings = {
  low: {
    playbackRate: 0.75,
    resolution: 480,
  },
  medium: {
    playbackRate: 1,
    resolution: 720,
  },
  high: {
    playbackRate: 1,
    resolution: 1080,
  },
};

export const useVideoPerformance = (
  videoRef: React.RefObject<HTMLVideoElement>,
  { shouldPlay = true, quality = 'medium', maxFPS = 30 }: VideoPerformanceOptions = {},
) => {
  const frameRef = useRef<number | undefined>(undefined);
  const lastFrameTimeRef = useRef<number>(0);
  const frameIntervalRef = useRef<number>(1000 / maxFPS);

  const optimizePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Apply quality settings
    const { playbackRate } = qualityMap[quality];
    video.playbackRate = playbackRate;

    // Set video attributes for better performance
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;

    // Enable hardware acceleration
    if (video.style) {
      video.style.transform = 'translateZ(0)';
      video.style.backfaceVisibility = 'hidden';
      video.style.perspective = '1000';
      video.style.willChange = 'transform';
    }

    // Mobile-specific optimizations
    if (window.innerWidth < 768) {
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
    }
  }, [quality, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    optimizePlayback();

    const animate = (currentTime: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastFrameTimeRef.current;

      if (deltaTime >= frameIntervalRef.current) {
        if (shouldPlay && video.paused) {
          video.play().catch(() => {
            console.warn('Video playback failed - user interaction may be needed');
          });
        } else if (!shouldPlay && !video.paused) {
          video.pause();
        }
        lastFrameTimeRef.current = currentTime;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [shouldPlay, optimizePlayback]);

  // Clean up on unmount
  useEffect(() => {
    const cleanup = () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
    return cleanup;
  }, [frameRef]);
};

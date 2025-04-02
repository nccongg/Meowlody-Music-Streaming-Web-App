import React, { useEffect, useRef, memo, useState } from 'react';
import { optimizeVideo } from '../utils/videoOptimizer';
import { useVideoPerformance } from '../hooks/useVideoPerformance';

interface VideoBackgroundProps {
  videoSource: string;
  quality?: 'low' | 'medium' | 'high';
  maxFPS?: number;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = memo(
  ({ videoSource, quality = 'medium', maxFPS = 30 }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [optimizedSource, setOptimizedSource] = useState(videoSource);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Handle window resize
    useEffect(() => {
      const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
      };

      // Call once to set initial state correctly
      handleResize();

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useVideoPerformance(videoRef as React.RefObject<HTMLVideoElement>, {
      shouldPlay: !isLoading && !isMobile, // Don't autoplay on mobile
      quality: isMobile ? 'low' : quality, // Lower quality on mobile
      maxFPS: isMobile ? 24 : maxFPS, // Lower FPS on mobile
    });

    useEffect(() => {
      setIsLoading(true);
      optimizeVideo(videoSource)
        .then(setOptimizedSource)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }, [videoSource]);

    const handleLoadedData = () => {
      setIsLoading(false);
    };

    // Check again right before rendering
    const isCurrentlyMobile = window.innerWidth < 768;

    return (
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div
          className={`absolute inset-0 bg-black/50 z-10 transition-opacity duration-1000 ${
            isLoading ? 'opacity-100' : 'opacity-50'
          }`}
        />
        {/* Static background image for mobile */}
        {isCurrentlyMobile && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${optimizedSource.replace('.mp4', '.jpg')})`,
              filter: 'blur(8px)',
            }}
          />
        )}
        {/* Video background for desktop */}
        {!isCurrentlyMobile && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleLoadedData}
            className={`absolute min-h-full min-w-full object-cover transition-opacity duration-1000 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: '1000',
              willChange: 'transform',
            }}
          >
            <source src={optimizedSource} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    );
  },
);

VideoBackground.displayName = 'VideoBackground';

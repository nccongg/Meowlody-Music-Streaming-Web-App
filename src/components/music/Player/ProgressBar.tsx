// import { useRef, useState, useEffect } from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (progress: number) => void;
}

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newProgress = (clickPosition / rect.width) * 100;
    onSeek(newProgress);
  };

  return (
    <div className="w-full flex items-center gap-2">
      <span className="text-xs text-gray-400 min-w-[35px] text-right">{formatTime(currentTime)}</span>

      <div className="relative flex-1 h-1 group">
        <div className="absolute inset-0 rounded-full bg-gray-800 cursor-pointer" onClick={handleClick}>
          <div
            className="absolute h-full bg-[#FACD66] rounded-full transition-colors"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute h-3 w-3 bg-[#FACD66] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-33%)` }}
          />
        </div>
      </div>

      <span className="text-xs text-gray-400 min-w-[35px]">{formatTime(duration)}</span>
    </div>
  );
}

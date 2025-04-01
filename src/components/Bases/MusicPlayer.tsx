import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBackwardStep,
  faForwardStep,
  faPause,
  faPlay,
  faRepeat,
  faShuffle,
  faVolumeHigh,
  faForward,
  faBackward,
} from '@fortawesome/free-solid-svg-icons';
import React, { useRef, useEffect, useState } from 'react';
import { useMusicPlayer } from '../../contexts/MusicPlayerContext';

const MusicPlayer: React.FC = () => {
  const {
    currentTrack,
    currentTime,
    duration,
    isPlaying,
    volume,
    isShuffling,
    isRepeating,
    togglePlay,
    setProgress,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrevious,
    seekForward,
    seekBackward,
  } = useMusicPlayer();

  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setProgress(percent * 100);
  };

  const handleProgressBarDrag = (e: MouseEvent) => {
    if (!isDragging || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setProgress(percent * 100);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleProgressBarDrag(e);
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 p-4">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-lg shadow-lg ${!currentTrack ? 'bg-gray-800' : ''}`}>
            {currentTrack && (
              <img
                src={currentTrack.album.imageUrl}
                alt={currentTrack.title}
                className="w-full h-full rounded-lg object-cover"
              />
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-white">{currentTrack?.title || 'No song selected'}</h4>
            <p className="text-sm text-gray-400">{currentTrack?.artist.name || 'Select a song to play'}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-xl mx-8">
          <div className="flex items-center gap-6">
            <button
              className={`text-gray-400 hover:text-white transition-colors ${isShuffling ? 'text-purple-500' : ''}`}
              onClick={toggleShuffle}
              disabled={!currentTrack}
            >
              <FontAwesomeIcon icon={faShuffle} className="w-4 h-4" />
            </button>
            <button
              className="text-gray-400 hover:text-white transition-colors"
              onClick={playPrevious}
              disabled={!currentTrack}
            >
              <FontAwesomeIcon icon={faBackwardStep} className="w-5 h-5" />
            </button>
            <button
              className="text-gray-400 hover:text-white transition-colors"
              onClick={seekBackward}
              disabled={!currentTrack}
            >
              <FontAwesomeIcon icon={faBackward} className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                currentTrack ? 'bg-white hover:bg-gray-200' : 'bg-gray-700 cursor-not-allowed'
              }`}
              disabled={!currentTrack}
            >
              <FontAwesomeIcon
                icon={isPlaying ? faPause : faPlay}
                className={`w-4 h-4 ml-0.5 ${currentTrack ? 'text-black' : 'text-gray-400'}`}
              />
            </button>
            <button
              className="text-gray-400 hover:text-white transition-colors"
              onClick={seekForward}
              disabled={!currentTrack}
            >
              <FontAwesomeIcon icon={faForward} className="w-4 h-4" />
            </button>
            <button
              className="text-gray-400 hover:text-white transition-colors"
              onClick={playNext}
              disabled={!currentTrack}
            >
              <FontAwesomeIcon icon={faForwardStep} className="w-5 h-5" />
            </button>
            <button
              className={`text-gray-400 hover:text-white transition-colors ${isRepeating ? 'text-purple-500' : ''}`}
              onClick={toggleRepeat}
              disabled={!currentTrack}
            >
              <FontAwesomeIcon icon={faRepeat} className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-gray-400 min-w-[40px] text-right">{formatTime(currentTime)}</span>
            <div
              ref={progressBarRef}
              className="flex-1 h-1 bg-gray-800 rounded-full cursor-pointer"
              onClick={handleProgressBarClick}
              onMouseDown={() => setIsDragging(true)}
            >
              <div
                className="h-full bg-purple-500 rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
              </div>
            </div>
            <span className="text-xs text-gray-400 min-w-[40px]">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faVolumeHigh} className="w-4 h-4 text-gray-400" />
          <div
            className="w-24 h-1 bg-gray-800 rounded-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              setVolume(percent);
            }}
          >
            <div className="h-full bg-purple-500 rounded-full relative" style={{ width: `${volume * 100}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;

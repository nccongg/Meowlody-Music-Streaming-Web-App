import { useContext } from 'react';
import { MusicPlayerContext } from '../contexts/MusicPlayerContext';
import { Track } from '../types/music';

export interface MusicPlayerContextType {
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  isShuffling: boolean;
  isRepeating: boolean;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playNext: () => void;
  playPrevious: () => void;
  playTrack: (track: Track) => void;
  addToQueue: (track: Track) => void;
}

export function useMusicPlayer(): MusicPlayerContextType {
  const context = useContext(MusicPlayerContext);

  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }

  return context;
}

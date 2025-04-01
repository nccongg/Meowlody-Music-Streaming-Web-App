import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Track } from '../services/music';

interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffling: boolean;
  isRepeating: boolean;
  queue: Track[];
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setProgress: (value: number) => void;
  setVolume: (value: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekForward: () => void;
  seekBackward: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [playHistory, setPlayHistory] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeating]);

  // Add keyboard controls for seeking
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!audioRef.current || !currentTrack) return;

      switch (e.key) {
        case 'ArrowRight':
          seekForward();
          break;
        case 'ArrowLeft':
          seekBackward();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentTrack]);

  const playTrack = async (track: Track) => {
    if (!audioRef.current) return;

    try {
      if (currentTrack?.id === track.id) {
        togglePlay();
        return;
      }

      // Add current track to history if exists
      if (currentTrack) {
        setPlayHistory((prev) => [...prev, currentTrack]);
      }

      // Update queue if not already in it
      if (!queue.find((t) => t.id === track.id)) {
        setQueue((prev) => [...prev, track]);
      }

      audioRef.current.src = track.previewUrl;
      setCurrentTrack(track);

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing track:', error);
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current || !currentTrack) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      setIsPlaying(false);
    }
  };

  const setProgress = (value: number) => {
    if (!audioRef.current) return;
    const time = (value / 100) * duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (value: number) => {
    if (!audioRef.current) return;
    const newVolume = Math.max(0, Math.min(1, value));
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const toggleShuffle = () => {
    setIsShuffling((prev) => !prev);
  };

  const toggleRepeat = () => {
    setIsRepeating((prev) => !prev);
  };

  const playNext = () => {
    if (!currentTrack || queue.length === 0) return;

    const currentIndex = queue.findIndex((track) => track.id === currentTrack.id);
    let nextTrack: Track | undefined;

    if (isShuffling) {
      const remainingTracks = queue.filter((track) => track.id !== currentTrack.id);
      nextTrack = remainingTracks[Math.floor(Math.random() * remainingTracks.length)];
    } else {
      nextTrack = queue[currentIndex + 1];
    }

    if (nextTrack) {
      playTrack(nextTrack);
    } else if (isRepeating) {
      playTrack(queue[0]);
    }
  };

  const playPrevious = () => {
    if (playHistory.length === 0) return;

    const previousTrack = playHistory[playHistory.length - 1];
    setPlayHistory((prev) => prev.slice(0, -1));
    playTrack(previousTrack);
  };

  const seekForward = () => {
    if (!audioRef.current || !currentTrack) return;
    const newTime = Math.min(audioRef.current.currentTime + 10, duration);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const seekBackward = () => {
    if (!audioRef.current || !currentTrack) return;
    const newTime = Math.max(audioRef.current.currentTime - 10, 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isShuffling,
        isRepeating,
        queue,
        playTrack,
        togglePlay,
        setProgress,
        setVolume: handleVolumeChange,
        toggleShuffle,
        toggleRepeat,
        playNext,
        playPrevious,
        seekForward,
        seekBackward,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}

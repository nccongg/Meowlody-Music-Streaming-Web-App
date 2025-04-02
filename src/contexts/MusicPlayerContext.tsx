import React, { createContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Track } from '../types/music';
import { MusicPlayerContextType } from '../hooks/useMusicPlayer';

export const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export function MusicPlayerProvider({ children }: MusicPlayerProviderProps) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    audioRef.current.src = currentTrack.audioUrl;
    if (isPlaying) {
      audioRef.current.play();
    }

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    const handleEnded = () => {
      if (isRepeating) {
        audioRef.current?.play();
      } else {
        playNext();
      }
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentTrack, isPlaying, isRepeating]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const setProgress = (progress: number) => {
    if (!audioRef.current) return;
    const time = (progress / 100) * duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!audioRef.current) return;
    const normalizedVolume = newVolume / 100;
    audioRef.current.volume = normalizedVolume;
    setVolume(newVolume);
  };

  const toggleShuffle = () => setIsShuffling(!isShuffling);
  const toggleRepeat = () => setIsRepeating(!isRepeating);

  const playNext = () => {
    if (!currentTrack || queue.length === 0) return;

    // Add current track to history
    setHistory((prev) => [currentTrack, ...prev]);

    // Get next track
    const nextTrack = isShuffling ? queue[Math.floor(Math.random() * queue.length)] : queue[0];

    // Remove the track from queue
    setQueue((prev) => prev.filter((track) => track.id !== nextTrack.id));

    // Play the next track
    setCurrentTrack(nextTrack);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (!currentTrack || history.length === 0) return;

    // Add current track back to queue
    setQueue((prev) => [currentTrack, ...prev]);

    // Get previous track from history
    const previousTrack = history[0];
    setHistory((prev) => prev.slice(1));

    // Play the previous track
    setCurrentTrack(previousTrack);
    setIsPlaying(true);
  };

  const addToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track]);
  };

  const playTrack = (track: Track) => {
    if (currentTrack) {
      setHistory((prev) => [currentTrack, ...prev]);
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const contextValue: MusicPlayerContextType = {
    currentTrack,
    currentTime,
    duration,
    isPlaying,
    volume,
    isShuffling,
    isRepeating,
    togglePlay,
    setProgress,
    setVolume: handleVolumeChange,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrevious,
    addToQueue,
    playTrack,
  };

  return <MusicPlayerContext.Provider value={contextValue}>{children}</MusicPlayerContext.Provider>;
}

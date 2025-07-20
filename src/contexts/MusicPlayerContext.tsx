import { createContext, useState, ReactNode } from 'react';
import { JamendoService } from '../services/api/jamendo';

interface Song {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  cover?: string;
  url?: string;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

interface SongInput {
  id: string;
  title: string;
  [key: string]: unknown;
}

interface MusicPlayerContextProps {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  playlists: Playlist[];
  queue: Song[];
  playSong: (songId: string, title: string) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  previousSong: () => void;
  setVolume: (volume: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  createPlaylist: (name: string, songs: SongInput[]) => void;
  addToPlaylist: (playlistId: string, song: Song) => void;
}

const defaultContext: MusicPlayerContextProps = {
  currentSong: null,
  isPlaying: false,
  volume: 70,
  playlists: [],
  queue: [],
  playSong: () => {},
  pauseSong: () => {},
  resumeSong: () => {},
  nextSong: () => {},
  previousSong: () => {},
  setVolume: () => {},
  addToQueue: () => {},
  removeFromQueue: () => {},
  createPlaylist: () => {},
  addToPlaylist: () => {}
};

const MusicPlayerContext = createContext<MusicPlayerContextProps>(defaultContext);

interface MusicPlayerProviderProps {
  children: ReactNode;
}

function MusicPlayerProvider({ children }: MusicPlayerProviderProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [queue, setQueue] = useState<Song[]>([]);

  // Mẫu dữ liệu âm nhạc để demo cùng ảnh bìa mặc định
  const sampleSongs: Record<string, Song> = {
    'song1': { id: 'song1', title: 'Dynamite', artist: 'BTS', album: 'BE', cover: 'https://i.scdn.co/image/ab67616d0000b273a7944447ded8a5a3c38f755b' },
    'song2': { id: 'song2', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', cover: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36' },
    'song3': { id: 'song3', title: 'positions', artist: 'Ariana Grande', album: 'Positions', cover: 'https://i.scdn.co/image/ab67616d0000b2735ef878a782c987d38d82b605' },
    'song4': { id: 'song4', title: 'Life Goes On', artist: 'BTS', album: 'BE', cover: 'https://i.scdn.co/image/ab67616d0000b273a7944447ded8a5a3c38f755b' },
    'song5': { id: 'song5', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', cover: 'https://i.scdn.co/image/ab67616d0000b2734c47e377b7ccd5fe30f291d5' },
  };

  const playSong = async (songId: string, title: string) => {
    // Nếu là bài hát từ kho demo
    if (sampleSongs[songId]) {
      setCurrentSong(sampleSongs[songId]);
      setIsPlaying(true);
      console.log(`Playing demo song: ${title} (ID: ${songId})`);
      return;
    }
    
    try {
      // Nếu là ID từ Jamendo (thường là số)
      if (/^\d+$/.test(songId)) {
        // Tạo bài hát với thông tin cơ bản
        const newSong: Song = {
          id: songId,
          title: title,
          artist: 'Jamendo Artist',
          album: 'Jamendo Album',
          cover: `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(title)}`,
        };
        
        setCurrentSong(newSong);
        setIsPlaying(true);
        
        // Cố gắng lấy thêm thông tin bài hát từ API (không chờ)
        JamendoService.searchTracks(title)
          .then(tracks => {
            // Tìm track chính xác hoặc gần giống
            const matchedTrack = tracks.find(t => 
              t.id === songId || 
              t.title.toLowerCase().includes(title.toLowerCase())
            );
            
            if (matchedTrack) {
              // Cập nhật bài hát với thông tin đầy đủ
              const updatedSong: Song = {
                id: songId,
                title: matchedTrack.title,
                artist: matchedTrack.artist.name,
                album: matchedTrack.album.name,
                cover: matchedTrack.album.imageUrl
              };
              setCurrentSong(updatedSong);
            }
          })
          .catch(err => console.error('Error fetching track details:', err));
      } else {
        // ID không phải Jamendo, tạo bài hát cơ bản
        const newSong: Song = {
          id: songId,
          title: title,
          cover: `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(title)}`
        };
        setCurrentSong(newSong);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing song:', error);
      // Fallback to basic song
      const newSong: Song = {
        id: songId,
        title: title,
        cover: `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(title)}`
      };
      setCurrentSong(newSong);
      setIsPlaying(true);
    }
    
    console.log(`Playing song: ${title} (ID: ${songId})`);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const resumeSong = () => {
    if (currentSong) {
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setCurrentSong(nextSong);
      setQueue(prevQueue => prevQueue.slice(1));
      setIsPlaying(true);
    }
  };

  const previousSong = () => {
    // Implementation would depend on history tracking
    console.log('Previous song');
  };

  const volumeHandler = (newVolume: number) => {
    // Đảm bảo giá trị nằm trong khoảng 0-100
    const clampedVolume = Math.max(0, Math.min(100, newVolume));
    setVolume(clampedVolume);
    console.log(`Volume stored in context: ${clampedVolume}%`);
  };

  const addToQueue = (song: Song) => {
    setQueue(prevQueue => [...prevQueue, song]);
  };

  const removeFromQueue = (songId: string) => {
    setQueue(prevQueue => prevQueue.filter(song => song.id !== songId));
  };

  const createPlaylist = (name: string, songs: SongInput[]) => {
    // Convert song data from chat to proper Song objects
    const playlistSongs = songs.map(songData => {
      if (typeof songData === 'string') {
        return { id: songData, title: songData };
      }
      
      if (sampleSongs[songData.id]) {
        return sampleSongs[songData.id]; 
      }
      
      return {
        id: songData.id || `song-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: songData.title || 'Unknown Song'
      };
    });

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      songs: playlistSongs
    };

    setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
    console.log(`Created playlist: ${name} with ${playlistSongs.length} songs`);
  };

  const addToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(prevPlaylists => 
      prevPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            songs: [...playlist.songs, song]
          };
        }
        return playlist;
      })
    );
  };

  return (
    <MusicPlayerContext.Provider value={{
      currentSong,
      isPlaying,
      volume,
      playlists,
      queue,
      playSong,
      pauseSong,
      resumeSong,
      nextSong,
      previousSong,
      setVolume: volumeHandler,
      addToQueue,
      removeFromQueue,
      createPlaylist,
      addToPlaylist
    }}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export { MusicPlayerContext, MusicPlayerProvider };

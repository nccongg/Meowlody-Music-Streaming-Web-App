import React, { useEffect, useRef, useState } from 'react';
import { useMusicPlayer } from '../../../hooks/useMusicPlayer';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faRepeat, faShuffle } from '@fortawesome/free-solid-svg-icons';

// Hàm utility để chuyển đổi âm lượng từ dải 0-100 sang 0-1 cho HTMLAudioElement
const convertToAudioVolume = (volume: number): number => {
  // Chuyển đổi từ 0-100 sang 0-1
  const scaledVolume = volume / 100;
  // Đảm bảo giá trị nằm trong khoảng [0, 1]
  return Math.max(0, Math.min(1, scaledVolume));
};

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    volume,
    pauseSong,
    resumeSong,
    nextSong,
    previousSong,
    setVolume
  } = useMusicPlayer();

  // Trạng thái nội bộ cho việc theo dõi thời gian và các tính năng UI
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [songAudioUrl, setSongAudioUrl] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch audio URL khi current song thay đổi
  useEffect(() => {
    const fetchSongUrl = async () => {
      if (!currentSong) {
        console.log('No current song, clearing audio URL');
        setSongAudioUrl('');
        return;
      }
      
      console.log(`Fetching audio URL for song: ${currentSong.title} (ID: ${currentSong.id})`);
      
      try {
        // Nếu là ID Jamendo (chỉ số)
        if (/^\d+$/.test(currentSong.id)) {
          // Lấy URL trực tiếp từ Jamendo
          console.log(`Fetching Jamendo URL for track ID: ${currentSong.id}`);
          
          // Cách 1: Sử dụng URL trực tiếp
          const directUrl = `https://prod-1.storage.jamendo.com/download/track/${currentSong.id}/mp31/`;
          console.log(`Using direct Jamendo download URL: ${directUrl}`);
          setSongAudioUrl(directUrl);
          return;
        }
        
        // Cho các bài demo
        if (currentSong.id.startsWith('song')) {
          // Đối với demo song, sử dụng URL SoundHelix
          const demoIndex = parseInt(currentSong.id.replace('song', '')) || 1;
          const demoUrl = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${demoIndex}.mp3`;
          console.log(`Using demo track: ${demoUrl}`);
          setSongAudioUrl(demoUrl);
          return;
        }
        
        console.log(`No audio URL found for song: ${currentSong.title} (ID: ${currentSong.id})`);
        // URL dự phòng nếu không có URL nào khác
        const fallbackUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        console.log(`Using fallback audio URL: ${fallbackUrl}`);
        setSongAudioUrl(fallbackUrl);
      } catch (error) {
        console.error('Error fetching song URL:', error);
        // URL dự phòng nếu có lỗi
        setSongAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');
      }
    };

    fetchSongUrl();
  }, [currentSong]);

  // Xử lý việc phát/dừng nhạc khi trạng thái thay đổi
  useEffect(() => {
    if (!audioRef.current || !songAudioUrl) return;

    // Cập nhật volume sử dụng hàm utility
    audioRef.current.volume = convertToAudioVolume(volume);
    
    // Xử lý bài hát mới
    if (currentSong) {
      audioRef.current.load();
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Autoplay prevented:', error);
            pauseSong(); // Update UI state if autoplay is prevented
          });
        }
      }
    }
  }, [currentSong, songAudioUrl, isPlaying, volume, pauseSong]);

  // Xử lý khi volume thay đổi
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Sử dụng hàm utility để đảm bảo âm lượng được đặt chính xác
    const audioVolume = convertToAudioVolume(volume);
    audioRef.current.volume = audioVolume;
    
    console.log(`Audio volume set to: ${audioVolume.toFixed(2)} (${volume}%)`);
  }, [volume]);
  
  // Xử lý khi isPlaying thay đổi
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Play prevented:', error);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Lắng nghe sự kiện từ audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      } else {
        setDuration(180); // 3 phút mặc định
      }
    };
    
    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play().catch(err => console.log('Replay failed:', err));
      } else {
        nextSong();
      }
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeating, nextSong]);

  const togglePlay = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  const toggleShuffle = () => {
    setIsShuffling(prev => !prev);
  };

  const toggleRepeat = () => {
    setIsRepeating(prev => !prev);
  };

  const setProgress = (value: number) => {
    if (!audioRef.current || duration <= 0) return;
    
    const newTime = (value / 100) * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (newVolume: number) => {
    console.log(`Volume control changed to: ${newVolume}%`);
    
    // Cập nhật state trong context
    setVolume(newVolume);
  };

  // URL hình ảnh mặc định dự phòng
  const defaultCoverUrl = 'https://via.placeholder.com/140?text=No+Cover';

  // Debug info
  useEffect(() => {
    if (currentSong) {
      console.log(`Now playing: ${currentSong.title} (ID: ${currentSong.id})`);
      console.log(`Audio URL: ${songAudioUrl}`);
    }
  }, [currentSong, songAudioUrl]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 backdrop-blur-xl bg-black/30 border-t border-white/10 z-40">
      {/* Audio element ẩn để phát nhạc */}
      <audio 
        ref={audioRef}
        src={songAudioUrl || undefined}
        preload="metadata"
        crossOrigin="anonymous"
        controls={false}
        autoPlay={isPlaying}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            console.log(`Audio loaded. Duration: ${audioRef.current.duration}s`);
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          console.log('Song ended, playing next song');
          nextSong();
        }}
        onVolumeChange={() => console.log(`Audio volume change event: ${audioRef.current?.volume}`)}
        onCanPlay={() => {
          console.log(`Can play audio: ${songAudioUrl}`);
          if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(e => {
              console.warn('Auto-play after can-play event failed:', e);
            });
          }
        }}
        onError={(e) => {
          console.error('Audio error:', e);
          const errorEvent = e as React.SyntheticEvent<HTMLAudioElement, Event>;
          const audioElement = errorEvent.currentTarget;
          
          // Lấy chi tiết lỗi cụ thể nếu có
          const mediaError = audioElement.error;
          if (mediaError) {
            console.error(`Media error code: ${mediaError.code}, message: ${mediaError.message}`);
            
            // Xử lý dựa trên mã lỗi
            // Mã 1: MEDIA_ERR_ABORTED - Người dùng đã hủy quá trình tải
            // Mã 2: MEDIA_ERR_NETWORK - Lỗi mạng
            // Mã 3: MEDIA_ERR_DECODE - Lỗi giải mã
            // Mã 4: MEDIA_ERR_SRC_NOT_SUPPORTED - Định dạng không được hỗ trợ
            
            if (mediaError.code === 4) { // Định dạng không được hỗ trợ
              console.log('Format not supported, trying alternative format...');
              
              // Nếu là URL Jamendo, thử thay đổi định dạng
              if (songAudioUrl && (songAudioUrl.includes('jamendo') || songAudioUrl.includes('storage'))) {
                // Thử thay đổi định dạng hoặc tham số URL
                if (songAudioUrl.includes('mp32')) {
                  // Thử với định dạng mp31 nếu mp32 không hoạt động
                  const newUrl = songAudioUrl.replace('mp32', 'mp31');
                  console.log(`Trying alternative format: ${newUrl}`);
                  setSongAudioUrl(newUrl);
                  return;
                } else if (songAudioUrl.includes('format=mp3')) {
                  // Thử với định dạng mp31 nếu mp3 không hoạt động
                  const newUrl = songAudioUrl.replace('format=mp3', 'format=mp31');
                  console.log(`Trying alternative format: ${newUrl}`);
                  setSongAudioUrl(newUrl);
                  return;
                }
              }
              
              // Thử với các định dạng ogg hoặc mp3 thay thế
              if (songAudioUrl && songAudioUrl.includes('trackid=')) {
                const trackIdMatch = songAudioUrl.match(/trackid=(\d+)/);
                if (trackIdMatch && trackIdMatch[1]) {
                  const trackId = trackIdMatch[1];
                  // Tạo URL thay thế
                  const alternateUrl = `https://prod-1.storage.jamendo.com/download/track/${trackId}/mp31/`;
                  console.log(`Trying download URL instead: ${alternateUrl}`);
                  setSongAudioUrl(alternateUrl);
                  return;
                }
              }
              
              // Sử dụng bài hát đã biết hoạt động từ Jamendo
              console.log('All formats failed, using known working track');
              const workingTrackId = '887202'; // "Press Record" track có thể phát tốt
              const workingUrl = `https://prod-1.storage.jamendo.com/download/track/${workingTrackId}/mp31/`;
              console.log(`Using known working track URL: ${workingUrl}`);
              setSongAudioUrl(workingUrl);
            } else if (mediaError.code === 2) { // Lỗi mạng
              console.log('Network error, retrying with different URL format');
              
              // Thử một bài hát có sẵn
              const emergencyTrackId = '887204'; // "Dance" track
              const emergencyUrl = `https://prod-1.storage.jamendo.com/download/track/${emergencyTrackId}/mp31/`;
              console.log(`Using emergency track due to network error: ${emergencyUrl}`);
              setSongAudioUrl(emergencyUrl);
            } else {
              // Các lỗi khác, cũng thử một bài hát fallback
              const fallbackTrackId = '887211'; // "City" track
              const fallbackUrl = `https://prod-1.storage.jamendo.com/download/track/${fallbackTrackId}/mp31/`;
              console.log(`Using fallback track due to other error: ${fallbackUrl}`);
              setSongAudioUrl(fallbackUrl);
            }
          } else {
            // Không có thông tin lỗi cụ thể, sử dụng bài fallback
            const defaultTrackId = '887202'; // "Press Record" track
            const defaultUrl = `https://prod-1.storage.jamendo.com/download/track/${defaultTrackId}/mp31/`;
            console.log(`Using default track, no error details: ${defaultUrl}`);
            setSongAudioUrl(defaultUrl);
          }
        }}
      />
      
      <div className="h-full max-w-screen-xl mx-auto px-6 grid grid-cols-[1fr,2fr,1fr] items-center gap-4">
        {/* Left Section - Track Info */}
        <div className="flex items-center gap-4">
          {currentSong && (
            <>
              <div className="w-14 h-14 rounded-xl overflow-hidden backdrop-blur-sm bg-black/20">
                <img
                  src={currentSong.cover || defaultCoverUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.log('Image error, using default cover');
                    (e.target as HTMLImageElement).src = defaultCoverUrl;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm truncate">{currentSong.title}</h3>
                <p className="text-gray-300 text-xs truncate">{currentSong.artist || 'Unknown Artist'}</p>
              </div>
              <button className="text-gray-300 hover:text-purple-400 transition-all duration-300">
                <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Center Section - Player Controls */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <button
              className={`text-gray-300 hover:text-purple-400 transition-all duration-300 ${
                isShuffling ? 'text-purple-400' : ''
              }`}
              onClick={toggleShuffle}
              disabled={!currentSong}
            >
              <FontAwesomeIcon icon={faShuffle} className="w-4 h-4" />
            </button>
            <PlayerControls
              isPlaying={isPlaying}
              isShuffling={isShuffling}
              isRepeating={isRepeating}
              onTogglePlay={togglePlay}
              onToggleShuffle={toggleShuffle}
              onToggleRepeat={toggleRepeat}
              onNext={nextSong}
              onPrevious={previousSong}
              disabled={!currentSong}
            />
            <button
              className={`text-gray-300 hover:text-purple-400 transition-all duration-300 ${
                isRepeating ? 'text-purple-400' : ''
              }`}
              onClick={toggleRepeat}
              disabled={!currentSong}
            >
              <FontAwesomeIcon icon={faRepeat} className="w-4 h-4" />
            </button>
          </div>
          
          <div className="w-full flex flex-col">
            <ProgressBar currentTime={currentTime} duration={duration} onSeek={setProgress} />
          </div>
        </div>

        {/* Right Section - Volume Control */}
        <div className="flex justify-end">
          <div className="w-32">
            <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

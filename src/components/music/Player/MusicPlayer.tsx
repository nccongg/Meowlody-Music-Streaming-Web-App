import { useMusicPlayer } from '../../../hooks/useMusicPlayer';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faRepeat, faShuffle } from '@fortawesome/free-solid-svg-icons';

export function MusicPlayer() {
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
  } = useMusicPlayer();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 backdrop-blur-xl bg-black/30 border-t border-white/10 z-40">
      <div className="h-full max-w-screen-xl mx-auto px-6 grid grid-cols-[1fr,2fr,1fr] items-center gap-4">
        {/* Left Section - Track Info */}
        <div className="flex items-center gap-4">
          {currentTrack && (
            <>
              <div className="w-14 h-14 rounded-xl overflow-hidden backdrop-blur-sm bg-black/20">
                <img
                  src={currentTrack.album.imageUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm truncate">{currentTrack.title}</h3>
                <p className="text-gray-300 text-xs truncate">{currentTrack.artist.name}</p>
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
              disabled={!currentTrack}
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
              onNext={playNext}
              onPrevious={playPrevious}
              disabled={!currentTrack}
            />
            <button
              className={`text-gray-300 hover:text-purple-400 transition-all duration-300 ${
                isRepeating ? 'text-purple-400' : ''
              }`}
              onClick={toggleRepeat}
              disabled={!currentTrack}
            >
              <FontAwesomeIcon icon={faRepeat} className="w-4 h-4" />
            </button>
          </div>
          <ProgressBar currentTime={currentTime} duration={duration} onSeek={setProgress} />
        </div>

        {/* Right Section - Volume Control */}
        <div className="flex justify-end">
          <div className="w-32">
            <VolumeControl volume={volume} onVolumeChange={setVolume} />
          </div>
        </div>
      </div>
    </div>
  );
}

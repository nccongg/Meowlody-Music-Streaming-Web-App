import { useMusicPlayer } from '../../contexts/MusicPlayerContext';

function MusicPlayer() {
  const { currentTrack, isPlaying, currentTime, duration, togglePlay, setProgress } = useMusicPlayer();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-900 border-t border-gray-800">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="text-gray-400">No song selected</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-900 border-t border-gray-800">
      <div className="flex items-center justify-between px-4 h-full">
        {/* Track Info */}
        <div className="flex items-center flex-1 min-w-0">
          <img
            src={currentTrack.album.imageUrl}
            alt={currentTrack.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="ml-4 min-w-0">
            <div className="text-white font-medium truncate">{currentTrack.title}</div>
            <div className="text-gray-400 text-sm truncate">{currentTrack.artist.name}</div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center space-x-6">
            <button
              className="text-white hover:text-purple-500 transition-colors"
              onClick={() => {
                /* Previous track */
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
              </svg>
            </button>
            <button
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
              onClick={togglePlay}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                {isPlaying ? (
                  <path fill="currentColor" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                ) : (
                  <path fill="currentColor" d="M8 5v14l11-7z" />
                )}
              </svg>
            </button>
            <button
              className="text-white hover:text-purple-500 transition-colors"
              onClick={() => {
                /* Next track */
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center w-full max-w-xl space-x-4 mt-2">
            <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 relative cursor-pointer"
                style={{ width: `${(currentTime / duration) * 100}%` }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  setProgress(percent * 100);
                }}
              />
            </div>
            <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3 flex-1 justify-end">
          <button className="text-white hover:text-purple-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z"
              />
            </svg>
          </button>
          <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden cursor-pointer">
            <div className="h-full bg-purple-500 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;

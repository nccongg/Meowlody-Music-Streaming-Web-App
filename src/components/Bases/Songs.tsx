import { useMusicPlayer } from '../../contexts/MusicPlayerContext';
import { Track } from '../../services/music';

interface SongsProps {
  track: Track;
}

const fallbackImage = 'https://via.placeholder.com/400?text=No+Image';

function Songs({ track }: SongsProps) {
  const { playTrack, currentTrack, isPlaying } = useMusicPlayer();

  const isCurrentTrack = currentTrack?.id === track.id;
  const duration = `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImage;
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-800/50 transition-colors group">
      <div className="relative aspect-square w-16 h-16 overflow-hidden rounded-lg">
        <img
          src={track.album.imageUrl}
          alt={track.title}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
          <button
            onClick={() => playTrack(track)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-black ml-0.5"
            >
              {isCurrentTrack && isPlaying ? <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /> : <path d="M8 5v14l11-7z" />}
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-white truncate">{track.title}</h3>
        <p className="text-sm text-gray-400 truncate">{track.artist.name}</p>
      </div>
      <div className="text-sm text-gray-400">{duration}</div>
    </div>
  );
}

export default Songs;

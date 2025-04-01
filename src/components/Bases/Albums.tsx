import { useMusicPlayer } from '../../contexts/MusicPlayerContext';
import { Track } from '../../services/music';

interface AlbumsProps {
  track: Track;
}

function Albums({ track }: AlbumsProps) {
  const { playTrack, currentTrack, isPlaying } = useMusicPlayer();

  const isCurrentTrack = currentTrack?.id === track.id;

  return (
    <div className="group relative">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <img src={track.album.imageUrl} alt={track.title} className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
          <button
            onClick={() => playTrack(track)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-black ml-1"
            >
              {isCurrentTrack && isPlaying ? <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /> : <path d="M8 5v14l11-7z" />}
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-white truncate">{track.title}</h3>
        <p className="text-sm text-gray-400 truncate">{track.artist.name}</p>
      </div>
    </div>
  );
}

export default Albums;

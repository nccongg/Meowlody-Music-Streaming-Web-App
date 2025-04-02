import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { Track } from '../../types/music';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

interface SongsProps {
  tracks: Track[];
  title: string;
  isLoading?: boolean;
}

function Songs({ tracks, title, isLoading = false }: SongsProps) {
  const { playTrack } = useMusicPlayer();

  if (isLoading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="aspect-square mb-4 bg-gray-700 rounded-lg" />
              <div className="h-4 bg-gray-700 rounded mb-2" />
              <div className="h-3 bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="text-gray-400 text-center py-8">No tracks available</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group"
            onClick={() => playTrack(track)}
          >
            <div className="aspect-square mb-4 relative">
              <img
                src={track.album.imageUrl}
                alt={track.title}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                  <FontAwesomeIcon icon={faPlay} className="text-white text-xl ml-1" />
                </div>
              </div>
            </div>
            <h3 className="font-medium text-white truncate">{track.title}</h3>
            <p className="text-sm text-gray-400 truncate">{track.artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Songs;

import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { Track } from '../../types/music';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

interface SongsProps {
  title: string;
  subtitle?: string;
  tracks: Track[];
}

export function Songs({ title, subtitle, tracks }: SongsProps) {
  const { playSong } = useMusicPlayer();

  // Hàm xử lý khi người dùng chọn phát một bài hát
  const handlePlayTrack = (track: Track) => {
    playSong(track.id, track.title);
  };

  return (
    <div className="mt-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="group relative bg-dark-800/30 backdrop-blur-md rounded-xl p-3 cursor-pointer"
            onClick={() => handlePlayTrack(track)}
          >
            <div className="relative">
              <img
                src={track.album.imageUrl}
                alt={track.title}
                className="w-full aspect-square object-cover rounded-lg mb-3"
              />
              <button
                className="absolute right-2 bottom-5 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 shadow-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayTrack(track);
                }}
              >
                <FontAwesomeIcon icon={faPlay} className="text-white ml-1" />
              </button>
            </div>
            <h3 className="font-semibold text-white truncate">{track.title}</h3>
            <p className="text-gray-400 text-sm truncate">{track.artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

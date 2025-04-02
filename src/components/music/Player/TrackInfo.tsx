import { Track } from '../../../types/music';

interface TrackInfoProps {
  track: Track | null;
}

export function TrackInfo({ track }: TrackInfoProps) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-14 h-14 rounded-lg shadow-lg ${!track ? 'bg-gray-800' : ''}`}>
        {track && (
          <img src={track.album.imageUrl} alt={track.title} className="w-full h-full rounded-lg object-cover" />
        )}
      </div>
      <div>
        <h4 className="text-sm font-medium text-white truncate">{track?.title || 'No song selected'}</h4>
        <p className="text-sm text-gray-400 truncate">{track?.artist.name || 'Select a song to play'}</p>
      </div>
    </div>
  );
}

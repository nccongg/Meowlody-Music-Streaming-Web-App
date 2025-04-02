import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Track } from '../types/music';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { JamendoService } from '../services/api/jamendo';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { playTrack } = useMusicPlayer();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const tracks = await JamendoService.searchTracks(query);
      setResults(tracks);
    } catch (error) {
      console.error('Failed to search tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-8 backdrop-blur-md bg-black/30 p-4 rounded-xl">
          <div className="flex-1 relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for songs, artists, or albums"
              className="w-full pl-12 pr-4 py-3 bg-black/30 backdrop-blur-sm rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="px-8 py-3 bg-purple-500 bg-opacity-80 backdrop-blur-sm text-white rounded-full font-medium hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400 backdrop-blur-md bg-black/30 p-6 rounded-xl">Loading...</div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((track) => (
              <div
                key={track.id}
                className="p-4 backdrop-blur-md bg-black/30 rounded-lg hover:bg-black/40 transition-colors cursor-pointer"
                onClick={() => playTrack(track)}
              >
                <img
                  src={track.album.imageUrl}
                  alt={track.title}
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                />
                <h3 className="text-white font-medium truncate">{track.title}</h3>
                <p className="text-gray-400 text-sm truncate">{track.artist.name}</p>
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="text-center text-gray-400 backdrop-blur-md bg-black/30 p-6 rounded-xl">No results found</div>
        ) : null}
      </div>
    </div>
  );
}

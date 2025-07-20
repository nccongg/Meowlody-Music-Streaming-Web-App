import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEllipsisVertical, faHeart, faClock, faPlay } from '@fortawesome/free-solid-svg-icons';
import { Track } from '../types/music';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { JamendoService } from '../services/api/jamendo';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [suggestedTracks, setSuggestedTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { playSong } = useMusicPlayer();

  // Fetch suggested tracks on mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const [trending, newReleases] = await Promise.all([
          JamendoService.getTrendingTracks(),
          JamendoService.getNewReleases(),
        ]);

        // Mix trending and new releases for suggestions
        const suggestions = [...trending.slice(0, 4), ...newReleases.slice(0, 4)];
        setSuggestedTracks(suggestions);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    };

    fetchSuggestions();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        const search = async () => {
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
        
        search();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handlePlayTrack = (track: Track) => {
    playSong(track.id, track.title);
  };

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Search Input */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for songs, artists, or albums"
              className="w-full pl-12 pr-4 py-3 bg-dark-800/50 backdrop-blur-sm rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Results Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="bg-dark-800/30 backdrop-blur-md rounded-[1.25rem] p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={results[0].album.imageUrl}
                alt="Search Results"
                className="w-48 h-48 rounded-2xl object-cover"
              />
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Search Results</h1>
                <p className="text-gray-400">{results.length} songs</p>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[auto,1fr,1fr,auto] gap-4 px-4 py-2 text-gray-400 text-sm border-b border-gray-700/50">
              <span className="w-8">#</span>
              <span>TITLE</span>
              <span>ARTIST</span>
              <span className="flex items-center justify-center">
                <FontAwesomeIcon icon={faClock} />
              </span>
            </div>

            {/* Track List */}
            <div className="mt-2">
              {results.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => handlePlayTrack(track)}
                  className="grid grid-cols-[auto,1fr,1fr,auto] gap-4 px-4 py-3 hover:bg-white/5 rounded-lg cursor-pointer group"
                >
                  <div className="w-8 flex items-center text-gray-400 group-hover:text-white">{index + 1}</div>
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={track.album.imageUrl} alt={track.title} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-white truncate">{track.title}</span>
                  </div>
                  <div className="flex items-center text-gray-400 truncate">{track.artist.name}</div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to favorites logic
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                    <span className="text-gray-400 w-12">{formatDuration(track.duration)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Show more options
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="text-center text-gray-400 backdrop-blur-md bg-dark-800/30 p-8 rounded-[1.25rem]">
            No results found for "{query}"
          </div>
        ) : suggestedTracks.length > 0 ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Suggested for you</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {suggestedTracks.map((track) => (
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
          </div>
        ) : null}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HeroSection from '../components/Bases/HeroSection';
import Songs from '../components/Bases/Songs';
import { musicService, Track } from '../services/music';

interface Artist {
  id: string;
  name: string;
  imageUrl: string;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
}

const genres = [
  { id: 1, name: 'Pop', color: 'bg-pink-600' },
  { id: 2, name: 'Hip-Hop', color: 'bg-yellow-600' },
  { id: 3, name: 'Rock', color: 'bg-red-600' },
  { id: 4, name: 'Electronic', color: 'bg-blue-600' },
  { id: 5, name: 'R&B', color: 'bg-purple-600' },
  { id: 6, name: 'Jazz', color: 'bg-green-600' },
];

const fallbackImage = 'https://via.placeholder.com/400?text=No+Image';

function Home() {
  const [trendingSongs, setTrendingSongs] = useState<Track[]>([]);
  const [popularArtists, setPopularArtists] = useState<Artist[]>([]);
  const [popularAlbums, setPopularAlbums] = useState<Album[]>([]);
  const [newReleases, setNewReleases] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImage;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songs, artists, albums, releases] = await Promise.all([
          musicService.getTrendingSongs(),
          musicService.getPopularArtists(),
          musicService.getPopularAlbums(),
          musicService.getNewReleases(),
        ]);
        setTrendingSongs(songs);
        setPopularArtists(artists);
        setPopularAlbums(albums);
        setNewReleases(releases);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HeroSection />

      <div className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Trending songs</h2>
          <Link to="/tracks" className="text-sm text-purple-400 hover:text-purple-300">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-7">
          {trendingSongs.map((track) => (
            <Songs key={track.id} track={track} />
          ))}
        </div>
      </div>

      <div className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Popular artists</h2>
          <Link to="/artists" className="text-sm text-purple-400 hover:text-purple-300">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4 sm:gap-6 mt-7">
          {popularArtists.map((artist) => (
            <div key={artist.id} className="text-center">
              <div className="aspect-square rounded-full overflow-hidden mb-3">
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-white text-sm font-medium truncate">{artist.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Popular albums & singles</h2>
          <Link to="/albums" className="text-sm text-purple-400 hover:text-purple-300">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 mt-7">
          {popularAlbums.map((album) => (
            <div key={album.id} className="group">
              <div className="aspect-square rounded-lg overflow-hidden mb-3">
                <img
                  src={album.imageUrl}
                  alt={album.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-white font-medium truncate">{album.title}</h3>
              <p className="text-gray-400 text-sm truncate">{album.artist}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">New Music Friday</h2>
          <Link to="/new-releases" className="text-sm text-purple-400 hover:text-purple-300">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-7">
          {newReleases.map((track) => (
            <Songs key={track.id} track={track} />
          ))}
        </div>
      </div>

      <div className="mt-16 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-7">Browse Genres</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`${genre.color} text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

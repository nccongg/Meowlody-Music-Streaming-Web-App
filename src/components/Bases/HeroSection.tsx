import { useEffect, useState } from 'react';
import { Track } from '../../services/music';
import { jamendoService } from '../../services/jamendo';
import { useMusicPlayer } from '../../contexts/MusicPlayerContext';

function HeroSection() {
  const [featuredTrack, setFeaturedTrack] = useState<Track | null>(null);
  const { playTrack } = useMusicPlayer();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTrack = async () => {
      try {
        // Fetch popular featured tracks
        const tracks = await jamendoService.getTrendingSongs();
        if (tracks.length > 0) {
          setFeaturedTrack(tracks[0]); // Get the most popular track
        }
      } catch (error) {
        console.error('Failed to fetch featured track:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedTrack();
  }, []);

  const handleListenNow = () => {
    if (featuredTrack) {
      playTrack(featuredTrack);
    }
  };

  return (
    <div
      className="relative w-full h-[400px] rounded-xl overflow-hidden group cursor-pointer"
      onClick={handleListenNow}
    >
      <div className="absolute inset-0">
        <img
          src={featuredTrack?.album.imageUrl || '/placeholder-hero.jpg'}
          alt="Featured Track"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </div>
      <div className="relative h-full flex flex-col justify-end p-8">
        <h1 className="text-4xl font-bold text-white mb-4">Featured Track</h1>
        {!isLoading && featuredTrack && (
          <div className="space-y-2 mb-6">
            <p className="text-2xl text-white font-medium">{featuredTrack.title}</p>
            <p className="text-lg text-gray-300">by {featuredTrack.artist.name}</p>
            <p className="text-base text-purple-400">Trending on Meowlody</p>
          </div>
        )}
        <button
          className="bg-purple-600 text-white font-medium px-8 py-3 rounded-full w-max hover:bg-purple-500 transition-colors transform hover:scale-105 duration-200 flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            handleListenNow();
          }}
        >
          <span>Play Now</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5v10l7-5-7-5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default HeroSection;

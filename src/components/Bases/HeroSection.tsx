import { useEffect, useState } from 'react';
import { Track } from '../../types/music';
import { JamendoService } from '../../services/api/jamendo';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';

function HeroSection() {
  const [featuredTrack, setFeaturedTrack] = useState<Track | null>(null);
  const { playTrack } = useMusicPlayer();

  useEffect(() => {
    const fetchFeaturedTrack = async () => {
      try {
        const tracks = await JamendoService.getTrendingTracks();
        if (tracks.length > 0) {
          setFeaturedTrack(tracks[0]);
        }
      } catch (error) {
        console.error('Failed to fetch featured track:', error);
      }
    };

    fetchFeaturedTrack();
  }, []);

  if (!featuredTrack) {
    return null;
  }

  return (
    <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden my-6">
      <div className="absolute inset-0 backdrop-blur-lg bg-black/20 rounded-[2.5rem]" />
      <img
        src={featuredTrack.album.imageUrl}
        alt={featuredTrack.title}
        className="absolute inset-0 w-full h-full object-cover opacity-40 rounded-[2.5rem]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-[2.5rem]" />
      <div className="relative h-full max-w-screen-xl mx-auto px-12 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{featuredTrack.title}</h1>
          <p className="text-xl text-gray-200 mb-8 drop-shadow-lg">{featuredTrack.artist.name}</p>
          <button
            onClick={() => playTrack(featuredTrack)}
            className="px-8 py-3 bg-purple-500 bg-opacity-80 backdrop-blur-sm text-white rounded-2xl font-medium hover:bg-purple-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

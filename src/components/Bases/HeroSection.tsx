import { useEffect, useState } from 'react';
import { Track } from '../../types/music';
import { JamendoService } from '../../services/api/jamendo';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';

function HeroSection() {
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { playSong } = useMusicPlayer();

  useEffect(() => {
    const fetchFeaturedTracks = async () => {
      try {
        const trendingTracks = await JamendoService.getTrendingTracks();
        setFeaturedTracks(trendingTracks.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch featured tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedTracks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredTracks.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredTracks.length]);

  if (isLoading || featuredTracks.length === 0) {
    return (
      <div className="h-[500px] bg-gradient-to-br from-purple-900 to-dark-900 rounded-3xl backdrop-blur-xl flex items-center justify-center">
        <div className="animate-pulse w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  const currentTrack = featuredTracks[currentIndex];

  // Hàm xử lý khi người dùng chọn phát một bài hát
  const handlePlayTrack = (track: Track) => {
    playSong(track.id, track.title);
  };

  return (
    <div className="h-[500px] relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0">
        <img
          src={currentTrack.album.imageUrl}
          alt={currentTrack.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent"></div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <h1 className="text-5xl font-bold text-white mb-3">{currentTrack.title}</h1>
        <p className="text-xl text-gray-300 mb-8">{currentTrack.artist.name}</p>
        <div className="flex gap-4">
          <button
            onClick={() => handlePlayTrack(currentTrack)}
            className="px-8 py-3 bg-purple-500 text-white rounded-full font-medium hover:bg-purple-600 transition-colors"
          >
            Play Now
          </button>
          <button className="px-8 py-3 bg-white/10 text-white rounded-full font-medium backdrop-blur-md hover:bg-white/20 transition-colors">
            Add to Queue
          </button>
        </div>

        <div className="flex gap-2 mt-8">
          {featuredTracks.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-12 h-1 rounded-full transition-colors ${
                i === currentIndex ? 'bg-purple-500' : 'bg-white/20'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

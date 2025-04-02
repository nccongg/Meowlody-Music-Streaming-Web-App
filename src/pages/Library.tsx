import { useState } from 'react';
import { Track } from '../types/music';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

export default function Library() {
  const [activeTab, setActiveTab] = useState<'playlists' | 'liked'>('playlists');
  const { playTrack } = useMusicPlayer();

  // This would typically come from a backend service
  const playlists: { id: string; name: string; tracks: Track[] }[] = [];
  const likedSongs: Track[] = [];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('playlists')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeTab === 'playlists' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Playlists
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeTab === 'liked' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Liked Songs
          </button>
        </div>

        {activeTab === 'playlists' ? (
          playlists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="aspect-square bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">🎵</span>
                  </div>
                  <h3 className="text-white font-medium truncate">{playlist.name}</h3>
                  <p className="text-gray-400 text-sm">{playlist.tracks.length} songs</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p className="mb-4">No playlists yet</p>
              <button className="px-6 py-2 bg-purple-500 text-white rounded-full font-medium hover:bg-purple-600">
                Create Playlist
              </button>
            </div>
          )
        ) : likedSongs.length > 0 ? (
          <div className="space-y-2">
            {likedSongs.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => playTrack(track)}
              >
                <img src={track.album.imageUrl} alt={track.title} className="w-12 h-12 rounded object-cover" />
                <div>
                  <h3 className="text-white font-medium">{track.title}</h3>
                  <p className="text-gray-400 text-sm">{track.artist.name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">No liked songs yet</div>
        )}
      </div>
    </div>
  );
}

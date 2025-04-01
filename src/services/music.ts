export interface Track {
  id: string | number;
  title: string;
  artist: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  album: {
    title: string;
    imageUrl: string;
  };
  duration: number;
  previewUrl: string;
}

export interface MusicProvider {
  searchTracks(query: string): Promise<Track[]>;
  getFeaturedTracks(): Promise<Track[]>;
  getNewReleases(): Promise<Track[]>;
  getTrackById(id: string | number): Promise<Track>;
  getPlaylist(id: string | number): Promise<Track[]>;
  getArtistTopTracks(artistId: string | number): Promise<Track[]>;
}

// Export the Jamendo service as our music provider
export { jamendoService as musicService } from './jamendo';

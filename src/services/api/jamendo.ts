import { Track, Artist, Album } from '../../types/music';

interface JamendoTrack {
  id: string;
  name: string;
  duration: number;
  audio: string;
  artist_id: string;
  artist_name: string;
  artist_idstr: string;
  album_id: string;
  album_name: string;
  album_image: string;
}

interface JamendoResponse<T> {
  headers: {
    status: string;
    code: number;
    error_message?: string;
    results_count: number;
    warnings: string[];
  };
  results: T[];
}

class JamendoServiceClass {
  private readonly baseUrl = import.meta.env.VITE_API_BASE_URL;
  private readonly clientId = import.meta.env.VITE_JAMENDO_CLIENT_ID;
  private readonly defaultImageSize = '400';

  private transformTrack(track: JamendoTrack): Track {
    const artist: Artist = {
      id: track.artist_idstr,
      name: track.artist_name,
    };

    const album: Album = {
      id: track.album_id,
      name: track.album_name,
      imageUrl: track.album_image,
    };

    return {
      id: track.id,
      title: track.name,
      duration: track.duration,
      artist,
      album,
      audioUrl: track.audio,
    };
  }

  private async fetchFromApi<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const queryParams = new URLSearchParams({
      client_id: this.clientId,
      format: 'json',
      imagesize: this.defaultImageSize,
      ...params,
    });

    const response = await fetch(`${this.baseUrl}${endpoint}?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Jamendo API error: ${response.statusText}`);
    }

    return response.json();
  }

  private getImageUrl(type: 'artist' | 'album' | 'track', id: string, trackId?: string): string {
    const baseUrl = 'https://usercontent.jamendo.com';
    if (type === 'album' && trackId) {
      return `${baseUrl}?type=album&id=${id}&width=${this.defaultImageSize}&trackid=${trackId}`;
    }
    return `${baseUrl}?type=${type}&id=${id}&width=${this.defaultImageSize}`;
  }

  async searchTracks(query: string): Promise<Track[]> {
    const response = await this.fetchFromApi<JamendoResponse<JamendoTrack>>('/tracks/', {
      search: query,
      limit: '20',
    });

    return response.results.map(this.transformTrack);
  }

  async getTrendingTracks(): Promise<Track[]> {
    const response = await this.fetchFromApi<JamendoResponse<JamendoTrack>>('/tracks/', {
      featured: '1',
      boost: 'popularity_total',
      limit: '10',
    });

    return response.results.map(this.transformTrack);
  }

  async getPopularArtists(): Promise<Artist[]> {
    const response = await this.fetchFromApi<JamendoResponse<{ id: string; name: string }>>('/artists/', {
      order: 'popularity_total',
      limit: '6',
    });

    return response.results.map((artist) => ({
      id: artist.id,
      name: artist.name,
      imageUrl: this.getImageUrl('artist', artist.id),
    }));
  }

  async getPopularAlbums(): Promise<Album[]> {
    // First, get popular tracks to ensure we have valid album images
    const response = await this.fetchFromApi<JamendoResponse<JamendoTrack>>('/tracks/', {
      featured: '1',
      boost: 'popularity_total',
      limit: '30', // Fetch more to ensure we get enough unique albums
      include: 'stats',
      groupby: 'album_id', // Group by album to avoid duplicates
    });

    // Convert tracks to albums and filter out duplicates
    const albums = response.results
      .filter((track) => track.album_id && track.album_name) // Filter out tracks without albums
      .map((track) => ({
        id: track.album_id,
        name: track.album_name,
        imageUrl: this.getImageUrl('album', track.album_id, track.id),
      }))
      .filter(
        (album, index, self) =>
          // Remove duplicates based on album ID
          index === self.findIndex((a) => a.id === album.id),
      )
      .slice(0, 9); // Take only the first 9 albums

    return albums;
  }

  async getNewReleases(): Promise<Track[]> {
    const today = new Date();
    const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3));
    const formattedDate = `${threeMonthsAgo.toISOString().split('T')[0]}_${new Date().toISOString().split('T')[0]}`;

    const response = await this.fetchFromApi<JamendoResponse<JamendoTrack>>('/tracks/', {
      datebetween: formattedDate,
      limit: '10',
      order: 'releasedate_desc',
      featured: '1',
      boost: 'popularity_total',
    });

    return response.results.map(this.transformTrack);
  }
}

export const JamendoService = new JamendoServiceClass();

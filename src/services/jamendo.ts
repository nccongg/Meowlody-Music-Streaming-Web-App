import { MusicProvider, Track } from './music';
import { JAMENDO_CONFIG } from '../config/api';

interface JamendoTrack {
  id: string;
  name: string;
  duration: number;
  artist_name: string;
  artist_id: string;
  album_name: string;
  album_id: string;
  album_image: string;
  audio: string;
  audiodownload: string;
  audiodownload_allowed: boolean;
  position?: number;
  license_ccurl?: string;
  tags?: string[];
  image?: string;
}

interface JamendoResponse<T> {
  headers: {
    status: string;
    code: number;
    error_message?: string;
    results_count: number;
    warnings?: string[];
  };
  results: T[];
}

interface JamendoArtist {
  id: string;
  name: string;
  image: string;
  joindate: string;
  followers: number;
}

class JamendoService implements MusicProvider {
  private static instance: JamendoService;
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly defaultImageSize: string;
  private readonly defaultAudioFormat: string;

  private constructor() {
    this.baseUrl = JAMENDO_CONFIG.baseUrl;
    this.clientId = JAMENDO_CONFIG.clientId;
    this.defaultImageSize = JAMENDO_CONFIG.defaultImageSize;
    this.defaultAudioFormat = JAMENDO_CONFIG.defaultAudioFormat;
  }

  public static getInstance(): JamendoService {
    if (!JamendoService.instance) {
      JamendoService.instance = new JamendoService();
    }
    return JamendoService.instance;
  }

  private getImageUrl(type: 'album' | 'artist', id: string, trackId?: string): string {
    const baseUrl = 'https://usercontent.jamendo.com';
    const width = this.defaultImageSize;

    if (type === 'album') {
      return `${baseUrl}?type=album&id=${id}&width=${width}${trackId ? `&trackid=${trackId}` : ''}`;
    } else {
      return `${baseUrl}?type=artist&id=${id}&width=${width}`;
    }
  }

  private convertTrack(track: JamendoTrack): Track {
    return {
      id: track.id,
      title: track.name,
      artist: {
        name: track.artist_name,
        id: track.artist_id,
        imageUrl: this.getImageUrl('artist', track.artist_id),
      },
      album: {
        title: track.album_name || 'Single',
        imageUrl: track.album_id
          ? this.getImageUrl('album', track.album_id, track.id)
          : this.getImageUrl('artist', track.artist_id),
      },
      duration: parseInt(track.duration.toString()),
      previewUrl: track.audio,
    };
  }

  private async fetchApi<T>(endpoint: string, params: Record<string, string> = {}): Promise<JamendoResponse<T>> {
    const queryParams = new URLSearchParams({
      client_id: this.clientId,
      format: 'json',
      imagesize: this.defaultImageSize,
      audioformat: this.defaultAudioFormat,
      include: 'musicinfo stats', // Include additional track information
      ...params,
    });

    const response = await fetch(`${this.baseUrl}${endpoint}?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Jamendo API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.headers.code !== 0 && data.headers.code !== 200) {
      throw new Error(data.headers.error_message || 'Unknown API error');
    }

    return data;
  }

  async searchTracks(query: string): Promise<Track[]> {
    const data = await this.fetchApi<JamendoTrack>('/tracks/', {
      search: query,
      limit: '20',
      boost: 'popularity_total', // Boost by popularity
    });
    return data.results.map((track) => this.convertTrack(track));
  }

  async getFeaturedTracks(): Promise<Track[]> {
    const data = await this.fetchApi<JamendoTrack>('/tracks/', {
      featured: '1',
      limit: '12',
      boost: 'popularity_total',
      tags: 'pop rock electronic', // Popular genres
    });
    return data.results.map((track) => this.convertTrack(track));
  }

  async getNewReleases(): Promise<Track[]> {
    const today = new Date();
    const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3));
    const formattedDate = `${threeMonthsAgo.toISOString().split('T')[0]}_${new Date().toISOString().split('T')[0]}`;

    const data = await this.fetchApi<JamendoTrack>('/tracks/', {
      datebetween: formattedDate,
      limit: '10',
      order: 'releasedate_desc', // Sort by release date, newest first
      featured: '1', // Only featured tracks for better quality
      boost: 'popularity_total', // Boost by popularity within the date range
      include: 'musicinfo stats', // Include additional track information
      track_type: 'single albumtrack', // Include both singles and album tracks
    });

    return data.results.map((track) => this.convertTrack(track));
  }

  async getTrackById(id: string | number): Promise<Track> {
    const data = await this.fetchApi<JamendoTrack>('/tracks/', {
      id: id.toString(),
    });

    if (!data.results.length) {
      throw new Error('Track not found');
    }

    return this.convertTrack(data.results[0]);
  }

  async getPlaylist(id: string | number): Promise<Track[]> {
    const data = await this.fetchApi<JamendoTrack>('/playlists/tracks/', {
      id: id.toString(),
    });
    return data.results.map((track) => this.convertTrack(track));
  }

  async getArtistTopTracks(artistId: string | number): Promise<Track[]> {
    const data = await this.fetchApi<JamendoTrack>('/artists/tracks/', {
      id: artistId.toString(),
      limit: '10',
      order: 'popularity_total',
    });
    return data.results.map((track) => this.convertTrack(track));
  }

  async getTrendingSongs(): Promise<Track[]> {
    const data = await this.fetchApi<JamendoTrack>('/tracks/', {
      featured: '1',
      limit: '10',
      boost: 'popularity_week', // Get tracks popular this week
      order: 'popularity_total_desc',
      include: 'stats',
    });
    return data.results.map((track) => this.convertTrack(track));
  }

  async getPopularArtists(): Promise<{ id: string; name: string; imageUrl: string }[]> {
    const data = await this.fetchApi<JamendoArtist>('/artists/', {
      limit: '9',
      order: 'popularity_total_desc',
      featured: '1',
    });
    return data.results.map((artist) => ({
      id: artist.id,
      name: artist.name,
      imageUrl: this.getImageUrl('artist', artist.id),
    }));
  }

  async getPopularAlbums(): Promise<{ id: string; title: string; artist: string; imageUrl: string }[]> {
    // Fetch popular tracks that are featured and have high popularity
    const data = await this.fetchApi<JamendoTrack>('/tracks/', {
      featured: '1',
      limit: '30', // Fetch more tracks to ensure we get enough unique albums
      boost: 'popularity_total',
      order: 'popularity_total_desc',
      include: 'stats',
      groupby: 'album_id', // Group by album to avoid duplicates
    });

    // Convert tracks to albums and filter out duplicates
    const albums = data.results
      .filter((track) => track.album_id && track.album_name) // Filter out tracks without albums
      .map((track) => ({
        id: track.album_id,
        title: track.album_name,
        artist: track.artist_name,
        imageUrl: track.album_image || track.image || this.getImageUrl('album', track.album_id, track.id),
      }))
      .filter(
        (album, index, self) =>
          // Remove duplicates based on album ID
          index === self.findIndex((a) => a.id === album.id),
      )
      .slice(0, 9); // Take only the first 9 albums

    return albums;
  }
}

export const jamendoService = JamendoService.getInstance();

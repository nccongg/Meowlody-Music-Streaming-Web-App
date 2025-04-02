export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Album {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Track {
  id: string;
  title: string;
  duration: number;
  artist: Artist;
  album: Album;
  audioUrl: string;
}

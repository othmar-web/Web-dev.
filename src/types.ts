export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  releaseYear: number;
  type: 'Album' | 'EP' | 'Single' | 'Podcast';
  category: 'music' | 'podcasts' | 'live';
  audioChordFrequencies?: number[];
  lyrics?: string[];
  bpm?: number;
}

export interface QuickAccessItem {
  id: string;
  title: string;
  coverUrl: string;
  trackId: string;
  gradient: string;
}

export interface Artist {
  id: string;
  name: string;
  monthlyListeners: string;
  imageUrl: string;
  popularTrackId: string;
  genres: string[];
}

export interface Playlist {
  id: string;
  name: string;
  trackCount: number;
  isCustom?: boolean;
}

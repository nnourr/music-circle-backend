export interface SpotifyUserInfoResponse {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: ExternalUrls;
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

export interface SpotifyTopArtistsResponse {
  items: SpotifyArtistInterface[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  previous: string | null;
  next: string | null;
}

export interface Image {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtistInterface {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface SpotifyTopTracksResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyTrack[];
}

export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyTrackArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  artists: SpotifyTrackArtist[];
}

export interface SpotifyTrackArtist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface ExternalIds {
  isrc: string;
}

interface ExternalUrls {
  spotify: string;
}

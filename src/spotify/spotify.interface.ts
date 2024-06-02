export interface SpotifyUserInfoResponse {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }>;
  product: string;
  type: string;
  uri: string;
}

export interface SpotifyTopArtistsResponse {
  items: Array<{
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
    images: Array<{
      url: string;
      height: number | null;
      width: number | null;
    }>;
    name: string;
    popularity: number;
    type: string;
    uri: string;
  }>;
  total: number;
  limit: number;
  offset: number;
  href: string;
  previous: string | null;
  next: string | null;
}

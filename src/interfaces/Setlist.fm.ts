export interface Artist {
  mbid?: string;
  tmid?: number;
  name: string;
  sortName?: string;
  disambiguation?: string;
  url?: string;
}

export interface ArtistAPIResponse {
  type: string;
  itemsPerPage: number;
  page: number;
  total: number;
  artist: Artist[];
}
export interface Song {
  name: string;
  with?: Artist;
  cover?: Artist;
  info?: string;
  tape?: boolean;
}

export interface Set {
  name: string;
  encore?: number;
  song: Song[];
}

export interface SetlistFm {
  artist: Artist;
  venue?: {
    city: {
      id: string;
      name: string;
      stateCode: string;
      state: string;
      coords: object
      country: object;
    };
    url: string;
    id: string;
    name: string;
  };
  tour?: {
    name: string;
  };
  sets: {
    set: Set[]
  };
  info?: string;
  url?: string;
  id?: string;
  versionId?: string;
  eventDate?: string;
  lastUpdated?: string;
}

import SetlistFmEndpoints from "../endpoints/Endpoints";
import MergedSet from "../interfaces/MergedSet";
import { Artist, ArtistAPIResponse, SetlistFm, Set, Song } from "../interfaces/Setlist.fm";
import { getMergedSpotifySetlist } from './SpotifyPlaylistsService';
import { setlistFmScrapForAverageSetlistSongList } from './SetlistScrapService';

export async function getSetlistFmBySetId(setID: string): Promise<SetlistFm> {
  const setlistResponse = await fetch(SetlistFmEndpoints.setlistFmSetlistByID + setID, {
    method: 'GET',
    headers: {
      'x-api-key': process.env.X_API_KEY as string,
      'Accept': 'application/json'
    }
  });

  const setlist: SetlistFm = await setlistResponse.json() as SetlistFm;

  return setlist;
}

export async function getArtistsByNamesList(artistName: string[]): Promise<Artist[]> {
  const artistResponsePromiseList: Promise<Artist>[] = [];

  artistName.forEach(artist => {
    artistResponsePromiseList.push(fetch(SetlistFmEndpoints.artistByArtistName + `?artistName=${artist}&sort=relevance`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.X_API_KEY as string,
        'Accept': 'application/json'
      },
    }).then(async (artistsResponse) => {
      const parsedArtistResponse: ArtistAPIResponse = await artistsResponse.json() as ArtistAPIResponse;
      return parsedArtistResponse.artist[0];
    }).catch((error) => {
      console.error("Setlist.fm.Service.ts::getArtistsByNamesList - Error:", error);
      throw new Error(error);
    }));
  });

  const resolvedPromises = await Promise.all(artistResponsePromiseList);

  return resolvedPromises;
}

async function setlistFmScrapForAverageSetlist(artist: Artist): Promise<SetlistFm> {
  const URL_YEAR_SUFIX = '?year=2024';
  const resolvedURL = artist.url?.replace('setlists', 'stats/average-setlist') + URL_YEAR_SUFIX;

  const scrappedSet: Set = {
    name: 'main',
    song: []
  }

  const averageSet: SetlistFm = {
    artist: artist,
    sets: { set: [scrappedSet] }
  }

  const songList: Song[] = await setlistFmScrapForAverageSetlistSongList(resolvedURL);

  averageSet.sets.set[0].song = songList;

  return averageSet;
}

export async function getSetlistsByScrappingArtists(artists: Artist[]): Promise<SetlistFm[]> {
  const scrappedSetlistsPromiseList: Promise<SetlistFm>[] = [];
  artists.forEach(artist => {
    scrappedSetlistsPromiseList.push(setlistFmScrapForAverageSetlist(artist));
  });

  const resolvedScrappedURLs = await Promise.all(scrappedSetlistsPromiseList);

  return resolvedScrappedURLs;
}

export async function getMergedSetlistsFromSetlists(setlists: SetlistFm[], includeTapes: boolean = false, coversByOriginalArtist: boolean = false): Promise<MergedSet[]> {
  const mergedSetlistsPromiseList: Promise<MergedSet>[] = [];
  setlists.forEach(setlist => {
    mergedSetlistsPromiseList.push(getMergedSpotifySetlist(setlist, includeTapes, coversByOriginalArtist));
  });

  const mergedSetlists = await Promise.all(mergedSetlistsPromiseList);

  return mergedSetlists;
}
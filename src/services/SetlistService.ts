import spotifySdk from "./SpotifySdk";
import { SearchResults, ItemTypes } from "@spotify/web-api-ts-sdk";
import Endpoints from "../endpoints/Endpoints";
import { SetlistFm, Song } from "../interfaces/Setlist.fm";
import MergedSet from "../interfaces/MergedSet";

export async function getSetlistFmBySetId(setID: string): Promise<SetlistFm> {
  const setlistResponse = await fetch(Endpoints.setlistFmSetlistByID + setID, {
    method: 'GET',
    headers: {
      'x-api-key': process.env.X_API_KEY as string,
      'Accept': 'application/json'
    }
  });

  const setlist: SetlistFm = await setlistResponse.json() as SetlistFm;

  return setlist;
}

function getSpotifyTrackSearchQuery(artistName: string, song: Song, coversByOriginalArtist: boolean): string {
  let resolvedArtistName = artistName;
  if (song.cover && coversByOriginalArtist) {
    resolvedArtistName = song.cover.name;
  }
  return `remaster%20track:${song.name}%20artist:${resolvedArtistName}`;
}

export async function getMergedSpotifySetlist(setlist: SetlistFm, includeTapes: boolean = false, coversByOriginalArtist: boolean = false): Promise<MergedSet> {
  const trackPromisesList: Promise<SearchResults<'track'[]>>[] = [];
  const queryType: ItemTypes[] = ["track"];

  const mergedSet: MergedSet = {
    artist: setlist.artist.name,
    city: setlist.venue.city.name,
    eventDate: setlist.eventDate,
    tracks: []
  };

  const spotifySdkInstance = spotifySdk.getSpotifySdkInstance();

  const trackPromiseMap: { index: number; promise: Promise<SearchResults<'track'[]>> }[] = [];

  for (const set of setlist.sets.set) {
    for (const song of set.song) {
      if ((song.tape && includeTapes) || !song.tape) {
        const searchQuery = getSpotifyTrackSearchQuery(setlist.artist.name, song, coversByOriginalArtist);
        const trackInfoPromise = spotifySdkInstance.search(searchQuery, queryType, "US", 1);
        const index = mergedSet.tracks.push({ songInfo: song }) - 1;
        trackPromiseMap.push({ index, promise: trackInfoPromise });
        trackPromisesList.push(trackInfoPromise);
      }
    }
  }

  const resolvedTracks = await Promise.all(trackPromisesList);

  trackPromiseMap.forEach(({ index }, i) => {
    mergedSet.tracks[index].trackInfo = resolvedTracks[i];
  });

  return mergedSet;
}
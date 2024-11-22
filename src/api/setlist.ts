import { Router, Request, Response } from "express";
import spotifySdk from "../services/SpotifySdk";
import { SearchResults, ItemTypes } from "@spotify/web-api-ts-sdk";
import Endpoints from "../endpoints/Endpoints";
import SetlistFm from "../interfaces/Setlist.fm";
import MergedSet from "../interfaces/MergedSet";

export const setlistRouter = Router();

setlistRouter.get('/', async (req: Request, res: Response) => {
  const setlistID = req.query.setId as string;

  const setlist = await getSetlistFmBySetId(setlistID);

  const mergedSpotifySetlist = await getMergedSpotifySetlist(setlist);

  res.send(mergedSpotifySetlist);
});

async function getSetlistFmBySetId(setID: string): Promise<SetlistFm> {
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

async function getMergedSpotifySetlist(setlist: SetlistFm): Promise<MergedSet> {
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
      const trackInfoPromise = spotifySdkInstance.search(`remaster%20track:${song.name}%20artist:${setlist.artist.name}`, queryType, "US", 1);
      const index = mergedSet.tracks.push({ songInfo: song }) - 1;
      trackPromiseMap.push({ index, promise: trackInfoPromise });
      trackPromisesList.push(trackInfoPromise);
    }
  }

  const resolvedTracks = await Promise.all(trackPromisesList);

  trackPromiseMap.forEach(({ index }, i) => {
    mergedSet.tracks[index].trackInfo = resolvedTracks[i];
  });

  return mergedSet;
}

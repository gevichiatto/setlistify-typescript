import { Router, Request, Response } from "express";
import spotifySdk from "../services/SpotifySdk";
import { SearchResults, ItemTypes, Track } from "@spotify/web-api-ts-sdk";
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

  for (const set of setlist.sets.set) {
    for (const song of set.song) {
      trackPromisesList.push(spotifySdkInstance.search(`remaster%20track:${song.name}%20artist:${setlist.artist}`, queryType, "US", 1));
    }
  }

  await Promise.all(trackPromisesList).then(tracklist => {
    const listOfSpotifyTracks: Track[] = [];
    for (const track of tracklist) {
      if (track.tracks?.items[0]) {
        listOfSpotifyTracks.push(track.tracks?.items[0]);
      }
    }
    mergedSet.tracks = listOfSpotifyTracks;
  });

  return mergedSet;
}
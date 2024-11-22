import { PartialSearchResult } from "@spotify/web-api-ts-sdk";
import { Song } from "./Setlist.fm";

interface MergedSong {
  songInfo: Song,
  trackInfo?: Pick<PartialSearchResult, "tracks"> | undefined,
}
interface MergedSet {
  artist: string;
  city: string;
  eventDate: string;
  tracks: MergedSong[];
}

export default MergedSet;
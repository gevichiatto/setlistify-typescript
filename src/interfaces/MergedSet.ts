import { Track } from "@spotify/web-api-ts-sdk";

interface MergedSet {
  artist: string;
  city: string;
  eventDate: string;
  tracks: Track[];
}

export default MergedSet;
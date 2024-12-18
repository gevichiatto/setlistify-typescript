import { Injectable } from '@nestjs/common';
import { getMergedSpotifySetlist } from '../../services/SpotifyPlaylistsService';
import { getSetlistFmBySetId } from '../../services/Setlist.fm.Service';
import { SetlistFm } from '../../interfaces/Setlist.fm';

@Injectable()
export class SetlistService {
  async getSetlistFmBySetId(setlistID: string) {
    return await getSetlistFmBySetId(setlistID);
  }

  async getMergedSpotifySetlist(setlist: SetlistFm, includeTapes: boolean, coversByOriginalArtist: boolean) {
    return await getMergedSpotifySetlist(setlist, includeTapes, coversByOriginalArtist);
  }
}

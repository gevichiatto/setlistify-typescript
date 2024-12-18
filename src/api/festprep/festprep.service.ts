import { Injectable } from '@nestjs/common';
import {
  getArtistsByNamesList,
  getSetlistsByScrappingArtists,
  getMergedSetlistsFromSetlists,
} from '../../services/Setlist.fm.Service';
import { Artist, SetlistFm } from '../../interfaces/Setlist.fm';

@Injectable()
export class FestprepService {
  async getArtistsByNamesList(artistsArray: string[]) {
    return await getArtistsByNamesList(artistsArray);
  }

  async getSetlistsByScrappingArtists(artists: Artist[]) {
    return await getSetlistsByScrappingArtists(artists);
  }

  async getMergedSetlistsFromSetlists(setlists: SetlistFm[], includeTapes: boolean, coversByOriginalArtist: boolean) {
    return await getMergedSetlistsFromSetlists(setlists, includeTapes, coversByOriginalArtist);
  }
}

import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SetlistService } from './setlist.service';

@Controller('api/setlist')
export class SetlistController {
  constructor(private readonly setlistService: SetlistService) {}

  @Get()
  async getSetlist(
    @Query('setId') setlistID: string,
    @Query('includeTapes') includeTapes: string,
    @Query('coversByOriginalArtist') coversByOriginalArtist: string,
  ) {
    if (!setlistID || setlistID.trim() === '') {
      throw new BadRequestException('Bad Request.');
    }

    const includeTapesBool = includeTapes === 'true';
    const coversByOriginalArtistBool = coversByOriginalArtist === 'true';

    const setlist = await this.setlistService.getSetlistFmBySetId(setlistID);

    return await this.setlistService.getMergedSpotifySetlist(setlist, includeTapesBool, coversByOriginalArtistBool);
  }
}

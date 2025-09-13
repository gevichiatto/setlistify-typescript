import { Controller, Get, Query, BadRequestException, ParseBoolPipe, ParseIntPipe } from '@nestjs/common';
import { SetlistService } from './setlist.service';

@Controller('api/setlist')
export class SetlistController {
  constructor(private readonly setlistService: SetlistService) {}

  @Get()
  async getSetlist(
    @Query('setId', ParseIntPipe) setlistID: number,
    @Query('includeTapes', ParseBoolPipe) includeTapes: boolean,
    @Query('coversByOriginalArtist', ParseBoolPipe) coversByOriginalArtist: boolean,
  ) {
    if (!setlistID) {
      throw new BadRequestException('Bad Request.');
    }

    const setlist = await this.setlistService.getSetlistFmBySetId(setlistID);

    return await this.setlistService.getMergedSpotifySetlist(setlist, includeTapes, coversByOriginalArtist);
  }
}

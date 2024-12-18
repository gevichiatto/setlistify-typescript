import { Controller, Get, Query, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { FestprepService } from './festprep.service';

@Controller('api/festprep')
export class FestprepController {
  constructor(private readonly festprepService: FestprepService) {}

  @Get()
  async getFestprep(
    @Query('artistsList') artistsList: string,
    @Query('includeTapes') includeTapes: string,
    @Query('coversByOriginalArtist') coversByOriginalArtist: string,
  ) {
    if (!artistsList || artistsList.trim() === '') {
      throw new BadRequestException('Bad Request.');
    }

    const includeTapesBool = includeTapes === 'true';
    const coversByOriginalArtistBool = coversByOriginalArtist === 'true';

    try {
      const artistsArray = artistsList.split(',');

      const artists = await this.festprepService.getArtistsByNamesList(artistsArray);
      const setlists = await this.festprepService.getSetlistsByScrappingArtists(artists);

      return await this.festprepService.getMergedSetlistsFromSetlists(
        setlists,
        includeTapesBool,
        coversByOriginalArtistBool,
      );
    } catch (error) {
      console.error('Error rejected:', error);
      throw new InternalServerErrorException('Internal Server Error.');
    }
  }
}

import { JSDOM } from 'jsdom';
import { Song } from '../interfaces/Setlist.fm';

function modifyResolvedURL(originalURL: string, yearsList: string[]): string {
  const mostRecentAvailableYear = yearsList[1];

  return `${originalURL.split('?')[0]}?year=${mostRecentAvailableYear}`;
}

export async function setlistFmScrapForAverageSetlistSongList(resolvedURL: string): Promise<Song[]> {
  return fetch(resolvedURL).then(async URLResponse => {
    const songsList: Song[] = [];

    if (!URLResponse.ok) {
      throw new Error(`SetlistScrapService.ts::setlistFmScrapForAverageSetlistSongList - Failed to fetch the URL: ${URLResponse.statusText}`);
    }

    const html = await URLResponse.text();

    if (!html) {
      throw new Error('SetlistScrapService.ts::setlistFmScrapForAverageSetlistSongList - Empty HTML content returned from the URL.');
    }

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const songElements = document.querySelectorAll('.songPart');

    if (songElements.length === 0) {
      const yearsSection = document.querySelector('.artistplayCounts');
      if (!yearsSection) {
        throw new Error('SetlistScrapService.ts::setlistFmScrapForAverageSetlistSongList - No years section found.');
      }
  
      const yearElements = yearsSection.querySelectorAll('a');
      const availableYears = Array.from(yearElements).map(el => el.textContent?.trim() || '');
      const modifiedURL = modifyResolvedURL(resolvedURL, availableYears);
      return setlistFmScrapForAverageSetlistSongList(modifiedURL);
    }

    const songs = Array.from(songElements).map(el => {
      const songName = el.textContent?.trim() || '';
      let isTape = false;
      let isCover = false;
      let coverArtistName = '';

      const parentRow = el.closest('li');
      if (parentRow?.classList.contains('tape')) {
        isTape = true;
      }

      const coverSpan = el.parentElement?.querySelector('.infoPart');
      if (coverSpan) {
        isCover = true;
        const coverText = coverSpan.textContent?.trim() || '';
        const match = /\((.+)\)/.exec(coverText);
        if (match) {
          coverArtistName = match[1];
        }
      }

      return { songName, isTape, isCover, coverArtistName };
    });

    songs.forEach(({ songName, isTape, isCover, coverArtistName }) => {
      const newSong: Song = {
        name: songName,
        tape: isTape
      };
      if (isCover) {
        newSong.cover = { name: coverArtistName };
      }
      songsList.push(newSong);
    });

    return songsList;
  });
}
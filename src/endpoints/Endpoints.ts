const SETLIST_FM_API = 'https://api.setlist.fm/rest';

const SetlistFmEndpoints = {
  setlistFmSetlistByID: `${SETLIST_FM_API}/1.0/setlist/`,
  artistByArtistName: `${SETLIST_FM_API}/1.0/search/artists`,
};

export default SetlistFmEndpoints;
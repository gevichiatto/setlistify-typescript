import { Router, Request, Response } from "express";
import { getArtistsByNamesList, getSetlistsByScrappingArtists, getMergedSetlistsFromSetlists } from "../services/Setlist.fm.Service";

export const festPrepRouter = Router();

festPrepRouter.get('/', async (req: Request, res: Response) => {
  const artistsList = req.query.artistsList as string;

  if (!artistsList || !artistsList.length) {
    res.status(400).json({ message: 'Bad Request.' });
    return;
  }

  const artistsArray = artistsList.split(",");

  const artists = await getArtistsByNamesList(artistsArray);

  const setlists = await getSetlistsByScrappingArtists(artists);

  const mergedSetlists = await getMergedSetlistsFromSetlists(setlists);

  res.send(mergedSetlists);
})
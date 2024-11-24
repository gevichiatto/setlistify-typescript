import { Router, Request, Response } from "express";
import { getArtistsByNamesList, getSetlistsByScrappingArtists, getMergedSetlistsFromSetlists } from "../services/Setlist.fm.Service";

export const festPrepRouter = Router();

festPrepRouter.get('/', async (req: Request, res: Response) => {
  const artistsList = req.query.artistsList as string;

  if (!artistsList || !artistsList.length) {
    res.status(400).json({ message: 'Bad Request.' });
    return;
  }

  const includeTapes: boolean = req.query.includeTapes === "true";
  const coversByOriginalArtist: boolean = req.query.coversByOriginalArtist === "true";

  try {
    const artistsArray = artistsList.split(",");
  
    const artists = await getArtistsByNamesList(artistsArray);
  
    const setlists = await getSetlistsByScrappingArtists(artists);

    const mergedSetlists = await getMergedSetlistsFromSetlists(setlists, includeTapes, coversByOriginalArtist);
  
    res.send(mergedSetlists);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
    console.log("Error rejected:", error);
  }
})
import { Router, Request, Response } from "express";
import { getMergedSpotifySetlist, getSetlistFmBySetId } from "../services/SetlistService";

export const setlistRouter = Router();

setlistRouter.get('/', async (req: Request, res: Response) => {
  const setlistID = req.query.setId as string;

  if (!setlistID || setlistID == "") {
    res.status(400).json({ message: "Bad Request." });
    return;
  }

  const includeTapes: boolean = req.query.includeTapes === "true";
  const coversByOriginalArtist: boolean = req.query.coversByOriginalArtist === "true";

  const setlist = await getSetlistFmBySetId(setlistID);

  const mergedSpotifySetlist = await getMergedSpotifySetlist(setlist, includeTapes, coversByOriginalArtist);

  res.send(mergedSpotifySetlist);
});
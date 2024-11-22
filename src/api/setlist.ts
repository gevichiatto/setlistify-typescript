import { Router, Request, Response } from "express";
import { getMergedSpotifySetlist, getSetlistFmBySetId } from "../services/SetlistService";

export const setlistRouter = Router();

setlistRouter.get('/', async (req: Request, res: Response) => {
  const setlistID = req.query.setId as string;

  const setlist = await getSetlistFmBySetId(setlistID);

  const mergedSpotifySetlist = await getMergedSpotifySetlist(setlist);

  res.send(mergedSpotifySetlist);
});
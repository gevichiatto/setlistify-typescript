import { Router, Request, Response, request } from "express";

export const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Coé.')
})

import { Router } from "express";
import { setlistRouter } from "./setlist";

export const router = Router();

router.use("/api/setlist/", setlistRouter);

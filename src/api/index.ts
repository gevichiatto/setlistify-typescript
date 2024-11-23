import { Router } from "express";
import { setlistRouter } from "./setlist";
import { festPrepRouter } from "./festPrep";

export const router = Router();

router.use("/api/setlist/", setlistRouter);
router.use("/api/festPrep/", festPrepRouter);

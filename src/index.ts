import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { router }  from "./api"
import spotifySdk from "./services/SpotifySdk";

dotenv.config({
	path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use((req: Request, res: Response, next: NextFunction) => {
	bodyParser.json({ limit: '20mb' })(req, res, next);
});

app.use(bodyParser.urlencoded({
	extended: true,
	limit: '30mb',
}));
	
app.use(cors<Request>(), router);

function startServer(): void {
  try {
    spotifySdk.authenticate();
    console.log('Spotify SDK authenticated.');
  } catch (error) {
    console.error('Failed to authenticate the Spotify SDK.', error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

startServer();

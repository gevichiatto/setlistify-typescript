import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import spotifySdk from "./services/SpotifySdk";
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

async function bootstrap() {
  try {
    spotifySdk.authenticate();
    console.log('Spotify SDK authenticated.');
  } catch (error) {
    console.error('Failed to authenticate the Spotify SDK.', error);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
  app.use(cors());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`[server]: Server is running at http://localhost:${port}`);
}
bootstrap();

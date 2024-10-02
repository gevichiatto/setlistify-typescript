import { SpotifyApi } from "@spotify/web-api-ts-sdk"

class SpotifySdk {
  private spotifySdk: SpotifyApi;
  private authenticated: boolean = false;

  constructor() {
    this.spotifySdk = {} as SpotifyApi;
  }

  public authenticate(): void {
    if (!this.authenticated || !this.spotifySdk) {
      this.spotifySdk = SpotifyApi.withClientCredentials(
        process.env.CLIENT_ID as string,
        process.env.CLIENT_SECRET as string
      );
    }
    this.authenticated = true;
  }
  
  public getSpotifySdkInstance(): SpotifyApi {
    if (!this.authenticated) {
      throw new Error("SpotifySdk:getSpotifySdkInstance :: SpotifySdk not authenticated.");
    }
    return this.spotifySdk;
  }
}

const spotifySdk = new SpotifySdk();
export default spotifySdk;
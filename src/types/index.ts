export interface SteamGameInfo {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_capsule_url: string;
  last_playtime: number;
  achievements: {
    total: number;
    completed: number;
  };
}


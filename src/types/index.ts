export interface SteamGameInfo {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
  img_capsule_url: string;
  last_played: number;
  achievements: {
    total: number;
    completed: number;
  };
}

export interface SvgData {
  recentGame: SteamGameInfo | null;
  theme: string;
}
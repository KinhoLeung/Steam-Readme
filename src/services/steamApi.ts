import axios from 'axios';
import { SteamGameInfo } from '../types';


export async function fetchRecentGame(steamId: string, apiKey: string): Promise<SteamGameInfo | null> {
  try {
    const [recentGamesResponse, ownedGamesResponse] = await Promise.all([
      axios.get(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`),
      axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=1`)
    ]);
    
    if (recentGamesResponse.data?.response?.games?.length > 0) {
      const game = recentGamesResponse.data.response.games[0];
      const ownedGame = ownedGamesResponse.data?.response?.games?.find((g: any) => g.appid === game.appid);
      
      if (!ownedGame) {
        throw new Error('无法获取游戏信息');
      }
      
      // 获取游戏成就信息
      const achievementsResponse = await axios.get(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${game.appid}&key=${apiKey}&steamid=${steamId}`);
      let totalAchievements = 0;
      let completedAchievements = 0;
      
      if (achievementsResponse.data?.playerstats?.achievements) {
        totalAchievements = achievementsResponse.data.playerstats.achievements.length;
        completedAchievements = achievementsResponse.data.playerstats.achievements.filter((a: { achieved: number }) => a.achieved === 1).length;
      }
      
      return {
        appid: game.appid,
        name: game.name,
        playtime_2weeks: game.playtime_2weeks,
        playtime_forever: game.playtime_forever,
        img_icon_url: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
        img_capsule_url: `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`,
        last_played: ownedGame.rtime_last_played, // 使用GetOwnedGames API返回的最后游玩时间
        achievements: {
          total: totalAchievements,
          completed: completedAchievements
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error('从Steam API获取最近游戏数据时出错:', error);
    throw error;
  }
}


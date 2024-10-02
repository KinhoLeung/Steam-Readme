import axios from 'axios';
import { SteamGameInfo } from '../types';

// Define interfaces to describe the expected data structures
interface RecentGame {
  appid: number;
  playtime_2weeks: number;
  playtime_forever: number;
}

interface LastPlayedGame {
  appid: number;
  last_playtime: number;
}

interface MatchedGame extends RecentGame {
  last_playtime: number;
}

export async function fetchRecentGame(steamId: string, apiKey: string): Promise<SteamGameInfo | null> {
  try {
    // Step 1: Get the list of recently played games
    const recentGamesResponse = await axios.get(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`);
    const recentGames: RecentGame[] = recentGamesResponse.data?.response?.games || [];

    if (recentGames.length === 0) {
      return null; // If there are no recently played games, return null
    }

    // Step 2: Get the last played time data
    const lastPlayedResponse = await axios.get(`http://api.steampowered.com/IPlayerService/ClientGetLastPlayedTimes/v1/?key=${apiKey}&steamid=${steamId}&format=json`);
    const lastPlayedGames: LastPlayedGame[] = lastPlayedResponse.data?.response?.games || [];

    // Step 3: Match the data
    const matchedGames: MatchedGame[] = recentGames.map(recentGame => {
      const lastPlayedInfo = lastPlayedGames.find(g => g.appid === recentGame.appid);
      return lastPlayedInfo ? { ...recentGame, last_playtime: lastPlayedInfo.last_playtime } : null;
    }).filter((game): game is MatchedGame => game !== null);

    // Step 4: Find the most recently played game
    const mostRecentGame = matchedGames.reduce((latest, current) => 
      (current.last_playtime > latest.last_playtime) ? current : latest
    );

    // Step 5: Get detailed game information
    const [ownedGamesResponse, achievementsResponse] = await Promise.all([
      axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=1`),
      axios.get(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${mostRecentGame.appid}&key=${apiKey}&steamid=${steamId}`)
    ]);

    const ownedGame = ownedGamesResponse.data?.response?.games?.find((g: any) => g.appid === mostRecentGame.appid);

    if (!ownedGame) {
      throw new Error('Unable to retrieve game information');
    }

    let totalAchievements = 0;
    let completedAchievements = 0;
    
    if (achievementsResponse.data?.playerstats?.achievements) {
      totalAchievements = achievementsResponse.data.playerstats.achievements.length;
      completedAchievements = achievementsResponse.data.playerstats.achievements.filter((a: { achieved: number }) => a.achieved === 1).length;
    }
    
    return {
      appid: mostRecentGame.appid,
      name: ownedGame.name,
      playtime_2weeks: mostRecentGame.playtime_2weeks,
      playtime_forever: mostRecentGame.playtime_forever,
      //https://steamcdn-a.akamaihd.net/steam/apps/${mostRecentGame.appid}//library_600x900.jpg
      img_capsule_url: `https://steamcdn-a.akamaihd.net/steam/apps/${mostRecentGame.appid}/header.jpg`,
      last_playtime: mostRecentGame.last_playtime,
      achievements: {
        total: totalAchievements,
        completed: completedAchievements
      }
    };
  } catch (error) {
    console.error('Error fetching recent game data from Steam API:', error);
    throw error;
  }
}


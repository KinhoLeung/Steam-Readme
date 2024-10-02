import * as dotenv from 'dotenv';
import axios from 'axios';
import * as http from 'http';
import * as url from 'url';
import { fetchRecentGame } from '../services/steamApi';

dotenv.config();

function errorHandler(error: unknown, res: http.ServerResponse) {
  console.error('Error generating SVG:', error);
  if (error instanceof Error) {
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Internal server error while generating SVG', details: error instanceof Error ? error.message : String(error) }));
}

function formatPlaytime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  return `${Math.round(minutes / 60)} hours`;
}

function formatLastPlayed(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

async function handler(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const steamId = process.env.STEAM_ID;
    const apiKey = process.env.STEAM_API_KEY;

    if (!steamId || !apiKey) {
      throw new Error('Missing Steam ID or API key');
    }

    const parsedUrl = url.parse(req.url || '', true);
    const theme = parsedUrl.query.theme as string || 'light';

    const recentGame = await fetchRecentGame(steamId, apiKey);

    if (!recentGame) {
      throw new Error('Unable to fetch recent game information');
    }

    const imageUrl = recentGame.img_capsule_url;
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    const base64Image = imageBuffer.toString('base64');

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="540" height="163">
        <style>
          .game-name { fill: ${theme === 'dark' ? '#ffffff' : '#000000'}; font-size: 20px; font-weight: bold; }
          .game-info { fill: ${theme === 'dark' ? '#ffffff' : '#000000'}; font-size: 14px; }
        </style>
        <image href="data:image/jpeg;base64,${base64Image}" x="10" y="10" width="306" height="143"/>
        <text x="336" y="30" class="game-name">${recentGame.name}</text>
        <text x="336" y="60" class="game-info">Playtime 2weeks: ${formatPlaytime(recentGame.playtime_2weeks)}</text>
        <text x="336" y="90" class="game-info">Playtime forever: ${formatPlaytime(recentGame.playtime_forever)}</text>
        <text x="336" y="120" class="game-info">Last playtime: ${formatLastPlayed(recentGame.last_playtime)}</text>
        <text x="336" y="150" class="game-info">Achievements: ${recentGame.achievements.completed}/${recentGame.achievements.total}</text>
        <text x="0" y="0" visibility="hidden">${Date.now()}</text>
      </svg>
    `;

    res.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(svg);
  } catch (error) {
    errorHandler(error, res);
  }
}

const server = http.createServer(handler);
const port = 3000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
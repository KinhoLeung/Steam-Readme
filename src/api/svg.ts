import * as dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import * as http from 'http';
import * as url from 'url';
import { fetchRecentGame } from '../services/steamApi';
import { generateSvg } from '../services/svgGenerator';

function errorHandler(error: unknown, res: http.ServerResponse) {
  console.error('生成SVG时出错:', error);
  if (error instanceof Error) {
    console.error('错误消息:', error.message);
    console.error('错误堆栈:', error.stack);
  }
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: '生成SVG时出现内部服务器错误', details: error instanceof Error ? error.message : String(error) }));
}

function formatPlaytime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} 分钟`;
  }
  return `${Math.round(minutes / 60)} 小时`;
}

function formatLastPlayed(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('zh-CN');
}

async function handler(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const steamId = process.env.STEAM_ID;
    const apiKey = process.env.STEAM_API_KEY;

    if (!steamId || !apiKey) {
      throw new Error('缺少Steam ID或API密钥');
    }

    // 解析URL参数
    const parsedUrl = url.parse(req.url || '', true);
    const theme = parsedUrl.query.theme as string || 'light';

    const recentGame = await fetchRecentGame(steamId, apiKey);

    if (!recentGame) {
      throw new Error('无法获取最近游戏信息');
    }

    // 创建包含游戏信息的 SVG
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="220">
        <style>
          .game-name { fill: ${theme === 'dark' ? '#ffffff' : '#000000'}; font-size: 20px; font-weight: bold; }
          .game-info { fill: ${theme === 'dark' ? '#A0A0A0' : '#A0A0A0'}; font-size: 14px; }
        </style>
        <image href="${recentGame.img_capsule_url}" x="20" y="20" width="300" height="140"/>
        <text x="340" y="40" class="game-name">${recentGame.name}</text>
        <text x="340" y="70" class="game-info">Playtime 2weeks: ${formatPlaytime(recentGame.playtime_2weeks)}</text>
        <text x="340" y="100" class="game-info">Playtime forever: ${formatPlaytime(recentGame.playtime_forever)}</text>
        <text x="340" y="130" class="game-info">Last played: ${formatLastPlayed(recentGame.last_played)}</text>
        <text x="340" y="160" class="game-info">Achievements: ${recentGame.achievements.completed}/${recentGame.achievements.total}</text>
      </svg>
    `;

    res.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(svg);
  } catch (error) {
    errorHandler(error, res);
  }
}

const server = http.createServer(handler);
const port = 3000;

server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
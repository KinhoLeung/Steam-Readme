import * as dotenv from 'dotenv';
dotenv.config();

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
    const svgContent = generateSvg({ recentGame, theme });

    res.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate'
    });
    res.end(svgContent);
  } catch (error) {
    errorHandler(error, res);
  }
}

const server = http.createServer(handler);
const port = 3000;

server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
import { SvgData } from '../types';

function formatLastPlayed(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatPlaytime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  return `${Math.round(minutes / 60)} hours`;
}

export function generateSvg(data: SvgData): string {
  const { recentGame, theme } = data;

  const textColor = theme === 'dark' ? '#ffffff' : '#444444';
  const subTextColor = theme === 'dark' ? '#a0a0a0' : '#888888';

  let svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="220" viewBox="0 0 600 220">
      <style>
        .game-name { fill: ${textColor}; font-size: 20px; font-weight: bold; }
        .game-time { fill: ${subTextColor}; font-size: 16px; }
        .no-game { fill: ${subTextColor}; font-size: 18px; }
      </style>
  `;

  if (recentGame) {
    svgContent += `
      <image x="20" y="20" width="300" height="140" href="${recentGame.img_capsule_url}" />
      <text x="340" y="40" class="game-name">${recentGame.name}</text>
      <text x="340" y="70" class="game-time">Playtime 2weeks: ${formatPlaytime(recentGame.playtime_2weeks)}</text>
      <text x="340" y="100" class="game-time">Playtime forever: ${formatPlaytime(recentGame.playtime_forever)}</text>
      <text x="340" y="130" class="game-time">Rtime last played: ${formatLastPlayed(recentGame.last_played)}</text>
      <text x="340" y="160" class="game-time">Achievements: ${recentGame.achievements.completed}/${recentGame.achievements.total}</text>
    `;
  } else {
    svgContent += `
      <text x="20" y="100" class="no-game">No recently played games</text>
    `;
  }

  svgContent += '</svg>';
  return svgContent;
}
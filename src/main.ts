// Error handler - shows ALL errors on the page
window.addEventListener('error', function(e) {
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;top:0;left:0;width:100%;padding:15px;background:rgba(255,50,50,0.95);color:white;font-size:16px;font-family:monospace;z-index:99999;white-space:pre-wrap;word-break:break-all;pointer-events:auto';
  div.textContent = '\u26A0\uFE0F ERROR: ' + (e.error ? (e.error.message || e.error.toString()) : e.message || 'Unknown error');
  if (e.error && e.error.stack) {
    div.textContent += '\n\nStack: ' + e.error.stack;
  }
  document.body.appendChild(div);
});
window.onerror = function(msg, url, line, col, error) {
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;top:50px;left:0;width:100%;padding:15px;background:rgba(200,0,0,0.95);color:white;font-size:16px;font-family:monospace;z-index:99999;white-space:pre-wrap;word-break:break-all;pointer-events:auto';
  div.textContent = '\u26A0\uFE0F onerror: ' + msg + '\nFile: ' + url + ':' + line + ':' + col;
  if (error && error.stack) {
    div.textContent += '\n\nStack: ' + error.stack;
  }
  document.body.appendChild(div);
  return true;
};

// Add a visible marker that JS is running
window.addEventListener('DOMContentLoaded', function() {
  const test = document.getElementById('js-test');
  if (test) test.textContent = 'JS LOADED';
});

import Phaser from 'phaser';
import { BootScene } from './phaser/scenes/BootScene';
import { GameScene } from './phaser/scenes/GameScene';
import { initHUD } from './ui/hud';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  parent: 'game-container',
  backgroundColor: '#5c94fc',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 900 },
      debug: false,
    },
  },
  scene: [BootScene, GameScene],
  pixelArt: true,
  roundPixels: true,
};

const game = new Phaser.Game(config);
initHUD(game);

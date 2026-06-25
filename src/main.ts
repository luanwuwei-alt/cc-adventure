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

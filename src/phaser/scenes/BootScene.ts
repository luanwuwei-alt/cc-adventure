import Phaser from 'phaser';
import { ASSET_KEYS, TILE } from '../../game/assets/manifest';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    this.generateShibaInuTexture();
    this.generateZubatTexture();
    this.generatePokeballTexture();
    this.generateGroundTexture();
    this.generateBrickTexture();
    this.generateQuestionTexture();
    this.generatePlatformTexture();
    this.generateFlagTexture();

    this.scene.start('GameScene');
  }

  private generateShibaInuTexture(): void {
    const s = 32;
    const g = this.add.graphics();
    g.setVisible(false);

    const TAN = 0xd4823a;
    const WHITE = 0xf5efe0;
    const DARK = 0x3a2510;
    const PINK = 0xff8a8a;

    // ── Tail (curled up - back LEFT) ──
    g.fillStyle(TAN);
    g.fillRect(0, 12, 6, 4);
    g.fillRect(0, 8, 4, 6);
    g.fillRect(3, 8, 3, 2);
    g.fillStyle(WHITE);
    g.fillRect(1, 8, 3, 2);
    g.fillRect(0, 10, 2, 2);

    // ── Back legs ──
    g.fillStyle(TAN);
    g.fillRect(4, 24, 5, 6);
    g.fillRect(7, 24, 5, 6);
    g.fillStyle(WHITE);
    g.fillRect(4, 28, 5, 4);
    g.fillRect(7, 28, 5, 4);

    // ── Body (side view) ──
    g.fillStyle(TAN);
    g.fillEllipse(13, 20, 16, 16);
    g.fillRect(6, 12, 14, 16);
    g.fillStyle(WHITE);
    g.fillEllipse(14, 22, 10, 10);
    g.fillRect(9, 17, 10, 8);

    // ── Front legs ──
    g.fillStyle(TAN);
    g.fillRect(15, 24, 5, 6);
    g.fillRect(18, 24, 5, 6);
    g.fillStyle(WHITE);
    g.fillRect(15, 28, 5, 4);
    g.fillRect(18, 28, 5, 4);

    // ── Chest fluff ──
    g.fillStyle(WHITE);
    g.fillEllipse(22, 16, 8, 6);

    // ── Head (side view, facing RIGHT) ──
    g.fillStyle(TAN);
    g.fillCircle(18, 9, 8);
    g.fillRect(10, 3, 16, 12);

    // Ear
    g.fillStyle(TAN);
    g.fillTriangle(14, 1, 22, 1, 16, 8);
    g.fillStyle(PINK);
    g.fillTriangle(16, 2, 20, 2, 17, 6);

    // White muzzle extending RIGHT
    g.fillStyle(WHITE);
    g.fillEllipse(25, 11, 12, 8);
    g.fillRect(18, 7, 10, 8);

    // Big cute anime-style eye
    g.fillStyle(DARK);
    g.fillEllipse(23, 7, 6, 6);
    g.fillStyle(0xffffff);
    g.fillCircle(22, 6, 2);
    g.fillCircle(24, 8, 1);

    // Nose
    g.fillStyle(DARK);
    g.fillEllipse(28, 9, 3, 2);

    // Smile
    g.lineStyle(1, DARK);
    g.lineBetween(24, 11, 27, 11);

    // Tongue
    g.fillStyle(PINK);
    g.fillRect(24, 11, 3, 3);
    g.fillRect(24, 10, 2, 1);

    // Blush
    g.fillStyle(PINK, 0.4);
    g.fillCircle(18, 11, 3);

    g.generateTexture(ASSET_KEYS.PLAYER, s, s);
    g.destroy();
  }

  private generateZubatTexture(): void {
    const s = 32;
    const g = this.add.graphics();
    g.setVisible(false);

    const P = 0x705898; // purple body
    const DP = 0x49376a; // dark purple wings
    const LP = 0xa898c8; // light purple mouth
    const B = 0x222222;

    // Body
    g.fillStyle(P);
    g.fillCircle(16, 16, 10);
    g.fillRect(10, 8, 12, 16);

    // Wings (pointing out)
    g.fillStyle(DP);
    g.fillTriangle(4, 10, 12, 14, 2, 22);
    g.fillTriangle(28, 10, 20, 14, 30, 22);

    // Inner wing detail
    g.fillStyle(P);
    g.fillTriangle(6, 12, 12, 14, 4, 20);
    g.fillTriangle(26, 12, 20, 14, 28, 20);

    // Mouth area
    g.fillStyle(LP);
    g.fillRect(12, 20, 8, 4);
    // Fangs
    g.fillStyle(0xffffff);
    g.fillRect(12, 21, 2, 3);
    g.fillRect(18, 21, 2, 3);
    // Fang outlines
    g.fillStyle(B);
    g.fillRect(12, 21, 2, 1);
    g.fillRect(18, 21, 2, 1);

    // Small eyes (Zubat has tiny eyes)
    g.fillStyle(0xff4444);
    g.fillRect(12, 12, 2, 2);
    g.fillRect(18, 12, 2, 2);

    g.generateTexture(ASSET_KEYS.ENEMY, s, s);
    g.destroy();
  }

  private generatePokeballTexture(): void {
    const s = 16;
    const g = this.add.graphics();
    g.setVisible(false);

    const RED = 0xee1515;
    const WHITE = 0xf0f0f0;
    const DARK = 0x222224;

    // Top half (red)
    g.fillStyle(RED);
    g.fillCircle(8, 8, 7);
    g.fillRect(1, 0, 14, 8);
    // Bottom half (white)
    g.fillStyle(WHITE);
    g.fillRect(1, 8, 14, 8);
    g.fillCircle(8, 8, 7);
    // Fill top half red again to cover white overlap
    g.fillStyle(RED);
    g.fillRect(1, 0, 14, 6);

    // Center band
    g.fillStyle(DARK);
    g.fillRect(1, 6, 14, 3);

    // Center button
    g.fillStyle(WHITE);
    g.fillCircle(8, 7, 3);
    g.fillStyle(DARK);
    g.fillCircle(8, 7, 3);
    g.fillStyle(WHITE);
    g.fillCircle(8, 7, 2);
    g.fillStyle(RED);
    g.fillCircle(8, 7, 1);

    g.generateTexture(ASSET_KEYS.COIN, s, s);
    g.destroy();
  }

  private generateGroundTexture(): void {
    const s = TILE.SIZE;
    const g = this.add.graphics();
    g.setVisible(false);

    // Grass top (vibrant green - Pokemon style)
    g.fillStyle(0x4a9e2e);
    g.fillRect(0, 0, s, 5);
    g.fillStyle(0x5cb83a);
    g.fillRect(0, 0, s, 3);

    // Dirt
    g.fillStyle(0xa0784a);
    g.fillRect(0, 5, s, s - 5);
    g.fillStyle(0x8b6a3c);
    g.fillRect(0, 5, s, 2);

    // Small grass tufts
    g.fillStyle(0x3d8a24);
    g.fillRect(2, 0, 2, 3);
    g.fillRect(10, 0, 2, 4);
    g.fillRect(22, 0, 2, 2);
    g.fillRect(28, 0, 2, 3);

    // Dirt speckles
    g.fillStyle(0x8b6a3c);
    g.fillRect(4, 10, 3, 2);
    g.fillRect(20, 16, 4, 2);
    g.fillRect(12, 22, 2, 2);
    g.fillRect(26, 20, 3, 2);
    g.fillRect(8, 26, 4, 2);

    g.generateTexture(ASSET_KEYS.TILES + '_ground', s, s);
    g.destroy();
  }

  private generateBrickTexture(): void {
    const s = TILE.SIZE;
    const g = this.add.graphics();
    g.setVisible(false);

    // Base color (stone - Pokemon gym style)
    g.fillStyle(0x888888);
    g.fillRect(0, 0, s, s);
    g.fillStyle(0x777777);
    g.fillRect(0, 0, s, 1);
    g.fillRect(0, 0, 1, s);

    // Brick pattern
    g.fillStyle(0x999999);
    g.fillRect(2, 2, 12, 12);
    g.fillRect(18, 2, 12, 12);
    g.fillRect(8, 16, 16, 12);
    g.fillRect(2, 16, 4, 12);

    g.generateTexture(ASSET_KEYS.TILES + '_brick', s, s);
    g.destroy();
  }

  private generateQuestionTexture(): void {
    const s = TILE.SIZE;
    const g = this.add.graphics();
    g.setVisible(false);

    // Blue item box (Pokemon style)
    const BLUE = 0x3068c8;
    const LIGHT = 0x4088e8;
    const DARK = 0x2050a0;

    g.fillStyle(BLUE);
    g.fillRect(0, 0, s, s);
    // Border
    g.fillStyle(DARK);
    g.fillRect(0, 0, s, 2);
    g.fillRect(0, s - 2, s, 2);
    g.fillRect(0, 0, 2, s);
    g.fillRect(s - 2, 0, 2, s);
    // Inner highlight
    g.fillStyle(LIGHT);
    g.fillRect(2, 2, s - 4, s - 4);
    g.fillStyle(BLUE);
    g.fillRect(3, 3, s - 6, s - 6);

    // Poke Ball icon in the center
    // Top half
    g.fillStyle(0xee1515);
    g.fillRect(9, 8, 14, 7);
    // Bottom half
    g.fillStyle(0xf0f0f0);
    g.fillRect(9, 15, 14, 7);
    // Band
    g.fillStyle(0x222224);
    g.fillRect(8, 14, 16, 2);
    // Button
    g.fillStyle(0xf0f0f0);
    g.fillRect(14, 13, 4, 4);
    g.fillStyle(0x222224);
    g.fillRect(14, 13, 4, 1);
    g.fillRect(14, 16, 4, 1);
    g.fillRect(14, 13, 1, 4);
    g.fillRect(17, 13, 1, 4);

    g.generateTexture(ASSET_KEYS.TILES + '_question', s, s);
    g.destroy();
  }

  private generatePlatformTexture(): void {
    const s = TILE.SIZE;
    const g = this.add.graphics();
    g.setVisible(false);

    g.fillStyle(0x888888);
    g.fillRect(0, 0, s, s);
    g.fillStyle(0xaaaaaa);
    g.fillRect(2, 2, s - 4, s - 4);
    g.fillStyle(0x666666);
    g.fillRect(0, s - 3, s, 3);

    g.generateTexture(ASSET_KEYS.TILES + '_platform', s, s);
    g.destroy();
  }

  private generateFlagTexture(): void {
    const g = this.add.graphics();
    g.setVisible(false);

    // Pole
    g.fillStyle(0xcccccc);
    g.fillRect(0, 0, 4, 128);

    // Ball on top (Poke Ball style)
    g.fillStyle(0xee1515);
    g.fillCircle(6, 4, 6);
    g.fillStyle(0xf0f0f0);
    g.fillRect(2, 4, 8, 4);
    g.fillStyle(0x222224);
    g.fillRect(1, 3, 10, 2);

    // Flag (Pikachu yellow with star)
    g.fillStyle(0xffde21);
    g.fillTriangle(4, 6, 32, 14, 4, 22);
    // Star/shine on flag
    g.fillStyle(0xffe85c);
    g.fillRect(10, 10, 4, 4);
    g.fillRect(12, 8, 2, 8);

    g.generateTexture(ASSET_KEYS.FLAG, 36, 128);
    g.destroy();
  }
}

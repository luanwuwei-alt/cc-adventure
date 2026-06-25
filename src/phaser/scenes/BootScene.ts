import Phaser from 'phaser';
import { ASSET_KEYS, TILE } from '../../game/assets/manifest';
import { LEVEL_THEMES, THEME_COLORS, type Theme } from '../../game/content/maps/levels';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  create(data?: { level?: number }): void {
    const levelIdx = data?.level ?? 0;
    this.generateShibaInuTexture();
    this.generateZubatTexture();
    this.generatePokeballTexture();
    this.generateFlagTexture();
    for (const theme of LEVEL_THEMES) {
      this.generateGroundTexture(theme);
      this.generateBrickTexture(theme);
      this.generateQuestionTexture(theme);
      this.generatePlatformTexture(theme);
    }
    this.scene.start('GameScene', { level: levelIdx });
  }

  private fillRoundRect(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, r: number): void {
    g.fillRoundedRect(x, y, w, h, r);
  }

  private generateShibaInuTexture(): void {
    const g = this.add.graphics().setVisible(false);
    const TAN=0xd4823a,WHITE=0xf5efe0,DARK=0x3a2510,PINK=0xff8a8a;
    g.fillStyle(TAN); g.fillRect(0,12,6,4); g.fillRect(0,8,4,6); g.fillRect(3,8,3,2);
    g.fillStyle(WHITE); g.fillRect(1,8,3,2); g.fillRect(0,10,2,2);
    g.fillStyle(TAN); g.fillRect(4,24,5,6); g.fillRect(7,24,5,6);
    g.fillStyle(WHITE); g.fillRect(4,28,5,4); g.fillRect(7,28,5,4);
    g.fillStyle(TAN); g.fillEllipse(13,20,16,16); g.fillRect(6,12,14,16);
    g.fillStyle(WHITE); g.fillEllipse(14,22,10,10); g.fillRect(9,17,10,8);
    g.fillStyle(TAN); g.fillRect(15,24,5,6); g.fillRect(18,24,5,6);
    g.fillStyle(WHITE); g.fillRect(15,28,5,4); g.fillRect(18,28,5,4);
    g.fillStyle(WHITE); g.fillEllipse(22,16,8,6);
    g.fillStyle(TAN); g.fillCircle(18,9,8); g.fillRect(10,3,16,12);
    g.fillStyle(TAN); g.fillTriangle(14,1,22,1,16,8);
    g.fillStyle(PINK); g.fillTriangle(16,2,20,2,17,6);
    g.fillStyle(WHITE); g.fillEllipse(25,11,12,8); g.fillRect(18,7,10,8);
    g.fillStyle(DARK); g.fillEllipse(23,7,6,6);
    g.fillStyle(0xffffff); g.fillCircle(22,6,2); g.fillCircle(24,8,1);
    g.fillStyle(DARK); g.fillEllipse(28,9,3,2);
    g.lineStyle(1,DARK); g.lineBetween(24,11,27,11);
    g.fillStyle(PINK); g.fillRect(24,11,3,3); g.fillRect(24,10,2,1);
    g.fillStyle(PINK); g.fillCircle(18,11,3);
    g.generateTexture(ASSET_KEYS.PLAYER,32,32); g.destroy();
  }

  private generateZubatTexture(): void {
    const g = this.add.graphics().setVisible(false);
    const P=0x705898,DP=0x49376a,LP=0xa898c8,B=0x222222;
    g.fillStyle(P); g.fillCircle(16,16,10); g.fillRect(10,8,12,16);
    g.fillStyle(DP); g.fillTriangle(4,10,12,14,2,22); g.fillTriangle(28,10,20,14,30,22);
    g.fillStyle(P); g.fillTriangle(6,12,12,14,4,20); g.fillTriangle(26,12,20,14,28,20);
    g.fillStyle(LP); g.fillRect(12,20,8,4);
    g.fillStyle(0xffffff); g.fillRect(12,21,2,3); g.fillRect(18,21,2,3);
    g.fillStyle(B); g.fillRect(12,21,2,1); g.fillRect(18,21,2,1);
    g.fillStyle(0xff4444); g.fillRect(12,12,2,2); g.fillRect(18,12,2,2);
    g.generateTexture(ASSET_KEYS.ENEMY,32,32); g.destroy();
  }

  private generatePokeballTexture(): void {
    const g = this.add.graphics().setVisible(false);
    const RED=0xee1515,WHITE=0xf0f0f0,DARK=0x222224;
    g.fillStyle(RED); g.fillCircle(8,8,7); g.fillRect(1,0,14,8);
    g.fillStyle(WHITE); g.fillRect(1,8,14,8); g.fillCircle(8,8,7);
    g.fillStyle(RED); g.fillRect(1,0,14,6);
    g.fillStyle(DARK); g.fillRect(1,6,14,3);
    g.fillStyle(WHITE); g.fillCircle(8,7,3); g.fillStyle(DARK); g.fillCircle(8,7,3);
    g.fillStyle(WHITE); g.fillCircle(8,7,2); g.fillStyle(RED); g.fillCircle(8,7,1);
    g.generateTexture(ASSET_KEYS.COIN,16,16); g.destroy();
  }

  private generateGroundTexture(theme: Theme): void {
    const s=TILE.SIZE,g=this.add.graphics().setVisible(false);
    const c=THEME_COLORS[theme];
    g.fillStyle(c.ground); g.fillRect(0,0,s,5);
    g.fillStyle(c.brick); g.fillRect(0,0,s,3);
    g.fillStyle(c.ground); g.fillRect(0,5,s,s-5);
    g.fillStyle(c.brick); g.fillRect(0,5,s,2);
    g.fillStyle(c.platform); g.fillRect(4,10,3,2); g.fillRect(20,16,4,2);
    g.fillRect(12,22,2,2); g.fillRect(26,20,3,2); g.fillRect(8,26,4,2);
    g.generateTexture(ASSET_KEYS.TILES+'_ground_'+theme,s,s); g.destroy();
  }

  private generateBrickTexture(theme: Theme): void {
    const s=TILE.SIZE,g=this.add.graphics().setVisible(false);
    const c=THEME_COLORS[theme];
    g.fillStyle(c.brick); g.fillRect(0,0,s,s);
    g.fillStyle(c.ground); g.fillRect(0,0,s,1); g.fillRect(0,0,1,s);
    g.fillStyle(c.platform); g.fillRect(2,2,12,12); g.fillRect(18,2,12,12);
    g.fillRect(8,16,16,12); g.fillRect(2,16,4,12);
    g.generateTexture(ASSET_KEYS.TILES+'_brick_'+theme,s,s); g.destroy();
  }

  private generateQuestionTexture(theme: Theme): void {
    const s=TILE.SIZE,g=this.add.graphics().setVisible(false);
    const c=THEME_COLORS[theme];
    const LIGHT=c.question+0x202020;
    g.fillStyle(c.question); g.fillRect(0,0,s,s);
    g.fillStyle(c.platform); g.fillRect(0,0,s,2); g.fillRect(0,s-2,s,2);
    g.fillRect(0,0,2,s); g.fillRect(s-2,0,2,s);
    g.fillStyle(LIGHT); g.fillRect(2,2,s-4,s-4);
    g.fillStyle(c.question); g.fillRect(3,3,s-6,s-6);
    // Pokéball icon
    g.fillStyle(0xee1515); g.fillRect(9,8,14,7);
    g.fillStyle(0xf0f0f0); g.fillRect(9,15,14,7);
    g.fillStyle(0x222224); g.fillRect(8,14,16,2);
    g.fillStyle(0xf0f0f0); g.fillRect(14,13,4,4);
    g.fillStyle(0x222224); g.fillRect(14,13,4,1); g.fillRect(14,16,4,1);
    g.fillRect(14,13,1,4); g.fillRect(17,13,1,4);
    g.generateTexture(ASSET_KEYS.TILES+'_question_'+theme,s,s); g.destroy();
  }

  private generatePlatformTexture(theme: Theme): void {
    const s=TILE.SIZE,g=this.add.graphics().setVisible(false);
    const c=THEME_COLORS[theme];
    g.fillStyle(c.platform); g.fillRect(0,0,s,s);
    g.fillStyle(c.question); g.fillRect(2,2,s-4,s-4);
    g.fillStyle(c.brick); g.fillRect(0,s-3,s,3);
    g.generateTexture(ASSET_KEYS.TILES+'_platform_'+theme,s,s); g.destroy();
  }

  private generateFlagTexture(): void {
    const g=this.add.graphics().setVisible(false);
    g.fillStyle(0xcccccc); g.fillRect(0,0,4,128);
    g.fillStyle(0xee1515); g.fillCircle(6,4,6);
    g.fillStyle(0xf0f0f0); g.fillRect(2,4,8,4);
    g.fillStyle(0x222224); g.fillRect(1,3,10,2);
    g.fillStyle(0xffde21); g.fillTriangle(4,6,32,14,4,22);
    g.fillStyle(0xffe85c); g.fillRect(10,10,4,4); g.fillRect(12,8,2,8);
    g.generateTexture(ASSET_KEYS.FLAG,36,128); g.destroy();
  }
}

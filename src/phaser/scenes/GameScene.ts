import Phaser from 'phaser';
import { ASSET_KEYS, TILE, PLAYER as PLAYER_CFG, GAME as GAME_CFG } from '../../game/assets/manifest';
import { createInputState, InputState } from '../../game/input/actions';
import { createInitialState, GameState, loseLife, addCoin, addScore, resetState } from '../../game/simulation/state';
import { LEVELS, LEVEL_THEMES, type LevelData } from '../../game/content/maps/levels';

export class GameScene extends Phaser.Scene {
  private gameState!: GameState;
  private inputState!: InputState;
  private jumpBufferTimer = 0;
  private coyoteTimer = 0;

  private player!: Phaser.Physics.Arcade.Sprite;
  private enemies!: Phaser.Physics.Arcade.Group;
  private coins!: Phaser.Physics.Arcade.Group;
  private grounds!: Phaser.Physics.Arcade.StaticGroup;
  private bricks!: Phaser.Physics.Arcade.StaticGroup;
  private questions!: Phaser.Physics.Arcade.StaticGroup;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private flagPole!: Phaser.Physics.Arcade.Sprite;

  private currentLevel = 0;
  private questionsData: { sprite: Phaser.Physics.Arcade.Sprite; used: boolean; row: number; col: number }[] = [];
  private respawnTimer = 0;
  private bgGfx: Phaser.GameObjects.Graphics[] = [];

  constructor() { super({ key: 'GameScene' }); }

  create(data?: { level?: number }): void {
    if (!this.gameState) this.gameState = createInitialState();
    this.currentLevel = data?.level ?? this.gameState.currentLevel ?? 0;
    if (this.currentLevel === 0) this.gameState = createInitialState();
    this.gameState.currentLevel = this.currentLevel;
    this.inputState = createInputState();
    this.questionsData = [];
    this.jumpBufferTimer = 0;
    this.coyoteTimer = 0;
    this.respawnTimer = 0;
    this.bgGfx = [];

    this.buildLevel(LEVELS[this.currentLevel]);
    this.createPlayer();
    this.setupCollisions();
    this.setupCamera();
    this.setupInput();
    this.updateHUD();

    this.hideOverlay('game-over');
    this.hideOverlay('level-complete');
    this.hideOverlay('game-complete');
    this.updateLevelDisplay();
  }

  update(_t: number, delta: number): void {
    if (this.gameState.gameOver || this.gameState.levelComplete) return;
    if (this.gameState.playerDead) {
      this.respawnTimer -= delta;
      if (this.respawnTimer <= 0) this.respawnPlayer();
      return;
    }
    this.pollInput();
    this.updatePlayer(delta);
    this.updateEnemies(delta);
  }

  private get theme(): string { return LEVEL_THEMES[this.currentLevel]; }

  private buildLevel(data: LevelData): void {
    this.grounds = this.physics.add.staticGroup();
    this.bricks = this.physics.add.staticGroup();
    this.questions = this.physics.add.staticGroup();
    this.platforms = this.physics.add.staticGroup();
    this.coins = this.physics.add.group();
    this.enemies = this.physics.add.group();
    const th = this.theme;

    this.drawBackground(data.width * TILE.SIZE);

    for (const g of data.grounds) {
      for (let i = 0; i < g.width; i++) {
        this.grounds.create((g.x + i) * TILE.SIZE + TILE.SIZE / 2, g.y * TILE.SIZE + TILE.SIZE / 2, ASSET_KEYS.TILES + '_ground_' + th);
      }
    }
    for (const b of data.bricks) {
      this.bricks.create(b.x * TILE.SIZE + TILE.SIZE / 2, b.y * TILE.SIZE + TILE.SIZE / 2, ASSET_KEYS.TILES + '_brick_' + th);
    }
    for (const q of data.questions) {
      const sprite = this.questions.create(q.x * TILE.SIZE + TILE.SIZE / 2, q.y * TILE.SIZE + TILE.SIZE / 2, ASSET_KEYS.TILES + '_question_' + th) as Phaser.Physics.Arcade.Sprite;
      this.questionsData.push({ sprite, used: false, row: q.y, col: q.x });
    }
    for (const p of data.platforms) {
      for (let i = 0; i < p.width; i++) {
        this.platforms.create((p.x + i) * TILE.SIZE + TILE.SIZE / 2, p.y * TILE.SIZE + TILE.SIZE / 2, ASSET_KEYS.TILES + '_platform_' + th);
      }
    }
    for (const c of data.coinTiles) {
      const coin = this.coins.create(c.x, c.y, ASSET_KEYS.COIN) as Phaser.Physics.Arcade.Sprite;
      coin.setBounceY(Phaser.Math.FloatBetween(0.3, 0.6));
      coin.body?.setSize(12, 12);
      this.tweens.add({ targets: coin, y: coin.y - 4, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    for (const e of data.enemies) {
      const enemy = this.enemies.create(e.x, e.y, ASSET_KEYS.ENEMY) as Phaser.Physics.Arcade.Sprite;
      enemy.setData('direction', -1);
      enemy.setData('speed', 40);
      enemy.setVelocityX(-40);
      enemy.body?.setSize(28, 30);
    }
    const flagGroup = this.physics.add.staticGroup();
    this.flagPole = flagGroup.create(data.flag.x, data.flag.y + 48, ASSET_KEYS.FLAG) as Phaser.Physics.Arcade.Sprite;
    this.flagPole.setOrigin(0, 0.5);
  }

  private drawBackground(worldWidth: number): void {
    const th = this.theme;
    // Clear old background graphics
    this.bgGfx.forEach(g => g.destroy());
    this.bgGfx = [];

    if (th === 'grass') {
      // Sky gradient
      const sky = this.add.graphics(); sky.setDepth(-10);
      sky.fillStyle(0x5c94fc); sky.fillRect(0, 0, worldWidth, GAME_CFG.HEIGHT);
      this.bgGfx.push(sky);
      // Hills
      const hills = this.add.graphics(); hills.fillStyle(0x7ab86c);
      for (let x = 0; x < worldWidth; x += 200) hills.fillEllipse(x, 420, 200, 100);
      hills.setDepth(-8); this.bgGfx.push(hills);
      // Clouds
      const clouds = this.add.graphics(); clouds.fillStyle(0xffffff, 0.8);
      for (let x = 0; x < worldWidth; x += 250) {
        const cy = Phaser.Math.Between(40, 120);
        clouds.fillEllipse(x, cy, 80, 30); clouds.fillEllipse(x + 30, cy - 8, 50, 24); clouds.fillEllipse(x - 20, cy + 4, 40, 20);
      }
      clouds.setDepth(-9); this.bgGfx.push(clouds);
      // Bushes
      const bushes = this.add.graphics(); bushes.fillStyle(0x4a8c2e);
      for (let x = 0; x < worldWidth; x += 300) { bushes.fillEllipse(x, 430, 80, 30); bushes.fillEllipse(x + 25, 423, 50, 24); }
      bushes.setDepth(-5); this.bgGfx.push(bushes);
    } else if (th === 'cave') {
      const bg = this.add.graphics(); bg.fillStyle(0x1a1a2e); bg.fillRect(0, 0, worldWidth, GAME_CFG.HEIGHT);
      bg.setDepth(-10); this.bgGfx.push(bg);
      // Stalactites
      const stal = this.add.graphics(); stal.fillStyle(0x3a2a1a);
      for (let x = 0; x < worldWidth; x += 180) {
        const h = Phaser.Math.Between(30, 80);
        stal.fillTriangle(x, 0, x + 30, 0, x + 15, h);
      }
      stal.setDepth(-9); this.bgGfx.push(stal);
      // Glowing crystals (small colored dots)
      const glow = this.add.graphics();
      for (let x = 0; x < worldWidth; x += 120) {
        const cy = Phaser.Math.Between(80, 200);
        glow.fillStyle(0x4488ff, 0.3); glow.fillCircle(x, cy, 6);
        glow.fillStyle(0x4488ff, 0.6); glow.fillCircle(x, cy, 3);
      }
      glow.setDepth(-8); this.bgGfx.push(glow);
    } else if (th === 'ice') {
      const bg = this.add.graphics(); bg.fillStyle(0xa8d8f0); bg.fillRect(0, 0, worldWidth, GAME_CFG.HEIGHT);
      bg.setDepth(-10); this.bgGfx.push(bg);
      // Snow peaks
      const snow = this.add.graphics(); snow.fillStyle(0xf0f8ff);
      for (let x = 0; x < worldWidth; x += 160) { snow.fillTriangle(x - 30, 480, x + 30, 480, x, 320); }
      snow.setDepth(-9); this.bgGfx.push(snow);
      // Snowflakes (dots)
      const flakes = this.add.graphics(); flakes.fillStyle(0xffffff, 0.7);
      for (let i = 0; i < 30; i++) {
        flakes.fillCircle(Math.random() * worldWidth, Math.random() * GAME_CFG.HEIGHT, 2);
      }
      flakes.setDepth(-8); this.bgGfx.push(flakes);
    } else if (th === 'sky') {
      const bg = this.add.graphics(); bg.fillStyle(0x87ceeb); bg.fillRect(0, 0, worldWidth, GAME_CFG.HEIGHT);
      bg.setDepth(-10); this.bgGfx.push(bg);
      // Many clouds
      const clouds = this.add.graphics(); clouds.fillStyle(0xffffff, 0.8);
      for (let x = 0; x < worldWidth; x += 140 + Math.random() * 80) {
        const cy = Phaser.Math.Between(30, 250);
        clouds.fillEllipse(x, cy, 100, 34); clouds.fillEllipse(x + 35, cy - 10, 60, 28); clouds.fillEllipse(x - 25, cy + 6, 50, 22);
      }
      clouds.setDepth(-9); this.bgGfx.push(clouds);
      // Sun
      const sun = this.add.graphics(); sun.fillStyle(0xffee55, 0.9); sun.fillCircle(worldWidth - 80, 60, 40);
      sun.fillStyle(0xffffaa, 0.3); sun.fillCircle(worldWidth - 80, 60, 55);
      sun.setDepth(-9); this.bgGfx.push(sun);
    } else if (th === 'lava') {
      const bg = this.add.graphics(); bg.fillStyle(0x2a0a0a); bg.fillRect(0, 0, worldWidth, GAME_CFG.HEIGHT);
      bg.setDepth(-10); this.bgGfx.push(bg);
      // Lava glow at bottom
      const lava = this.add.graphics();
      for (let x = 0; x < worldWidth; x += 30) {
        lava.fillStyle(0xff4400, 0.4 + Math.random() * 0.3);
        lava.fillCircle(x, 440 + Math.random() * 30, 20 + Math.random() * 15);
      }
      lava.setDepth(-9); this.bgGfx.push(lava);
      // Embers
      const embers = this.add.graphics(); embers.fillStyle(0xff6600, 0.6);
      for (let i = 0; i < 20; i++) { embers.fillCircle(Math.random() * worldWidth, Math.random() * 300, 2 + Math.random() * 3); }
      embers.setDepth(-8); this.bgGfx.push(embers);
    }
  }

  private createPlayer(): void {
    const start = LEVELS[this.currentLevel].playerStart;
    this.player = this.physics.add.sprite(start.x, start.y - 32, ASSET_KEYS.PLAYER);
    this.player.setOrigin(0.5, 0.5);
    this.player.body!.setSize(22, 30);
    this.player.setCollideWorldBounds(false);
    this.player.setDepth(1);
  }

  private setupCollisions(): void {
    this.physics.add.collider(this.player, this.grounds);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.bricks);
    this.physics.add.collider(this.player, this.questions, (_p, tile) => { this.hitQuestionBlock(tile as Phaser.Physics.Arcade.Sprite); });
    this.physics.add.collider(this.enemies, this.grounds);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.bricks);
    this.physics.add.collider(this.enemies, this.enemies, (_e1, e2) => {
      const enemy = e2 as Phaser.Physics.Arcade.Sprite;
      if (!enemy.active || !enemy.body) return;
      const dir = enemy.getData('direction');
      enemy.setData('direction', -dir!);
      enemy.setVelocityX(-dir! * enemy.getData('speed'));
    });
    this.physics.add.overlap(this.player, this.enemies, (_p, enemy) => { this.handleEnemyCollision(enemy as Phaser.Physics.Arcade.Sprite); });
    this.physics.add.overlap(this.player, this.coins, (_p, coin) => { this.collectCoin(coin as Phaser.Physics.Arcade.Sprite); });
    this.physics.add.overlap(this.player, this.flagPole, () => { this.reachFlag(); });
  }

  private setupInput(): void {
    const keyState: Record<string, boolean> = {};
    const self = this;
    (self as any)._keyState = keyState;
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      keyState[e.code] = true;
      if (e.code === 'Space' || e.key === ' ') {
        if (self.gameState.gameOver) { self.resetAll(); }
        else if (self.gameState.levelComplete) {
          const nextLvl = self.currentLevel + 1;
          if (nextLvl < LEVELS.length) { self.goToLevel(nextLvl); }
          else { self.resetAll(); }
        }
      }
    });
    window.addEventListener('keyup', (e: KeyboardEvent) => { keyState[e.code] = false; });
    this.input.on('pointerdown', () => { if (this.gameState.gameOver || this.gameState.levelComplete) this.restartGame(); });
  }

  private goToLevel(level: number): void {
    this.gameState.levelComplete = false;
    this.gameState.currentLevel = level;
    this.scene.start('BootScene', { level });
  }

  private pollInput(): void {
    const ks: Record<string, boolean> = (this as any)._keyState || {};
    this.inputState.left = !!ks['ArrowLeft'] || !!ks['KeyA'];
    this.inputState.right = !!ks['ArrowRight'] || !!ks['KeyD'];
    const jumpDown = !!ks['Space'] || !!ks['ArrowUp'] || !!ks['KeyW'];
    this.inputState.jumpJustDown = jumpDown && !this.inputState.jump;
    this.inputState.jump = jumpDown;
  }

  private updatePlayer(delta: number): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down || body.touching.down;
    if (onGround) this.coyoteTimer = 80; else this.coyoteTimer -= delta;
    if (this.inputState.jumpJustDown) this.jumpBufferTimer = 100; else this.jumpBufferTimer -= delta;
    if (this.inputState.left) { body.setAccelerationX(-PLAYER_CFG.ACCELERATION); this.player.setFlipX(true); }
    else if (this.inputState.right) { body.setAccelerationX(PLAYER_CFG.ACCELERATION); this.player.setFlipX(false); }
    else { body.setAccelerationX(0); body.setDragX(PLAYER_CFG.DRAG); }
    if (Math.abs(body.velocity.x) > PLAYER_CFG.SPEED) body.velocity.x = Math.sign(body.velocity.x) * PLAYER_CFG.SPEED;
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) { body.setVelocityY(PLAYER_CFG.JUMP_VELOCITY); this.jumpBufferTimer = 0; this.coyoteTimer = 0; }
    if (!this.inputState.jump && body.velocity.y < -100) body.setVelocityY(body.velocity.y * 0.6);
    if (this.player.y > GAME_CFG.HEIGHT + 64) this.playerDie();
  }

  private updateEnemies(_delta: number): void {
    this.enemies.getChildren().forEach((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      if (!enemy.active) return;
      const body = enemy.body as Phaser.Physics.Arcade.Body;
      if (body.blocked.left) { enemy.setData('direction', 1); enemy.setVelocityX(enemy.getData('speed')); }
      else if (body.blocked.right) { enemy.setData('direction', -1); enemy.setVelocityX(-enemy.getData('speed')); }
      if (enemy.y > GAME_CFG.HEIGHT + 64) enemy.destroy();
    });
  }

  private handleEnemyCollision(enemy: Phaser.Physics.Arcade.Sprite): void {
    if (!enemy.active || this.gameState.playerDead) return;
    const pb = this.player.body as Phaser.Physics.Arcade.Body;
    if (pb.velocity.y > 0 && this.player.y < enemy.y - 12) this.stompEnemy(enemy);
    else this.playerDie();
  }

  private stompEnemy(enemy: Phaser.Physics.Arcade.Sprite): void {
    (this.player.body as Phaser.Physics.Arcade.Body).setVelocityY(-250);
    enemy.setData('stomped', true);
    enemy.setVelocityX(0); enemy.setVelocityY(0);
    this.tweens.add({ targets: enemy, scaleY: 0.2, scaleX: 1.2, duration: 150, onComplete: () => { enemy.destroy(); } });
    enemy.body!.enable = false;
    addScore(this.gameState, GAME_CFG.ENEMY_SCORE); this.updateHUD();
  }

  private collectCoin(coin: Phaser.Physics.Arcade.Sprite): void {
    if (!coin.active) return;
    coin.destroy();
    addCoin(this.gameState); this.updateHUD();
    const txt = this.add.text(coin.x, coin.y, '+100', { fontSize: '14px', color: '#ffffff', fontFamily: 'Courier New', stroke: '#000000', strokeThickness: 2 }).setOrigin(0.5);
    this.tweens.add({ targets: txt, y: txt.y - 40, alpha: 0, duration: 600, onComplete: () => txt.destroy() });
  }

  private hitQuestionBlock(sprite: Phaser.Physics.Arcade.Sprite): void {
    const data = this.questionsData.find(q => q.sprite === sprite);
    if (!data || data.used) return;
    if (this.player.y < sprite.y) return;
    data.used = true;
    sprite.setTint(0x886644);
    this.tweens.add({ targets: sprite, y: sprite.y - 6, duration: 80, yoyo: true, ease: 'Quad.easeOut' });
    const coin = this.add.sprite(sprite.x, sprite.y - TILE.SIZE, ASSET_KEYS.COIN).setDepth(2);
    this.tweens.add({ targets: coin, y: coin.y - 48, alpha: 0, duration: 500, ease: 'Quad.easeOut', onComplete: () => { coin.destroy(); } });
    addCoin(this.gameState); this.updateHUD();
  }

  private reachFlag(): void {
    const levelIdx = this.currentLevel;
    if (this.gameState.levelComplete) return;
    this.gameState.levelComplete = true;
    addScore(this.gameState, GAME_CFG.FLAG_SCORE);
    this.gameState.currentLevel = levelIdx;
    this.updateHUD();
    this.player.setVelocity(0, 0);
    (this.player.body as Phaser.Physics.Arcade.Body).setAcceleration(0, 0);
    (this.player.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.tweens.add({ targets: this.player, y: LEVELS[levelIdx].flag.y + 64, duration: 400, ease: 'Sine.easeIn' });
    this.time.delayedCall(800, () => {
      const isLast = levelIdx >= LEVELS.length - 1;
      if (isLast) {
        document.getElementById('game-complete')!.style.display = 'flex';
        document.getElementById('final-score')!.textContent = `Score: ${this.gameState.score}`;
        document.getElementById('total-coins')!.textContent = `Coins: ${this.gameState.coins}`;
      } else {
        const lvlH1 = document.querySelector('#level-complete h1'); if (lvlH1) lvlH1.textContent = `STAGE ${levelIdx + 1} CLEAR!`;
        this.showOverlay('level-complete');
        document.getElementById('final-score')!.textContent = `Score: ${this.gameState.score}`;
      }
    });
  }

  private playerDie(): void {
    if (this.gameState.playerDead) return;
    this.gameState.playerDead = true;
    this.player.setVelocity(0, -300); this.player.setTint(0xff4444);
    (this.player.body as Phaser.Physics.Arcade.Body).setAcceleration(0, 0);
    (this.player.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
    (this.player.body as Phaser.Physics.Arcade.Body).checkCollision.none = true;
    const hasLives = loseLife(this.gameState);
    this.updateHUD();
    if (!hasLives) this.time.delayedCall(1200, () => { this.showOverlay('game-over'); });
    else this.respawnTimer = GAME_CFG.RESPAWN_DELAY;
  }

  private respawnPlayer(): void {
    this.gameState.playerDead = false;
    const start = LEVELS[this.currentLevel].playerStart;
    this.player.setPosition(start.x, start.y - 32);
    this.player.clearTint(); this.player.setVelocity(0, 0); this.player.setAlpha(1);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(true); body.checkCollision.none = false; body.setAcceleration(0, 0);
  }

  private setupCamera(): void {
    const data = LEVELS[this.currentLevel];
    const worldWidth = data.width * TILE.SIZE;
    this.cameras.main.setBounds(0, 0, worldWidth, GAME_CFG.HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.2);
    this.cameras.main.setDeadzone(160, 60);
    this.cameras.main.setRoundPixels(true);
    this.physics.world.setBounds(0, 0, worldWidth, GAME_CFG.HEIGHT + 200);
  }

  private updateHUD(): void {
    const el = (id: string) => document.getElementById(id)!;
    el('score-display').textContent = String(this.gameState.score);
    el('coin-display').textContent = String(this.gameState.coins);
    el('lives-display').textContent = String(this.gameState.lives);
  }

  private showOverlay(id: string): void { const el = document.getElementById(id); if (el) el.style.display = 'flex'; }
  private hideOverlay(id: string): void { const el = document.getElementById(id); if (el) el.style.display = 'none'; }

  private updateLevelDisplay(): void {
    const el = document.getElementById('level-display');
    if (el) el.textContent = `${this.currentLevel + 1}/${LEVELS.length}`;
  }

  private restartGame(): void { this.resetAll(); }
  private resetAll(): void { resetState(this.gameState); this.goToLevel(0); }
}

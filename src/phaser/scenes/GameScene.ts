import Phaser from 'phaser';
import { ASSET_KEYS, TILE, PLAYER as PLAYER_CFG, GAME as GAME_CFG } from '../../game/assets/manifest';
import { createInputState, InputState } from '../../game/input/actions';
import { createInitialState, GameState, loseLife, addCoin, addScore, resetState } from '../../game/simulation/state';
import { LEVEL_1, LevelData } from '../../game/content/maps/level1';

export class GameScene extends Phaser.Scene {
  // Game state
  private gameState!: GameState;
  private inputState!: InputState;
  private jumpBufferTimer = 0;
  private coyoteTimer = 0;

  // Phaser objects
  private player!: Phaser.Physics.Arcade.Sprite;
  private enemies!: Phaser.Physics.Arcade.Group;
  private coins!: Phaser.Physics.Arcade.Group;
  private grounds!: Phaser.Physics.Arcade.StaticGroup;
  private bricks!: Phaser.Physics.Arcade.StaticGroup;
  private questions!: Phaser.Physics.Arcade.StaticGroup;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private flagPole!: Phaser.Physics.Arcade.Sprite;

  // Level data references
  private questionsData: { sprite: Phaser.Physics.Arcade.Sprite; used: boolean; row: number; col: number }[] = [];

  private respawnTimer = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.gameState = createInitialState();
    this.inputState = createInputState();
    this.questionsData = [];
    this.jumpBufferTimer = 0;
    this.coyoteTimer = 0;
    this.respawnTimer = 0;

    this.buildLevel(LEVEL_1);
    this.createPlayer();
    this.setupCollisions();
    this.setupCamera();
    this.setupInput();
    this.updateHUD();

    // Hide overlays
    this.hideOverlay('game-over');
    this.hideOverlay('level-complete');
  }

  update(_time: number, delta: number): void {
    if (this.gameState.gameOver) return;
    if (this.gameState.levelComplete) return;

    if (this.gameState.playerDead) {
      this.respawnTimer -= delta;
      if (this.respawnTimer <= 0) {
        this.respawnPlayer();
      }
      return;
    }

    this.pollInput();
    this.updatePlayer(delta);
    this.updateEnemies(delta);
  }

  // ─── Level Building ────────────────────────────────────────

  private buildLevel(data: LevelData): void {
    this.grounds = this.physics.add.staticGroup();
    this.bricks = this.physics.add.staticGroup();
    this.questions = this.physics.add.staticGroup();
    this.platforms = this.physics.add.staticGroup();
    this.coins = this.physics.add.group();
    this.enemies = this.physics.add.group();

    // Background clouds
    this.drawBackground(data.width * TILE.SIZE);

    // Ground segments
    for (const g of data.grounds) {
      for (let i = 0; i < g.width; i++) {
        this.grounds.create(
          (g.x + i) * TILE.SIZE + TILE.SIZE / 2,
          g.y * TILE.SIZE + TILE.SIZE / 2,
          ASSET_KEYS.TILES + '_ground'
        );
      }
    }

    // Bricks
    for (const b of data.bricks) {
      this.bricks.create(
        b.x * TILE.SIZE + TILE.SIZE / 2,
        b.y * TILE.SIZE + TILE.SIZE / 2,
        ASSET_KEYS.TILES + '_brick'
      );
    }

    // Question blocks
    for (const q of data.questions) {
      const sprite = this.questions.create(
        q.x * TILE.SIZE + TILE.SIZE / 2,
        q.y * TILE.SIZE + TILE.SIZE / 2,
        ASSET_KEYS.TILES + '_question'
      ) as Phaser.Physics.Arcade.Sprite;
      this.questionsData.push({ sprite, used: false, row: q.y, col: q.x });
    }

    // Platforms
    for (const p of data.platforms) {
      for (let i = 0; i < p.width; i++) {
        this.platforms.create(
          (p.x + i) * TILE.SIZE + TILE.SIZE / 2,
          p.y * TILE.SIZE + TILE.SIZE / 2,
          ASSET_KEYS.TILES + '_platform'
        );
      }
    }

    // Coins (floating)
    for (const c of data.coinTiles) {
      const coin = this.coins.create(c.x, c.y, ASSET_KEYS.COIN) as Phaser.Physics.Arcade.Sprite;
      coin.setBounceY(Phaser.Math.FloatBetween(0.3, 0.6));
      coin.body?.setSize(12, 12);
      // Add coin bob tween
      this.tweens.add({
        targets: coin,
        y: coin.y - 4,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Enemies
    for (const e of data.enemies) {
      const enemy = this.enemies.create(e.x, e.y, ASSET_KEYS.ENEMY) as Phaser.Physics.Arcade.Sprite;
      enemy.setData('direction', -1); // start going left
      enemy.setData('speed', 40);
      enemy.setVelocityX(-40);
      enemy.body?.setSize(28, 30);
    }

    // Flag pole
    const flagGroup = this.physics.add.staticGroup();
    this.flagPole = flagGroup.create(data.flag.x, data.flag.y + 48, ASSET_KEYS.FLAG) as Phaser.Physics.Arcade.Sprite;
    this.flagPole.setOrigin(0, 0.5);
  }

  private drawBackground(worldWidth: number): void {
    // Hills (far background)
    const g = this.add.graphics();
    g.fillStyle(0x7ab86c);
    for (let x = 0; x < worldWidth; x += 200) {
      g.fillEllipse(x, 420, 200, 100);
    }
    g.setDepth(-10);

    // Clouds
    const cloudG = this.add.graphics();
    cloudG.fillStyle(0xffffff, 0.8);
    for (let x = 0; x < worldWidth; x += 250) {
      const cy = Phaser.Math.Between(40, 120);
      cloudG.fillEllipse(x, cy, 80, 30);
      cloudG.fillEllipse(x + 30, cy - 8, 50, 24);
      cloudG.fillEllipse(x - 20, cy + 4, 40, 20);
    }
    cloudG.setDepth(-9);

    // Bushes (mid-ground)
    const bushG = this.add.graphics();
    bushG.fillStyle(0x4a8c2e);
    for (let x = 0; x < worldWidth; x += 300) {
      bushG.fillEllipse(x, 430, 80, 30);
      bushG.fillEllipse(x + 25, 423, 50, 24);
    }
    bushG.setDepth(-5);
  }

  // ─── Player ───────────────────────────────────────────────

  private createPlayer(): void {
    const start = LEVEL_1.playerStart;
    this.player = this.physics.add.sprite(start.x, start.y - 32, ASSET_KEYS.PLAYER);
    this.player.setOrigin(0.5, 0.5);
    this.player.body!.setSize(22, 30);
    this.player.setCollideWorldBounds(false);
    this.player.setDepth(1);
  }

  // ─── Collisions ────────────────────────────────────────────

  private setupCollisions(): void {
    // Player vs ground
    this.physics.add.collider(this.player, this.grounds);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.bricks);
    this.physics.add.collider(this.player, this.questions, (_player, tile) => {
      this.hitQuestionBlock(tile as Phaser.Physics.Arcade.Sprite);
    });

    // Enemy vs ground
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

    // Player vs enemies
    this.physics.add.overlap(this.player, this.enemies, (_p, enemy) => {
      this.handleEnemyCollision(enemy as Phaser.Physics.Arcade.Sprite);
    });

    // Player vs coins
    this.physics.add.overlap(this.player, this.coins, (_p, coin) => {
      this.collectCoin(coin as Phaser.Physics.Arcade.Sprite);
    });

    // Player vs flag
    this.physics.add.overlap(this.player, this.flagPole, () => {
      this.reachFlag();
    });
  }

  // ─── Input ─────────────────────────────────────────────────


  private setupInput(): void {
    // Track key state manually via raw DOM events
    const keyState: Record<string, boolean> = {};
    const self = this;

    // Save reference for pollInput to use
    (self as any)._keyState = keyState;

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      keyState[e.code] = true;
      // Restart on Space when game over / level complete
      if ((e.code === 'Space' || e.key === ' ') && (self.gameState.gameOver || self.gameState.levelComplete)) {
        self.restartGame();
      }
    });
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      keyState[e.code] = false;
    });

    // Click to restart
    this.input.on('pointerdown', () => {
      if (this.gameState.gameOver || this.gameState.levelComplete) {
        this.restartGame();
      }
    });
  }

  private pollInput(): void {
    const ks: Record<string, boolean> = (this as any)._keyState || {};
    this.inputState.left = !!ks['ArrowLeft'] || !!ks['KeyA'];
    this.inputState.right = !!ks['ArrowRight'] || !!ks['KeyD'];
    const jumpDown = !!ks['Space'] || !!ks['ArrowUp'] || !!ks['KeyW'];

    if (jumpDown && !this.inputState.jump) {
      this.inputState.jumpJustDown = true;
    } else {
      this.inputState.jumpJustDown = false;
    }
    this.inputState.jump = jumpDown;
  }

  // ─── Player Update ─────────────────────────────────────────

  private updatePlayer(delta: number): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down || body.touching.down;

    // Coyote time: allow jump briefly after leaving ground
    if (onGround) {
      this.coyoteTimer = 80;
    } else {
      this.coyoteTimer -= delta;
    }

    // Jump buffer: allow jump press slightly before hitting ground
    if (this.inputState.jumpJustDown) {
      this.jumpBufferTimer = 100;
    } else {
      this.jumpBufferTimer -= delta;
    }

    // Horizontal movement
    if (this.inputState.left) {
      body.setAccelerationX(-PLAYER_CFG.ACCELERATION);
      this.player.setFlipX(true);
    } else if (this.inputState.right) {
      body.setAccelerationX(PLAYER_CFG.ACCELERATION);
      this.player.setFlipX(false);
    } else {
      body.setAccelerationX(0);
      body.setDragX(PLAYER_CFG.DRAG);
    }

    // Speed cap
    if (Math.abs(body.velocity.x) > PLAYER_CFG.SPEED) {
      body.velocity.x = Math.sign(body.velocity.x) * PLAYER_CFG.SPEED;
    }

    // Jump with buffer + coyote
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      body.setVelocityY(PLAYER_CFG.JUMP_VELOCITY);
      this.jumpBufferTimer = 0;
      this.coyoteTimer = 0;
    }

    // Variable jump height: release jump early = shorter jump
    if (!this.inputState.jump && body.velocity.y < -100) {
      body.setVelocityY(body.velocity.y * 0.6);
    }

    // Fall death
    if (this.player.y > GAME_CFG.HEIGHT + 64) {
      this.playerDie();
    }
  }

  // ─── Enemies ───────────────────────────────────────────────

  private updateEnemies(_delta: number): void {
    this.enemies.getChildren().forEach((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      if (!enemy.active) return;

      // Turn around at edges or walls
      const body = enemy.body as Phaser.Physics.Arcade.Body;
      if (body.blocked.left) {
        enemy.setData('direction', 1);
        enemy.setVelocityX(enemy.getData('speed'));
      } else if (body.blocked.right) {
        enemy.setData('direction', -1);
        enemy.setVelocityX(-enemy.getData('speed'));
      }

      // Remove enemies that fall off screen
      if (enemy.y > GAME_CFG.HEIGHT + 64) {
        enemy.destroy();
      }
    });
  }

  private handleEnemyCollision(enemy: Phaser.Physics.Arcade.Sprite): void {
    if (!enemy.active || this.gameState.playerDead) return;

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;

    // Stomp enemy: player is falling and above enemy
    if (playerBody.velocity.y > 0 && this.player.y < enemy.y - 12) {
      this.stompEnemy(enemy);
    } else {
      // Player hit by enemy
      this.playerDie();
    }
  }

  private stompEnemy(enemy: Phaser.Physics.Arcade.Sprite): void {
    // Bounce player up
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(-250);

    // Destroy enemy with squash effect
    enemy.setData('stomped', true);
    enemy.setVelocityX(0);
    enemy.setVelocityY(0);
    this.tweens.add({
      targets: enemy,
      scaleY: 0.2,
      scaleX: 1.2,
      duration: 150,
      onComplete: () => {
        enemy.destroy();
      },
    });
    enemy.body!.enable = false;

    addScore(this.gameState, GAME_CFG.ENEMY_SCORE);
    this.updateHUD();
  }

  // ─── Coins ─────────────────────────────────────────────────

  private collectCoin(coin: Phaser.Physics.Arcade.Sprite): void {
    if (!coin.active) return;
    coin.destroy();
    addCoin(this.gameState);
    this.updateHUD();

    // Show a floating score text
    const txt = this.add.text(coin.x, coin.y, '+100', {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Courier New',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    this.tweens.add({
      targets: txt,
      y: txt.y - 40,
      alpha: 0,
      duration: 600,
      onComplete: () => txt.destroy(),
    });
  }

  // ─── Question Blocks ───────────────────────────────────────

  private hitQuestionBlock(sprite: Phaser.Physics.Arcade.Sprite): void {
    const data = this.questionsData.find((q) => q.sprite === sprite);
    if (!data || data.used) return;

    // Only trigger when hitting from below
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    if (this.player.y < sprite.y) return; // player is above the block, not below

    data.used = true;
    sprite.setTint(0x886644);

    // Bump animation
    this.tweens.add({
      targets: sprite,
      y: sprite.y - 6,
      duration: 80,
      yoyo: true,
      ease: 'Quad.easeOut',
    });

    // Spawn a coin from the block
    const coin = this.add.sprite(sprite.x, sprite.y - TILE.SIZE, ASSET_KEYS.COIN);
    coin.setDepth(2);
    this.tweens.add({
      targets: coin,
      y: coin.y - 48,
      alpha: 0,
      duration: 500,
      ease: 'Quad.easeOut',
      onComplete: () => {
        coin.destroy();
      },
    });

    addCoin(this.gameState);
    this.updateHUD();
  }

  // ─── Flag ──────────────────────────────────────────────────

  private reachFlag(): void {
    if (this.gameState.levelComplete) return;
    this.gameState.levelComplete = true;

    addScore(this.gameState, GAME_CFG.FLAG_SCORE);
    this.updateHUD();

    // Stop player
    this.player.setVelocity(0, 0);
    (this.player.body as Phaser.Physics.Arcade.Body).setAcceleration(0, 0);
    (this.player.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // Slide down animation
    this.tweens.add({
      targets: this.player,
      y: LEVEL_1.flag.y + 64,
      duration: 400,
      ease: 'Sine.easeIn',
    });

    // Show level complete after a brief delay
    this.time.delayedCall(800, () => {
      this.showOverlay('level-complete');
      document.getElementById('final-score')!.textContent = `Score: ${this.gameState.score}`;
    });
  }

  // ─── Death / Respawn ───────────────────────────────────────

  private playerDie(): void {
    if (this.gameState.playerDead) return;
    this.gameState.playerDead = true;

    // Death animation: bounce up then fall
    this.player.setVelocity(0, -300);
    this.player.setTint(0xff4444);
    (this.player.body as Phaser.Physics.Arcade.Body).setAcceleration(0, 0);
    (this.player.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
    (this.player.body as Phaser.Physics.Arcade.Body).checkCollision.none = true;

    const hasLives = loseLife(this.gameState);
    this.updateHUD();

    if (!hasLives) {
      this.time.delayedCall(1200, () => {
        this.showOverlay('game-over');
      });
    } else {
      this.respawnTimer = GAME_CFG.RESPAWN_DELAY;
    }
  }

  private respawnPlayer(): void {
    this.gameState.playerDead = false;
    const start = LEVEL_1.playerStart;
    this.player.setPosition(start.x, start.y - 32);
    this.player.clearTint();
    this.player.setVelocity(0, 0);
    this.player.setAlpha(1);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(true);
    body.checkCollision.none = false;
    body.setAcceleration(0, 0);
  }

  // ─── Camera ────────────────────────────────────────────────

  private setupCamera(): void {
    const worldWidth = LEVEL_1.width * TILE.SIZE;
    this.cameras.main.setBounds(0, 0, worldWidth, GAME_CFG.HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.1, 0);
    this.cameras.main.setDeadzone(100, 0);
    this.physics.world.setBounds(0, 0, worldWidth, GAME_CFG.HEIGHT + 200);
  }

  // ─── HUD ──────────────────────────────────────────────────

  private updateHUD(): void {
    document.getElementById('score-display')!.textContent = String(this.gameState.score);
    document.getElementById('coin-display')!.textContent = String(this.gameState.coins);
    document.getElementById('lives-display')!.textContent = String(this.gameState.lives);
  }

  // ─── Overlays ──────────────────────────────────────────────

  private showOverlay(id: string): void {
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  }

  private hideOverlay(id: string): void {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  // ─── Restart ───────────────────────────────────────────────

  private restartGame(): void {
    resetState(this.gameState);
    this.hideOverlay('game-over');
    this.hideOverlay('level-complete');
    this.scene.restart();
  }
}

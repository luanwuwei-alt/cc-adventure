export const ASSET_KEYS = {
  TILES: 'tiles',
  PLAYER: 'player',
  PLAYER_RUN: 'player-run',
  ENEMY: 'enemy',
  COIN: 'coin',
  FLAG: 'flag',
  BACKGROUND: 'background',
} as const;

export const TILE = {
  SIZE: 32,
  GROUND: 0,
  BRICK: 1,
  QUESTION: 2,
  EMPTY: -1,
} as const;

export const PLAYER = {
  SPEED: 200,
  JUMP_VELOCITY: -420,
  ACCELERATION: 600,
  DRAG: 800,
  WIDTH: 24,
  HEIGHT: 32,
} as const;

export const GAME = {
  WIDTH: 800,
  HEIGHT: 480,
  COIN_SCORE: 100,
  ENEMY_SCORE: 200,
  FLAG_SCORE: 1000,
  INITIAL_LIVES: 3,
  RESPAWN_DELAY: 800,
} as const;

export interface GameState {
  score: number;
  coins: number;
  lives: number;
  playerDead: boolean;
  levelComplete: boolean;
  gameOver: boolean;
}

export function createInitialState(): GameState {
  return {
    score: 0,
    coins: 0,
    lives: 3,
    playerDead: false,
    levelComplete: false,
    gameOver: false,
  };
}

export function addScore(state: GameState, points: number): void {
  state.score += points;
}

export function addCoin(state: GameState): void {
  state.coins += 1;
  state.score += 100;
}

export function loseLife(state: GameState): boolean {
  state.lives -= 1;
  if (state.lives <= 0) {
    state.gameOver = true;
    return false;
  }
  return true;
}

export function resetState(state: GameState): void {
  state.score = 0;
  state.coins = 0;
  state.lives = 3;
  state.playerDead = false;
  state.levelComplete = false;
  state.gameOver = false;
}

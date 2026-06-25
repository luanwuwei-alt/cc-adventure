export interface LevelData {
  width: number;
  height: number;
  playerStart: { x: number; y: number };
  grounds: { x: number; y: number; width: number }[];
  bricks: { x: number; y: number }[];
  questions: { x: number; y: number }[];
  platforms: { x: number; y: number; width: number }[];
  enemies: { x: number; y: number }[];
  coinTiles: { x: number; y: number }[];
  flag: { x: number; y: number };
}

const T = 32; // tile size

export const LEVEL_1: LevelData = {
  width: 110,
  height: 15,
  playerStart: { x: 3 * T, y: 12 * T },

  // Ground segments: (x tile, y tile, width in tiles)
  grounds: [
    { x: 0, y: 14, width: 20 },
    { x: 21, y: 14, width: 4 },   // small platform after gap
    { x: 27, y: 13, width: 8 },   // raised ground section
    { x: 27, y: 14, width: 8 },
    { x: 37, y: 14, width: 15 },
    { x: 54, y: 14, width: 5 },   // after second gap
    { x: 61, y: 13, width: 10 },  // raised section 2
    { x: 61, y: 14, width: 10 },
    { x: 73, y: 14, width: 5 },
    { x: 80, y: 14, width: 30 },  // final stretch to flag
  ],

  // Brick blocks
  bricks: [
    // Section 1: early bricks
    { x: 8, y: 10 },
    { x: 9, y: 10 },
    { x: 10, y: 10 },
    { x: 14, y: 10 },
    { x: 15, y: 10 },
    // Section 2: raised area
    { x: 30, y: 10 },
    { x: 31, y: 10 },
    { x: 32, y: 10 },
    { x: 33, y: 10 },
    // Section 3: later area
    { x: 64, y: 10 },
    { x: 65, y: 10 },
    { x: 66, y: 10 },
    // Section 4: staircase to flag
    { x: 95, y: 12 },
    { x: 95, y: 11 },
    { x: 95, y: 10 },
    { x: 96, y: 11 },
    { x: 96, y: 10 },
    { x: 97, y: 10 },
  ],

  // Question blocks (contain coins)
  questions: [
    { x: 7, y: 10 },
    { x: 12, y: 10 },
    { x: 16, y: 9 },
    { x: 29, y: 10 },
    { x: 42, y: 10 },
    { x: 63, y: 10 },
    { x: 85, y: 10 },
  ],

  // Floating platforms (standable)
  platforms: [
    { x: 5, y: 12, width: 2 },
    { x: 18, y: 11, width: 2 },
    { x: 39, y: 11, width: 3 },
    { x: 48, y: 10, width: 2 },
    { x: 56, y: 11, width: 2 },
    { x: 70, y: 11, width: 3 },
    { x: 76, y: 10, width: 2 },
    { x: 88, y: 11, width: 2 },
  ],

  // Enemies (goomba-like)
  enemies: [
    { x: 10 * T, y: 12 * T },
    { x: 14 * T, y: 12 * T },
    { x: 30 * T, y: 11 * T },
    { x: 40 * T, y: 12 * T },
    { x: 44 * T, y: 12 * T },
    { x: 50 * T, y: 12 * T },
    { x: 64 * T, y: 11 * T },
    { x: 68 * T, y: 11 * T },
    { x: 75 * T, y: 12 * T },
    { x: 82 * T, y: 12 * T },
    { x: 86 * T, y: 12 * T },
    { x: 90 * T, y: 12 * T },
  ],

  // Floating coin positions (coins to collect mid-air)
  coinTiles: [
    { x: 4 * T + 8, y: 10 * T },
    { x: 4 * T + 24, y: 10 * T },
    { x: 12 * T + 8, y: 7 * T },
    { x: 12 * T + 24, y: 7 * T },
    { x: 19 * T + 8, y: 9 * T },
    { x: 19 * T + 24, y: 9 * T },
    { x: 33 * T + 8, y: 8 * T },
    { x: 33 * T + 24, y: 8 * T },
    { x: 40 * T + 8, y: 9 * T },
    { x: 40 * T + 24, y: 9 * T },
    { x: 49 * T + 8, y: 8 * T },
    { x: 65 * T + 8, y: 8 * T },
    { x: 65 * T + 24, y: 8 * T },
    { x: 78 * T + 8, y: 9 * T },
    { x: 78 * T + 24, y: 9 * T },
    { x: 92 * T + 8, y: 9 * T },
    { x: 92 * T + 24, y: 9 * T },
  ],

  // Flag pole position
  flag: { x: 105 * T, y: 8 * T },
};

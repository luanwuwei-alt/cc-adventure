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
 
 const T = 32;
 
 // ─────────────────────────────────────────────
 // Level 1 — Green Grass Plains (Pokémon style)
 // ─────────────────────────────────────────────
 const LEVEL_1: LevelData = {
   width: 110, height: 15,
   playerStart: { x: 3 * T, y: 12 * T },
   grounds: [
     { x: 0, y: 14, width: 20 },
     { x: 21, y: 14, width: 4 },
     { x: 27, y: 13, width: 8 }, { x: 27, y: 14, width: 8 },
     { x: 37, y: 14, width: 15 },
     { x: 54, y: 14, width: 5 },
     { x: 61, y: 13, width: 10 }, { x: 61, y: 14, width: 10 },
     { x: 73, y: 14, width: 5 },
     { x: 80, y: 14, width: 30 },
   ],
   bricks: [
     { x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 },
     { x: 14, y: 10 }, { x: 15, y: 10 },
     { x: 30, y: 10 }, { x: 31, y: 10 }, { x: 32, y: 10 }, { x: 33, y: 10 },
     { x: 64, y: 10 }, { x: 65, y: 10 }, { x: 66, y: 10 },
     { x: 95, y: 12 }, { x: 95, y: 11 }, { x: 95, y: 10 },
     { x: 96, y: 11 }, { x: 96, y: 10 }, { x: 97, y: 10 },
   ],
   questions: [
     { x: 7, y: 10 }, { x: 12, y: 10 }, { x: 16, y: 9 },
     { x: 29, y: 10 }, { x: 42, y: 10 }, { x: 63, y: 10 }, { x: 85, y: 10 },
   ],
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
   enemies: [
     { x: 10 * T, y: 12 * T }, { x: 14 * T, y: 12 * T },
     { x: 30 * T, y: 11 * T }, { x: 40 * T, y: 12 * T },
     { x: 44 * T, y: 12 * T }, { x: 50 * T, y: 12 * T },
     { x: 64 * T, y: 11 * T }, { x: 68 * T, y: 11 * T },
     { x: 75 * T, y: 12 * T }, { x: 82 * T, y: 12 * T },
     { x: 86 * T, y: 12 * T }, { x: 90 * T, y: 12 * T },
   ],
   coinTiles: [
     { x: 4 * T + 8, y: 10 * T }, { x: 4 * T + 24, y: 10 * T },
     { x: 12 * T + 8, y: 7 * T }, { x: 12 * T + 24, y: 7 * T },
     { x: 19 * T + 8, y: 9 * T }, { x: 19 * T + 24, y: 9 * T },
     { x: 33 * T + 8, y: 8 * T }, { x: 33 * T + 24, y: 8 * T },
     { x: 40 * T + 8, y: 9 * T }, { x: 40 * T + 24, y: 9 * T },
     { x: 49 * T + 8, y: 8 * T },
     { x: 65 * T + 8, y: 8 * T }, { x: 65 * T + 24, y: 8 * T },
     { x: 78 * T + 8, y: 9 * T }, { x: 78 * T + 24, y: 9 * T },
     { x: 92 * T + 8, y: 9 * T }, { x: 92 * T + 24, y: 9 * T },
   ],
   flag: { x: 105 * T, y: 8 * T },
 };
 
 // ─────────────────────────────────────────────
 // Level 2 — Underground Cave
 // ─────────────────────────────────────────────
 const LEVEL_2: LevelData = {
   width: 90, height: 15,
   playerStart: { x: 3 * T, y: 11 * T },
   grounds: [
     { x: 0, y: 12, width: 12 },   // start platform
     { x: 14, y: 14, width: 8 },   // lower area
     { x: 24, y: 13, width: 6 }, { x: 24, y: 14, width: 6 },
     { x: 32, y: 14, width: 10 },  // cave floor
     { x: 43, y: 13, width: 4 }, { x: 43, y: 14, width: 4 },
     { x: 49, y: 14, width: 8 },
     { x: 59, y: 12, width: 5 },   // raised section
     { x: 66, y: 14, width: 5 },
     { x: 73, y: 14, width: 17 },  // final platform
   ],
   bricks: [
     { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 9 },
     { x: 18, y: 10 }, { x: 19, y: 10 },
     { x: 27, y: 10 }, { x: 28, y: 10 },
     { x: 35, y: 10 }, { x: 36, y: 10 }, { x: 37, y: 10 },
     { x: 45, y: 9 }, { x: 46, y: 9 },
     { x: 53, y: 10 }, { x: 54, y: 10 },
     { x: 78, y: 11 }, { x: 79, y: 11 }, { x: 80, y: 11 },
     { x: 84, y: 12 }, { x: 84, y: 11 }, { x: 84, y: 10 },
   ],
   questions: [
     { x: 4, y: 9 }, { x: 15, y: 10 }, { x: 34, y: 10 },
     { x: 52, y: 10 }, { x: 62, y: 10 },
   ],
   platforms: [
     { x: 10, y: 10, width: 2 },
     { x: 20, y: 8, width: 2 },
     { x: 38, y: 11, width: 2 },
     { x: 47, y: 10, width: 2 },
     { x: 56, y: 12, width: 2 },
     { x: 69, y: 11, width: 3 },
     { x: 82, y: 12, width: 2 },
   ],
   enemies: [
     { x: 16 * T, y: 12 * T }, { x: 26 * T, y: 11 * T },
     { x: 35 * T, y: 12 * T }, { x: 45 * T, y: 11 * T },
     { x: 50 * T, y: 12 * T }, { x: 60 * T, y: 10 * T },
     { x: 68 * T, y: 12 * T }, { x: 75 * T, y: 12 * T },
     { x: 80 * T, y: 12 * T },
   ],
   coinTiles: [
     { x: 10 * T + 8, y: 7 * T }, { x: 10 * T + 24, y: 7 * T },
     { x: 21 * T + 8, y: 6 * T },
     { x: 28 * T + 8, y: 8 * T }, { x: 28 * T + 24, y: 8 * T },
     { x: 39 * T + 8, y: 9 * T }, { x: 39 * T + 24, y: 9 * T },
     { x: 48 * T + 8, y: 8 * T },
     { x: 70 * T + 8, y: 9 * T }, { x: 70 * T + 24, y: 9 * T },
     { x: 86 * T + 8, y: 9 * T },
   ],
   flag: { x: 86 * T, y: 7 * T },
 };
 
 // ─────────────────────────────────────────────
 // Level 3 — Ice & Snow
 // ─────────────────────────────────────────────
 const LEVEL_3: LevelData = {
   width: 100, height: 15,
   playerStart: { x: 3 * T, y: 12 * T },
   grounds: [
     { x: 0, y: 14, width: 15 },
     { x: 17, y: 13, width: 6 }, { x: 17, y: 14, width: 6 },
     { x: 25, y: 14, width: 10 },
     { x: 38, y: 14, width: 5 },
     { x: 45, y: 13, width: 8 }, { x: 45, y: 14, width: 8 },
     { x: 55, y: 14, width: 5 },
     { x: 62, y: 13, width: 4 }, { x: 62, y: 14, width: 4 },
     { x: 69, y: 14, width: 5 },
     { x: 76, y: 13, width: 6 }, { x: 76, y: 14, width: 6 },
     { x: 84, y: 14, width: 16 },
   ],
   bricks: [
     { x: 6, y: 10 }, { x: 7, y: 10 }, { x: 8, y: 10 }, { x: 9, y: 10 },
     { x: 20, y: 10 }, { x: 21, y: 10 },
     { x: 28, y: 10 }, { x: 29, y: 10 }, { x: 30, y: 10 },
     { x: 40, y: 10 }, { x: 41, y: 10 },
     { x: 50, y: 10 }, { x: 51, y: 10 }, { x: 52, y: 10 },
     { x: 65, y: 10 }, { x: 66, y: 10 },
     { x: 80, y: 10 }, { x: 81, y: 10 },
     { x: 88, y: 12 }, { x: 88, y: 11 }, { x: 88, y: 10 },
     { x: 89, y: 11 }, { x: 89, y: 10 }, { x: 90, y: 10 },
   ],
   questions: [
     { x: 5, y: 10 }, { x: 13, y: 10 }, { x: 26, y: 10 },
     { x: 48, y: 10 }, { x: 63, y: 10 }, { x: 78, y: 10 },
   ],
   platforms: [
     { x: 3, y: 12, width: 2 },
     { x: 14, y: 11, width: 2 },
     { x: 22, y: 11, width: 2 },
     { x: 33, y: 10, width: 3 },
     { x: 42, y: 12, width: 2 },
     { x: 57, y: 12, width: 2 },
     { x: 69, y: 10, width: 3 },
     { x: 73, y: 12, width: 2 },
   ],
   enemies: [
     { x: 8 * T, y: 12 * T }, { x: 18 * T, y: 11 * T },
     { x: 28 * T, y: 12 * T }, { x: 35 * T, y: 12 * T },
     { x: 42 * T, y: 12 * T }, { x: 50 * T, y: 12 * T },
     { x: 58 * T, y: 12 * T }, { x: 65 * T, y: 11 * T },
     { x: 72 * T, y: 12 * T }, { x: 79 * T, y: 12 * T },
     { x: 86 * T, y: 12 * T },
   ],
   coinTiles: [
     { x: 7 * T + 8, y: 8 * T }, { x: 7 * T + 24, y: 8 * T },
     { x: 15 * T + 8, y: 9 * T },
     { x: 29 * T + 8, y: 8 * T }, { x: 29 * T + 24, y: 8 * T },
     { x: 34 * T + 8, y: 8 * T }, { x: 34 * T + 24, y: 8 * T },
     { x: 49 * T + 8, y: 8 * T },
     { x: 58 * T + 8, y: 6 * T }, { x: 58 * T + 24, y: 6 * T },
     { x: 70 * T + 8, y: 8 * T }, { x: 70 * T + 24, y: 8 * T },
     { x: 92 * T + 8, y: 8 * T }, { x: 92 * T + 24, y: 8 * T },
   ],
   flag: { x: 96 * T, y: 8 * T },
 };
 
 // ─────────────────────────────────────────────
 // Level 4 — Sky Fortress
 // ─────────────────────────────────────────────
 const LEVEL_4: LevelData = {
   width: 80, height: 15,
   playerStart: { x: 3 * T, y: 11 * T },
   grounds: [
     { x: 0, y: 14, width: 10 },
     { x: 12, y: 14, width: 8 },
     { x: 22, y: 14, width: 5 },
     { x: 29, y: 13, width: 6 }, { x: 29, y: 14, width: 6 },
     { x: 37, y: 14, width: 5 },
     { x: 44, y: 14, width: 8 },
     { x: 54, y: 14, width: 5 },
     { x: 61, y: 14, width: 5 },
     { x: 68, y: 14, width: 12 },
   ],
   bricks: [
     { x: 5, y: 10 }, { x: 6, y: 10 },
     { x: 15, y: 10 }, { x: 16, y: 10 },
     { x: 24, y: 11 }, { x: 25, y: 11 },
     { x: 32, y: 10 }, { x: 33, y: 10 },
     { x: 39, y: 10 }, { x: 40, y: 10 },
     { x: 47, y: 10 }, { x: 48, y: 10 },
     { x: 56, y: 11 }, { x: 57, y: 11 },
     { x: 71, y: 11 }, { x: 72, y: 11 }, { x: 73, y: 11 },
     { x: 74, y: 10 }, { x: 74, y: 11 },
   ],
   questions: [
     { x: 3, y: 10 }, { x: 20, y: 10 }, { x: 35, y: 10 },
     { x: 50, y: 10 }, { x: 63, y: 10 },
   ],
   platforms: [
     { x: 8, y: 12, width: 2 },
     { x: 17, y: 11, width: 2 },
     { x: 26, y: 11, width: 3 },
     { x: 34, y: 12, width: 2 },
     { x: 41, y: 11, width: 3 },
     { x: 49, y: 10, width: 2 },
     { x: 58, y: 12, width: 2 },
     { x: 65, y: 12, width: 3 },
     { x: 70, y: 10, width: 2 },
   ],
   enemies: [
     { x: 12 * T, y: 12 * T }, { x: 20 * T, y: 12 * T },
     { x: 30 * T, y: 11 * T }, { x: 38 * T, y: 12 * T },
     { x: 45 * T, y: 12 * T }, { x: 52 * T, y: 12 * T },
     { x: 60 * T, y: 12 * T }, { x: 66 * T, y: 12 * T },
   ],
   coinTiles: [
     { x: 9 * T + 8, y: 10 * T }, { x: 9 * T + 24, y: 10 * T },
     { x: 18 * T + 8, y: 9 * T },
     { x: 27 * T + 8, y: 9 * T }, { x: 27 * T + 24, y: 9 * T },
     { x: 42 * T + 8, y: 9 * T }, { x: 42 * T + 24, y: 9 * T },
     { x: 50 * T + 8, y: 8 * T }, { x: 50 * T + 24, y: 8 * T },
     { x: 66 * T + 8, y: 7 * T }, { x: 66 * T + 24, y: 7 * T },
     { x: 74 * T + 8, y: 8 * T },
   ],
   flag: { x: 76 * T, y: 7 * T },
 };
 
 // ─────────────────────────────────────────────
 // Level 5 — Lava Cavern (final stage)
 // ─────────────────────────────────────────────
 const LEVEL_5: LevelData = {
   width: 95, height: 15,
   playerStart: { x: 3 * T, y: 12 * T },
   grounds: [
     { x: 0, y: 14, width: 10 },
     { x: 13, y: 13, width: 5 }, { x: 13, y: 14, width: 5 },
     { x: 20, y: 14, width: 18 },
     { x: 40, y: 13, width: 4 }, { x: 40, y: 14, width: 4 },
     { x: 46, y: 14, width: 10 },
     { x: 58, y: 14, width: 5 },
     { x: 65, y: 13, width: 6 }, { x: 65, y: 14, width: 6 },
     { x: 73, y: 14, width: 5 },
     { x: 80, y: 14, width: 15 },
   ],
   bricks: [
     { x: 4, y: 10 }, { x: 5, y: 10 }, { x: 6, y: 10 },
     { x: 14, y: 10 }, { x: 15, y: 10 },
     { x: 23, y: 10 }, { x: 24, y: 10 }, { x: 25, y: 10 },
     { x: 30, y: 10 }, { x: 31, y: 10 },
     { x: 44, y: 10 }, { x: 45, y: 10 },
     { x: 50, y: 10 }, { x: 51, y: 10 },
     { x: 68, y: 10 }, { x: 69, y: 10 },
     { x: 82, y: 12 }, { x: 82, y: 11 }, { x: 82, y: 10 },
     { x: 83, y: 11 }, { x: 83, y: 10 }, { x: 84, y: 10 },
   ],
   questions: [
     { x: 10, y: 10 }, { x: 21, y: 10 }, { x: 28, y: 10 },
     { x: 48, y: 10 }, { x: 55, y: 10 }, { x: 66, y: 10 },
   ],
   platforms: [
     { x: 8, y: 12, width: 2 },
     { x: 17, y: 11, width: 2 },
     { x: 27, y: 11, width: 2 },
     { x: 36, y: 12, width: 3 },
     { x: 52, y: 12, width: 2 },
     { x: 60, y: 11, width: 3 },
     { x: 71, y: 12, width: 2 },
     { x: 78, y: 12, width: 3 },
   ],
   enemies: [
     { x: 6 * T, y: 12 * T }, { x: 15 * T, y: 11 * T },
     { x: 24 * T, y: 12 * T }, { x: 28 * T, y: 12 * T },
     { x: 34 * T, y: 12 * T }, { x: 42 * T, y: 11 * T },
     { x: 48 * T, y: 12 * T }, { x: 54 * T, y: 12 * T },
     { x: 62 * T, y: 12 * T }, { x: 67 * T, y: 11 * T },
     { x: 75 * T, y: 12 * T }, { x: 82 * T, y: 12 * T },
     { x: 86 * T, y: 12 * T },
   ],
   coinTiles: [
     { x: 11 * T + 8, y: 8 * T }, { x: 11 * T + 24, y: 8 * T },
     { x: 22 * T + 8, y: 8 * T },
     { x: 29 * T + 8, y: 8 * T }, { x: 29 * T + 24, y: 8 * T },
     { x: 37 * T + 8, y: 10 * T }, { x: 37 * T + 24, y: 10 * T },
     { x: 53 * T + 8, y: 7 * T }, { x: 53 * T + 24, y: 7 * T },
     { x: 61 * T + 8, y: 9 * T }, { x: 61 * T + 24, y: 9 * T },
     { x: 79 * T + 8, y: 10 * T }, { x: 79 * T + 24, y: 10 * T },
     { x: 88 * T + 8, y: 8 * T },
   ],
   flag: { x: 91 * T, y: 8 * T },
 };
 
 export const LEVELS: LevelData[] = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5];
 export const LEVEL_THEMES = ['grass', 'cave', 'ice', 'sky', 'lava'] as const;
 export type Theme = (typeof LEVEL_THEMES)[number];
 export const THEME_COLORS: Record<Theme, { bg: number; ground: number; brick: number; question: number; platform: number }> = {
   grass: { bg: 0x5c94fc, ground: 0x4a9e2e, brick: 0x888888, question: 0x3068c8, platform: 0x888888 },
   cave:  { bg: 0x1a1a2e, ground: 0x5a4a3a, brick: 0x6a5a4a, question: 0x886644, platform: 0x6a5a4a },
   ice:   { bg: 0xa8d8f0, ground: 0xd0e8f0, brick: 0x88ccee, question: 0x44aaee, platform: 0x88ccee },
   sky:   { bg: 0x87ceeb, ground: 0xc0a060, brick: 0xa08050, question: 0x886644, platform: 0xa08050 },
   lava:  { bg: 0x2a0a0a, ground: 0x8a3a2a, brick: 0x6a2a1a, question: 0xcc4400, platform: 0x6a2a1a },
 };

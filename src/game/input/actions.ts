export const INPUT = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  JUMP: 'JUMP',
} as const;

export type InputAction = keyof typeof INPUT;

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  jumpJustDown: boolean;
}

export function createInputState(): InputState {
  return { left: false, right: false, jump: false, jumpJustDown: false };
}

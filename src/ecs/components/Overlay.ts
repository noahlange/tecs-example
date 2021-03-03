import type { Point } from '@types';

export class Overlay {
  public static readonly type = 'overlay';
  public alpha: number = 1;
  public tiles: { texture: string; position: Point }[] = [];
}

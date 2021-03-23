import type { Vector2, Color } from '@types';

export class Overlay {
  public static readonly type = 'overlay';
  public color: Color = { r: 255, g: 0, b: 0, a: 0.5 };
  public tiles: { texture: string; position: Vector2 }[] = [];
}

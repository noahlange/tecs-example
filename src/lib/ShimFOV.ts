import type { FOV } from 'malwoden';

interface VisibilityCallback {
  (x: number, y: number, r: number, visibility: number): void;
}

/**
 * Permits ROT's lighting to use malwoden's FOV implementation.
 */
export class ShimFOV {
  protected _fov: FOV.PreciseShadowcasting;

  protected compute(
    x: number,
    y: number,
    range: number,
    callback: VisibilityCallback
  ): void {
    return this._fov.calculateCallback({ x, y }, range, (point, range, vis) => {
      callback(point.x, point.y, range, vis);
    });
  }

  public constructor(fov: FOV.PreciseShadowcasting) {
    this._fov = fov;
  }
}

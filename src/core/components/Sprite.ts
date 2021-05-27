import type { Color } from '@lib/types';
import type { Vector2 } from 'malwoden';
import type * as PIXI from 'pixi.js';

import { RGB } from '@utils';
import { Component } from 'tecs';

interface SpriteData {
  key: string | null;
  tint: Color | null;
  pivot: Vector2;
}

export class Sprite extends Component implements SpriteData {
  public static readonly type = 'sprite';

  public pixi: PIXI.Sprite | null = null;
  public tint: Color | null = { r: 255, g: 255, b: 255, a: 1 };
  public pivot = { x: 0.5, y: 0 };

  public set key(value: string | null) {
    this._prevKey = this._key;
    this._key = value;
  }

  public get key(): string | null {
    return this._key;
  }

  public get changed(): boolean {
    return this._prevKey !== this._key;
  }

  protected _key: string | null = null;
  protected _prevKey: string | null = null;

  public toJSON(): SpriteData {
    return {
      key: this.key,
      tint: this.tint ? RGB.simplify(this.tint) : null,
      pivot: this.pivot
    };
  }
}

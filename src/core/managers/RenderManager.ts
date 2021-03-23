import { Manager } from '@lib';
import type { Vector2 } from '@types';
import * as PIXI from 'pixi.js';

import { TILE_HEIGHT, TILE_WIDTH, view } from '../../utils';

export class RenderManager extends Manager {
  protected tileWidth = TILE_WIDTH;
  protected tileHeight = TILE_HEIGHT;
  protected camera: Vector2 = { x: 0, y: 0 };
  protected pixi!: PIXI.Application;

  public get app(): PIXI.Application {
    return this.pixi;
  }

  public getScreenPoint(point: Vector2): Vector2 {
    return {
      x: point.x * this.tileWidth,
      y: point.y * this.tileHeight
    };
  }

  public getWorldPoint(point: Vector2): Vector2 {
    return {
      x: Math.floor((point.x + this.app.stage.pivot.x) / this.tileWidth),
      y: Math.floor((point.y + this.app.stage.pivot.y) / this.tileHeight)
    };
  }

  public get view(): HTMLCanvasElement {
    return this.app.view;
  }

  public follow(pos: Vector2): void {
    const { x, y } = this.getScreenPoint(pos);
    this.camera = { x: x - view.w / 4, y: y - view.h / 4 };
    this.app.stage.pivot.set(this.camera.x, this.camera.y);
  }

  public init(): void {
    this.pixi = new PIXI.Application({
      width: view.w / 2,
      height: view.h / 2,
      transparent: true,
      antialias: false,
      resolution: 3
    });

    document.getElementById('root')?.appendChild(this.app.view);
  }
}

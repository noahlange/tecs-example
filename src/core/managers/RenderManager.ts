import type { Vector2 } from '@types';

import * as PIXI from 'pixi.js';
import { Manager } from '@lib';
import { view, RESOLUTION, TILE_HEIGHT, TILE_WIDTH, toRelative } from '@utils';

export class RenderManager extends Manager {
  protected tileWidth = TILE_WIDTH;
  protected tileHeight = TILE_HEIGHT;
  protected camera: Vector2 = { x: 0, y: 0 };
  protected pixi!: PIXI.Application;

  public get app(): PIXI.Application {
    return this.pixi;
  }

  public getScreenPoint(point: Vector2): Vector2 {
    const next = toRelative(this.game.$.map, point) ?? point;
    return {
      x: next.x * this.tileWidth,
      y: next.y * this.tileHeight
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
    this.camera = {
      x: x - view.width / (2 * RESOLUTION),
      y: y - view.height / (2 * RESOLUTION)
    };

    this.app.stage.pivot.set(this.camera.x, this.camera.y);
  }

  public init(): void {
    this.pixi = new PIXI.Application({
      width: view.width / RESOLUTION,
      height: view.height / RESOLUTION,
      resolution: RESOLUTION,
      backgroundColor: 0xffffff,
      transparent: false,
      antialias: false
    });

    document.getElementById('root')?.appendChild(this.app.view);
  }
}

import { Manager } from '@lib';
import type { Point } from '@types';
import * as PIXI from 'pixi.js';

import { RESOLUTION, TILE_HEIGHT, TILE_WIDTH, view } from '../../utils';

export class RenderManager extends Manager {
  protected tileWidth = TILE_WIDTH;
  protected tileHeight = TILE_HEIGHT;
  protected camera: Point = { x: 0, y: 0 };
  protected pixi!: PIXI.Application;

  public get app(): PIXI.Application {
    return this.pixi;
  }

  public getScreenPoint(point: Point): Point {
    return {
      x: point.x * this.tileWidth,
      y: point.y * this.tileHeight
    };
  }

  public getWorldPoint(point: Point): Point {
    return {
      x: Math.floor((point.x + this.app.stage.pivot.x) / this.tileWidth),
      y: Math.floor((point.y + this.app.stage.pivot.y) / this.tileHeight)
    };
  }

  public get view(): HTMLCanvasElement {
    return this.app.view;
  }

  public follow(pos: Point): void {
    const { x, y } = this.getScreenPoint(pos);
    this.camera = { x: x - view.w / 2, y: y - view.h / 2 };
    this.app.stage.pivot.set(this.camera.x, this.camera.y);
  }

  public init(): void {
    this.pixi = new PIXI.Application({
      width: view.w,
      height: view.h,
      transparent: true,
      antialias: false,
      resolution: RESOLUTION
    });

    document.body.appendChild(this.app.view);
  }
}

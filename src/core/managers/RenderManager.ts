import type { Position, Sprite } from '@core/components';
import type { Vector2, Vector3 } from '@lib/types';
import type { Spritesheet } from 'pixi.js';
import type { EntityType } from 'tecs';

import { Manager } from '@lib';
import { Projection } from '@lib/enums';
import { RESOLUTION, TILE_HEIGHT, TILE_WIDTH, view } from '@utils';
import { getSpritesheetFromURL } from '@utils/pixi';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import { atlas } from '../../atlases';

export class RenderManager extends Manager {
  public sheets: Record<string, PIXI.Spritesheet> = {};

  public camera: Vector2 = { x: 0, y: 0 };
  public pivot: Vector2 = { x: 0, y: 0 };
  protected pixi!: PIXI.Application;
  public viewport!: Viewport;

  public get app(): PIXI.Application {
    return this.pixi;
  }

  public loadSpritesheets(spritesheets: { [key: string]: Spritesheet }): void {
    Object.assign(this.sheets, spritesheets);
  }

  public getTexture(sheet: string, key: string): PIXI.Texture | null {
    return this.sheets[sheet]?.textures[key] ?? null;
  }

  public async loadAtlases(): Promise<void[]> {
    return Promise.all(
      Object.keys(atlas)
        .filter(key => !this.sheets[key])
        .map(async key => {
          const value = atlas[key];
          this.sheets[key] = await getSpritesheetFromURL(
            value.image,
            value.atlas
          );
        })
    );
  }

  public getScreenPoint(point: Vector2): Vector3 {
    const TW = TILE_WIDTH;
    const TH = TILE_HEIGHT;
    const map = this.game.$.map;
    const rel = point;
    switch (map.world.projection) {
      case Projection.ISOMETRIC: {
        return {
          x: ((rel.x - rel.y) * TW) / 2,
          y: ((rel.y + rel.x) * TH) / 2,
          z: rel.y
        };
      }
      case Projection.ORTHOGRAPHIC:
      default: {
        return {
          x: rel.x * TW,
          y: rel.y * TH,
          z: 0
        };
      }
    }
  }

  // @todo broken
  public getWorldPoint(point: Vector2): Vector2 {
    const TW = TILE_WIDTH / RESOLUTION;
    const TH = TILE_HEIGHT / RESOLUTION;

    switch (this.game.$.map.world.projection) {
      case Projection.ISOMETRIC: {
        const x2 = point.x;
        const y2 = point.y;
        const x1 = (x2 / TW + y2 / TH) / 2;
        const y1 = y2 / TH - x1;
        return {
          x: Math.floor(x1 * 2),
          y: Math.floor(y1 * 2)
        };
      }
      case Projection.ORTHOGRAPHIC:
      default: {
        return {
          x: Math.floor(point.x / TILE_WIDTH),
          y: Math.floor(point.y / TILE_HEIGHT)
        };
      }
    }
  }

  public follow(entity: EntityType<[typeof Position], [typeof Sprite]>): void {
    const { x, y } = this.getScreenPoint(entity.$.position);
    this.pivot = entity.$.position;
    this.camera = {
      x: x - view.width / (2 * RESOLUTION),
      y: y - view.height / (2 * RESOLUTION)
    };
  }

  public async init(): Promise<void> {
    this.pixi = new PIXI.Application({
      width: view.width / RESOLUTION,
      height: view.height / RESOLUTION,
      resolution: RESOLUTION,
      backgroundColor: 0xffffff,
      antialias: false
    });

    this.viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 2000,
      worldHeight: 2000,
      ticker: this.pixi.ticker,
      interaction: this.pixi.renderer.plugins.interaction
    });

    this.viewport.drag().wheel();
    this.app.stage.addChild(this.viewport);

    await this.loadAtlases();
    document.getElementById('root')?.appendChild(this.pixi.view);
  }
}

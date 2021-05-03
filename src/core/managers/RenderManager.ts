import type { Vector2, Vector3 } from '../../lib/types';

import { Manager } from '@lib';
import { Projection } from '@lib/enums';
import { RESOLUTION, TILE_HEIGHT, TILE_WIDTH, view } from '@utils';
import { toRelative } from '@utils/geometry';
import { getSpritesheetFromURL } from '@utils/pixi';
import * as PIXI from 'pixi.js';

import { atlas } from '../../atlases';

export class RenderManager extends Manager {
  public sheets: Record<string, PIXI.Spritesheet> = {};

  protected camera: Vector2 = { x: 0, y: 0 };
  protected pixi!: PIXI.Application;
  protected projection = Projection.ORTHOGRAPHIC;

  public get app(): PIXI.Application {
    return this.pixi;
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
    const map = this.game.$.map;
    const rel = toRelative(map, point) ?? point;
    switch (map.world.projection) {
      case Projection.ISOMETRIC: {
        return {
          x: (rel.x - rel.y) * (TILE_WIDTH / 2),
          y: (rel.y + rel.x) * (TILE_HEIGHT / 2),
          z: rel.y
        };
      }
      case Projection.ORTHOGRAPHIC:
      default: {
        return {
          x: rel.x * TILE_WIDTH,
          y: rel.y * TILE_HEIGHT,
          z: 0
        };
      }
    }
  }

  public getWorldPoint(point: Vector2): Vector2 {
    return {
      x: Math.floor((point.x + this.pixi.stage.pivot.x) / TILE_WIDTH),
      y: Math.floor((point.y + this.pixi.stage.pivot.y) / TILE_HEIGHT)
    };
  }

  public follow(pos: Vector2): void {
    const { x, y } = this.getScreenPoint(pos);
    this.camera = {
      x: x - view.width / (2 * RESOLUTION),
      y: y - view.height / (2 * RESOLUTION)
    };

    this.pixi.stage.pivot.set(this.camera.x, this.camera.y);
  }

  public async init(): Promise<void> {
    this.pixi = new PIXI.Application({
      width: view.width / RESOLUTION,
      height: view.height / RESOLUTION,
      resolution: RESOLUTION,
      backgroundColor: 0xffffff,
      backgroundAlpha: 1,
      antialias: false
    });

    await this.loadAtlases();
    document.getElementById('root')?.appendChild(this.pixi.view);
  }
}

import * as ROT from 'rot-js';
import { System } from 'tecs';

import type { Point, RGBColor } from '../types';

import {
  Collision,
  Position,
  LightSource,
  Glyph,
  Playable,
  Renderable
} from '../components';

import { AMBIENT_DARK, AMBIENT_LIGHT, timer } from '../utils';

// structure is [ 'x,y' => T ]
type PointMap<T> = Record<string, T>;

type LightPoint = Point & { color: RGBColor };

export class Lighting extends System {
  public static readonly type = 'lighting';

  public lightData: PointMap<RGBColor> = {};
  public collisionData: PointMap<boolean> = {};
  public fovData: PointMap<number> = {};

  // since most coordinate pairs are generated independently of entity data, this can't be cleared without needing to re-run the query in computeColors()
  public keyToID: PointMap<Set<string>> = {};

  // grid coordinates that need to be repainted
  public repaint: string[] = [];
  public firstPaint: boolean = true;

  // created in init()
  public fov!: InstanceType<typeof ROT.FOV.PreciseShadowcasting>;
  public lighting!: ROT.Lighting;

  public getCoordString(position: Point, id?: string): string {
    const key = position.x + ',' + position.y;
    if (id) {
      (this.keyToID[key] ??= new Set()).add(id);
    }
    return key;
  }

  /**
   * Get all light sources, adding colors from overlapping sources.
   */
  protected getLights(): LightPoint[] {
    const lights: Record<string, LightPoint> = {};
    for (const { $, id } of this.world.query
      .with(LightSource, Position)
      .all()) {
      const pos = this.getCoordString($.position, id);
      // filter out light sources outside player FOV
      if (this.fovData[pos]) {
        lights[pos] = {
          ...$.position,
          color: lights[pos]?.color
            ? ROT.Color.add(lights[pos]?.color, $.light.color)
            : $.light.color
        };
      }
    }
    return Object.values(lights);
  }

  /**
   * Compute player FOV each tick.
   */
  protected computeFOV(): void {
    // line-of-sight obstructions...
    for (const { id, $ } of this.world.query.changed(Collision, Position)) {
      const key = this.getCoordString($.position, id);
      this.collisionData[key] = $.collision.allowLOS;
    }

    // we want to repaint every cell within the FOV this tick _or_ last tick—
    // light the new cells we're entering, "unlight" the ones we've left.
    for (const key in this.fovData) {
      this.repaint.push(key);
    }

    // reset from last tick
    this.fovData = {};

    for (const { $ } of this.world.query.with(Playable, Position)) {
      this.fov.compute($.position.x, $.position.y, 10, (x, y, r, v) => {
        const key = this.getCoordString({ x, y });
        this.fovData[key] = v;
      });
    }
  }

  /**
   * Compute lighting each tick, ignoring everything outside the player's FOV
   */
  protected computeLighting(): void {
    this.lighting.clearLights();
    for (const light of this.getLights()) {
      this.lighting.setLight(light.x, light.y, light.color);
    }
    this.lighting.compute((x: number, y: number, color: RGBColor) => {
      const key = this.getCoordString({ x, y });
      if (this.fovData[key]) {
        this.lightData[key] = color;
        this.repaint.push(key);
      }
    });
  }

  /**
   * Write appropriate color data to renderable entities.
   */
  protected computeColors(): void {
    const ids = (this.firstPaint ? [] : this.repaint).reduce(
      (a: string[], key) =>
        a.concat(Array.from(this.keyToID[key]?.values() ?? [])),
      []
    );

    const query = this.world.query.with(Position, Renderable).some(Glyph);
    /**
     * If we've done an initial paint, we only need to paint the changes. Note
     * that the `changed()` query will exclude entities that have been updated
     * in FOV/lighting, but not at the component level. That's why we have to
     * track IDs.
     */
    const results = this.firstPaint ? query.all() : query.findIn(ids);

    for (const { id, $, $$ } of results) {
      const key = this.getCoordString($.position, id);

      const l = this.lightData[key];
      const c = this.collisionData[key];

      const base = c && l ? AMBIENT_LIGHT : AMBIENT_DARK;
      const light = ROT.Color.add(l ?? AMBIENT_DARK, AMBIENT_LIGHT);

      $$.render.fg = ROT.Color.multiply(base, $.glyph?.fg ?? AMBIENT_DARK);
      $$.render.bg = ROT.Color.multiply(base, light);
      $$.render.active = true;
    }
  }

  public tick(): void {
    this.computeFOV();
    this.computeLighting();
    this.computeColors();

    this.firstPaint = false;
    this.repaint = [];
    this.lightData = {};
  }

  public init(): void {
    this.fov = new ROT.FOV.PreciseShadowcasting(
      (x: number, y: number): boolean => {
        const key = this.getCoordString({ x, y });
        return this.collisionData[key] || false;
      },
      { topology: 4 }
    );

    this.lighting = new ROT.Lighting(
      // same callback with a different return type
      (x: number, y: number): number => {
        const key = this.getCoordString({ x, y });
        return this.collisionData[key] ? 0.3 : 0;
      },
      { range: 8, passes: 2 }
    );

    this.lighting.setFOV(this.fov);
  }
}

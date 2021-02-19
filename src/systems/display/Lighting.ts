import * as ROT from 'rot-js';
import { System } from 'tecs';

import type { Point, RGBColor } from '../../types';

import {
  Collision,
  Position,
  LightSource,
  Glyph,
  Playable,
  Renderable,
  Interactive
} from '../../components';

import { AMBIENT_DARK, AMBIENT_LIGHT, getGrid } from '../../utils';
import { Core } from '../../entities';

type LightPoint = Point & { color: RGBColor };

enum LOS {
  VISIBLE = 0,
  BLOCKED = 1
}

export class Lighting extends System {
  public static readonly type = 'lighting';

  public lightGrid: (RGBColor | null)[][] = [];
  public passable: (number | null)[][] = [];
  public fovGrid: (number | null)[][] = [];
  public lastFOV: Point[] = [];

  // since most coordinate pairs are generated independently of entity data, this can't be cleared without needing to re-run the query in computeColors()
  public idGrid: Set<string>[][] = [];

  // grid coordinates that need to be repainted
  public repaint: Point[] = [];
  public firstPaint: boolean = true;
  public loaded = false;

  // created in init()
  public fov!: InstanceType<typeof ROT.FOV.RecursiveShadowcasting>;
  public lighting!: ROT.Lighting;

  public lights: Record<string, LightPoint> = {};
  public adds: string[] = [];

  public width!: number;
  public height!: number;

  protected queries = {
    playable: this.world.query.components(Playable, Position).persist(),
    fov: this.world.query.components(Collision, Position).persist(),
    lights: this.world.query.components(LightSource, Position).persist(),
    lit: this.world.query
      .components(Position, Renderable)
      .some.components(Glyph, Interactive)
      .persist()
  };

  /**
   * Get all light sources, adding colors from overlapping sources.
   */
  protected getLights(): LightPoint[] {
    const res: Record<string, LightPoint> = {};

    for (const { $, id } of this.queries.lights) {
      const { x, y } = $.position;
      (this.idGrid[x][y] ??= new Set()).add(id);
      this.lights[id] = { x, y, color: $.light.color };
    }

    for (const id in this.lights) {
      const light = this.lights[id];
      const key = light.x + ' ' + light.y;
      const rgb =
        key in res ? ROT.Color.add(res[key].color, light.color) : light.color;

      res[key] = { ...light, color: rgb };
    }
    return Object.values(res);
  }

  /**
   * Compute player FOV each tick.
   */
  protected computeFOV(): void {
    // line-of-sight obstructions...
    // @todo - filter results

    for (const { id, $ } of this.queries.fov) {
      const { x, y } = $.position;
      (this.idGrid[x][y] ??= new Set()).add(id);
      const passable =
        $.collision.passable || $.collision.allowLOS
          ? LOS.VISIBLE
          : LOS.BLOCKED;
      this.passable[x][y] = passable;
    }

    // we want to repaint every cell within the FOV this tick _or_ last tick—
    // light the new cells we're entering, "unlight" the ones we've left.
    for (const { x, y } of this.lastFOV) {
      this.repaint.push({ x, y });
    }
    this.lastFOV = [];

    // reset from last tick
    this.fovGrid = getGrid(this.width, this.height, null);

    for (const { $ } of this.queries.playable) {
      this.fov.compute($.position.x, $.position.y, 10, (x, y, r, v) => {
        this.fovGrid[x][y] = v;
        this.repaint.push({ x, y });
        this.lastFOV.push({ x, y });
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
      if (this.fovGrid[x]?.[y]) {
        this.lightGrid[x][y] = color;
        this.repaint.push({ x, y });
      }
    });
  }

  /**
   * Write appropriate color data to renderable entities.
   */

  protected computeColors(): void {
    const ids: string[] = [];
    if (!this.firstPaint) {
      for (const { x, y } of this.repaint) {
        const id = this.idGrid[+x][+y];
        if (id) {
          ids.push(...Array.from(id.values()));
        }
      }
    }

    /**
     * If we've done an initial paint, we only need to paint the changes. Note
     * that the `changed()` query will exclude entities that have been updated
     * in FOV/lighting, but not at the component level. That's why we have to
     * track IDs.
     */

    for (const { id, $ } of this.queries.lit) {
      if (ids.length && !ids.includes(id)) {
        continue;
      }

      const { x, y } = $.position;
      (this.idGrid[x][y] ??= new Set()).add(id);

      const data = this.lightGrid[x][y];
      const base =
        this.passable[x][y] === LOS.VISIBLE ? AMBIENT_LIGHT : AMBIENT_DARK;

      const light = data ? ROT.Color.add(AMBIENT_LIGHT, data) : AMBIENT_LIGHT;

      $.render.fg = $.glyph?.fg
        ? ROT.Color.interpolate(
            ROT.Color.multiply(base, data ?? AMBIENT_LIGHT),
            $.glyph?.fg
          )
        : ROT.Color.multiply(base, data ?? AMBIENT_LIGHT);
      // $.render.fg = ROT.Color.multiply(base, $.glyph?.fg ?? AMBIENT_DARK);
      // $.render.bg = ROT.Color.multiply(base, light);
      $.render.bg = ROT.Color.multiply(light, AMBIENT_LIGHT);
      $.render.active = true;
      $.render.dirty = true;

      this.firstPaint = false;
    }
  }

  public tick(): void {
    this.computeFOV();
    this.computeLighting();
    this.computeColors();
    this.lightGrid = getGrid(this.width, this.height);
    this.repaint = [];
  }

  public init(): void {
    const core = this.world.query.entities(Core).first();
    if (core) {
      const w = (this.width = core.$.game.width);
      const h = (this.height = core.$.game.height);

      this.lightGrid = getGrid(w, h);
      this.passable = getGrid(w, h);
      this.fovGrid = getGrid(w, h);
      this.idGrid = getGrid(w, h);

      this.fov = new ROT.FOV.RecursiveShadowcasting(
        (x, y) => this.passable[x]?.[y] === LOS.VISIBLE
      );

      this.lighting = new ROT.Lighting(
        // same callback with a different return type
        (x: number, y: number): number =>
          this.passable[x][y] === LOS.VISIBLE ? 0 : 0.3,
        { range: 10, passes: 1 }
      );

      this.lighting.setFOV(this.fov);

      this.loaded = true;
    }
  }
}

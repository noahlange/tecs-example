import type { Vector2, Color } from '@types';
import type { CollisionMap } from '@lib';

import { System } from 'tecs';
import { FOV } from 'malwoden';

import { Lighting, Vector2Array } from '@lib';

import {
  Position,
  LightSource,
  Renderable,
  Interactive,
  View as ViewComponent,
  Playable,
  Sprite
} from '../components';

import {
  AMBIENT_DARK as DARK,
  AMBIENT_LIGHT as LIGHT,
  isSamePoint
} from '@utils';
import { add, multiply } from '@utils/colors';

enum Repaint {
  /**
   * Skip the lighting/painting process entirely.
   */
  NONE = 0,
  /**
   * Re-paint the tile, but don't re-light it.
   */
  BASE = 1,
  /**
   * Re-paint and re-light the tile.
   */
  FULL = 2,
  /**
   * Red circles for debugging.
   */
  DEBUG = 3
}

export class View extends System {
  public static readonly type = 'view';

  // we need to track cells we'd like to "unpaint" after a
  protected repaintGrid!: Vector2Array<Repaint>;
  protected colorGrid!: Vector2Array<Color>;

  // we don't need to recalculate FOV if the view hasn't changed
  protected lastPosition: Record<string, Vector2> = {};

  protected width!: number;
  protected height!: number;

  // rot instances, instantiated during init()
  protected fov!: FOV.PreciseShadowcasting;
  protected lighting!: Lighting;

  // protected lighting!: ROT.Lighting;
  protected collisions!: CollisionMap;

  protected debug = false;

  protected queries = {
    lights: this.world.query.components(LightSource, Position).persist(),
    views: this.world.query
      .components(Position, ViewComponent)
      .some.components(Playable)
      .persist(),
    renderable: this.world.query
      .components(Position, Renderable)
      .some.components(Sprite, Interactive)
      .persist()
  };

  /**
   * compute FOV each tick.
   */
  protected computeFOV(): void {
    const viewers = this.queries.views
      .get()
      .sort((a, b) => (a.$.player ? 1 : 0) - (b.$.player ? 1 : 0));

    for (const viewer of viewers) {
      const { id, $ } = viewer;
      if ($.player || this.debug) {
        // if the viewport has moved, we want to repaint (but un-light) the previous view. if it's still visible, it'll be added in the FOV computation loop below
        for (const point of $.view.visible) {
          this.repaintGrid.set(point, Repaint.BASE);
        }
      } else {
        // for the time being, we'll only recalculate FOVs for (NPCs) that have actually moved
        const prev = this.lastPosition[id];
        if (prev && isSamePoint($.position, prev)) {
          continue;
        }
      }
      // recalculate FOV
      $.view.visible = [];
      this.fov.calculateCallback($.position, $.view.range, pos => {
        $.view.visible.push(pos);
        this.repaintGrid.set(
          pos,
          this.debug ? Repaint.DEBUG : $.player ? Repaint.FULL : Repaint.BASE
        );
      });

      // and update last position
      this.lastPosition[id] = { ...$.position };
    }
  }

  /**
   * Compute lighting each tick
   */

  protected computeLighting(): void {
    // reset...
    this.colorGrid.clear();
    this.lighting.clearLights();
    const lights = new Vector2Array<Color>({
      w: this.width,
      h: this.height
    });

    // find all the light sources...
    for (const { $ } of this.queries.lights) {
      const prev = lights.get($.position);
      lights.set($.position, prev ? add(prev, $.light.color) : $.light.color);
    }

    for (const [point, color] of lights.entries()) {
      this.lighting.setLight(point, color);
    }

    // ...and recolor
    this.lighting.compute((point, color: Color) => {
      this.colorGrid.set(point, color);
    });
  }

  /**
   * Write appropriate color data to renderable entities.
   */
  protected repaint(): void {
    for (const { $ } of this.queries.renderable) {
      const r = this.repaintGrid.get($.position);
      if (!r) {
        continue;
      }

      let data: Color | null = null;

      switch (r) {
        case Repaint.FULL:
          data = this.colorGrid.get($.position);
          break;
        case Repaint.DEBUG:
          data = { r: 255, g: 0, b: 0, a: 1 };
          break;
      }

      const base = this.collisions.isVisible($.position) ? LIGHT : DARK;
      const light = data ? add(LIGHT, data) : LIGHT;
      const mult = multiply(base, data ?? LIGHT);

      $.render.fg = { r: 255, g: 255, b: 255, a: 1 };
      // $.render.fg = $.sprite?.tint ? mix(mult, $.sprite?.tint) : mult;
      $.render.bg = multiply(light, LIGHT);
      $.render.dirty = true;
    }
  }

  public tick(): void {
    this.computeFOV();
    this.computeLighting();
    this.repaint();
    // only paint explicitly-indicated tiles next tick
    this.repaintGrid.clear();
    this.colorGrid.clear();
  }

  public initMap(): void {
    const map = this.world.game.$.map;
    const w = (this.width ??= map.bounds.w);
    const h = (this.height ??= map.bounds.h);

    // initially, we want to paint everything without lighting. we may light it during the tick, but we don't care at this point.
    this.repaintGrid = new Vector2Array({ w, h }, Repaint.BASE);
    this.colorGrid = new Vector2Array({ w, h });

    this.collisions = map.collisions;
    this.fov = new FOV.PreciseShadowcasting({
      lightPasses: point => this.collisions.isVisible(point),
      topology: 'four'
    });

    this.lighting = new Lighting(
      map.bounds,
      point => (this.collisions.isVisible(point) ? 0 : 0.3),
      { range: 8, passes: 2 }
    );

    this.lighting.setFOV(this.fov);
  }

  public init(): void {
    this.initMap();
    this.world.game.on('initMap', () => this.initMap());
  }
}

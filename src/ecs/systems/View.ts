import type { Vector2, Color, Size } from '@types';

import { System } from 'tecs';
import { FOV } from 'malwoden';
import { Lighting } from '@lib';

import {
  Position,
  LightSource,
  Renderable,
  View as ViewComponent,
  Playable,
  Sprite
} from '../components';

import {
  AMBIENT_DARK as DARK,
  AMBIENT_LIGHT as LIGHT,
  CHUNK_HEIGHT,
  CHUNK_WIDTH,
  isSamePoint,
  toRelative,
  fromRelative,
  CHUNK_RADIUS
} from '@utils';

import { Vector2Array } from '@lib';
import { add, mix, multiply } from '@utils/colors';

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

  protected center: Vector2 = { x: 0, y: 0 };
  protected size!: Size;

  protected fov!: FOV.PreciseShadowcasting;
  protected lighting!: Lighting;

  protected debug = false;

  protected queries = {
    lights: this.world.query.components(LightSource, Position).persist(),
    views: this.world.query
      .components(Position, ViewComponent)
      .some.components(Playable)
      .persist(),
    renderable: this.world.query
      .components(Position, Renderable)
      .some.components(Sprite)
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
      const rel = toRelative(this.center, $.position);
      if (rel) {
        $.view.visible = [];
        this.fov.calculateCallback(rel, $.view.range, pos => {
          $.view.visible.push(fromRelative(this.center, pos));
          this.repaintGrid.set(
            pos,
            this.debug ? Repaint.DEBUG : $.player ? Repaint.FULL : Repaint.BASE
          );
        });

        // and update last position
        this.lastPosition[id] = $.position;
      }
    }
  }

  /**
   * Compute lighting each tick
   */
  protected computeLighting(): void {
    // reset...
    this.colorGrid.clear();
    this.lighting.clearLights();
    const lights = new Vector2Array<Color>(this.size);

    // find all the light sources...
    for (const { $ } of this.queries.lights) {
      const pos = toRelative(this.center, $.position);
      if (pos) {
        const prev = lights.get(pos);
        // we'll need to add colors if we're stacking lights
        lights.set(pos, prev ? add(prev, $.light.color) : $.light.color);
      }
    }

    for (const [point, color] of lights.entries()) {
      this.lighting.setLight(point, color);
    }

    // ...and recolor
    for (const [point, color] of this.lighting.compute()) {
      this.colorGrid.set(point, color);
    }
  }

  /**
   * Write appropriate color data to renderable entities.
   */
  protected repaint(): void {
    for (const { $ } of this.queries.renderable) {
      const key = toRelative(this.center, $.position);

      if (!key || !this.repaintGrid.has(key)) {
        continue;
      }

      const r = this.repaintGrid.get(key);

      let data: Color | null = null;

      switch (r) {
        case Repaint.FULL: {
          const rel = toRelative(this.center, $.position);
          if (rel) {
            data = this.colorGrid.get(rel);
          }
          break;
        }
        case Repaint.DEBUG:
          data = { r: 255, g: 0, b: 0, a: 1 };
          break;
      }

      const visible = key && this.world.game.$.map.collisions.isVisible(key);
      if (visible) {
        const light = data ? add(LIGHT, data) : LIGHT;
        const mult = multiply(LIGHT, data ?? LIGHT);
        $.render.fg = $.sprite?.tint ? mix(mult, $.sprite?.tint) : mult;
        $.render.bg = multiply(light, LIGHT);
        $.render.dirty = true;
      } else {
        $.render.fg = DARK;
        $.render.dirty = true;
      }
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
    this.size = {
      width: CHUNK_WIDTH + CHUNK_RADIUS * 2,
      height: CHUNK_HEIGHT + CHUNK_RADIUS * 2
    };
    // center chunk
    this.center = { x: map.x, y: map.y };

    // initially, we want to paint everything without lighting. we may light it during the tick, but we don't care at this point.
    this.repaintGrid = new Vector2Array(this.size, Repaint.BASE);
    this.colorGrid = new Vector2Array(this.size);

    this.fov = new FOV.PreciseShadowcasting({
      lightPasses: point =>
        map.collisions.isVisible(fromRelative(this.center, point)),
      topology: 'four',
      cartesianRange: true
    });

    this.lighting = new Lighting(
      { ...this.size, range: 8, passes: 2, fov: this.fov },
      point =>
        map.collisions.isVisible(fromRelative(this.center, point)) ? 0 : 0.3
    );
  }

  public init(): void {
    this.initMap();
    this.world.game.on('initMap', () => this.initMap());
  }
}

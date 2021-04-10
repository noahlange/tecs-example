import type { Area } from '@lib';
import type { Color, Size, Vector2 } from '@types';
import { System } from 'tecs';
import { Vector2Array, Lighting } from '@lib';
import {
  CHUNK_HEIGHT,
  CHUNK_RADIUS,
  CHUNK_WIDTH,
  fromRelative,
  toRelative,
  AMBIENT_DARK as DARK,
  AMBIENT_LIGHT as LIGHT
} from '@utils';
import { add, mix, multiply } from '@utils/colors';
import {
  LightSource,
  Playable,
  Position,
  Renderable,
  Sprite,
  View
} from '@ecs/components';

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

export class LightingSystem extends System {
  public static readonly type = 'lighting';

  // we need to track cells we'd like to "unpaint" after a
  protected repaintGrid!: Vector2Array<Repaint>;
  protected colorGrid!: Vector2Array<Color>;

  // we don't need to recalculate FOV if the view hasn't changed
  protected lastPosition: Record<string, Vector2> = {};

  protected area: Area | null = null;
  protected size: Size = { width: 0, height: 0 };

  protected lighting!: Lighting;

  protected $ = {
    views: this.world.query
      .components(Position, View)
      .some.components(Playable)
      .persist(),
    renderable: this.world.query
      .components(Position, Renderable)
      .some.components(Sprite)
      .persist(),
    lights: this.world.query.components(LightSource, Position).persist()
  };

  /**
   * Compute lighting each tick
   */
  protected computeLighting(): void {
    for (const viewer of this.$.views) {
      // if the viewport has moved, we want to repaint (but un-light) the previous view. if it's still visible, it'll be added in the FOV computation loop below
      for (const point of viewer.$.view.visible) {
        this.repaintGrid.set(
          point,
          viewer.has(Playable) ? Repaint.FULL : Repaint.BASE
        );
      }
    }

    // reset...
    this.colorGrid.clear();
    this.lighting.clearLights();
    const lights = new Vector2Array<Color>(this.size);

    // find all the light sources...
    for (const { $ } of this.$.lights) {
      const pos = toRelative(this.area!, $.position);
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
    for (const { $ } of this.$.renderable) {
      const pos = toRelative(this.area!, $.position);
      const color = pos && this.repaintGrid.get(pos);
      if (!pos) {
        continue;
      }

      let data: Color | null = null;

      switch (color) {
        case Repaint.FULL:
          data = this.colorGrid.get(pos);
          break;
        case Repaint.DEBUG:
          data = { r: 255, g: 0, b: 0, a: 1 };
          break;
        default:
          data = this.colorGrid.get(pos);
          break;
      }

      const base = this.area?.collisions.isVisible(pos) ? LIGHT : DARK;
      const light = data ? add(LIGHT, data) : LIGHT;
      const mult = multiply(base, data ?? LIGHT);

      $.render.fg = $.sprite?.tint ? mix(mult, $.sprite?.tint) : mult;
      $.render.bg = multiply(light, LIGHT);
      $.render.dirty = true;
    }
  }

  public tick(): void {
    if (this.area) {
      this.computeLighting();
      this.repaint();
      // only paint explicitly-indicated tiles next tick
      this.repaintGrid.clear();
      this.colorGrid.clear();
    }
  }

  public initArea(area: Area): void {
    this.area = area;
    this.size = {
      width: CHUNK_WIDTH + CHUNK_RADIUS * 2,
      height: CHUNK_HEIGHT + CHUNK_RADIUS * 2
    };

    // initially, we want to paint everything without lighting. we may light it during the tick, but we don't care at this point.
    this.repaintGrid = new Vector2Array(this.size, Repaint.BASE);
    this.colorGrid = new Vector2Array(this.size);

    this.lighting = new Lighting(
      { ...this.size, range: 8, passes: 2, fov: area.fov },
      point => (area.collisions.isVisible(fromRelative(area, point)) ? 0 : 0.3)
    );
  }

  public init(): void {
    this.world.game.on('init.area', area => this.initArea(area));
  }
}
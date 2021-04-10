import type { Vector2 } from '@types';
import type { Area } from '@lib';

import { System } from 'tecs';

import {
  Position,
  Renderable,
  View as ViewComponent,
  Playable,
  Sprite
} from '../components';

import { isSamePoint, toRelative, fromRelative } from '@utils';

export class View extends System {
  public static readonly type = 'view';

  // we don't need to recalculate FOV if the view hasn't changed
  protected lastPosition: Record<string, Vector2> = {};
  protected area: Area | null = null;
  protected debug = false;

  protected queries = {
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
    const { fov, x, y } = this.area!;
    const center = { x, y };

    const viewers = this.queries.views
      .get()
      .sort((a, b) => (a.$.player ? 1 : 0) - (b.$.player ? 1 : 0));

    for (const viewer of viewers) {
      const { id, $ } = viewer;
      // for the time being, we'll only recalculate FOVs for (NPCs) that have actually moved
      const prev = this.lastPosition[id];
      if (prev && isSamePoint($.position, prev)) {
        continue;
      }
      // recalculate FOV
      const rel = toRelative(center, $.position);
      if (rel) {
        $.view.visible = [];
        fov.calculateCallback(rel, $.view.range, pos => {
          $.view.visible.push(fromRelative(center, pos));
        });

        // and update last position
        this.lastPosition[id] = $.position;
      }
    }
  }

  public tick(): void {
    if (this.area) {
      this.computeFOV();
    }
  }

  public initArea(area: Area): void {
    this.area = area;
  }

  public init(): void {
    this.world.game.on('init.area', area => this.initArea(area));
  }
}

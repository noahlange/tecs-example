import type { ChunkMap } from '@core/maps';
import type { Vector2 } from '@lib/types';

import {
  Playable,
  Position,
  Renderable,
  Sprite,
  View as ViewComponent
} from '@core/components';
import { fromRelative, isSamePoint, toRelative } from '@utils/geometry';
import { System } from 'tecs';

export class ViewSystem extends System {
  public static readonly type = 'view';

  // we don't need to recalculate FOV if the view hasn't changed
  protected lastPosition: Record<string, Vector2> = {};
  protected area: ChunkMap | null = null;
  protected debug = false;

  protected queries = {
    views: this.ctx.$.components(Position, ViewComponent)
      .some.components(Playable)
      .persist(),
    renderable: this.ctx.$.components(Position, Renderable)
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

  public initArea(area: ChunkMap): void {
    this.area = area;
  }

  public start(): void {
    this.ctx.game.on('init.map.chunks', area => this.initArea(area));
  }
}

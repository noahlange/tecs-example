import type { Vector2 } from '@types';

import { TileType } from '@enums';
import { Rectangle, MapBuilder } from '@lib';
import { RNG } from '@utils';

export class Builder extends MapBuilder {
  protected rooms: Rectangle[] = [];

  protected drawCorridor(a: Vector2, b: Vector2): void {
    const [yMin, yMax] = [a.y, b.y].sort((a, b) => a - b);
    const [xMin, xMax] = [a.x, b.x].sort((a, b) => a - b);
    const isVertical = xMin === xMax;

    const [min, max] = isVertical ? [yMin, yMax] : [xMin, xMax];
    const point = isVertical ? xMin : yMin;

    for (let i = min; i <= max; i++) {
      const target = isVertical ? { x: point, y: i } : { x: i, y: point };
      for (const p of this.getBrushPoints(target)) {
        this.map.add(p, TileType.FLOOR);
      }
    }
  }

  protected drawCorridors(): void {
    for (let i = 1; i <= this.rooms.length; i++) {
      const [curr, next] = [this.rooms[i - 1], this.rooms[i] ?? this.rooms[0]];
      const { x: x2, y: y2 } = next.center;
      const { x: x1, y: y1 } = curr.center;

      if (RNG.flip()) {
        this.drawCorridor({ x: x1, y: y1 }, { x: x2, y: y1 });
        this.drawCorridor({ x: x2, y: y1 }, { x: x2, y: y2 });
      } else {
        this.drawCorridor({ x: x1, y: y1 }, { x: x1, y: y2 });
        this.drawCorridor({ x: x1, y: y2 }, { x: x2, y: y2 });
      }

      this.map.snapshot();
    }
  }

  protected drawRooms(): void {
    const MAX_ROOMS = 30;
    const MIN_SIZE = 6;
    const MAX_SIZE = 10;

    for (let i = 0; i < MAX_ROOMS; i++) {
      const w = RNG.int.between(MIN_SIZE, MAX_SIZE);
      const h = RNG.int.between(MIN_SIZE, MAX_SIZE);
      const x1 = RNG.int.between(1, this.width - w - 1) - 1;
      const y1 = RNG.int.between(1, this.height - h - 1) - 1;
      const r = new Rectangle({ x1, y1, x2: x1 + w, y2: y1 + h });

      const collision = {
        x1: r.x1 - Math.ceil(w / 2),
        y1: r.y1 - Math.ceil(h / 2),
        x2: r.x2 + Math.ceil(w / 2),
        y2: r.y2 + Math.ceil(h / 2)
      };

      if (!this.rooms.some(other => other.intersects(collision))) {
        this.rooms.push(r);
        this.drawRectangle(r, TileType.FLOOR);
        this.map.snapshot();
      }
    }
  }

  public generate(): void {
    this.drawRooms();
    this.drawCorridors();
  }
}

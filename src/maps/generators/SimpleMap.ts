import type { Vector2 } from '@types';

import { TileType } from '@enums';
import { Rectangle, MapBuilder } from '@lib';
import { RNG } from '@utils';
import { getUniformInt } from '@utils/random';

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
      const { cx: nextX, cy: nextY } = next;
      const { cx: currX, cy: currY } = curr;

      if (RNG.flip()) {
        this.drawCorridor({ x: currX, y: currY }, { x: nextX, y: currY });
        this.drawCorridor({ x: nextX, y: currY }, { x: nextX, y: nextY });
      } else {
        this.drawCorridor({ x: currX, y: currY }, { x: currX, y: nextY });
        this.drawCorridor({ x: currX, y: nextY }, { x: nextX, y: nextY });
      }

      this.map.snapshot();
    }
  }

  protected drawRooms(): void {
    const MAX_ROOMS = 30;
    const MIN_SIZE = 6;
    const MAX_SIZE = 10;

    for (let i = 0; i < MAX_ROOMS; i++) {
      const w = getUniformInt(MIN_SIZE, MAX_SIZE);
      const h = getUniformInt(MIN_SIZE, MAX_SIZE);
      const x1 = getUniformInt(1, this.width - w - 1) - 1;
      const y1 = getUniformInt(1, this.height - h - 1) - 1;
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

import type { Rect } from '@types';
import { RNG } from '@utils';
import { TileType } from '@enums';
import { Rectangle, MapBuilder } from '@lib';

export class Builder extends MapBuilder {
  protected rects: Rectangle[] = [];
  protected rooms: Rectangle[] = [];

  protected isValid(rect: Rectangle): boolean {
    const expanded = new Rectangle(rect);
    expanded.x1 -= 2;
    expanded.y1 -= 2;
    expanded.x2 += 2;
    expanded.y2 += 2;

    const [minX, maxX] = [expanded.x1, expanded.x2].sort((a, b) => a - b);
    const [minY, maxY] = [expanded.y1, expanded.y2].sort((a, b) => a - b);

    if (minX < 1 || maxX > this.width - 2) {
      return false;
    }
    if (minY < 1 || maxY > this.height - 2) {
      return false;
    }

    for (let x = minX; x < maxX; x++) {
      for (let y = minY; y < maxY; y++) {
        if (!this.map.tiles.is({ x, y }, TileType.WALL)) {
          return false;
        }
      }
    }
    return true;
  }

  // returns a random partition. if no rectangles exist, returns the initial partition
  protected getRandomRect(): Rectangle {
    if (this.rects.length) {
      const i = RNG.int.between(1, this.rects.length) - 1;
      if (this.rects[i]) {
        return this.rects[i];
      }
    }

    return new Rectangle({
      x1: 1,
      y1: 1,
      x2: this.width - 2,
      y2: this.height - 2
    });
  }

  protected getRandomSubRect(rect: Rectangle): Rectangle {
    const res = new Rectangle(rect);
    const rWidth = Math.abs(res.x1 - res.x2);
    const rHeight = Math.abs(res.y1 - res.y2);

    const w = Math.max(3, RNG.int.between(1, Math.min(rWidth, 16)) - 1) + 1;
    const h = Math.max(3, RNG.int.between(1, Math.min(rHeight, 16)) - 1) + 1;

    res.x1 += RNG.int.between(1, 6) - 1;
    res.y1 += RNG.int.between(1, 6) - 1;
    res.x2 = res.x1 + w;
    res.y2 = res.y1 + h;

    return res;
  }

  protected subdivide(rect: Rectangle): void {
    const w = Math.abs(rect.x2 - rect.x1);
    const h = Math.abs(rect.y1 - rect.y2);
    const hw = Math.round(Math.max(w / 2, 1));
    const hh = Math.round(Math.max(h / 2, 1));

    this.rects.push(
      // northwest
      new Rectangle({
        x1: rect.x1,
        y1: rect.y1,
        x2: rect.x1 + hw,
        y2: rect.y1 + hh
      }),
      // southwest
      new Rectangle({
        x1: rect.x1,
        y1: rect.y1 + hh,
        x2: rect.x1 + hw,
        y2: rect.y1 + h
      }),
      // northeast
      new Rectangle({
        x1: rect.x1 + hw,
        y1: rect.y1,
        x2: rect.x1 + w,
        y2: rect.y1 + hh
      }),
      // southeast
      new Rectangle({
        x1: rect.x1 + hw,
        y1: rect.y1 + hh,
        x2: rect.x1 + w,
        y2: rect.y1 + h
      })
    );
  }

  protected drawCorridor(rectangle: Rect): void {
    let x = rectangle.x1;
    let y = rectangle.y1;
    const { x2, y2 } = rectangle;
    while (x !== x2 || y !== y2) {
      switch (true) {
        case x < x2:
          x += 1;
          break;
        case x > x2:
          x -= 1;
          break;
        case y < y2: {
          y += 1;
          break;
        }
        case y > y2: {
          y -= 1;
          break;
        }
      }

      this.map.add({ x, y }, TileType.FLOOR);
    }
  }

  protected drawCorridors(): void {
    for (let i = 0; i < this.rooms.length - 1; i++) {
      const [curr, next] = [this.rooms[i], this.rooms[i + 1]];
      const x1 =
        curr.x1 + (RNG.int.between(1, Math.abs(curr.x1 - curr.x2)) - 1);
      const y1 =
        curr.y1 + (RNG.int.between(1, Math.abs(curr.y1 - curr.y2)) - 1);
      const x2 =
        next.x1 + (RNG.int.between(1, Math.abs(next.x1 - next.x2)) - 1);
      const y2 =
        next.y1 + (RNG.int.between(1, Math.abs(next.y1 - next.y2)) - 1);
      this.drawCorridor({ x1, y1, x2, y2 });
    }
  }

  public generate(): void {
    const first = this.getRandomRect();
    this.rects.push(first);
    this.subdivide(first);

    let rooms = 0;
    while (rooms < 256) {
      const rect = this.getRandomRect();
      const candidate = this.getRandomSubRect(rect);

      if (this.isValid(candidate)) {
        this.drawRectangle(candidate, TileType.FLOOR);
        this.rooms.push(candidate);
        this.subdivide(rect);
        this.map.snapshot();
      }
      rooms++;
    }

    this.rooms.sort((a, b) => a.x1 - b.x1);
    this.drawCorridors();
    this.map.snapshot();
  }
}

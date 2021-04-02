import { Rectangle, MapBuilder } from '@lib';
import { TileType } from '@enums';
import { RNG } from '@utils';

export class Builder extends MapBuilder {
  public static MIN_ROOM_SIZE: number = 8;

  protected rects: Rectangle[] = [];
  protected rooms: Rectangle[] = [];

  protected connect(x1: number, y1: number, x2: number, y2: number): void {
    let [x, y] = [x1, y1];
    while (x !== x2 && y !== y2) {
      switch (true) {
        case x < x2:
          x += 1;
          break;
        case x > x2:
          x -= 1;
          break;
        case y < y2:
          y += 1;
          break;
        case y > y2:
          y -= 1;
          break;
      }

      this.map.add({ x, y }, TileType.FLOOR);
    }
  }

  protected subdivide(r: Rectangle): void {
    if (this.rects.length > 0) {
      this.rects.pop();
    }
    const { width, height } = r;
    const [halfWidth, halfHeight] = [
      Math.floor(width / 2),
      Math.floor(height / 2)
    ];

    const h1 = { x1: r.x1, y1: r.y1, x2: r.x1 + (halfWidth - 1), y2: r.y2 };
    const h2 = { x1: r.x1 + halfWidth, y1: r.y1, x2: r.x2, y2: r.y2 };
    const v1 = { x1: r.x1, y1: r.y1, x2: r.x2, y2: r.y1 + halfHeight - 1 };
    const v2 = { x1: r.x1, y1: r.y1 + halfHeight, x2: r.x2, y2: r.y2 };

    const isVertical = RNG.flip();
    const rects = isVertical ? [h1, h2] : [v1, v2];

    for (const r of rects) {
      const rect = new Rectangle(r);
      this.rects.push(rect);
      const half = isVertical ? halfWidth : halfHeight;
      if (half > Builder.MIN_ROOM_SIZE) {
        this.subdivide(rect);
      }
    }
  }

  public generate(): void {
    const first = new Rectangle({
      x1: 1,
      y1: 1,
      x2: this.width - 1,
      y2: this.height - 1
    });

    this.rects.push(first);
    this.subdivide(first);

    for (const room of this.rects) {
      this.rooms.push(room);
      for (let y = room.y1; y < room.y2; y++) {
        for (let x = room.x1; x < room.x2; x++) {
          this.map.add({ x, y }, TileType.FLOOR);
        }
      }
      this.map.snapshot();
    }

    for (let i = 0; i < this.rooms.length - 1; i++) {
      const [room, next] = [this.rooms[i], this.rooms[i + 1]];
      const rx = RNG.int.between(1, Math.abs(room.x1 - room.x2) - 1);
      const ry = RNG.int.between(1, Math.abs(room.y1 - room.y2) - 1);
      const nx = RNG.int.between(1, Math.abs(next.x1 - next.x2) - 1);
      const ny = RNG.int.between(1, Math.abs(next.y1 + next.y2) - 1);
      this.connect(room.x1 + rx, room.y1 + ry, next.x1 + nx, next.y1 + ny);
      this.map.snapshot();
    }
  }
}

import * as ROT from 'rot-js';

import { Door, GameMap, Item } from '../../entities';
import { getItem } from '../../entities/items';
import { HEIGHT, WIDTH } from '../../utils';
import { MapGen } from './MapGen';

export class DiggerMap extends MapGen {
  public static readonly type = 'map';

  protected map!: InstanceType<typeof ROT.Map.Digger>;

  protected generate(): void {
    this.map = new ROT.Map.Digger(WIDTH, HEIGHT, { dugPercentage: 0.75 });

    this.world.create(GameMap, {
      game: { width: WIDTH, height: HEIGHT }
    });

    this.map.create((x, y, value) => this.addCell({ x, y }, !!value));

    for (const room of this.map.getRooms()) {
      const [x, y] = room.getCenter();

      if (ROT.RNG.getPercentage() > 75) {
        const [t, r, b, l] = [
          room.getTop(),
          room.getRight(),
          room.getBottom(),
          room.getLeft()
        ];
        this.world.create(
          Item,
          getItem([
            { x: r, y: t },
            { x: l, y: b }
          ])
        );
      }

      if (ROT.RNG.getPercentage() > 25) {
        this.addLight({ x, y });
      }

      room.getDoors((x, y) => {
        this.world.create(Door, {
          position: { x, y },
          glyph: {
            text: '-',
            fg: [120, 80, 48],
            bg: [30, 30, 30]
          },
          collision: {
            passable: false,
            allowLOS: false
          }
        });
      });
    }

    const rooms = this.map.getRooms();
    const room = rooms.shift();
    if (room) {
      const [x, y] = room.getCenter();
      this.addPlayer({ x, y });
    }
  }
}

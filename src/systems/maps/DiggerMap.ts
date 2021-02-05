import * as ROT from 'rot-js';

import { Door, Item } from '../../entities';
import { getItem } from '../../entities/items';
import { NPC } from '../../entities/NPC';
import { HEIGHT, WIDTH } from '../../utils';
import { MapGen } from './MapGen';

export class DiggerMap extends MapGen {
  public static readonly type = 'map';

  protected map!: InstanceType<typeof ROT.Map.Digger>;
  protected doors: Set<string> = new Set();

  protected addNPC(): void {
    const picked = ROT.RNG.getItem(this.map.getRooms());
    if (picked) {
      const [x, y] = picked.getCenter();
      this.world.create(NPC, {
        text: { title: 'NPC' },
        // talk: { file: 'dialogue', start: 'Start' },
        glyph: { text: '@', fg: [255, 0, 0] },
        position: { x, y },
        collision: { allowLOS: true }
      });
    }
  }

  protected generate(): void {
    this.map = new ROT.Map.Digger(WIDTH, HEIGHT, { dugPercentage: 0.75 });
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
        this.doors.add(`${x} ${y}`);
      });
    }

    const rooms = this.map.getRooms();
    const room = rooms.shift();
    if (room) {
      const [x, y] = room.getCenter();
      this.addPlayer({ x, y });
    }

    for (const door of this.doors) {
      const [x, y] = door.split(' ');
      this.world.create(Door, {
        position: { x: +x, y: +y },
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
    }

    this.addNPC();
  }
}

import * as ROT from 'rot-js';

import { Door, Chest, NPC } from '../../entities';
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
        // talk: { file: 'dialogue', start: 'Start' },
        position: { x, y }
      });
    }
  }

  protected generate(): void {
    this.map = new ROT.Map.Digger(WIDTH, HEIGHT, { dugPercentage: 0.75 });
    this.map.create((x, y, value) => this.addCell({ x, y }, !!value));

    for (const room of this.map.getRooms()) {
      const [x, y] = room.getCenter();

      if (ROT.RNG.getPercentage() > 75) {
        const nw = { x: room.getLeft(), y: room.getTop() };
        const se = { x: room.getRight(), y: room.getBottom() };
        this.world.create(Chest, {
          position: {
            x: ROT.RNG.getUniformInt(nw.x, se.x),
            y: ROT.RNG.getUniformInt(nw.y, se.y)
          }
        });
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
      this.world.create(Door, { position: { x: +x, y: +y } });
    }

    this.addNPC();
  }
}

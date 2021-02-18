import * as ROT from 'rot-js';
import { MapGen } from './MapGen';
import type { MapGenResult } from './MapGen';

export class DiggerMap extends MapGen {
  protected map!: InstanceType<typeof ROT.Map.Digger>;
  protected items: MapGenResult[] = [];
  protected doors: Set<string> = new Set();

  protected addEnemies(): void {
    const rooms = this.map.getRooms();
    const picked = ROT.RNG.getItem(rooms);
    if (picked) {
      const [x, y] = picked.getCenter();
      this.addGoblin({ x, y });
    }
  }

  protected addNPCs(): void {
    const rooms = this.map.getRooms();
    const picked = ROT.RNG.getItem(rooms);
    if (picked) {
      const [x, y] = picked.getCenter();
      this.items.push({ entity: 'NPC', data: { position: { x, y } } });
    }
  }

  protected addRooms(): void {
    for (const room of this.map.getRooms()) {
      const [x, y] = room.getCenter();

      if (ROT.RNG.getPercentage() > 75) {
        const nw = { x: room.getLeft(), y: room.getTop() };
        const se = { x: room.getRight(), y: room.getBottom() };
        this.items.push({
          entity: 'Chest',
          data: {
            position: {
              x: ROT.RNG.getUniformInt(nw.x, se.x),
              y: ROT.RNG.getUniformInt(nw.y, se.y)
            }
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
  }

  public generate(): MapGenResult[] {
    this.map = new ROT.Map.Digger(this.width, this.height, {
      dugPercentage: 0.75
    });
    this.map.create((x, y, value) => this.addCell({ x, y }, !!value));

    this.addRooms();
    const rooms = this.map.getRooms();
    const room = rooms.shift();

    if (room) {
      const [x, y] = room.getCenter();
      this.addPlayer({ x, y });
    }

    for (const door of this.doors) {
      const [x, y] = door.split(' ');
      this.items.push({ entity: 'Door', data: { position: { x: +x, y: +y } } });
    }

    this.addNPCs();
    this.addEnemies();

    return this.items;
  }
}

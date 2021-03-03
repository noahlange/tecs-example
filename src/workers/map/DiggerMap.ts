import * as ROT from 'rot-js';
import { MapGen } from './MapGen';

import { T } from '../../utils';

import type { MapGenResult, MapGenEntity, MapGenInfo } from './MapGen';
import type { Point } from '../../types';
import { Array2D } from '@lib';

export class DiggerMap extends MapGen {
  protected map!: InstanceType<typeof ROT.Map.Digger>;
  protected items: MapGenEntity[] = [];
  protected doors: Set<string> = new Set();
  protected mapData: MapGenInfo = { doors: [], rooms: [] };
  protected walls!: Array2D<boolean>;

  // https://bfnightly.bracketproductions.com/chapter_16.html
  protected addWalls(): [Point, boolean, string][] {
    const res: [Point, boolean, string][] = [];
    const map: Record<number, string> = {
      0: 'wall_a_blank',
      1: 'wall_a_n', // n
      2: 'wall_a_s', // s
      3: 'wall_a_ns', // ns
      4: 'wall_a_w', // w
      5: 'wall_a_nw', // nw
      6: 'wall_a_sw', // sw
      7: 'wall_a_nse', // nse
      8: 'wall_a_e', // e
      9: 'wall_a_ne', // ne
      10: 'wall_a_se', // se
      11: 'wall_a_nse', // nse
      12: 'wall_a_ew', // ew
      13: 'wall_a_sew', // ews
      14: 'wall_a_new', // ewn
      15: 'wall_a_nsew' // nsew
    };

    for (const [{ x, y }] of this.walls.entries()) {
      let emptyNeighbor = false;
      let mask = 0b0;

      const neighbors: [number, Point][] = [
        [1, { x, y: y - 1 }],
        [2, { x, y: y + 1 }],
        [4, { x: x - 1, y }],
        [8, { x: x + 1, y }]
      ];

      for (const [plus, { x: x2, y: y2 }] of neighbors) {
        if (this.walls.get({ x: x2, y: y2 })) {
          mask += plus;
        } else {
          emptyNeighbor = true;
        }
      }

      res.push([{ x, y }, true, emptyNeighbor ? map[mask] : T.BLANK]);
    }

    return res;
  }

  protected addEnemies(): void {
    const rooms = this.map.getRooms();
    for (let i = 0; i < 5; i++) {
      const picked = ROT.RNG.getItem(rooms);
      if (picked) {
        const [x, y] = picked.getCenter();
        this.addEnemy({ x, y });
      }
    }
  }

  protected addNPCs(): void {
    // const rooms = this.map.getRooms();
    // const picked = ROT.RNG.getItem(rooms);
    // if (picked) {
    //   const [x, y] = picked.getCenter();
    //   this.items.push({ entity: 'NPC', data: { position: { x, y } } });
    // }
  }

  protected addRooms(): void {
    this.mapData.doors = [];
    this.mapData.rooms = [];

    for (const room of this.map.getRooms()) {
      const [x, y] = room.getCenter();
      const nw = { x: room.getLeft(), y: room.getTop() };
      const se = { x: room.getRight(), y: room.getBottom() };

      if (ROT.RNG.getPercentage() > 75) {
        this.addItem({
          x: ROT.RNG.getUniformInt(nw.x, se.x),
          y: ROT.RNG.getUniformInt(nw.y, se.y)
        });

        // this.items.push({
        //   entity: 'Chest',
        //   data: {
        //     position: {
        //       x: ROT.RNG.getUniformInt(nw.x, se.x),
        //       y: ROT.RNG.getUniformInt(nw.y, se.y)
        //     }
        //   }
        // });
      }

      if (ROT.RNG.getPercentage() > 25) {
        this.addLight({ x, y });
      }

      room.getDoors((x, y) => {
        // otherwise there are a lot of double-doors
        if (ROT.RNG.getPercentage() > 25) {
          this.mapData.doors.push({ x, y });
          this.doors.add(`${x} ${y}`);
        }
      });

      this.mapData.rooms.push({
        ...nw,
        w: se.x - nw.x,
        h: se.y - nw.y
      });
    }
  }

  public generate(): MapGenResult {
    this.map = new ROT.Map.Digger(this.width, this.height, {
      dugPercentage: 0.75
    });

    this.walls = new Array2D({ w: this.width, h: this.height });

    this.map.create((x, y, value) => {
      this.addCell({ x, y }, !!value);
      this.walls.set({ x, y }, !!value);
    });

    for (const [pos, isWall, glyph] of this.addWalls()) {
      if (isWall) {
        // this.addCell(pos, isWall, glyph);
      }
    }
    this.addRooms();

    const rooms = this.map.getRooms();
    const room = rooms.shift();

    if (room) {
      const [x, y] = room.getCenter();
      this.addPlayer({ x, y });
    }

    for (const door of this.doors) {
      const [x, y] = door.split(' ');
      this.items.push({
        entity: 'Door',
        tags: [],
        data: {
          position: { x: +x, y: +y }
        }
      });
    }
    this.addNPCs();
    this.addEnemies();

    return { entities: this.items, map: { doors: [], rooms: [] } };
  }
}

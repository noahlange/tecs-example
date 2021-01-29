import * as ROT from 'rot-js';

import { System } from 'tecs';

import { Cell, Door, Light, Player } from '../entities';
import { HEIGHT, WIDTH } from '../utils';

export class MapGen extends System {
  public static readonly type = 'map';

  protected map!: InstanceType<typeof ROT.Map.Digger>;

  protected addPlayers(): void {
    const rooms = this.map.getRooms();
    const room = rooms.shift();
    if (room) {
      const [x, y] = room.getCenter();
      this.world.create(Player, {
        position: { x, y },
        light: {
          color: [255, 255, 0]
        },
        glyph: {
          text: '@',
          fg: [0, 0, 0]
        }
      });
    }
  }

  protected generateDiggerMap(): void {
    this.map = new ROT.Map.Digger(WIDTH, HEIGHT, { dugPercentage: 0.75 });
    this.map.create((x, y, value) => {
      const isWall = value;
      this.world.create(Cell, {
        position: { x, y },
        collision: { passable: !isWall, allowLOS: !isWall },
        glyph: {
          text: isWall ? '#' : '.',
          fg: [120, 120, 120]
        }
      });
    });

    for (const room of this.map.getRooms()) {
      const [x, y] = room.getCenter();

      if (ROT.RNG.getPercentage() > 50) {
        this.world.create(Light, {
          position: { x, y },
          light: {
            color: [
              ROT.RNG.getUniformInt(50, 200),
              ROT.RNG.getUniformInt(50, 200),
              ROT.RNG.getUniformInt(50, 200)
            ]
          }
        });
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
    this.addPlayers();
  }

  public init(): void {
    this.generateDiggerMap();
  }
}

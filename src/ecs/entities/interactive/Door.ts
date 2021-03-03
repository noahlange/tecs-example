import type { RGBColor } from '@types';
import { Entity } from 'tecs';

import {
  Collision,
  Sprite,
  Interactive,
  Position,
  Renderable
} from '../../components';
import { T } from '@utils';

const openedText = [
  'you have opened the door',
  'you have opened the door...again',
  'you have opened this door for the third time',
  'this is the fourth time you have opened this door',
  '...',
  'six times? seriously, find some other door to abuse.',
  'there exists no reason for you opening and closing this door seven times in a row',
  'LEAVE THE DOOR ALONE I SWEAR TO GOD THERE ARE AT LEAST TWENTY OTHER DOORS IN HERE'
];

const closedText = [
  'you have closed the door',
  'you have closed the door',
  'you have closed the door again',
  'well, congrats, you closed it.',
  'after long and thoughtful consideration you decide to close the door',
  'swear to god if you close this door another time—',
  "OKAY! IT'S CLOSED! ARE YOU HAPPY NOW?!",
  'NO! DOOR CLOSED FOR BUSINESS! DOOR HATES YOU!'
];

export class Door extends Entity.with(
  Sprite,
  Position,
  Interactive,
  Collision,
  Renderable
) {
  public static data = {
    sprite: { key: 'door_01', tint: [60, 30, 20] as RGBColor },
    collision: { passable: false, allowLOS: false }
  };

  public count: number = 0;

  public interact(): void {
    if (this.count >= 8) {
      return;
    }

    const next = !this.$.collision.passable;

    this.$.collision.passable = next;
    this.$.collision.allowLOS = next;

    this.$.sprite.key = next ? 'door_01_open' : 'door_01';

    const value = next ? openedText[this.count] : closedText[this.count];

    // @todo log text
    // this.manager.create(UIMessage, { text: { title: '', value } });
    if (!next && this.count <= 7) {
      this.count++;
    }
  }
}

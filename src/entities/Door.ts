import { Entity } from 'tecs';
import { UIMessage } from '.';

import {
  Collision,
  Glyph,
  Interactive,
  Position,
  Renderable
} from '../components';

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
  Glyph,
  Position,
  Interactive,
  Collision,
  Renderable
) {
  public count: number = 0;

  public interact(): void {
    if (this.count >= 8) {
      return;
    }

    const { $$ } = this;
    const next = !$$.collision.passable;
    $$.collision.passable = next;
    $$.collision.allowLOS = next;
    $$.glyph.text = next ? '/' : '-';

    const value = next ? openedText[this.count] : closedText[this.count];
    this.manager.create(UIMessage, { text: { title: '', value } });
    if (!next && this.count <= 7) {
      this.count++;
    }
  }
}

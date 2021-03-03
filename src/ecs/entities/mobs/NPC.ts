import { Entity } from 'tecs';
import {
  Collision,
  Sprite,
  Position,
  Renderable,
  Text,
  Talk,
  Interactive,
  View,
  Faction,
  Equipped
} from '../../components';
import type { RGBColor } from '@types';
import { T } from '@utils';

export class NPC extends Entity.with(
  Sprite,
  Position,
  Renderable,
  Faction,
  Text,
  Talk,
  Collision,
  Interactive,
  Equipped,
  View
) {
  public static readonly data = {
    text: { title: 'NPC' },
    sprite: { key: T.PLAYER, tint: [255, 0, 0] as RGBColor },
    collision: { allowLOS: true }
  };

  public interact(): void {
    this.$.talk.active = true;
  }
}

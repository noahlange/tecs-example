import type { Faction as FactionType } from '@enums';
import { Component } from 'tecs';

export class Faction extends Component {
  public static readonly type = 'faction';
  public factions: FactionType[] = [];
}

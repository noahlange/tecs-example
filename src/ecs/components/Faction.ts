import { Component } from 'tecs';
import type { Faction as FactionType } from '../../types';

export class Faction extends Component {
  public static readonly type = 'faction';
  public factions: FactionType[] = [];
}

import { Component } from 'tecs';
import { Direction } from '../../types';

export class Position extends Component {
  public static readonly type = 'position';
  public d: Direction = Direction.N;
  public x: number = 0;
  public y: number = 0;
  public z: number = 1;
  public chunkX: number = 0;
  public chunkY: number = 0;
}

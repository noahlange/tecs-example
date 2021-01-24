import { Component } from 'tecs';
import { src } from '../utils';

export class Sprite extends Component {
  public static readonly type = 'sprite';
  public image: string = src;
}

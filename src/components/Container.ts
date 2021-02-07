import { Component } from 'tecs';

export class Container extends Component {
  public static readonly type = 'container';
  public open: boolean = false;
  public locked: boolean = false;
  public items: string[] = [];
}

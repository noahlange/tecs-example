import { Component } from 'tecs';

export class Text extends Component {
  public static readonly type = 'text';
  public title: string = ';';
  public value: string = '';
}

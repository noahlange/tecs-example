import { Component } from 'tecs';

export class Talk extends Component {
  public static readonly type = 'talk';
  public file: string | null = null;
  public start: string | null = null;
  public active: boolean = false;
}

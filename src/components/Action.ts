import { Component } from 'tecs';
import { ID } from '../types';

export class Action extends Component {
  public static readonly type = 'action';
  public action: ID = ID.NONE;
  public subject: string | null = null;
  public target: string | null = null;
}

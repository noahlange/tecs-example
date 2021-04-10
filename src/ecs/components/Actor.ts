import { Component } from 'tecs';
import { Action } from '@utils';
import type { ActionType } from '@utils';

/**
 * An entity capable of performing actions
 */
export class Actor extends Component {
  public static readonly type = 'action';
  public data: ActionType = { id: Action.NONE };
}

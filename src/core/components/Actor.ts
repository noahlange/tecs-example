import type { ActionType } from '@utils';

import { Action } from '@lib/enums';
import { Component } from 'tecs';

/**
 * An entity capable of performing actions
 */
export class Actor extends Component {
  public static readonly type = 'action';
  public data: ActionType = { id: Action.NONE };
}

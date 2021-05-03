import type { Vector2 } from '../../lib/types';

import { AIState, AIType } from '@lib/enums';
import { Component } from 'tecs';

export class AI extends Component {
  public static readonly type = 'ai';

  public type: AIType = AIType.PASSIVE;
  public state: AIState = AIState.IDLE;
  public home?: Vector2;
}

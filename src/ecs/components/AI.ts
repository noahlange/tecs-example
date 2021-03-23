import { Component } from 'tecs';
import type { Vector2 } from '@types';
import { AIState, AIType } from '@enums';

export class AI extends Component {
  public static readonly type = 'ai';

  public type: AIType = AIType.PASSIVE;
  public state: AIState = AIState.IDLE;
  public home?: Vector2;
}

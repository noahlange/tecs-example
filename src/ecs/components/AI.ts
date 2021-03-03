import { Component } from 'tecs';
import type { Point } from '../../types';
import { AIState } from '../../types';
import { AIType } from '../../types';

export class AI extends Component {
  public static readonly type = 'ai';

  public type: AIType = AIType.PASSIVE;
  public state: AIState = AIState.IDLE;
  public home?: Point;
}

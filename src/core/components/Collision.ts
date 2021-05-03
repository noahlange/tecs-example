import { Collision as Collisions } from '@lib/enums';
import { isObstacle, isObstruction } from '@utils';
import { Component } from 'tecs';

export class Collision extends Component {
  public static readonly type = 'collision';

  // can this be moved through?
  public get isObstacle(): boolean {
    return isObstacle(this.value);
  }

  public set isObstacle(value: boolean) {
    this.value = value
      ? this.value | Collisions.OBSTACLE
      : this.value & Collisions.OBSTACLE;
  }

  // can this be seen through?
  public get isObstruction(): boolean {
    return isObstruction(this.value);
  }

  public set isObstruction(value: boolean) {
    this.value = value
      ? this.value | Collisions.OBSTRUCTION
      : this.value & Collisions.OBSTRUCTION;
  }

  public value: number = Collisions.NONE;
}

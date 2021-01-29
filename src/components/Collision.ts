import { Component } from 'tecs';

export class Collision extends Component {
  public static readonly type = 'collision';
  // can this be moved through?
  public passable: boolean = false;
  // can this be seen through?
  public allowLOS: boolean = false;
}

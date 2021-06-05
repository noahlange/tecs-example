import { Component } from 'tecs';

interface UsableData {
  duration: number;
}

export class Usable extends Component {
  public static readonly type = 'use';

  public duration: number = 0;

  protected current: number = 0;
  protected toggle: boolean = false;

  public set active(value: boolean) {
    this.current = 0;
    this.toggle = value;
  }

  public get active(): boolean {
    return this.toggle;
  }

  public tick(): void {
    if (this.toggle) {
      this.current += 1;
      if (this.current >= this.duration) {
        this.toggle = false;
        this.current = 0;
      }
    }
  }

  public toJSON(): UsableData {
    return {
      duration: this.duration
    };
  }
}

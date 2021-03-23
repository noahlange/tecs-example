export class HealthBar {
  protected static a = 'bar_00_0';
  protected static b = 'bar_01_1';
  protected static c = 'bar_01_2';
  protected static d = 'bar_01_3';
  protected static e = 'bar_01_4';

  public max: number;
  public value: number;
  public sprites: string[] = [];

  protected calculate(): void {
    const pct = this.value / this.max;
    const bars = Math.round(Math.log(this.max)) - 2;
    const live = Math.floor(pct * bars);
    const part = pct * bars - live;
    const dead = bars - live - Math.ceil(part);

    const res = [];
    for (let i = 0; i < live; i++) {
      res.push(HealthBar.e);
    }

    switch (true) {
      case part > 0.75:
        res.push(HealthBar.e);
        break;
      case part > 0.5:
        res.push(HealthBar.d);
        break;
      case part > 0.25:
        res.push(HealthBar.c);
        break;
      case part > 0:
        res.push(HealthBar.b);
        break;
    }

    for (let i = 0; i < dead; i++) {
      res.push(HealthBar.a);
    }

    this.sprites = res;
  }

  public constructor(max: number) {
    this.max = this.value = max;
    this.calculate();
  }
}

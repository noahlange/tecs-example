import seedrandom from 'seedrandom';

export class Seeder {
  public static get seed(): string {
    return this.seeder?.seed;
  }

  public static unset(seed: string): void {
    if (seed in this.states) {
      delete this.states[seed];
    }
  }

  public static set(seed: string): void {
    // if we have an active seeder, store the current state.
    if (this.seeder) {
      this.seeder.save();
    }
    const state = this.states[seed] ?? true;
    // set the global seeder
    this.seeder = new Seeder(seed, { state });
    // ...overwrite global RNG behavior
    Math.random = () => this.seeder.random();
  }

  protected static seeder: Seeder;
  protected static states: Record<string, seedrandom.State> = {};

  protected seeder: ReturnType<typeof seedrandom>;
  protected seed: string;

  protected save(): void {
    Seeder.states[this.seed] = this.seeder.state();
  }

  public random(): number {
    return this.seeder.quick();
  }

  public constructor(seed: string, state?: seedrandom.State) {
    this.seed = seed;
    this.seeder = seedrandom(seed, { state });
  }
}

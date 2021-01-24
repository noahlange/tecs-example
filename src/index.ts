import { World } from 'tecs';

import { Item } from './entities/Item';
import { Renderer } from './systems/Renderer';
import { Movement } from './systems/Movement';

export class MyWorld extends World.with(Renderer, Movement) {
  public init(): void {
    for (let i = 0; i < 10; i++) {
      this.entities.create(Item);
    }
  }
}

const world = new MyWorld();
world.start();

import { Manager } from '@lib';
import { _ } from '@utils';
import pako from 'pako';

export class SaveManager extends Manager {
  public toSave(): Uint8Array {
    const save: Record<string, any> = {};
    const ecs = this.game.ecs.save();
    for (const [key, value] of _.entries(this.game.$)) {
      if (value.toJSON) {
        save[key] = value.toJSON();
      }
    }

    ecs.entities = ecs.entities.slice(0, 2000);
    return pako.deflate(JSON.stringify({ ecs }));
  }

  public init(): void {
    // window.save = () => {
    //   console.log(this.toSave());
    // };
  }
}

import { Manager } from '@lib';
import { _ } from '@utils';
import pako from 'pako';

export class SaveManager extends Manager {
  public toSave(): Uint8Array {
    const save: Record<string, any> = {};
    const ecs = this.game.ctx.save();
    for (const [key, value] of _.entries(this.game.$)) {
      if (value.toJSON) {
        save[key] = value.toJSON();
      }
    }

    return pako.deflate(JSON.stringify({ ecs }));
  }

  public async start(): Promise<void> {
    // window.save = () => {
    //   console.log(this.toSave());
    // };
  }
}

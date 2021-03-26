import type { JSX } from 'preact';
import type { Player } from '@ecs/entities';

import type { GameState } from '@enums';
import { h } from 'preact';
import type { Area } from '@lib';
import { toChunkPosition } from '@utils';

interface GameplayUIProps {
  player: Player;
  area: Area;
  state: GameState;
}

export function GameplayUI(props: GameplayUIProps): JSX.Element {
  const { position } = props.player.$;
  const [chunk, pos] = toChunkPosition(position);

  return (
    <div className="ui hud">
      <div className="hp">
        <p>
          Chunk: {chunk.x}, {chunk.y}
          <br />
          Pos: {pos.x}, {pos.y}
        </p>
        <p>
          Pos: {position.x}, {position.y}
        </p>
      </div>
      <div class="actions">
        <ul>
          <li>
            <button className="border">1</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

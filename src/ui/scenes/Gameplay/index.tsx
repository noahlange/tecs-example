import type { Player } from '@core/entities';
import type { WorldMap } from '@core/maps';
import type { GameState } from '@lib/enums';
import type { JSX } from 'preact';

import './gameplay.scss';

import { toChunkPosition } from '@utils/geometry';
import { h } from 'preact';

interface GameplayUIProps {
  player: Player;
  area: WorldMap;
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

import type { JSX } from 'preact';
import type { Player } from '@ecs/entities';
import type { GameMessage } from '@types';

import type { GameState } from '@enums';
import { h } from 'preact';
import type { Chunk } from '@lib';

interface GameplayUIProps {
  player: Player;
  log: GameMessage[];
  chunk: Chunk;
  state: GameState;
}

export function GameplayUI(props: GameplayUIProps): JSX.Element {
  const { position } = props.player.$;
  return (
    <div className="ui hud">
      <div className="hp">
        <p>
          Chunk: {props.chunk.x}, {props.chunk.y}
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
      <div className="log">
        <ul>
          {props.log.slice(-3).map(({ text }, i) => (
            <li className={`log-item`} key={i}>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

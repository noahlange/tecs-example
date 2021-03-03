import type { JSX } from 'preact';
import type { Player } from '@ecs/entities';

import { h } from 'preact';

import './styles.scss';
import type { GameMessage } from '@types';
import { GameState } from '@utils/enums';

interface GameplayUIProps {
  player: Player;
  log: GameMessage[];
  state: GameState;
}

export function GameplayUI(props: GameplayUIProps): JSX.Element {
  const { stats } = props.player.$;
  return (
    <div className="ui hud">
      <div>{props.state === GameState.PAUSED ? 'Paused' : ''}</div>
      <div>
        HP {stats.health.value}/{stats.health.max}
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
          {props.log.slice(-5).map(({ text }, i) => (
            <li key={i}>{text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import type { JSX } from 'preact';
import type { Player } from '@ecs/entities';

import { h } from 'preact';

import './styles.scss';
import type { GameMessage } from '@types';

interface GameplayUIProps {
  player: Player;
  log: GameMessage[];
}

export function GameplayUI(props: GameplayUIProps): JSX.Element {
  return (
    <div className="ui hud">
      <div>
        HP {props.player.$.stats.hp}/{props.player.$.stats.hpMax}
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

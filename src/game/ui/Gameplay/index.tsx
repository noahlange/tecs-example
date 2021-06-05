import type { Player } from '@game/entities';
import type { GameState } from '@lib/enums';
import type { JSX } from 'preact';

import './gameplay.scss';

import { GameContext } from '@ui/components/GameContext';
import { h } from 'preact';

interface GameplayUIProps {}

export function GameplayUI(props: GameplayUIProps): JSX.Element {
  return (
    <GameContext.Consumer>
      {ecs => {
        return (
          <div className="ui hud">
            <div className="hp">
              {/* <progress
          value={player.$.stats.health.value - 20}
          max={player.$.stats.health.max}
        /> */}
            </div>
            <div class="actions">
              <ul>
                <li>{/* <button className="border">1</button> */}</li>
              </ul>
            </div>
          </div>
        );
      }}
    </GameContext.Consumer>
  );
}

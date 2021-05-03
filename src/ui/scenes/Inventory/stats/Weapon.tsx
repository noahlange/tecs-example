import type { Equipment } from '@core/entities';
import type { JSX } from 'preact';

import { DamageType } from '@lib/enums';
import { h } from 'preact';

interface WeaponStatsProps {
  item: InstanceType<typeof Equipment>;
}

const damageTypeNames = {
  [DamageType.BLUNT]: 'Blunt',
  [DamageType.ENERGY]: 'Energy',
  [DamageType.SHARP]: 'Sharp',
  [DamageType.ARCANE]: 'Arcane'
};

export function WeaponStats(props: WeaponStatsProps): JSX.Element {
  return (
    <table>
      <tbody>
        {props.item.$.equip.damage.map((damage, i) => {
          return (
            <tr key={i}>
              <th>Damage</th>
              <td>
                {damage.value}&nbsp;
                {damageTypeNames[damage.type]}
              </td>
            </tr>
          );
        })}
        <tr>
          <th>Value</th>
          <td>{props.item.$.item.value}</td>
        </tr>
      </tbody>
    </table>
  );
}

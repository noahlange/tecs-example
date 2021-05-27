import type { Item, Text } from '@core/components';
import type { Equipment } from '@core/entities';
import type { InventoryItem } from '@core/entities/types';
import type { JSX } from 'preact';
import type { EntityType } from 'tecs';

import './inventory.scss';

import { ItemType } from '@lib/enums';
import { h } from 'preact';

import armor from '../../../../static/sprites/ui/btn-armor.png';
import items from '../../../../static/sprites/ui/btn-items.png';
import magic from '../../../../static/sprites/ui/btn-magic.png';
import misc from '../../../../static/sprites/ui/btn-misc.png';
import potions from '../../../../static/sprites/ui/btn-potions.png';
import weapons from '../../../../static/sprites/ui/btn-weapons.png';
import ShowIf from '../../components/ShowIf';
import { WeaponStats } from './stats/Weapon';

interface InventoryProps {
  items: InventoryItem[];
  index: number;
  type: ItemType | null;
  selected: EntityType<[typeof Item, typeof Text]> | null;
}

const buttons = [
  { type: null, icon: items, title: 'All Items' },
  { type: ItemType.WEAPON, icon: weapons, title: 'Weapons' },
  { type: ItemType.ARMOR, icon: armor, title: 'Armor' },
  { type: ItemType.CONSUMABLE, icon: potions, title: 'Consumables' },
  { type: ItemType.MAGIC, icon: magic, title: 'Magic' },
  { type: ItemType.MISC, icon: misc, title: 'Misc' }
];

export function InventoryUI(props: InventoryProps): JSX.Element {
  const title = buttons.find(item => item.type === props.type)?.title ?? '';

  return (
    <div className="inventory">
      <div className="item-list">
        <nav>
          {buttons.map(button => {
            const className = props.type === button.type ? 'selected' : '';
            return (
              <button key={button.type} className={className}>
                <img src={button.icon} />
              </button>
            );
          })}
        </nav>
        <div>
          <ul>
            {props.items.map(item => {
              const { $, id } = item;
              const className = item === props.selected ? 'selected' : '';
              const color = item.$.equip?.isEquipped ? 'red' : 'initial';
              return (
                <li key={id} className={`item ${className}`}>
                  <span style={{ color: color }}>{$.text.title}</span>
                  <span>{$.item.count}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="item-divider"></div>
      <div className="item-panel">
        <div className="item-type">{title}</div>
        <ShowIf value={props.selected}>
          {selected => (
            <div className="item-info">
              <div className="item-title">
                <h2>{selected.$.text.title}</h2>
              </div>
              <ShowIf value={selected.$.item.type === ItemType.WEAPON}>
                {() => (
                  <WeaponStats
                    item={selected as InstanceType<typeof Equipment>}
                  />
                )}
              </ShowIf>
              <div className="item-description">
                {selected.$.item.description}
              </div>
            </div>
          )}
        </ShowIf>
      </div>
    </div>
  );
}

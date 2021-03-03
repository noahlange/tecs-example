import type { JSX } from 'preact';
import type { InventoryItem } from '@ecs/entities/types';
import type { EntityType } from 'tecs';
import type { Item, Text } from '@ecs/components';

import { ItemType } from '@types';
import { h } from 'preact';

import items from 'url:../../../assets/ui/btn-items.png';
import weapons from 'url:../../../assets/ui/btn-weapons.png';
import armor from 'url:../../../assets/ui/btn-armor.png';
import potions from 'url:../../../assets/ui/btn-potions.png';
import magic from 'url:../../../assets/ui/btn-magic.png';
import misc from 'url:../../../assets/ui/btn-misc.png';

import './styles.scss';

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
            return (
              <button
                key={button.type}
                className={props.type === button.type ? 'selected' : ''}
              >
                <img src={button.icon} />
              </button>
            );
          })}
        </nav>
        <div>
          <ul>
            {props.items.map(({ id, $ }, i) => {
              const isSelected = i === props.index;
              return (
                <li className={`item ${isSelected ? 'selected' : ''}`} key={id}>
                  <span>{$.text.title}</span>
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
        <div className="item-info">
          <div className="item-title">
            <h2>{props.selected?.$.text.title}</h2>
          </div>
          <div className="item-description">
            {props.selected?.$.item.description}
          </div>
        </div>
      </div>
    </div>
  );
}
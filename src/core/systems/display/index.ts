import { sequence } from 'tecs';

import { AnimationSystem } from './AnimationSystem';
import { CameraSystem } from './CameraSystem';
import { LightingSystem } from './LightingSystem';
import { RenderSystem } from './RenderSystem';
import { ViewSystem } from './ViewSystem';

export default sequence(
  AnimationSystem,
  CameraSystem,
  ViewSystem,
  LightingSystem,
  RenderSystem
);

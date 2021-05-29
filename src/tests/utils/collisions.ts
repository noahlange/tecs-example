import { describe, expect, test } from '@jest/globals';
import { Collision } from '@lib/enums';
import { isObstacle, isObstruction } from '@utils';

describe('isObstacle()', () => {
  test('"complete" and "obstacle" are obstacles', () => {
    expect(isObstacle(Collision.COMPLETE)).toBeTruthy();
    expect(isObstacle(Collision.OBSTACLE)).toBeTruthy();
  });
  test('"obstruction" and "none" are not', () => {
    expect(isObstacle(Collision.NONE)).toBeFalsy();
    expect(isObstacle(Collision.OBSTRUCTION)).toBeFalsy();
  });
});

describe('isObstruction()', () => {
  test('"complete" and "obstruction" are obstructions', () => {
    expect(isObstruction(Collision.COMPLETE)).toBeTruthy();
    expect(isObstruction(Collision.OBSTRUCTION)).toBeTruthy();
  });
  test('"obstacle" and "none" are not', () => {
    expect(isObstruction(Collision.NONE)).toBeFalsy();
    expect(isObstruction(Collision.OBSTACLE)).toBeFalsy();
  });
});

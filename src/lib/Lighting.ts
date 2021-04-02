/**
 * Effectively a copy-paste of rot.js's lighting code with Array2D and a swapped FOV implementation using malwoden.
 * https://github.com/ondras/rot.js/blob/master/src/lighting.ts
 * https://github.com/Aedalus/malwoden
 */

import type { Vector2, Size, Color } from '@types';
import type { FOV } from 'malwoden';
import { Vector2Array } from './Vector2Array';

import { AMBIENT_LIGHT } from '@utils';
import { add } from '@utils/colors';

interface ReflectivityCallback {
  (point: Vector2): number;
}

interface LightingOptions {
  width: number;
  height: number;
  fov: FOV.PreciseShadowcasting;
  passes?: number;
  emissionThreshold?: number;
  range?: number;
}

/**
 * Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 */
export class Lighting {
  protected reflectivityCallback: ReflectivityCallback;
  protected options: {
    passes: number;
    emissionThreshold: number;
    range: number;
  };

  protected cache: {
    reflectivity: Vector2Array<number>;
    fov: Vector2Array<Vector2Array<number>>;
  };

  protected lights: Vector2Array<Color>;
  protected fov!: FOV.PreciseShadowcasting;
  protected size: Size;

  /**
   * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
   */
  protected reset(): this {
    this.cache = {
      fov: new Vector2Array(this.size),
      reflectivity: new Vector2Array(this.size)
    };
    return this;
  }
  /**
   * Compute the lighting
   */
  public *compute(): IterableIterator<[Vector2, Color]> {
    const done = new Vector2Array<number>(this.size);
    const lit = new Vector2Array<Color>(this.size);
    let emitting = new Vector2Array<Color>(this.size);

    for (const [key, light] of this.lights.entries()) {
      /* prepare emitters for first pass */
      emitting.set(
        key,
        add(emitting.get(key) ?? { r: 0, g: 0, b: 0, a: 1 }, light)
      );
    }
    for (let i = 0; i < this.options.passes; i++) {
      /* main loop */
      this.emitLight(emitting, lit, done);
      if (i === this.options.passes - 1) {
        continue;
      } /* not for the last pass */
      emitting = this._computeEmitters(lit, done);
    }
    for (const [point, light] of lit.entries()) {
      /* let the user know what and how is lit */
      yield [
        point,
        {
          r: Math.max(Math.min(255, light.r), AMBIENT_LIGHT.r),
          g: Math.max(Math.min(255, light.g), AMBIENT_LIGHT.g),
          b: Math.max(Math.min(255, light.b), AMBIENT_LIGHT.b),
          a: 1
        }
      ];
    }
    return this;
  }
  /**
   * Compute one iteration from all emitting cells
   * @param emittingCells These emit light
   * @param lit Add projected light to these
   * @param done These already emitted, forbid them from further calculations
   */
  protected emitLight(
    emitting: Vector2Array<Color>,
    lit: Vector2Array<Color>,
    done: Vector2Array<number>
  ): this {
    for (const [point, light] of emitting.entries()) {
      const fov = this.cache.fov.get(point) ?? this._updateFOV(point);
      this.cache.fov.set(point, fov);
      for (const [key, formFactor] of fov.entries()) {
        const res = lit.get(key) ?? { r: 0, g: 0, b: 0, a: 1 };
        res.r += Math.round(light.r * formFactor);
        res.g += Math.round(light.g * formFactor);
        res.b += Math.round(light.b * formFactor);
        res.a += Math.round(light.a * formFactor);
        lit.set(key, res);
      }
      done.set(point, 1);
    }
    return this;
  }
  /**
   * Prepare a list of emitters for next pass
   */
  protected _computeEmitters(
    lit: Vector2Array<Color>,
    done: Vector2Array<number>
  ): Vector2Array<Color> {
    const res = new Vector2Array<Color>(this.size);

    for (const [point, color] of lit.entries()) {
      if (done.get(point)) {
        // already emitted
        continue;
      }

      const reflectivity =
        this.cache.reflectivity.get(point) ?? this.reflectivityCallback(point);

      this.cache.reflectivity.set(point, reflectivity);

      // will not reflect at all
      if (!reflectivity) {
        continue;
      }

      // compute emission color
      const emission: Color = { r: 0, g: 0, b: 0, a: 1 };
      let intensity = 0;
      for (const part of ['r', 'g', 'b', 'a'] as (keyof Color)[]) {
        intensity += emission[part] = Math.round(color[part] * reflectivity);
      }
      if (intensity > this.options.emissionThreshold) {
        res.set(point, emission);
      }
    }

    return res;
  }

  /**
   * Compute FOV ("form factor") for a potential light source at [x,y]
   */
  protected _updateFOV(point: Vector2): Vector2Array<number> {
    const cache = new Vector2Array<number>(this.size);
    const range = this.options.range;
    this.fov.calculateCallback(point, range, (point, r, vis) => {
      const formFactor = vis * (1 - r / range) || 0;
      if (formFactor === 0) {
        return;
      }
      cache.set(point, formFactor);
    });

    this.cache.fov.set(point, cache);
    return cache;
  }

  /**
   * Adjust options at runtime
   */
  public setOptions(options: Partial<LightingOptions>): this {
    Object.assign(this.options, options);
    if (options?.range) {
      this.reset();
    }
    return this;
  }

  /**
   * Set (or remove) a light source
   */
  public setLight({ x, y }: Vector2, color: Color): this {
    if (color) {
      this.lights.set({ x, y }, color);
    } else {
      this.lights.delete({ x, y });
    }
    return this;
  }

  /**
   * Remove all light sources
   */
  public clearLights(): void {
    this.lights = new Vector2Array(this.size);
  }

  public constructor(
    options: LightingOptions,
    reflectivityCallback: ReflectivityCallback
  ) {
    const { width, height, ...rest } = options;
    const size = (this.size = { width, height });

    this.cache = {
      fov: new Vector2Array(size),
      reflectivity: new Vector2Array(size)
    };
    this.reflectivityCallback = reflectivityCallback;
    this.options = Object.assign(
      {
        passes: 1,
        emissionThreshold: 100,
        range: 10
      },
      rest
    );

    this.fov = options.fov;
    this.lights = new Vector2Array(size);
    this.setOptions(options);
  }
}

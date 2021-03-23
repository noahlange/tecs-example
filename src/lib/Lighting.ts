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
  (x: Vector2): number;
}

interface LightingCallback {
  (point: Vector2, color: Color): void;
}

interface LightingOptions {
  passes: number;
  emissionThreshold: number;
  range: number;
}

/**
 * Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 */
export class Lighting {
  protected _reflectivityCallback: ReflectivityCallback;
  protected _options: LightingOptions;

  protected _lights: Vector2Array<Color>;
  protected _fovCache: Vector2Array<Vector2Array<number>>;

  protected _reflectivityCache: Vector2Array<number>;
  protected _fov!: FOV.PreciseShadowcasting;
  protected _size: Size;

  /**
   * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
   */
  protected reset(): this {
    this._reflectivityCache = new Vector2Array(this._size);
    this._fovCache = new Vector2Array(this._size);
    return this;
  }
  /**
   * Compute the lighting
   */
  public compute(lightingCallback: LightingCallback): this {
    const done = new Vector2Array<number>(this._size);
    const lit = new Vector2Array<Color>(this._size);
    let emitting = new Vector2Array<Color>(this._size);

    for (const [key, light] of this._lights.entries()) {
      /* prepare emitters for first pass */
      emitting.set(
        key,
        add(emitting.get(key) ?? { r: 0, g: 0, b: 0, a: 1 }, light)
      );
    }
    for (let i = 0; i < this._options.passes; i++) {
      /* main loop */
      this._emitLight(emitting, lit, done);
      if (i === this._options.passes - 1) {
        continue;
      } /* not for the last pass */
      emitting = this._computeEmitters(lit, done);
    }
    for (const [point, light] of lit.entries()) {
      /* let the user know what and how is lit */
      lightingCallback(point, {
        r: Math.max(light.r, AMBIENT_LIGHT.r),
        g: Math.max(light.g, AMBIENT_LIGHT.g),
        b: Math.max(light.b, AMBIENT_LIGHT.b),
        a: 1
      });
    }
    return this;
  }
  /**
   * Compute one iteration from all emitting cells
   * @param emittingCells These emit light
   * @param lit Add projected light to these
   * @param done These already emitted, forbid them from further calculations
   */
  protected _emitLight(
    emitting: Vector2Array<Color>,
    lit: Vector2Array<Color>,
    done: Vector2Array<number>
  ): this {
    for (const [point, light] of emitting.entries()) {
      this._emitLightFromCell(point, light, lit);
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
    const res = new Vector2Array<Color>(this._size);

    for (const [point, color] of lit.entries()) {
      if (done.get(point)) {
        continue;
      } /* already emitted */

      const reflectivity =
        this._reflectivityCache.get(point) ?? this._reflectivityCallback(point);
      this._reflectivityCache.set(point, reflectivity);

      if (reflectivity == 0) {
        continue;
      } /* will not reflect at all */
      /* compute emission color */
      const emission: Color = { r: 0, g: 0, b: 0, a: 1 };
      let intensity = 0;
      for (const component of ['r', 'g', 'b', 'a'] as (keyof Color)[]) {
        const part = Math.round(color[component] * reflectivity);
        emission[component] = part;
        intensity += part;
      }
      if (intensity > this._options.emissionThreshold) {
        res.set(point, emission);
      }
    }

    return res;
  }

  /**
   * Compute one iteration from one cell
   */
  protected _emitLightFromCell(
    point: Vector2,
    color: Color,
    lit: Vector2Array<Color>
  ): this {
    const fov = this._fovCache.get(point) ?? this._updateFOV(point);
    this._fovCache.set(point, fov);
    for (const [key, formFactor] of fov.entries()) {
      const result = lit.get(key) ?? { r: 0, g: 0, b: 0, a: 1 };
      result.r += Math.round(color.r * formFactor);
      result.g += Math.round(color.g * formFactor);
      result.b += Math.round(color.b * formFactor);
      result.a += Math.round(color.a * formFactor);
      lit.set(key, result);
    }
    return this;
  }

  /**
   * Compute FOV ("form factor") for a potential light source at [x,y]
   */
  protected _updateFOV(point: Vector2): Vector2Array<number> {
    const cache = new Vector2Array<number>(this._size);
    const range = this._options.range;

    this._fov.calculateCallback(point, range, (point, r, vis) => {
      const formFactor = vis * (1 - r / range) || 0;
      if (formFactor === 0) {
        return;
      }
      cache.set(point, formFactor);
    });

    this._fovCache.set(point, cache);
    return cache;
  }

  /**
   * Adjust options at runtime
   */
  public setOptions(options: Partial<LightingOptions>): this {
    Object.assign(this._options, options);
    if (options?.range) {
      this.reset();
    }
    return this;
  }

  /**
   * Set the used Field-Of-View algo
   */
  public setFOV(fov: FOV.PreciseShadowcasting): this {
    this._fov = fov;
    this._fovCache = new Vector2Array(this._size);
    return this;
  }

  /**
   * Set (or remove) a light source
   */
  public setLight({ x, y }: Vector2, color: Color): this {
    if (color) {
      this._lights.set({ x, y }, color);
    } else {
      this._lights.delete({ x, y });
    }
    return this;
  }

  /**
   * Remove all light sources
   */
  public clearLights(): void {
    this._lights = new Vector2Array(this._size);
  }

  public constructor(
    size: Size,
    reflectivityCallback: ReflectivityCallback,
    options: Partial<LightingOptions> = {}
  ) {
    this._size = size;
    this._reflectivityCallback = reflectivityCallback;
    this._options = Object.assign(
      {
        passes: 1,
        emissionThreshold: 100,
        range: 10
      },
      options
    );

    this._lights = new Vector2Array(size);
    this._fovCache = new Vector2Array(size);
    this._reflectivityCache = new Vector2Array(size);
    this.setOptions(options);
  }
}

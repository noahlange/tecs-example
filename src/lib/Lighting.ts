/**
 * Effectively a copy-paste of rot.js's lighting code with Array2D.
 * https://github.com/ondras/rot.js/blob/master/src/lighting.ts
 */

import type { Point, RGBColor, Size } from '@types';
import type { FOV } from 'malwoden';
import { Array2D } from './Array2D';

import * as Color from 'rot-js/lib/color';

interface ReflectivityCallback {
  (x: Point): number;
}

interface LightingCallback {
  (point: Point, color: RGBColor): void;
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

  protected _lights: Array2D<RGBColor>;
  protected _fovCache: Array2D<Array2D<number>>;

  protected _reflectivityCache: Array2D<number>;
  protected _fov!: FOV.PreciseShadowcasting;
  protected _size: Size;

  /**
   * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
   */
  protected reset(): this {
    this._reflectivityCache = new Array2D(this._size);
    this._fovCache = new Array2D(this._size);
    return this;
  }
  /**
   * Compute the lighting
   */
  public compute(lightingCallback: LightingCallback): this {
    const done = new Array2D<number>(this._size);
    const lit = new Array2D<RGBColor>(this._size);
    let emitting = new Array2D<RGBColor>(this._size);

    for (const [key, light] of this._lights.entries()) {
      /* prepare emitters for first pass */
      emitting.set(key, [0, 0, 0]);
      Color.add_(emitting.get(key), light);
    }
    for (let i = 0; i < this._options.passes; i++) {
      /* main loop */
      this._emitLight(emitting, lit, done);
      if (i + 1 == this._options.passes) {
        continue;
      } /* not for the last pass */
      emitting = this._computeEmitters(lit, done);
    }
    for (const [point, light] of lit.entries()) {
      /* let the user know what and how is lit */
      lightingCallback(point, light);
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
    emitting: Array2D<RGBColor>,
    lit: Array2D<RGBColor>,
    done: Array2D<number>
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
    lit: Array2D<RGBColor>,
    done: Array2D<number>
  ): Array2D<RGBColor> {
    const res = new Array2D<RGBColor>(this._size);

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
      const emission: RGBColor = [0, 0, 0];
      let intensity = 0;
      for (let i = 0; i < 3; i++) {
        const part = Math.round(color[i] * reflectivity);
        emission[i] = part;
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
    point: Point,
    color: RGBColor,
    lit: Array2D<RGBColor>
  ): this {
    const fov = this._fovCache.get(point) ?? this._updateFOV(point);
    this._fovCache.set(point, fov);

    for (const [key, formFactor] of fov.entries()) {
      const result = lit.get(key) ?? [0, 0, 0];
      lit.set(key, result);

      for (let i = 0; i < 3; i++) {
        result[i] += Math.round(color[i] * formFactor);
      } /* add light color */
    }
    return this;
  }

  /**
   * Compute FOV ("form factor") for a potential light source at [x,y]
   */
  protected _updateFOV(point: Point): Array2D<number> {
    const cache = new Array2D<number>(this._size);
    const range = this._options.range;

    this._fov.calculateCallback(point, range, (point, r, vis) => {
      const formFactor = vis * (1 - r / range);
      if (formFactor == 0) {
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
    this._fovCache = new Array2D(this._size);
    return this;
  }

  /**
   * Set (or remove) a light source
   */
  public setLight({ x, y }: Point, color: RGBColor): this {
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
    this._lights = new Array2D(this._size);
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

    this._lights = new Array2D(size);
    this._fovCache = new Array2D(size);
    this._reflectivityCache = new Array2D(size);
    this.setOptions(options);
  }
}

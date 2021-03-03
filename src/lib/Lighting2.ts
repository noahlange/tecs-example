import type { Point, RGBColor, Size } from '@types';
import type { FOV } from 'malwoden';

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

function toUint16(value: number): number {
  return Math.min(Math.trunc(value), 0xfffff);
}

/**
 * Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 */
export class Lighting {
  protected _reflectivityCallback: ReflectivityCallback;
  protected _options: LightingOptions;

  protected _lights: Map<number, Uint8ClampedArray>;
  protected _fovCache: Uint16Array[];

  protected _reflectivityCache: number[];
  protected _fov!: FOV.PreciseShadowcasting;
  protected _size: Size;
  protected _length: number;
  protected _indices: Set<number> = new Set();

  protected getPoint(index: number): Point {
    const x = Math.floor(index / this._size.h);
    return { x, y: index - x * this._size.h };
  }

  protected getIndex(point: Point): number {
    return point.x * this._size.h + point.y;
  }
  /**
   * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
   */
  protected reset(): this {
    this._reflectivityCache = [];
    this._fovCache = [];
    return this;
  }
  /**
   * Compute the lighting
   */
  public compute(lightingCallback: LightingCallback): this {
    const done = new Uint8ClampedArray(this._length);
    const lit: RGBColor[] = [];
    let emitting: RGBColor[] = [];

    for (const [key, light] of this._lights.entries()) {
      /* prepare emitters for first pass */
      if (light) {
        const value: RGBColor = [0, 0, 0];
        Color.add_(value, Array.from(light.values()) as RGBColor);
        emitting[key] = value;
      }
    }
    for (let i = 0; i < this._options.passes; i++) {
      /* main loop */
      this._emitLight(emitting, lit, done);
      if (i + 1 == this._options.passes) {
        continue;
      } /* not for the last pass */
      emitting = this._computeEmitters(lit, done);
    }
    for (const [index, light] of lit.entries()) {
      /* let the user know what and how is lit */
      lightingCallback(this.getPoint(index), light);
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
    emitting: RGBColor[],
    lit: RGBColor[],
    done: Uint8ClampedArray
  ): this {
    for (const [key, light] of Object.entries(emitting)) {
      if (light) {
        const index = +key;
        this._emitLightFromCell(index, light, lit);
        done[index] = 1;
      }
    }
    return this;
  }
  /**
   * Prepare a list of emitters for next pass
   */
  protected _computeEmitters(
    lit: RGBColor[],
    done: Uint8ClampedArray
  ): RGBColor[] {
    const res: RGBColor[] = [];

    for (const [index, color] of lit.entries()) {
      if (!color || done[index]) {
        continue;
      } /* already emitted */

      const reflectivity = (this._reflectivityCache[
        index
      ] ??= this._reflectivityCallback(this.getPoint(index)));

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
        res[index] = emission.map(i => Math.min(0xfff, i)) as RGBColor;
      }
    }

    return res;
  }

  /**
   * Compute one iteration from one cell
   */
  protected _emitLightFromCell(
    index: number,
    color: RGBColor,
    lit: RGBColor[]
  ): this {
    const fov = (this._fovCache[index] ??= this._updateFOV(index));
    for (const index of this._indices) {
      const formFactor = fov[index];
      if (formFactor) {
        const result = (lit[index] ??= [0, 0, 0]);
        for (let i = 0; i < 3; i++) {
          result[i] += color[i] * (formFactor / 1000);
        } /* add light color */
      }
    }
    return this;
  }

  /**
   * Compute FOV ("form factor") for a potential light source at [x,y]
   */
  protected _updateFOV(index: number): Uint16Array {
    const cache = new Uint16Array(this._length);
    const range = this._options.range;

    this._fov.calculateCallback(
      this.getPoint(index),
      range,
      (point, r, vis) => {
        const i = this.getIndex(point);
        const formFactor = toUint16(vis * (1 - r / range) * 1000);
        cache[i] = toUint16(formFactor);
        if (formFactor) {
          this._indices.add(i);
        }
      }
    );

    this._fovCache[index] = cache;
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
    this._fovCache = [];
    return this;
  }

  /**
   * Set (or remove) a light source
   */
  public setLight(point: Point, color: RGBColor): this {
    const i = this.getIndex(point);
    if (color) {
      this._lights.set(i, new Uint8ClampedArray(color));
    } else {
      this._lights.delete(i);
    }
    return this;
  }

  /**
   * Remove all light sources
   */
  public clearLights(): void {
    this._lights = new Map();
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
        emissionThreshold: 75,
        range: 10
      },
      options
    );

    this._length = size.h * size.w;
    this._lights = new Map();
    this._fovCache = [];
    this._reflectivityCache = [];
    this.setOptions(options);
  }
}

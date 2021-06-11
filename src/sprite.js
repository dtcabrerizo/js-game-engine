'use strict'

/**
 * Main sprite class
 */
export class Sprite {
  /**
   * @param {Array<Object>} config Sprite configuration
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Load sprite from URL
   * @param {String} src Sprite path
   * @returns {Promise} Sprite loaded
   */
  load(src) {
    return new Promise(
      (resolve, reject) => {
        this.img = new Image();
        this.img.addEventListener('load', resolve, false);
        this.img.addEventListener('error', () => reject(new Error(`Sprite image could not be loaded`)), false);
        this.img.src = src;
      }
    )
  }

  /**
   * Draws sprite to a context
   * @param {CanvasRenderingContext2D} ctx Context to place the image
   * @param {String} spriteId Id of the sprite portion
   * @param {Number} x X coordinates to place the image relative to the context
   * @param {Number} y Y coordinates to place the image relative to the context
   * @param {Number} rotation Rotation in radians from the center
   * @param {Array<Number>} scale [x,y] scale to be applied
   * @param {Number} opacity Alpha opacity applied to the image
   * @returns {CanvasRenderingContext2D} Context where the image were drawn
   * @throws {Error} SpriteId not found
   */
  draw(ctx, spriteId, x, y, rotation = 0, scale = [1, 1], opacity = 1) {
    const sprite = this.config[spriteId];

    if (!sprite) throw new Error(`Sprite ${spriteId} not found`);
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x + sprite.w / 2 * scale[0], y + sprite.h / 2 * scale[1]);
    ctx.rotate(rotation);
    ctx.translate(-x - sprite.w / 2 * scale[0], -y - sprite.h / 2 * scale[1]);

    const dx = scale[0] >= 0 ? x : (x - sprite.w) * scale[0];
    const dy = scale[1] >= 0 ? y : (-y - sprite.h) * scale[1];

    ctx.drawImage(this.img, sprite.x, sprite.y, sprite.w, sprite.h, dx, dy, sprite.w * scale[0], sprite.h * scale[1]);
    ctx.scale(scale[0], scale[1]);
    ctx.restore();
    return ctx;
  }
}

/**
 * Holds all the sprites
 */
export default class Sprites {

  /**
   * Loads a sprite to the Sprites class as a property
   * @param {String} name Sprite identifier
   * @param {String} src Sprite path
   * @param {Array<Object>} config Sprite configuration
   * @returns 
   */
  static load(name, src, config) {
    if (['length', 'prototype', 'load'].indexOf(name) >= 0) throw new Error(`The name "${name}" is not allowed for a sprite`);
    if (Sprites[name]) return;

    Sprites[name] = new Sprite(config);

    return Sprites[name].load(src);
  }

}
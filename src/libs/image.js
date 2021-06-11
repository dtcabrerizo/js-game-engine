'use strict'

export class CustomImage extends Image {

    /**
     * Draws an Image to a context
     * @param {CanvasRenderingContext2D} ctx Context to place the image
     * @param {Number} x X coordinates to place the image relative to the context
     * @param {Number} y Y coordinates to place the image relative to the context
     * @param {Number} rotation Rotation in radians from the center
     * @param {Array<Number>} scale [x,y] scale to be applied
     * @param {Number} opacity Alpha opacity applied to the image
     * @returns {CanvasRenderingContext2D} Context where the image were drawn
     */
    draw(ctx, x, y, rotation = 0, scale = [1, 1], opacity = 1) {

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(x + this.width / 2 * scale[0], y + this.height / 2 * scale[1]);
        ctx.rotate(rotation);
        ctx.translate(-x - this.width / 2 * scale[0], -y - this.height / 2 * scale[1]);

        const dx = scale[0] >= 0 ? x : (x - this.width) * scale[0];
        const dy = scale[1] >= 0 ? y : (-y - this.height) * scale[1];

        ctx.drawImage(this, dx, dy, this.width * scale[0], this.height * scale[1]);
        ctx.scale(scale[0], scale[1]);
        ctx.restore();
        return ctx;
    }
}




/**
 * Load images from URL
 */
export default class Images {
    /**
     * Loads image to the Images class as a property
     * @param {String} name Image identifier
     * @param {String} src Image path
     * @returns {Promise} Image loaded
     */
    static load(name, src) {
        return new Promise(
            (resolve, reject) => {
                if (['length', 'prototype', 'load'].indexOf(name) >= 0) throw new Error(`The name "${name}" is not allowed for an image`);
                if (Images[name]) return resolve();

                Images[name] = new CustomImage();
                Images[name].addEventListener('load', resolve, false);
                Images[name].addEventListener('error', () => reject(new Error(`Image ${name} could not be loaded`)), false);
                Images[name].src = src;
            }
        );
    }
}
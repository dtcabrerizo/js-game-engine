'use strict'


export class CustomFont {
    /**
     * 
     * @param {String} name Font name to be used on context
     */
    constructor(name) {
        this.name = name;
    }

    load(url) {
        return new Promise(
            (resolve, reject) => {
                this.el = document.createElement('link');
                this.el.setAttribute('rel', 'stylesheet');
                this.el.setAttribute('href', url);
                this.el.setAttribute('media', 'all');

                this.el.addEventListener('load', resolve, false);
                this.el.addEventListener('error', () => reject(new Error(`Font ${this.name} could not be loaded`)), false);

                document.head.appendChild(this.el);
            }
        )
    }
    /**
     * Returns the formatted string with the font value to be used on canvas context
     * @param {Number|String} value Size in pixes or the value to be used with the font on the cnavas context
     * @returns {String} Font size and name formatted
     */
    size(value) {
        if (!value) return this.toString();
        if (!Number.isNaN(value)) value = `${value}px`;
        return `${value} "${this.name}"`;
    }

    /**
     * Return the font name to be used on canvas context
     * @returns {String} Font name formatted
     */
    toString() {
        return `"${this.name}"`;
    }

    /**
     * Configs the context top use the font with the deined alignment
     * @param {CanvasRenderingContext2D} ctx The canvas to be configured
     * @param {object} config The canvas to be configured
     * @param {String} config.color Color, gradient, or pattern to use on the fillStyle property
     * @param {Number|String} config.size Size in pixes or the value to be used with the font on the cnavas context
     * @param {('left'|'right'|'center'|'start'|'end')} config.align Default text horizonatl alignment  
     * @param {('top'|'hanging'|'middle'|'alphabetic'|'ideographic'|'bottom')} config.baseline Default text baseline alignment  
     * @returns 
     */
    config(ctx, { color, size, align, baseline, letterSpacing } = {}) {
        ctx.font = this.size(size);
        
        if (color) ctx.fillStyle = color;
        if (align) ctx.textAlign = align;
        if (baseline) ctx.textBaseline = baseline;        
        if (letterSpacing) ctx.letterSpacing = letterSpacing;
        return ctx;
    }

    /**
     * Non-desrtuctive draws text on canvas using the config
     * @param {CanvasRenderingContext2D} ctx The canvas to be configured
     * @param {String} text Text to be drawn
     * @param {object} config The canvas to be configured
     * @param {String} config.color Color, gradient, or pattern to use on the fillStyle property
     * @param {Number|String} config.size Size in pixes or the value to be used with the font on the cnavas context
     * @param {('left'|'right'|'center'|'start'|'end')} config.align Default text horizonatl alignment  
     * @param {('top'|'hanging'|'middle'|'alphabetic'|'ideographic'|'bottom')} config.baseline Default text baseline alignment  
     * @returns 
     */
     draw(ctx, text, x, y, config) {
        ctx.save();
        this.config(ctx, config)
        ctx.fillText(text, x, y);
        ctx.restore();
        return ctx;
    }

    /**
     * Non-destructive measures text on canvas using the config
     * @param {CanvasRenderingContext2D} ctx The canvas to be configured
     * @param {String} text Text to be measured
     * @param {object} config The canvas to be configured
     * @param {String} config.color Color, gradient, or pattern to use on the fillStyle property
     * @param {Number|String} config.size Size in pixes or the value to be used with the font on the cnavas context
     * @param {('left'|'right'|'center'|'start'|'end')} config.align Default text horizonatl alignment  
     * @param {('top'|'hanging'|'middle'|'alphabetic'|'ideographic'|'bottom')} config.baseline Default text baseline alignment  
     * @returns {TextMetrics}
     */
    measureText(ctx, text, config) {
        ctx.save();
        this.config(ctx, config);
        const ret = ctx.measureText(text);
        ctx.restore();
        return ret;
    }
}


/**
 * Load Fonts from URL
 */
export default class Fonts {
    /**
     * Loads Font to the Fonts class as a property
     * @param {String} id Font identifier
     * @param {String} name Font identifier
     * @param {String} url Font path
     * @returns {Promise} Font loaded
     */
    static load(id, name, url) {
        if (['length', 'prototype', 'load'].indexOf(id) >= 0) throw new Error(`The name "${id}" is not allowed for a font`);
        if (Fonts[id]) return resolve();

        Fonts[id] = new CustomFont(name);
        return Fonts[id].load(url);

    }
}
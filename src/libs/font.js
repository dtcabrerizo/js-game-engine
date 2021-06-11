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
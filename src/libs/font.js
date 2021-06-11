'use strict'



/**
 * Load Fonts from URL
 */
 export default class Fonts {
    /**
     * Loads Font to the Fonts class as a property
     * @param {String} name Font identifier
     * @param {String} src Font path
     * @returns {Promise} Font loaded
     */
    static load(name, src) {
        return new Promise(
            (resolve, reject) => {
                if (['length', 'prototype', 'load'].indexOf(name) >= 0) throw new Error(`The name "${name}" is not allowed for a font`);
                if (Fonts[name]) return resolve();

                Fonts[name] = document.createElement('link');
                Fonts[name].setAttribute('rel', 'stylesheet');
                Fonts[name].setAttribute('href', src);
                Fonts[name].setAttribute('media', 'all');

                Fonts[name].addEventListener('load', resolve, false);
                Fonts[name].addEventListener('error', () => reject(new Error(`Font ${name} could not be loaded`)), false);

                document.head.appendChild(Fonts[name]);
            }
        );
    }
}
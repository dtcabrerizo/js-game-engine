'use strict'



/**
 * Load Scripts from URL
 */
 export default class Scripts {
    /**
     * Loads Script to the Scripts class as a property
     * @param {String} name Script identifier
     * @param {String} src Script path
     * @returns {Promise} Script loaded
     */
    static load(name, src) {
        return new Promise(
            (resolve, reject) => {
                if (['length', 'prototype', 'load'].indexOf(name) >= 0) throw new Error(`The name "${name}" is not allowed for a script`);
                if (Scripts[name]) return resolve();

                Scripts[name] = document.createElement('script');
                Scripts[name].setAttribute('type', 'text/javascript');
                Scripts[name].setAttribute('src', src);

                Scripts[name].addEventListener('load', resolve, false);
                Scripts[name].addEventListener('error', () => reject(new Error(`Script ${name} could not be loaded`)), false);

                document.body.appendChild(Scripts[name]);
            }
        );
    }
}
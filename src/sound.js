'use strict'

export class Sound {

    played = false; // Flag to check if the sound has been played once
    /**
     * 
     * @param {Audio} audio Audio element holding the sound to be loaded
     * @param {Boolean} loop Specifies if sound should run in a loop
     */
    constructor(audio, loop = false) {
        this.audio = audio;
        this.audio.loop = loop;
        this.duration = audio.duration;
    }

    get volume() { 
        return this.audio.volume;
    }
    set volume(value) { 
        return this.audio.volume = value;
    }

    /**
     * Creates a copy of the Sound class
     * @returns {Sound} Copy of the sound class
     */
    clone() {
        const tmpAudio = new Audio(this.audio.src, this.audio.loop);
        tmpAudio.volume = this.audio.volume;
        return new Sound(tmpAudio, this.loop);
    }
    /**
     * Plays the sound
     * @param {Boolean} loop Overwrites the sound loop configuration
     * @returns {Promise} Resolved when the sound played
     */
    play(loop) {
        this.played = true;
        this.audio.loop = loop || this.audio.loop;
        if (this.loop)
            return this.audio.play();
        return new Promise((resolve) => {
            this.audio.play();
            setTimeout(resolve, this.duration * 1000);
        });
    };
    /**
     * Stops the playback
     */
    stop() {
        // Resets the sound to the start
        this.audio.currentTime = 0;
        // Pause the playback
        this.audio.pause();
    };

    isPlaying() {
        return  !this.audio.paused && !this.audio.ended && this.audio.readyState > 2;
    }
}

/**
 * Holds the Sound class list
 */
export default class Sounds {
    static _items = {};

    /**
     * Returns a copy of a Sound class
     * @param {String} id Sound identifier
     * @returns {Sound} Copy of the Sound class
     */
    static get(id) {
        return this._items[id] ? this._items[id].clone() : undefined;
    }

    /**
     * Stop all sounds
     */
    static stopAll() {
        Object.values(this._items).forEach(i => i.stop());
    }

    /**
     * 
     * @param {String} name Sound identifier
     * @param {String} src Sound path
     * @param {Boolean} loop Specifies if sound should run in a loop
     * @param {Number} volume Volume value for the audio
     * @returns {Promise} Sound loaded
     */
    static load(name, src, loop = false, volume = 1) {
        return new Promise(function (resolve, reject) {
            if (Sounds[name]) return resolve();

            const audio = new Audio(src, loop);

            audio.volume = volume;

            let wait = 0;
            const loading = () => {
                if (audio.readyState == 4) return Sounds[name] = new Sound(audio, loop), resolve();
                if (wait++ > 50) return reject(new Error(`Timeout loading sound "${name}"`));
                setTimeout(loading, 100);
            }
            loading();
        })
    }
}


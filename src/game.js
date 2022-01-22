'use strict'

import Fonts from "./font.js";
import Scripts from "./script.js";
import Sprites from "./sprite.js";
import Images from "./image.js";
import Sounds from "./sound.js";
import Rect from "./rect.js";
import { Client, Server} from './network.js';

/**
 * Main game class
 */
export default class Game {
  constructor(initialScene, width, height, parent = document.body) {
    
    // Create the canvas object
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.setAttribute('tabindex', 0);

    // Add handlers for the most common events
    ['mouseMove', 'mouseDown', 'mouseUp', 'mouseEnter', 'mouseLeave', 'click', 'keyUp', 'keyDown', 'keyPress'].forEach(event => {
      this.canvas.addEventListener(event.toLowerCase(), this.event.bind(this, event, false));
    });
    
    // Ad handler for the mouse right clivk and bind it as a "click" event
    this.canvas.addEventListener('contextmenu', this.event.bind(this, 'click', true));

    // Add the canvas to the DOM inside the parent node
    parent.appendChild(this.canvas);

    // Get the canvas context for drawing
    this.ctx = this.canvas.getContext('2d');

    // Loads the initial scene if there is one
    if (initialScene) this.scene = initialScene;

    // Starts the main loop
    this.loop(performance.now());
  }

  /**
   * Returns the current loaded scene
   */
  get scene() {
    return this.currentScene;
  }
  /**
   * Changes the current scene
   */
  set scene(scene) {
    // Display a message that the scene is changing
    console.debug('Changing Scene: ', scene);

    // If the current scene has a destroy function invoke it before changin scene
    if (typeof (this.currentScene?.destroy) == 'function') this.currentScene.destroy(this);
    this.currentScene = scene;
    // If the new scene has an init funcion invoke it 
    if (scene.init && typeof (scene.init) == 'function') scene.init(this);
    // Return the game object
    return this;
  }

  loop(date) {
    // Calculate the delta since last loop execution
    const delta = (performance.now() - date) / 1000;

    // Save the canvas context state before executing the scene methods
    this.ctx.save();
    // If the current scene has an update function invoke it before start drawing
    if (this.currentScene?.update) this.currentScene.update(this, delta);
    // If the current scene has a draw function invoke it
    if (this.currentScene?.draw) this.currentScene.draw(this, delta);
    // Restore the canvas context to its original configuration
    this.ctx.restore();

    // Schedule next loop execution when the browser is ready for the next frame
    window.requestAnimationFrame(this.loop.bind(this, performance.now()));
  }

  event(event, preventDefault, e ) {
    // If the event handler don't want to execute the default behavior we should cancel it
    // It would be used mostly for the "contextmenu" event so it won't display the menu
    if (preventDefault) e.preventDefault();
    // If the current scene has a handler for this event invoke the handler
    return this.currentScene?.[event] && this.currentScene?.[event](this, e);
  }
}


export { Game, Scripts, Fonts, Sprites, Images, Sounds, Rect, Client, Server };
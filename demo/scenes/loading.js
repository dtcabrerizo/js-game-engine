'use strict'

import Images from '../../src/libs/image.js';
import Sounds from '../../src/libs/sound.js';
import Sprites from '../../src/libs/sprite.js';
import Fonts from '../../src/libs/font.js';
import Scene1 from './scene1.js';


// Define the loading scene
const SceneLoading = {
  id: 'SceneLoading',
  init(game) {

    // Config for the Pokemon Sprites
    const pokemons = {};
    Array(21).fill().forEach((_, y) => {
      Array(31).fill().forEach((_, x) => {
        const n = x + y * 31;
        pokemons[`PKM-${n + 1}`] = { x: x * 96, y: y * 96, w: 96, h: 96 };
      });
    });

    // Config for the arrows sprite
    const arrows = {
      left: { x: 0, y: 250, w: 260, h: 265 },
      right: { x: 520, y: 254, w: 260, h: 265 }
    };

    // Config for the Ditto sprites
    const ditto = {};
    Array(4).fill().forEach((_, i) => ditto[`p-${i}`] = { x: 33 * i, y: 0, w: 33, h: 29 });

    // Controls the progress of the resources loading
    this.progress = 0;

    // List of resources to load, each resource is a promise
    const promises = [
      Sprites.load('pkm', './images/pkmn.png', pokemons),
      Sprites.load('ditto', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAAAdAgMAAAAWQyy/AAAADFBMVEX///+4YOA4ODj4+PhASPNeAAAAAXRSTlMAQObYZgAAAStJREFUeF6l08FqhEAMBuBhbk6fYyj6Pgmul3pZEN9hWV8i9FgvC3X6PELpe2zP9Y/pyCLLFprLoP83STzo/lv+/ZEoGGwMw10RacmePmML4PfOjyqev6WGKDs/Kth40QiEXInxLPzxle+WHUS8kgoi6vU8zzaobIQB31R4QrU4T9RVKl5ngpheaBP1KlmWLlU4z0iCJioORKxCmzm5nDSJAOx0jxthdEBwzOLIkJyFIEGgQpvVqxSMhVRxQKCiEYhozQtbPV/Fmx6iJE5ErYkWgi8mlOYkEiVZxQRpglUojSZB9wJUTDoxkTeMN4J3ot0JT79CTMifRUmUEtV5803EJcD3+5ScS+MmML+feHBhCcKSWOVvw9s07H+LTdwvL/1Fp9yvaggJUx/WD0e0wREEScedAAAAAElFTkSuQmCC', ditto),
      Sprites.load('arrows', './images/arrow.png', arrows),
      Images.load('back', './images/back.png'),
      Sounds.load('pkm', './sounds/music.mp3', true, 0.5),
      Fonts.load('P2', 'https://fonts.googleapis.com/css?family=Press+Start+2P')
    ];

    // Increments the progress counter for each promise that finishes
    const inc = () => this.progress += 100 / promises.length;
    promises.forEach(p => p.then(inc));

    // Set the progress to 100 when all promises resolved, just to make sure it will end the scene
    Promise.all(promises).then(() => this.progress = 100);


  },
  draw(game, delta) {
    // Draw the scene

    game.ctx.font = '40px "Press Start 2P"';
    game.ctx.textAlign = 'center';
    game.ctx.textBaseline = 'middle';

    // If it still loading the resources display the progress bar
    if (this.progress < 100) {
      game.ctx.fillStyle = 'rgb(128,0,0)';
      game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

      game.ctx.fillStyle = 'rgb(255,255,255)';
      game.ctx.strokeStyle = 'rgb(255,255,255)';
      game.ctx.lineWidth = 4;
      game.ctx.fillText('Loading...', game.canvas.width / 2, game.canvas.height / 2 - 50);

      game.ctx.strokeRect(20, game.canvas.height / 2 + 50, game.canvas.width - 40, 20)
      game.ctx.fillRect(20, game.canvas.height / 2 + 50, (game.canvas.width - 40) * this.progress / 100, 20)
    } else {
      // When all the resources are loaded wait for the user to click on the canvas to start
      // This is important so the canvas have the focus and can receive keyboar inputs and we can start playing audio since the user already interacted with the page
      game.ctx.fillStyle = 'rgb(51,51,51)';
      game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
      game.ctx.fillStyle = 'rgb(255,255,255)';
      game.ctx.fillText('Click to start', game.canvas.width / 2, game.canvas.height / 2);
    }

  },
  mouseUp(game) {
    // If we already loaded all the resources and the user clicked the canvas change the scene to the next scene
    if (this.progress >= 100) game.scene = Scene1;
  }
};

export default SceneLoading;


'use strict'

import Fonts from "../../../src/libs/font.js";
import Images from "../../../src/libs/image.js";
import Sounds from "../../../src/libs/sound.js";
import Sprites from "../../../src/libs/sprite.js";
import { Rect } from "../../../src/libs/utils.js";

const Scene1 = {
    init(game) {
        // Start the background music
        Sounds.pkm.play();
        // Current displayed pokemon
        this.pkmIndex = 1;
        // Scale to display the pokemon
        this.pkmScale = 3;

        // Controls if there is an animation and the frames for that
        this.animation = null;

        // Controls which frame of the Ditto sprite it should display
        this.dittoFrame = 1;
        
        // FPS Display
        this.fps = 0;
        this.fpsLastUpdated = 2;
    },
    draw(game, delta) 
    {
        // Draw the scene
        
        // Draw the background
        Images.back.draw(game.ctx, 0, 0);

        // Draw the arrows
        Sprites.arrows.draw(game.ctx, 'left', 20, 200, 0, [0.3, 0.3]);
        Sprites.arrows.draw(game.ctx, 'right', game.canvas.width - 20 - 260 * 0.3, 200, 0, [0.3, 0.3]);

        // Change the smoothing config to scale the sprites after the arrows has been drawn
        game.ctx.imageSmoothingEnabled = false;

        // Draw the Ditto in the correct frame
        Sprites.ditto.draw(game.ctx, `p-${Math.floor(this.dittoFrame)}`, 0, 0, 0, [4, 4]);

        // Default x and y coordinates to display the pokemon
        const defX = (game.canvas.width - 96 * 3) / 2;
        const defY = (game.canvas.height - 96 * 3) / 2;

        // If there is an animation happening display both pokemon involved on the animation on their calculated coordinates
        if (this.animation) {
            Sprites.pkm.draw(game.ctx, `PKM-${this.animation.p1.index}`, this.animation.p1.x, defY, 0, [this.pkmScale, this.pkmScale]);
            Sprites.pkm.draw(game.ctx, `PKM-${this.animation.p2.index}`, this.animation.p2.x, defY, 0, [this.pkmScale, this.pkmScale]);
        } else {
            // If there is no animation display the current pokemon on the default coordinates
            Sprites.pkm.draw(game.ctx, `PKM-${this.pkmIndex}`, defX, defY, 0, [this.pkmScale, this.pkmScale]);
        }
        
        // Display the current calculated FPS on the top right corner
        game.ctx.font = Fonts.P2.size(20);
        game.ctx.textAlign = 'right';
        game.ctx.textBaseline = 'top';
        game.ctx.fillText(`FPS: ${this.fps.toFixed(2)}`, game.canvas.width, 15);
    
    },
    update(game, delta) {
        // Update the counter for the Ditto frame
        // Each frame would last 150ms, since we are using a Math.floor when displaying the ditto frame
        this.dittoFrame += delta / 0.15;
        // If we reached the last frame reset to the first
        if (this.dittoFrame > 4) this.dittoFrame = 0;

        // The animation lasts for 1 second, if the animetion time is gretaher than 1 the animation must end
        if (this.animation?.time > 1) {
            // Sets the new pokemon index to be the second pokemon on the animation
            this.pkmIndex = this.animation.p2.index;
            // Resets the animation control
            this.animation = null;
        } else if (this.animation?.time <= 1) {
            // If we are still running the animation recalculate the coordinates for the pokemons
            this.animation.p1.x += (game.canvas.width + 96 * this.pkmScale) / 2 * delta * this.animation.dir
            this.animation.p2.x += (game.canvas.width + 96 * this.pkmScale) / 2 * delta * this.animation.dir
            // Increment the current delta to the total time of the animation
            this.animation.time += delta;
        }

        // Increment the counter of when we last calculated the FPS
        // It should be calculated only when it reachs 1 second, so the numbers should stay at least 1 second on the screen
        this.fpsLastUpdated += delta;
        if (this.fpsLastUpdated > 1) {
            // If 1 second has passes since the last update recalculate the fps using the current delta
            // This results on the snapshot FPS, would be better to claculate the Mean FPS during the 1 second interval
            this.fps = 1 / delta;
            // Resets the counter to recalculate the FPS
            this.fpsLastUpdated = 0;
        }
    },
    mouseUp(game, e) {
        // If there is ananimation happening do not accepts user clicks
        if (this.animation) return;
        // Rectangles to check if the user clicked a button
        const leftArrow = new Rect(20, 200, 260 * 0.3, 265 * 0.3);
        const rightArrow = new Rect(game.canvas.width - 20 - 260 * 0.3, 200, 260 * 0.3, 265 * 0.3);
        // Point where the user clicked on the canvas
        const point = { x: e.offsetX, y: e.offsetY };

        // Check if the point where the user clicked is inside one of the buttons rectangles and start mobing the pokemon if necesary
        if (leftArrow.containsPoint(point)) {
            this.nextPKM();
        } else if (rightArrow.containsPoint(point)) {
            this.prevPKM();
        }
    },
    keyUp(game, e) {
        // If there is ananimation happening do not accepts keyboard events
        if (this.animation) return;
        // Check if the user pressed the left or right keys on the keyboard and start mobing the pokemon if necesary
        if (e.key == 'ArrowLeft') {
            this.nextPKM();
        } else if (e.key == 'ArrowRight') {
            this.prevPKM();
        }
                
    },

    /* CUSTOM */
    /* Thos functions are created for this scene only and it would be invoked internally, it won't be invoked by the Game class */
    nextPKM() {
        // Move to the next pokemon creating an animation
        const p1 = { index: this.pkmIndex, x: (game.canvas.width - 96 * 3) / 2 };
        const p2 = {
            index: this.pkmIndex > 1 ? this.pkmIndex - 1 : 649,
            x: -96 * this.pkmScale
        };
        // Animation object with both pokemon involved and the direction of the movement
        this.animation = { time: 0, p1, p2, dir: 1 };
    },
    prevPKM() {
        // Move to the next pokemon creating an animation
        const p1 = { index: this.pkmIndex, x: (game.canvas.width - 96 * 3) / 2 };
        const p2 = {
            index: this.pkmIndex < 649 ? this.pkmIndex + 1 : 1,
            x: game.canvas.width
        };
        // Animation object with both pokemon involved and the direction of the movement
        this.animation = { time: 0, p1, p2, dir: -1 };
    }
}

export default Scene1;
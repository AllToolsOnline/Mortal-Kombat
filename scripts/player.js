/**
 * A generic class for any animated object in the game.
 * Handles loading sprite sheets and cycling through frames.
 */
class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        c
    }) {
        this.position = position;
        this.c = c;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5; // Determines animation speed (higher is slower)

        this.image = new Image();
        this.image.src = imageSrc;
    }

    /**
     * Draws the current frame of the sprite onto the canvas.
     */
    draw() {
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        // Calculate the crop box for the current frame
        const cropWidth = this.image.width / this.framesMax;
        const crop = {
            position: {
                x: this.framesCurrent * cropWidth,
                y: 0,
            },
            width: cropWidth,
            height: this.image.height,
        };

        // Draw the cropped image onto the canvas
        this.c.drawImage(
            this.image,
            crop.position.x,
            crop.position.y,
            crop.width,
            crop.height,
            this.position.x,
            this.position.y,
            crop.width * this.scale,
            this.image.height * this.scale
        );
    }

    /**
     * Updates the animation frame.
     */
    animateFrames() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    /**
     * The main update method, called in every frame of the game loop.
     */
    update() {
        this.draw();
        this.animateFrames();
    }
}

/**
 * The Fighter class extends Sprite and adds all player-specific logic
 * like movement, physics, combat, and health.
 */
class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        imageSrc,
        scale = 1,
        framesMax = 1,
        c,
        canvas,
        gravity,
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        // Call the parent Sprite constructor
        super({ position, imageSrc, scale, framesMax, c });

        // Fighter-specific properties
        this.velocity = velocity;
        this.canvas = canvas;
        this.gravity = gravity;
        this.width = 50; // Used for physics calculations
        this.height = 150; // Used for physics calculations
        this.lastKeyPressed = '';
        this.isAttacking = false;
        this.health = 100;
        
        // Attack box properties
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        };
        
        // Reset animation frame counters from the parent
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
    }

    /**
     * The main update method for the fighter, called every frame.
     */
    update() {
        this.draw();
        this.animateFrames();

        // Update attack box position to follow the fighter
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + 50; // Small offset from top

        // Update position based on current velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Apply gravity if the fighter is in the air
        if (this.position.y + this.height + this.velocity.y >= this.canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += this.gravity;
        }
    }

    /**
     * Triggers the attack state.
     */
    attack() {
        this.isAttacking = true;
        // The attack state lasts for a short duration (100ms)
        // This could be tied to the attack animation length in the future.
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

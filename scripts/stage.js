/**
 * Represents the game's background stage.
 * It handles loading and drawing the background image for the level.
 */
class Stage {
    /**
     * @param {object} options - The options for creating the stage.
     * @param {object} options.position - The x and y coordinates where the image will be drawn.
     * @param {string} options.imageSrc - The path to the background image file.
     * @param {CanvasRenderingContext2D} c - The 2D rendering context of the canvas.
     */
    constructor({ position, imageSrc }, c) {
        this.position = position;
        this.c = c;

        // Create a new Image object for the background.
        this.image = new Image();
        
        // A flag to ensure we don't try to draw the image before it's loaded.
        this.isLoaded = false;
        this.image.onload = () => {
            this.isLoaded = true;
            console.log(`Stage image loaded: ${imageSrc}`);
        };
        
        // Set the source of the image, which triggers the loading process.
        this.image.src = imageSrc;
    }

    /**
     * Draws the stage's background image onto the canvas.
     */
    draw() {
        // Only draw the image if it has been successfully loaded to prevent errors.
        if (this.isLoaded) {
            this.c.drawImage(this.image, this.position.x, this.position.y);
        }
    }

    /**
     * The update method for the stage. For a static background, it just calls draw.
     * This is called in every frame of the main game loop.
     */
    update() {
        this.draw();
    }
}

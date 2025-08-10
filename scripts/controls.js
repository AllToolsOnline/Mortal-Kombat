/**
 * Manages all keyboard input for the game.
 * It listens for keydown and keyup events to control both fighters.
 */
class Controls {
    /**
     * @param {object} options - The options for the controls handler.
     * @param {Fighter} options.player - The player 1 fighter object.
     * @param {Fighter} options.enemy - The player 2 fighter (enemy) object.
     */
    constructor({ player, enemy }) {
        this.player = player;
        this.enemy = enemy;

        // An object to track the pressed state of all relevant keys.
        this.keys = {
            // Player 1 keys
            a: { pressed: false },
            d: { pressed: false },
            w: { pressed: false }, // Not used for movement, but for jump action

            // Player 2 keys
            ArrowLeft: { pressed: false },
            ArrowRight: { pressed: false },
            ArrowUp: { pressed: false } // Not used for movement, but for jump action
        };

        // Attach the event listeners when a new Controls object is created.
        this.addKeyboardListeners();
    }

    /**
     * Sets up the global event listeners for keyboard events.
     */
    addKeyboardListeners() {
        // Listener for when a key is pressed down
        window.addEventListener('keydown', (event) => {
            // Use a switch statement to handle different key presses.
            switch (event.key) {
                // --- Player 1 Controls ---
                case 'd':
                    this.keys.d.pressed = true;
                    this.player.lastKeyPressed = 'd';
                    break;
                case 'a':
                    this.keys.a.pressed = true;
                    this.player.lastKeyPressed = 'a';
                    break;
                case 'w':
                    // Player can only jump if they are on the ground (velocity.y is 0)
                    if (this.player.velocity.y === 0) {
                        this.player.velocity.y = -20; // A negative y-velocity simulates a jump.
                    }
                    break;
                case ' ': // Spacebar for Player 1's attack
                    this.player.attack();
                    break;

                // --- Player 2 Controls ---
                case 'ArrowRight':
                    this.keys.ArrowRight.pressed = true;
                    this.enemy.lastKeyPressed = 'ArrowRight';
                    break;
                case 'ArrowLeft':
                    this.keys.ArrowLeft.pressed = true;
                    this.enemy.lastKeyPressed = 'ArrowLeft';
                    break;
                case 'ArrowUp':
                    if (this.enemy.velocity.y === 0) {
                        this.enemy.velocity.y = -20;
                    }
                    break;
                case 'ArrowDown': // ArrowDown for Player 2's attack
                    this.enemy.attack();
                    break;
            }
        });

        // Listener for when a key is released
        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                // --- Player 1 ---
                case 'd':
                    this.keys.d.pressed = false;
                    break;
                case 'a':
                    this.keys.a.pressed = false;
                    break;

                // --- Player 2 ---
                case 'ArrowRight':
                    this.keys.ArrowRight.pressed = false;
                    break;
                case 'ArrowLeft':
                    this.keys.ArrowLeft.pressed = false;
                    break;
            }
        });
    }
}

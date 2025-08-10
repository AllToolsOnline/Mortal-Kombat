// This event listener waits for the HTML document to be fully loaded and parsed.
// It's the entry point for our game logic.
window.addEventListener('DOMContentLoaded', () => {

    // --- CANVAS & GAME SETUP ---
    const canvas = document.getElementById('game-canvas');
    const c = canvas.getContext('2d');

    // Set the canvas dimensions to match our game container size.
    canvas.width = 1024;
    canvas.height = 576;

    // A constant for gravity to be used by players/objects.
    const gravity = 0.7;

    // --- GAME STATE & INSTANCES ---

    // Create the background stage. We'll assume the Stage class is in 'scripts/stage.js'.
    // It will handle drawing the background image.
    const stage = new Stage({
        position: { x: 0, y: 0 },
        imageSrc: './assets/images/bg_stage1.png' // Path to the first stage background
    }, c);

    // Create the player instance. The Fighter class will be in 'scripts/player.js'.
    const player = new Fighter({
        position: { x: 200, y: 100 },
        velocity: { x: 0, y: 0 },
        imageSrc: './assets/images/player1/idle.png', // Starting sprite
        scale: 2.5, // Adjust sprite size if needed
        framesMax: 8, // Number of frames in the idle animation
        c, // Pass canvas context
        canvas, // Pass canvas itself
        gravity, // Pass gravity
        attackBox: {
            offset: { x: 100, y: 50 },
            width: 150,
            height: 50
        }
    });

    // Create the enemy instance. The Enemy class will be in 'scripts/enemy.js'.
    const enemy = new Fighter({ // For now, the enemy can also be a Fighter
        position: { x: 774, y: 100 },
        velocity: { x: 0, y: 0 },
        color: 'blue',
        imageSrc: './assets/images/player2/idle.png', // Starting sprite
        scale: 2.5,
        framesMax: 4, // Number of frames in this idle animation
        c,
        canvas,
        gravity,
        attackBox: {
            offset: { x: -170, y: 50 }, // Flipped offset for facing left
            width: 150,
            height: 50
        }
    });

    // Initialize the UI manager. The UI class will be in 'scripts/ui.js'.
    // It will handle the timer, health bars, and messages.
    const gameUI = new UI({ player, enemy });

    // Initialize the controls handler. The Controls class will be in 'scripts/controls.js'.
    const controls = new Controls();

    // --- MAIN GAME LOOP ---

    let lastTime = 0;
    let isGameOver = false;

    function animate(currentTime) {
        // If game over, stop the loop.
        if (isGameOver) return;

        // Request the next frame from the browser.
        const animationId = window.requestAnimationFrame(animate);
        const deltaTime = (currentTime - lastTime) / 1000; // Time since last frame in seconds
        lastTime = currentTime;

        // Clear the canvas before drawing the next frame.
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw the stage and players.
        stage.update();
        player.update();
        enemy.update();

        // Reset horizontal velocity each frame.
        player.velocity.x = 0;
        enemy.velocity.x = 0;

        // --- PLAYER MOVEMENT ---
        if (controls.keys.a.pressed && player.lastKeyPressed === 'a') {
            player.velocity.x = -5;
        } else if (controls.keys.d.pressed && player.lastKeyPressed === 'd') {
            player.velocity.x = 5;
        }

        // --- ENEMY MOVEMENT ---
        if (controls.keys.ArrowLeft.pressed && enemy.lastKeyPressed === 'ArrowLeft') {
            enemy.velocity.x = -5;
        } else if (controls.keys.ArrowRight.pressed && enemy.lastKeyPressed === 'ArrowRight') {
            enemy.velocity.x = 5;
        }

        // --- COLLISION DETECTION ---
        // Player attacks enemy
        if (
            rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
            player.isAttacking
        ) {
            player.isAttacking = false; // Ensure one hit per attack
            enemy.health -= 20;
            gameUI.updateHealth();
            console.log('Enemy was hit!');
        }

        // Enemy attacks player
        if (
            rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
            enemy.isAttacking
        ) {
            enemy.isAttacking = false;
            player.health -= 20;
            gameUI.updateHealth();
            console.log('Player was hit!');
        }
        
        // --- GAME OVER CHECK ---
        if (player.health <= 0 || enemy.health <= 0) {
            gameUI.determineWinner();
            isGameOver = true;
        }
    }

    // --- START GAME ---
    // Listen for the start button click to initialize the game.
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', () => {
        gameUI.startGame();
        animate(0); // Start the animation loop.
    });
});

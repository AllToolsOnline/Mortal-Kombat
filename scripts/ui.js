/**
 * Manages all User Interface elements of the game.
 * Handles the title screen, health bars, timer, and result messages.
 */
class UI {
    /**
     * @param {object} options - The options for the UI manager.
     * @param {Fighter} options.player - The player object.
     * @param {Fighter} options.enemy - The enemy object.
     */
    constructor({ player, enemy }) {
        // --- STORE REFERENCES ---
        this.player = player;
        this.enemy = enemy;

        // --- DOM ELEMENT SELECTION ---
        this.titleScreen = document.getElementById('title-screen');
        this.uiOverlay = document.getElementById('ui-overlay');
        this.timerEl = document.getElementById('timer');
        this.resultMessageEl = document.getElementById('result-message');
        this.player1HealthEl = document.getElementById('player1-health');
        this.player2HealthEl = document.getElementById('player2-health');

        // --- TIMER STATE ---
        this.gameTimer = 60;
        this.timerId = null;
    }

    /**
     * Hides the title screen, shows the in-game UI, and starts the round timer.
     */
    startGame() {
        // Fade out the title screen for a smooth transition
        this.titleScreen.style.opacity = '0';
        setTimeout(() => {
            this.titleScreen.style.display = 'none';
        }, 500); // Match the transition duration in style.css

        // Show the in-game UI
        this.uiOverlay.style.display = 'block';
        
        // Start the countdown
        this.decreaseTimer();
    }

    /**
     * Updates the health bars on the screen to reflect the current health of the fighters.
     */
    updateHealth() {
        this.player1HealthEl.style.width = this.player.health + '%';
        this.player2HealthEl.style.width = this.enemy.health + '%';
    }

    /**
     * Decrements the game timer every second and checks for a timeout.
     */
    decreaseTimer() {
        if (this.gameTimer > 0) {
            // Use setTimeout recursively to create a stoppable timer.
            this.timerId = setTimeout(() => this.decreaseTimer(), 1000);
            this.gameTimer--;
            this.timerEl.innerHTML = this.gameTimer;
        }

        // If the timer reaches 0, determine the winner.
        if (this.gameTimer === 0) {
            this.determineWinner();
        }
    }

    /**
     * Stops the timer, checks player health, and displays the winner message.
     */
    determineWinner() {
        // Stop the timer from running further.
        clearTimeout(this.timerId);

        // Make the result message visible.
        this.resultMessageEl.style.display = 'flex';

        // Compare health to determine the outcome.
        if (this.player.health === this.enemy.health) {
            this.resultMessageEl.innerHTML = 'Tie';
        } else if (this.player.health > this.enemy.health) {
            this.resultMessageEl.innerHTML = 'Player 1 Wins';
        } else {
            this.resultMessageEl.innerHTML = 'Player 2 Wins';
        }
    }
}

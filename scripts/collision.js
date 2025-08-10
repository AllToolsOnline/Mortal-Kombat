/**
 * A utility function to detect collision between two rectangular objects.
 * Specifically, it checks if an attacker's attack box overlaps with a target's body.
 * * @param {object} options - The collision check options.
 * @param {Fighter} options.rectangle1 - The attacking fighter.
 * @param {Fighter} options.rectangle2 - The target fighter.
 * @returns {boolean} - True if there is a collision, false otherwise.
 */
function rectangularCollision({ rectangle1, rectangle2 }) {
    // rectangle1 is the attacker, rectangle2 is the target.
    // We are checking if rectangle1's attackBox hits rectangle2's body.

    const attackBox = rectangle1.attackBox;
    const targetBody = {
        position: rectangle2.position,
        width: rectangle2.width,
        height: rectangle2.height
    };

    // Check for overlap on the X and Y axes.
    const xOverlap = attackBox.position.x + attackBox.width >= targetBody.position.x &&
                     attackBox.position.x <= targetBody.position.x + targetBody.width;

    const yOverlap = attackBox.position.y + attackBox.height >= targetBody.position.y &&
                     attackBox.position.y <= targetBody.position.y + targetBody.height;

    // A collision occurs only if there is an overlap on both axes.
    return xOverlap && yOverlap;
}

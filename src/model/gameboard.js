export default class Gameboard {
    #board = [];
    #missedAttacks;
    #allShipsSunk = false;

    constructor() {
        for (let row = 0; row < 10; row++) {
            let currRow = [];
            for (let col = 0; col < 10; col++) {
                currRow.push(0);
            }
            this.#board.push(currRow);
        }
    }

    receiveAttack(xCoord, yCoord) {

    }
}
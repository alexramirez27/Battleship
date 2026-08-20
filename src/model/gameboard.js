import Ship from "./ship.js";

export default class Gameboard {
    #board = [];
    #shipPositions = new Map();
    #missedAttacks = new Set();
    #allShipsSunk = false;

    #destroyer = new Ship(2);
    #submarine = new Ship(3, true);
    #cruiser = new Ship(3);
    #battleship = new Ship(4);
    #carrier = new Ship(5);

    constructor() {
        for (let row = 0; row < 10; row++) {
            let currRow = [];
            for (let col = 0; col < 10; col++) {
                currRow.push('W');
            }
            this.#board.push(currRow);
        }
    }

    get allShipsSunk() {
        return this.#allShipsSunk;
    }

    receiveAttack(row, col) {

    }

    placeShip(shipType, orientation, direction, startRow, startCol) {
        if (typeof shipType === "string" || shipType instanceof String) { 
            throw new TypeError("shipType needs to be a string!");
        }

        const shipTypeLC = shipType.toLowerCase();
        if (shipTypeLC !== "destroyer" && shipTypeLC !== "submarine" && shipTypeLC !== "cruiser" &&
            shipTypeLC !== "battleship" && shipTypeLC !== "carrier") {
                throw new Error("shipType needs to be a destroyer, submarine, cruiser, battleship, or carrier!");
        }

        if (orientation !== "horizontal" && orientation !== "vertical") {
            throw new Error("Orientation must be horizontal or vertical!")
        }

        if (direction !== "up" && direction !== "down" && direction !== "left" && direction !== "right") {
            throw new Error("Direction must be up, down, left, or right!");
        }

        if (((direction === "left" || direction === "right") && orientation === "vertical") ||
            ((direction === "up" || direction === "down") && orientation === "horizontal")) {
            throw new Error("The orientation and direction entered are not compatible!");
        }

        let shipLength;
        switch (shipTypeLC) {
            case "destroyer":
                shipLength = 2;
                break;
            case "submarine":
                shipLength = 3;
                break;
            case "cruiser":
                shipLength = 3;
                break;
            case "battleship":
                shipLength = 4;
                break;
            case "carrier":
                shipLength = 5;
                break;
        }

        const proposedShipPositions = [];
        switch (direction) {
            case "up":
                // Board bounds check
                const endRow = startRow - (shipLength - 1);
                if (endRow < 0) {
                    return false;
                }

                for (let row = startRow; row >= endRow; row--) {
                    proposedShipPositions.push([row, startCol]);
                }

                break;
            case "down":
                // Board bounds check
                const endRow = startRow + (shipLength - 1);
                if (endRow > 9) {
                    return false;
                }

                for (let row = startRow; row <= endRow; row++) {
                    proposedShipPositions.push([row, startCol]);
                }

                break;
            case "left":
                // Board bounds check
                const endCol = startCol - (shipLength - 1);
                if (endCol < 0) {
                    return false;
                }

                for (let col = startCol; col >= endCol; col--) {
                    proposedShipPositions.push([startRow, col]);
                }

                break;
            case "right":
                // Board bounds check
                const endCol = startCol + (shipLength - 1);
                if (endCol > 0) {
                    return false;
                }

                for (let col = startCol; col <= endCol; col++) {
                    proposedShipPositions.push([startRow, col]);
                }

                break;
        }

        // Check if one of the squares is currently occupied by a ship
        for (const [row, col] of proposedShipPositions) {
            if (this.#shipPositions.has(`(${row}, ${col})`)) {
                return false;
            }
        }

        // Place the ship on the gameboard
        for (const [row, col] of proposedShipPositions) {
            this.#board[row][col] = 'S';
            this.#shipPositions.set(`(${row}, ${col})`, shipTypeLC);
        }

        return true;
    }
}
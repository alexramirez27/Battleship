import Ship from "./ship.js";

export default class Gameboard {
    #board = [];
    #shipPositions = new Map();
    #successfulAttacks = new Set();
    #missedAttacks = new Set();
    #allShipsSunk = false;

    #destroyer;
    #submarine;
    #cruiser;
    #battleship;
    #carrier;

    constructor() {
        this.resetBoard();
    }

    get allShipsSunk() {
        return this.#allShipsSunk;
    }

    get shipPositions() {
        return this.#shipPositions;
    }

    get successfulAttacks() {
        return this.#successfulAttacks;
    }

    get missedAttacks() {
        return this.#missedAttacks;
    }

    get board() {
        return this.#board;
    }

    numTimesShipHit(shipType) {
        if (!(typeof shipType === "string" || shipType instanceof String)) { 
            throw new TypeError("shipType needs to be a string!");
        }

        const shipTypeLC = shipType.toLowerCase();
        if (shipTypeLC !== "destroyer" && shipTypeLC !== "submarine" && shipTypeLC !== "cruiser" &&
            shipTypeLC !== "battleship" && shipTypeLC !== "carrier") {
                throw new Error("shipType needs to be a destroyer, submarine, cruiser, battleship, or carrier!");
        }

        switch (shipTypeLC) {
            case "destroyer":
                return this.#destroyer.numTimesHit;
            case "submarine":
                return this.#submarine.numTimesHit;
            case "cruiser":
                return this.#cruiser.numTimesHit;
            case "battleship":
                return this.#battleship.numTimesHit;
            case "carrier":
                return this.#carrier.numTimesHit;
        }
    }

    // Returns false if the position has already been attacked
    receiveAttack(row, col) {
        if (this.#allShipsSunk || this.#successfulAttacks.has(`(${row}, ${col})`)) {
            return false;
        }

        let hit = false;
        if (this.#shipPositions.has(`(${row}, ${col})`)) {
            hit = true;
            const shipType = this.#shipPositions.get(`(${row}, ${col})`);

            switch (shipType) {
                case 'destroyer':
                    this.#destroyer.hit();
                    break;
                case 'submarine':
                    this.#submarine.hit();
                    break;
                case 'cruiser':
                    this.#cruiser.hit();
                    break;
                case 'battleship':
                    this.#battleship.hit();
                    break;
                case 'carrier':
                    this.#carrier.hit();
                    break;
            }
        }

        if (hit) {
            this.#successfulAttacks.add(`(${row}, ${col})`);
            this.#board[row][col] = 'OO';
        } else {
            this.#missedAttacks.add(`(${row}, ${col})`);
            this.#board[row][col] = 'XX';
        }

        if (this.#destroyer.beenSunk &&
            this.#submarine.beenSunk &&
            this.#cruiser.beenSunk &&
            this.#battleship.beenSunk &&
            this.#carrier.beenSunk
        ) {
            this.#allShipsSunk = true;
        }

        return true;
    }

    placeShip(shipType, orientation, direction, startRow, startCol) {
        if (!(typeof shipType === "string" || shipType instanceof String)) { 
            throw new TypeError("shipType needs to be a string!");
        }

        const shipTypeLC = shipType.toLowerCase();
        const orientationLC = orientation.toLowerCase();
        const directionLC = direction.toLowerCase();
        if (shipTypeLC !== "destroyer" && shipTypeLC !== "submarine" && shipTypeLC !== "cruiser" &&
            shipTypeLC !== "battleship" && shipTypeLC !== "carrier") {
                throw new Error("shipType needs to be a destroyer, submarine, cruiser, battleship, or carrier!");
        }

        if (orientationLC !== "horizontal" && orientationLC !== "vertical") {
            throw new Error("Orientation must be horizontal or vertical!")
        }

        if (directionLC !== "up" && directionLC !== "down" && directionLC !== "left" && directionLC !== "right") {
            throw new Error("Direction must be up, down, left, or right!");
        }

        if (((directionLC === "left" || directionLC === "right") && orientationLC === "vertical") ||
            ((directionLC === "up" || directionLC === "down") && orientationLC === "horizontal")) {
            throw new Error("The orientation and direction entered are not compatible!");
        }

        let shipLength;
        let shipSymbol;
        switch (shipTypeLC) {
            case "destroyer":
                shipLength = 2;
                shipSymbol = 'DE';
                break;
            case "submarine":
                shipLength = 3;
                shipSymbol = 'SU';
                break;
            case "cruiser":
                shipLength = 3;
                shipSymbol = 'CR';
                break;
            case "battleship":
                shipLength = 4;
                shipSymbol = 'BA';
                break;
            case "carrier":
                shipLength = 5;
                shipSymbol = 'CA';
                break;
        }

        const proposedShipPositions = [];
        switch (direction) {
            case "up": {
                // Board bounds check
                const endRow = startRow - (shipLength - 1);
                if (endRow < 0) {
                    return false;
                }

                for (let row = startRow; row >= endRow; row--) {
                    proposedShipPositions.push([row, startCol]);
                }

                break;
            }
            case "down": {
                // Board bounds check
                const endRow = startRow + (shipLength - 1);
                if (endRow > 9) {
                    return false;
                }

                for (let row = startRow; row <= endRow; row++) {
                    proposedShipPositions.push([row, startCol]);
                }

                break;
            }
            case "left": {
                // Board bounds check
                const endCol = startCol - (shipLength - 1);
                if (endCol < 0) {
                    return false;
                }

                for (let col = startCol; col >= endCol; col--) {
                    proposedShipPositions.push([startRow, col]);
                }

                break;
            }
            case "right": {
                // Board bounds check
                const endCol = startCol + (shipLength - 1);
                if (endCol > 9) {
                    return false;
                }

                for (let col = startCol; col <= endCol; col++) {
                    proposedShipPositions.push([startRow, col]);
                }

                break;
            }
        }

        // Check if one of the squares is currently occupied by a ship
        for (const [row, col] of proposedShipPositions) {
            if (this.#shipPositions.has(`(${row}, ${col})`)) {
                return false;
            }
        }

        // Place the ship on the gameboard
        for (const [row, col] of proposedShipPositions) {
            this.#board[row][col] = shipSymbol;
            this.#shipPositions.set(`(${row}, ${col})`, shipTypeLC);
        }

        return true;
    }

    prettyPrint() {
        for (const row of this.#board) {
            console.log(row.join('  '));
        }
    }

    printMap() {
        console.log(this.#shipPositions);
    }  

    resetBoard() {
        this.#board.length = 0;
        this.#shipPositions.clear();
        this.#successfulAttacks.clear();
        this.#missedAttacks.clear();

        this.#destroyer = new Ship(2);
        this.#submarine = new Ship(3, true);
        this.#cruiser = new Ship(3);
        this.#battleship = new Ship(4);
        this.#carrier = new Ship(5);

        for (let row = 0; row < 10; row++) {
            let currRow = [];
            for (let col = 0; col < 10; col++) {
                currRow.push('WA');
            }
            this.#board.push(currRow);
        }

        this.#randomlyPlaceShips();
    }

    #randomlyPlaceShips() {
        let [orientation, direction, startRow, startCol] = this.#randomOrDirPos();

        while (!this.placeShip("destroyer", orientation, direction, startRow, startCol)) {
            [orientation, direction, startRow, startCol] = this.#randomOrDirPos();
        }

        while (!this.placeShip("submarine", orientation, direction, startRow, startCol)) {
            [orientation, direction, startRow, startCol] = this.#randomOrDirPos();
        }

        while (!this.placeShip("cruiser", orientation, direction, startRow, startCol)) {
            [orientation, direction, startRow, startCol] = this.#randomOrDirPos();
        }

        while (!this.placeShip("battleship", orientation, direction, startRow, startCol)) {
            [orientation, direction, startRow, startCol] = this.#randomOrDirPos();
        }

        while (!this.placeShip("carrier", orientation, direction, startRow, startCol)) {
            [orientation, direction, startRow, startCol] = this.#randomOrDirPos();
        }
    }

    #randomOrDirPos() {
        let orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
        
        let direction;
        switch (orientation) {
            case "horizontal": 
                direction = Math.random() < 0.5 ? "left" : "right";
                break;
            case "vertical":
                direction = Math.random() < 0.5 ? "up" : "down";
                break;
        }

        const startRow = Math.floor(Math.random() * 10);
        const startCol = Math.floor(Math.random() * 10);

        return [orientation, direction, startRow, startCol];
    }
}
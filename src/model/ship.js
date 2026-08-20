export default class Ship {
    #length;
    #shipType;
    #numTimesHit = 0;
    #beenSunk = false;

    constructor(length, submarine = false) {
        if (length !== 3 && submarine) {
            throw new Error("Ship cannot be submarine since its length is not 3!");
        }

        if (length < 2 || length > 5) {
            throw new RangeError("Ship length must be between 2 and 5!");
        }

        this.#length = length;

        switch (length) {
            case 2:
                this.#shipType = "Destroyer";
                break;
            case 3:
                submarine ? this.#shipType = "Submarine" : this.#shipType = "Cruiser";
                break;
            case 4:
                this.#shipType = "Battleship";
                break;
            case 5:
                this.#shipType = "Carrier";
                break;
        }
    }

    get length() {
        return this.#length;
    }

    get shipType() {
        return this.#shipType;
    }

    get beenSunk() {
        return this.#beenSunk;
    }

    hit() {
        if (!this.#beenSunk) {
            this.#numTimesHit++;

            if (this.#numTimesHit === this.#length) {
                this.#beenSunk = true;
            }
        }
    }

    isSunk() {
        return this.#beenSunk;
    }
}
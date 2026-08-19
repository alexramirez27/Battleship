export default class Ship {
    #length;
    #numTimesHit = 0;
    #beenSunk = false;

    constructor(length) {
        this.#length = length;
    }

    get length() {
        return this.#length;
    }

    hit() {
        this.#numTimesHit++;
    }

    isSunk() {

    }
}
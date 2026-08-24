import Gameboard from "./gameboard.js";

export default class Player {
    #gameboard = new Gameboard();
    #playerType;
    #playerColor;

    constructor(playerType, playerNum = 1) {
        if (!(typeof playerType === "string" || playerType instanceof String)) { 
            throw new TypeError("playerType needs to be a string!");
        }

        const playerTypeLC = playerType.toLowerCase();
        if (playerTypeLC !== "real" && playerTypeLC !== "computer") {
            throw new Error("playerType needs to be real or computer!");
        }

        if (playerNum < 1 || playerNum > 2) {
            throw new RangeError("playerNum needs to be either 1 or 2!");
        }

        this.#playerType = playerTypeLC;
        this.#playerColor = playerNum === 1
            ? "blue"
            : "red";    
    }

    get playerType() {
        return this.#playerType;
    }

    get playerColor() {
        return this.#playerColor;
    }

    get gameboard() {
        return this.#gameboard;
    }
}
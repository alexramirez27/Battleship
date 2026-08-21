import Gameboard from "./gameboard.js";

export default class Player {
    #gameboard = new Gameboard();
    #playerType;

    constructor(playerType) {
        if (!(typeof playerType === "string" || playerType instanceof String)) { 
            throw new TypeError("playerType needs to be a string!");
        }

        const playerTypeLC = playerType.toLowerCase();
        if (playerTypeLC !== "real" && playerTypeLC !== "computer") {
            throw new Error("playerType needs to be real or computer!");
        }

        this.#playerType = playerTypeLC;
    }

    get playerType() {
        return this.#playerType;
    }
}
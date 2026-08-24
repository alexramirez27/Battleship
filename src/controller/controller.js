import View from "../view/view.js";
import Player from "../model/player.js";

export default class Controller {
    #player1;
    #player2;
    #gameType;
    #view = new View();

    set gameType(gameType) {
        if (!(typeof gameType === "string" || gameType instanceof String)) { 
            throw new TypeError("gameType needs to be a string!");
        }

        const gameTypeLC = gameType.toLowerCase();
        if (gameTypeLC !== "2-player" && gameTypeLC !== "computer") {
            throw new Error("playerType needs to be real or computer!");
        }

        this.#player1 = new Player("real");
        this.#player2 = gameType === "2-player" 
            ? new Player("real") 
            : new Player("computer"); 
    }

    controllerInit() {
        this.#view.viewInit();

        // 2-Player Mode
        const twoPlayerBtn = document.querySelector('#menu-btns button:nth-child(1)');
        twoPlayerBtn.addEventListener('click', () => {
            this.gameType = "2-player";
            this.#view.displayPlayerView(this.#player1, this.#player2);
        });

        const computerBtn = document.querySelector('#menu-btns button:nth-child(2)');
        computerBtn.addEventListener('click', () => {
            this.gameType = "computer";
        });
    }
}
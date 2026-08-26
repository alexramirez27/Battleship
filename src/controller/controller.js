import View from "../view/view.js";
import Player from "../model/player.js";

export default class Controller {
    #view = new View();
    #gameType;
    #player1;
    #player2;
    #currentPlayer;
    #currentOpponent;
    #currentPage = "home";
    #turn = 0;

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
            ? new Player("real", 2) 
            : new Player("computer", 2); 
        
        this.#currentPlayer = this.#player1;
        this.#currentOpponent = this.#player2;
    }

    controllerInit() {
        this.#view.viewInit();
        this.#homePageListeners();
    }

    #homePageListeners() {
        // 2-player mode
        const twoPlayerBtn = document.querySelector('#menu-btns button:nth-child(1)');
        twoPlayerBtn.addEventListener('click', () => {
            this.#currentPage = "setup";
            this.gameType = "2-player";
            this.#view.boardSetupPage(this.#currentPlayer, this.#currentOpponent);
            this.#setupPageListeners();
        });

        // Computer mode
        const computerBtn = document.querySelector('#menu-btns button:nth-child(2)');
        computerBtn.addEventListener('click', () => {
            this.#currentPage = "setup";
            this.gameType = "computer";
        });
    }

    #setupPageListeners() {
        const main = document.querySelector('main');
        const setupContainer = document.querySelector('#setup-container');
        const buttonsContainer = document.querySelector('#setup-buttons');

        const randomBtn = document.querySelector('#random-btn');
        randomBtn.addEventListener("click", () => {
            const gameboard = document.querySelector('.gameboard');
            setupContainer.removeChild(gameboard);
            setupContainer.removeChild(buttonsContainer);

            this.#currentPlayer.gameboard.resetBoard();
            
            this.#view.displayBoard(setupContainer, this.#currentPlayer, "player");
            setupContainer.appendChild(buttonsContainer);
        });

        const acceptBtn = document.querySelector('#accept-btn');
        acceptBtn.addEventListener("click", () => {
            this.#turn++;

            if (this.#turn % 2 === 0) {
                this.#currentPlayer = this.#player1;
                this.#currentOpponent = this.#player2;
            } else {
                this.#currentPlayer = this.#player2;
                this.#currentOpponent = this.#player1;
            }

            // Player 2 is real
            if (this.#currentPlayer.playerType === "real") {
                main.removeChild(setupContainer);
                if (this.#turn >= 2) {
                    this.#currentPage = "game-page";
                }
                this.#nextPlayerModal();
            }

            // Player 2 is computer
        });
    }

    #gamePageListeners() {

    }

    async #nextPlayerModal() {
        await this.#transitionModal('next-player-turn');

        if (this.#currentPage === "setup") {
            this.#view.boardSetupPage(this.#currentPlayer);
            this.#setupPageListeners();
        } else if (this.#currentPage === "game-page") {
            this.#view.gameViewPage(this.#currentPlayer, this.#currentOpponent);
            this.#gamePageListeners();
        }
    }

    async #transitionModal(dialogId) {
        const currPlayerNum = document.querySelector('#curr-player-num');
        currPlayerNum.textContent = this.#turn % 2 === 0? 1 : 2;

        const countdown = document.querySelector('#countdown');
        countdown.textContent = '3';

        this.#view.openModal(dialogId);

        await this.#delay(1000);
        countdown.textContent = '2';
        await this.#delay(1000);
        countdown.textContent = '1';
        await this.#delay(1000);

        this.#view.closeModal(dialogId);
    }

    #delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
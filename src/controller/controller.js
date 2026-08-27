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
    #turn = 1;
    #map = new Map([
        ['A1', '00'], ['A2', '01'], ['A3', '02'], ['A4', '03'], ['A5', '04'],
        ['A6', '05'], ['A7', '06'], ['A8', '07'], ['A9', '08'], ['A10', '09'],

        ['B1', '10'], ['B2', '11'], ['B3', '12'], ['B4', '13'], ['B5', '14'],
        ['B6', '15'], ['B7', '16'], ['B8', '17'], ['B9', '18'], ['B10', '19'],

        ['C1', '20'], ['C2', '21'], ['C3', '22'], ['C4', '23'], ['C5', '24'],
        ['C6', '25'], ['C7', '26'], ['C8', '27'], ['C9', '28'], ['C10', '29'],

        ['D1', '30'], ['D2', '31'], ['D3', '32'], ['D4', '33'], ['D5', '34'],
        ['D6', '35'], ['D7', '36'], ['D8', '37'], ['D9', '38'], ['D10', '39'],

        ['E1', '40'], ['E2', '41'], ['E3', '42'], ['E4', '43'], ['E5', '44'],
        ['E6', '45'], ['E7', '46'], ['E8', '47'], ['E9', '48'], ['E10', '49'],

        ['F1', '50'], ['F2', '51'], ['F3', '52'], ['F4', '53'], ['F5', '54'],
        ['F6', '55'], ['F7', '56'], ['F8', '57'], ['F9', '58'], ['F10', '59'],

        ['G1', '60'], ['G2', '61'], ['G3', '62'], ['G4', '63'], ['G5', '64'],
        ['G6', '65'], ['G7', '66'], ['G8', '67'], ['G9', '68'], ['G10', '69'],

        ['H1', '70'], ['H2', '71'], ['H3', '72'], ['H4', '73'], ['H5', '74'],
        ['H6', '75'], ['H7', '76'], ['H8', '77'], ['H9', '78'], ['H10', '79'],

        ['I1', '80'], ['I2', '81'], ['I3', '82'], ['I4', '83'], ['I5', '84'],
        ['I6', '85'], ['I7', '86'], ['I8', '87'], ['I9', '88'], ['I10', '89'],

        ['J1', '90'], ['J2', '91'], ['J3', '92'], ['J4', '93'], ['J5', '94'],
        ['J6', '95'], ['J7', '96'], ['J8', '97'], ['J9', '98'], ['J10', '99'],
    ]);

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
        const setupContainer = main.querySelector('#setup-container');
        const buttonsContainer = setupContainer.querySelector('#setup-buttons');

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
            // this.#turn++;

            if (this.#turn % 2 === 1) {
                this.#currentPlayer = this.#player2;
                this.#currentOpponent = this.#player1;
            } else {
                this.#currentPlayer = this.#player1;
                this.#currentOpponent = this.#player2;
            }

            this.#turn++;

            // Player 2 is a real player
            if (this.#currentPlayer.playerType === "real") {
                main.removeChild(setupContainer);
                if (this.#turn > 2) {
                    this.#currentPage = "game-page";
                }
                this.#nextPlayerModal();
            }

            // Player 2 is computer
        });
    }

    #gamePageListeners() {
        const opponentBoard = document.querySelector('#boards-container .gameboard:nth-child(2)');
        const cells = opponentBoard.querySelectorAll('.cell');

        const main = document.querySelector('main');

        cells.forEach(cell => {
            cell.style.cursor = 'pointer';

            cell.addEventListener('click', async () => {
                const pos = cell.id.split('-')[1];
                const posConverted = this.#map.get(pos);
                const [row, col] = posConverted.split('');
                // console.log(`row = ${row}, col = ${col}`);
                this.#currentOpponent.gameboard.receiveAttack(row, col);

                // console.log(`current turn = ${this.#turn}`);

                this.#view.gameViewPage(this.#currentPlayer, this.#currentOpponent);

                await this.#delay(1000);

                // Remove current gameboards from the DOM
                const boardsContainer = main.querySelector('#boards-container');
                main.removeChild(boardsContainer);

                // Check if all ships sunk
                if (this.#currentOpponent.gameboard.allShipsSunk) {
                    console.log('All of the opponents ships have been sunk!');
                }

                if (this.#turn % 2 === 1) {
                    this.#currentPlayer = this.#player2;
                    this.#currentOpponent = this.#player1;
                } else {
                    this.#currentPlayer = this.#player1;
                    this.#currentOpponent = this.#player2;
                }

                this.#turn++;

                this.#nextPlayerModal();
            });
        })
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
        currPlayerNum.textContent = this.#turn % 2 === 1 ? 1 : 2;

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
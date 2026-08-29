import View from "../view/view.js";
import Player from "../model/player.js";
import hitAudio from "../audio/ship-hit.mp3";
import splashAudio from "../audio/water-splash.mp3";

export default class Controller {
    #audioOn = true;
    #hitAudio = new Audio(hitAudio);
    #splashAudio = new Audio(splashAudio);
    #view = new View();
    #gameType = "";
    #player1 = null;
    #player2 = null;
    #currentPlayer = null;
    #currentOpponent = null;
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
        const soundOff = document.querySelector('#sound-off');
        const soundOn = document.querySelector('#sound-on');

        soundOff.addEventListener("click", () => {
            soundOff.style.display = "none";
            soundOn.style.display = "block";
            this.#audioOn = true;
        });

        soundOn.addEventListener("click", () => {
            soundOn.style.display = "none";
            soundOff.style.display = "block";
            this.#audioOn = false;
        });

        // Hide the sound-off svg initially
        soundOff.style.display = "none";

        this.#homePageListeners();
    }

    #resetState() {
        this.#gameType = "";
        this.#player1 = null;
        this.#player2 = null;
        this.#currentPlayer = null;
        this.#currentOpponent = null;
        this.#currentPage = "home";
        this.#turn = 1;

        const main = document.querySelector('main');

        const firstDialogHeader = main.querySelector('#next-player-turn > h1');
        firstDialogHeader.textContent = "";

        const spanPlayerNum = document.createElement('span');
        spanPlayerNum.id = "curr-player-num";
        const spanSecondLine = document.createElement('span');
        spanSecondLine.className = "text-second-line";
        firstDialogHeader.append("Player", spanPlayerNum, "'s turn in", document.createElement('br'), spanSecondLine);

        const secondDialogHeader = main.querySelector('#winner > h1');
        secondDialogHeader.textContent = "";

        const shipDescriptors = main.querySelector('#ship-descriptors');
        this.#view.removeFromDOM(main, shipDescriptors);
    }

    #homePageListeners() {
        const main = document.querySelector('main');
        const menuBtns = main.querySelector('#menu-btns');
        const twoPlayerBtn = menuBtns.querySelector('button:nth-child(1)');
        const computerBtn = menuBtns.querySelector('button:nth-child(2)');

        // 2-player mode
        twoPlayerBtn.addEventListener('click', () => {
            this.#view.removeFromDOM(main, menuBtns);
            this.#currentPage = "setup";
            this.gameType = "2-player";

            console.log(`typeof this.#currentPlayer = ${typeof this.#currentPlayer}, typeof this.#currentOpponent = ${typeof this.#currentOpponent}`);

            this.#view.boardSetupPage(this.#currentPlayer, this.#currentOpponent);
            this.#setupPageListeners();
            this.#view.shipDescriptors();
            this.#view.shipSunkMessage();
        });

        // Computer mode
        computerBtn.addEventListener('click', () => {
            this.#view.removeFromDOM(main, menuBtns);
            this.#currentPage = "setup";
            this.gameType = "computer";

            console.log(`typeof this.#player1 = ${typeof this.#player1}, typeof this.#player2 = ${typeof this.#player2}`);

            this.#view.boardSetupPage(this.#player1, this.#player2);
            this.#setupPageListeners();
            this.#view.shipDescriptors();
            this.#view.shipSunkMessage();
        });
    }

    #setupPageListeners() {
        const main = document.querySelector('main');
        const setupContainer = main.querySelector('#setup-container');
        const buttonsContainer = setupContainer.querySelector('#setup-buttons');

        const randomBtn = document.querySelector('#random-btn');
        randomBtn.addEventListener("click", () => {
            const gameboard = document.querySelector('.gameboard');

            this.#view.removeFromDOM(setupContainer, gameboard, buttonsContainer);

            this.#currentPlayer.gameboard.resetBoard();
            
            this.#view.displayBoard(setupContainer, this.#currentPlayer, "player");
            setupContainer.appendChild(buttonsContainer);
        });

        const acceptBtn = document.querySelector('#accept-btn');
        acceptBtn.addEventListener("click", () => {
            // Swap players if the second player is a real player
            if (this.#player2.playerType === "real") {
                if (this.#turn % 2 === 1) {
                    this.#currentPlayer = this.#player2;
                    this.#currentOpponent = this.#player1;
                } else {
                    this.#currentPlayer = this.#player1;
                    this.#currentOpponent = this.#player2;
                }
            }

            if (this.#player2.playerType === "real") {
                this.#turn++;
            }

            this.#view.removeFromDOM(main, setupContainer);

            // Player 2 is a real player
            if (this.#currentPlayer.playerType === "real" && this.#turn > 2) {
                this.#currentPage = "game-page";
            // Player 2 is computer
            } else if (this.#player2.playerType === "computer") {
                this.#currentPage = "game-page";
            }

            this.#nextPlayerModal();
        });
    }

    #gamePageListeners() {
        console.log(`typeof this.#player1 = ${typeof this.#player1}, typeof this.#player2 = ${typeof this.#player2}`);

        console.log(`current turn = ${this.#turn}`);

        const opponentBoard = document.querySelector('#boards-container .gameboard:nth-child(2)');
        const cells = opponentBoard.querySelectorAll('.cell');

        const main = document.querySelector('main');

        // Player's turn
        if ((this.#player2.playerType === "computer" && this.#turn % 2 === 1) ||
            (this.#player2.playerType === "real")) {
            this.#clickOpponentGameboard(cells, main);
        // Computer's turn
        } else if (this.#player2.playerType === "computer" && this.#turn % 2 === 0) {
            // Computer's turn
            this.#computerAttacksRandom();
            this.#turn++;

            this.#nextPlayerModal();
        }
    }

    #clickOpponentGameboard(cells, main) {
        cells.forEach(cell => {
            let pos = cell.id.split('-')[1];
            let posConverted = this.#map.get(pos);
            let [row, col] = posConverted.split('');

            if (
                !this.#currentOpponent.gameboard.successfulAttacks.has(`(${row}, ${col})`) &&
                !this.#currentOpponent.gameboard.missedAttacks.has(`(${row}, ${col})`)
            ) {
                cell.style.cursor = 'pointer';
            }

            cell.addEventListener('click', async () => {
                pos = cell.id.split('-')[1];
                posConverted = this.#map.get(pos);
                [row, col] = posConverted.split('');

                // Do not execute if the cell has already been attacked
                if (
                    this.#currentOpponent.gameboard.successfulAttacks.has(`(${row}, ${col})`) ||
                    this.#currentOpponent.gameboard.missedAttacks.has(`(${row}, ${col})`)
                ) {
                    return;
                }

                this.#currentOpponent.gameboard.receiveAttack(row, col);
                if (this.#audioOn && this.#currentOpponent.gameboard.recentHit === "hit") {
                    this.#hitAudio.play();
                } else if (this.#audioOn && this.#currentOpponent.gameboard.recentHit === "miss") {
                    this.#splashAudio.play();
                }

                let sunkShip = false;
                let shipSunkMessage = document.querySelector('#ship-sunk-message');
                const main = document.querySelector('main');
                if (this.#currentOpponent.gameboard.sunkAShip) {
                    shipSunkMessage.textContent = 
                        `${this.#currentOpponent.playerName}'s ${this.#currentOpponent.gameboard.mostRecentShipSunk} has been sunk!`;
                    shipSunkMessage.style.visibility = 'visible';
                    sunkShip = true;
                }

                if (this.#player2.playerType === "real") {
                    this.#view.gameViewPage(this.#currentPlayer, this.#currentOpponent);
                }
                else if (this.#player2.playerType === "computer") {
                    this.#view.gameViewPage(this.#player1, this.#player2);
                }

                await this.#delay(2000);
                if (sunkShip) {
                    shipSunkMessage.style.visibility = 'hidden';
                } 

                // Remove current gameboards from the DOM
                const boardsContainer = main.querySelector('#boards-container');
                this.#view.removeFromDOM(main, boardsContainer);

                // Check if all ships sunk
                if (this.#currentOpponent.gameboard.allShipsSunk) {
                    console.log('All of the opponents ships have been sunk!');
                    if (this.#turn % 2 === 1) {
                        this.#playerWinsModal("Player 1");
                    } else {
                        if (this.#currentOpponent.playerType === "real") {
                            this.#playerWinsModal("Player 2");
                        } else if (this.#currentOpponent.playerType === "computer") {
                            this.#playerWinsModal("Computer");
                        }
                    }

                    return;
                }

                // Swap currentPlayer if both players are real
                if (this.#player2.playerType === "real") {
                    if (this.#turn % 2 === 1) {
                        this.#currentPlayer = this.#player2;
                        this.#currentOpponent = this.#player1;
                    } else {
                        this.#currentPlayer = this.#player1;
                        this.#currentOpponent = this.#player2;
                    }
                }
                
                this.#turn++;

                this.#nextPlayerModal();

                console.log("Player 1 gameboard:")
                this.#player1.gameboard.prettyPrint();

                console.log("Player 2 gameboard:");
                this.#player2.gameboard.prettyPrint();
            });
        });
    }

    #computerAttacksRandom() {
        let randRow = Math.floor(Math.random() * 10);
        let randCol = Math.floor(Math.random() * 10);

        while (
            this.#player1.gameboard.successfulAttacks.has(`(${randRow}, ${randCol})`) ||
            this.#player1.gameboard.missedAttacks.has(`(${randRow}, ${randCol})`)
        ) {
            randRow = Math.floor(Math.random() * 10);
            randCol = Math.floor(Math.random() * 10);
        }

        this.#player1.gameboard.receiveAttack(randRow, randCol);
        if (this.#audioOn && this.#player1.gameboard.recentHit === "hit") {
            this.#hitAudio.play();
        } else if (this.#audioOn && this.#player1.gameboard.recentHit === "miss") {
            this.#splashAudio.play();
        }
    }

    async #playerWinsModal(playerWinner) {
        const winner = document.querySelector('#winner > h1');
        // winner.textContent = ` playerWinner`;
        const secondLine = document.createElement('span');
        secondLine.className = 'text-second-line';
        secondLine.textContent = "wins!";
        winner.append(playerWinner, document.createElement('br'), secondLine);

        await this.#transitionModal('winner');

        this.#view.homePage();
        this.#homePageListeners();
        this.#resetState();
    }

    async #nextPlayerModal() {
        console.log("Called nextPlayerModal");

        if (this.#player2.playerType === "real") {
            await this.#transitionModal('next-player-turn');
        }

        // We are still in the setup page
        if (this.#currentPage === "setup") {
            console.log('1');
            this.#view.boardSetupPage(this.#currentPlayer);
            this.#setupPageListeners();
        // We are now in the game page and both players are real
        } else if (this.#currentPage === "game-page" && this.#player2.playerType === "real") {
            console.log('2');
            this.#view.gameViewPage(this.#currentPlayer, this.#currentOpponent);
            this.#gamePageListeners();
        // We are now in the game page but we are playing against the computer
        } else if (this.#currentPage === "game-page" && this.#player2.playerType === "computer") {
            console.log('3');
            console.log("Playing against the computer woohoo!");
            this.#view.gameViewPage(this.#player1, this.#player2);
            this.#gamePageListeners();
        }
    }

    async #transitionModal(dialogId) {
        console.log("Called transitionModal");

        const currPlayerNum = document.querySelector('#curr-player-num');
        currPlayerNum.textContent = this.#turn % 2 === 1 ? " 1" : " 2";

        let secondLine = document.querySelector('.text-second-line');

        const shipDescriptors = document.querySelector('#ship-descriptors');
        shipDescriptors.style.visibility = "hidden";

        this.#view.openModal(dialogId);

        if (dialogId === 'next-player-turn') {
            secondLine.textContent = '3';
            await this.#delay(1000);
            secondLine.textContent = '2';
            await this.#delay(1000);
            secondLine.textContent = '1';
            await this.#delay(1000);
        } else if (dialogId === 'winner') {
            await this.#delay(3000);
        }

        this.#view.closeModal(dialogId);

        shipDescriptors.style.visibility = "visible";
    }

    #delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
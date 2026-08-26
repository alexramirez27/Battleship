export default class View {
    #map = new Map([
        [0, 'A'], [1, 'B'], [2, 'C'], [3, 'D'], [4, 'E'],
        [5, 'F'], [6, 'G'], [7, 'H'], [8, 'I'], [9, 'J']
    ]);

    viewInit() {
        const soundOff = document.querySelector('#sound-off');
        const soundOn = document.querySelector('#sound-on');

        soundOff.addEventListener("click", () => {
            soundOff.style.display = "none";
            soundOn.style.display = "block";
        });

        soundOn.addEventListener("click", () => {
            soundOn.style.display = "none";
            soundOff.style.display = "block";
        });

        // Hide the sound-off svg initially
        soundOff.style.display = "none";

        const twoPlayerBtn = document.querySelector('#menu-btns button:nth-child(1)');
        const computerBtn = document.querySelector('#menu-btns button:nth-child(2)');

        twoPlayerBtn.addEventListener("click", () => {
            twoPlayerBtn.style.display = "none";
            computerBtn.style.display = "none";
        });

        computerBtn.addEventListener("click", () => {
            twoPlayerBtn.style.display = "none";
            computerBtn.style.display = "none";
        });
    }

    openModal(dialogId) {
        const dialog = document.querySelector(`#${dialogId}`);
        dialog.showModal();
    }

    closeModal(dialogId) {
        const dialog = document.querySelector(`#${dialogId}`);
        dialog.close();
    }

    boardSetupPage(player) {
        const main = document.querySelector('main');
        main.style.backgroundColor = player.playerColor === "blue"
            ? "var(--blue-background, blue)"
            : "var(--red-background, blue)";

        const setupContainer = document.createElement('div');
        setupContainer.id = "setup-container";
        
        this.displayBoard(setupContainer, player, "player");

        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = "setup-buttons";

        const randomBtn = document.createElement('button');
        randomBtn.id = "random-btn";
        randomBtn.textContent = "Randomize";
        buttonsContainer.appendChild(randomBtn);

        const acceptBtn = document.createElement('button');
        acceptBtn.id = "accept-btn";
        acceptBtn.textContent = "Accept";
        buttonsContainer.appendChild(acceptBtn);
        
        setupContainer.appendChild(buttonsContainer);

        main.appendChild(setupContainer);
    }

    gameViewPage(player, opponent) {
        const main = document.querySelector('main');
        main.style.backgroundColor = player.playerColor === "blue"
            ? "var(--blue-background, blue)"
            : "var(--red-background, blue)";

        const boardsContainer = document.createElement('div');
        boardsContainer.id = "boards-container";

        this.displayBoard(boardsContainer, player, "player");
    
        this.displayBoard(boardsContainer, opponent, "opponent");

        main.appendChild(boardsContainer);
    }

    displayBoard(boardsContainer, player, playerType) {
        if (!(typeof playerType === "string" || playerType instanceof String)) { 
            throw new TypeError("playerType needs to be a string!");
        }

        const playerTypeLC = playerType.toLowerCase();
        if (playerTypeLC !== "player" && playerTypeLC !== "opponent") {
                throw new Error("playerType needs to be player or opponent!");
        }
        
        // Player's gameboard
        const playerBoard = player.gameboard.board;
        player.gameboard.prettyPrint();
        console.log('============================');

        const playerBoardDiv = document.createElement('div');
        playerBoardDiv.className = "gameboard";

        // Player Ships
        const playerBoardHeader = document.createElement('h1');
        playerBoardHeader.className = "player-header";

        const playerNum = player.playerColor === "blue" ? 1 : 2;
        playerBoardHeader.textContent = `Player ${playerNum} Ships`;
        playerBoardDiv.appendChild(playerBoardHeader);
        
        // Player's column numbers
        this.#addColNums(playerBoardDiv);

        // Display player's gameboard
        if (playerTypeLC === "player") {
            this.#buildPlayerBoard(playerBoard, playerBoardDiv);
        } else if(playerTypeLC === "opponent") {
            this.#buildOpponentBoard(playerBoard, playerBoardDiv);
        }

        boardsContainer.appendChild(playerBoardDiv);
    }

    #addColNums(boardDiv) {
        const colNums = document.createElement('div');
        colNums.className = "col-nums-div";

        const emptyCol = document.createElement('h1');
        emptyCol.className = "col-num";
        colNums.appendChild(emptyCol);

        for (let col = 1; col <= 10; col++) {
            const currCol = document.createElement('h1');
            currCol.className = "col-num";
            currCol.textContent = col;
            colNums.appendChild(currCol);
        }
        
        boardDiv.appendChild(colNums);
    }

    #buildPlayerBoard(playerBoard, playerBoardDiv) {
        for (let row = 0; row < 10; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = "board-row";
            rowDiv.id = `row-${this.#map.get(row)}`;

            const rowLetter = document.createElement('h1');
            rowLetter.className = "row-letter";
            rowLetter.textContent = this.#map.get(row);
            rowDiv.appendChild(rowLetter);

            for (let col = 0; col < 10; col++) {
                const cellDiv = document.createElement('div');
                cellDiv.className = "cell";
                cellDiv.id = `player-${this.#map.get(row)}${col}`;

                switch(playerBoard[row][col]) {
                    case 'WA':
                        cellDiv.style.backgroundColor = "var(--water, blue)";
                        break;
                    case 'XX':
                        cellDiv.style.backgroundColor = "var(--water, blue)";
                        cellDiv.style.color = "var(--blue-text, black)";
                        cellDiv.textContent = 'X';
                        break;
                    case 'OO':
                        cellDiv.style.backgroundColor = "var(--ship, darkslategrey)";
                        cellDiv.style.color = "var(--red-text, red)";
                        cellDiv.textContent = 'O';
                        break;
                    case 'DE':
                        cellDiv.style.backgroundColor = "var(--ship, darkslategrey)";
                        cellDiv.style.color = "white";
                        cellDiv.textContent = 'DE';
                        break;
                    case 'SU':
                        cellDiv.style.backgroundColor = "var(--ship, darkslategrey)";
                        cellDiv.style.color = "white";
                        cellDiv.textContent = 'SU';
                        break;
                    case 'CR':
                        cellDiv.style.backgroundColor = "var(--ship, darkslategrey)";
                        cellDiv.style.color = "white";
                        cellDiv.textContent = 'CR';
                        break;
                    case 'BA':
                        cellDiv.style.backgroundColor = "var(--ship, darkslategrey)";
                        cellDiv.style.color = "white";
                        cellDiv.textContent = 'BA';
                        break;
                    case 'CA':
                        cellDiv.style.backgroundColor = "var(--ship, darkslategrey)";
                        cellDiv.style.color = "white";
                        cellDiv.textContent = 'CA';
                        break;
                }

                rowDiv.appendChild(cellDiv);
            }
            playerBoardDiv.appendChild(rowDiv);
        }
    }

    #buildOpponentBoard(opponentBoard, opponentBoardDiv) {
        for (let row = 0; row < 10; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = "board-row";
            rowDiv.id = `row-${this.#map.get(row)}`;

            const rowLetter = document.createElement('h1');
            rowLetter.className = "row-letter";
            rowLetter.textContent = this.#map.get(row);
            rowDiv.appendChild(rowLetter);

            for (let col = 0; col < 10; col++) {
                const cellDiv = document.createElement('div');
                cellDiv.className = "cell";
                cellDiv.id = `opp-${this.#map.get(row)}${col}`;

                switch(opponentBoard[row][col]) {
                    case 'WA':
                        cellDiv.style.backgroundColor = "var(--water, blue)";
                        break;
                    case 'XX':
                        cellDiv.style.backgroundColor = "var(--water, blue)";
                        cellDiv.style.color = "var(--blue-text, black)";
                        cellDiv.textContent = 'X';
                        break;
                    case 'OO':
                        cellDiv.style.backgroundColor = "var(--water, blue)";
                        cellDiv.style.color = "var(--red-text, red)";
                        cellDiv.textContent = 'O';
                        break;
                    case 'DE':
                        cellDiv.style.backgroundColor = "var(--water, blue)";
                        break;
                    case 'SU':
                        cellDiv.style.backgroundColor = "var(--water, blue)";
                        break;
                    case 'CR':
                        cellDiv.style.backgroundColor = "var(--water, blue)";
                        break;
                    case 'BA':
                        cellDiv.style.backgroundColor = "var(--water, blue)";
                        break;
                    case 'CA':
                        cellDiv.style.backgroundColor = "var(--water, blue)";
                        break;
                }

                rowDiv.appendChild(cellDiv);
            }
            opponentBoardDiv.appendChild(rowDiv);
        }
    }
}
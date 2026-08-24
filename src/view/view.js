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

    displayPlayerView(player, opponent) {
        const main = document.querySelector('main');
        main.style.backgroundColor = player.playerColor === "blue"
            ? "var(--blue-background, blue)"
            : "var(--red-background, blue)";

        const gameboards = document.createElement('div');
        gameboards.className = "gameboards";

        const playerBoard = player.gameboard.board;
        // Display player's gameboard
        const playerBoardDiv = document.createElement('div');
        for (let row = 0; row < 10; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = "board-row";
            rowDiv.id = `row-${this.#map.get(row)}`;
            for (let col = 0; col < 10; col++) {
                const cellDiv = document.createElement('div');
                cellDiv.className = "cell";
                cellDiv.id = `${this.#map.get(row)}${col}`;
                cellDiv.style.width = "48px";
                cellDiv.style.height = "48px";

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

        gameboards.appendChild(playerBoardDiv);

        // const opponentBoard = opponent.gameboard.board;
        // // Display opponent's gameboard
        // const opponentBoardDiv = document.createElement('div');
        // for (let row = 0; row < 10; row++) {
        //     const rowDiv = document.createElement('div');
        //     rowDiv.className = "board-row";
        //     rowDiv.id = `row-${this.#map.get(row)}`;
        //     for (let col = 0; col < 10; col++) {
        //         const cellDiv = document.createElement('div');
        //         cellDiv.id = `${this.#map.get(row)}${col}`;
        //         cellDiv.style.width = "48px";
        //         cellDiv.style.height = "48px";

        //         switch(opponentBoard[row][col]) {
        //             case 'WA':
        //                 cellDiv.style.backgroundColor = "var(--water, blue)";
        //                 break;
        //             case 'XX':
        //                 cellDiv.style.backgroundColor = "var(--water, blue)";
        //                 cellDiv.style.color = "var(--blue-text, black)";
        //                 cellDiv.textContent = 'X';
        //                 break;
        //             case 'OO':
        //                 cellDiv.style.backgroundColor = "var(--water, blue)";
        //                 cellDiv.style.color = "var(--red-text, red)";
        //                 cellDiv.textContent = 'O';
        //                 break;
        //             case 'DE':
        //                 cellDiv.style.backgroundColor = "var(--ship, darkslategrey)";
        //                 cellDiv.style.color = "white";
        //                 cellDiv.textContent = 'DE';
        //                 break;
        //             case 'SU':
        //                 cellDiv.style.backgroundColor = "var(--water, blue)";
        //                 break;
        //             case 'CR':
        //                 cellDiv.style.backgroundColor = "var(--water, blue)";
        //                 break;
        //             case 'BA':
        //                 cellDiv.style.backgroundColor = "var(--water, blue)";
        //                 break;
        //             case 'CA':
        //                 cellDiv.style.backgroundColor = "var(--water, blue)";
        //                 break;
        //         }

        //         rowDiv.appendChild(cellDiv);
        //     }
        //     opponentBoardDiv.appendChild(rowDiv);
        // }

        // gameboards.appendChild(opponentBoardDiv);

        main.appendChild(gameboards);
    }
}
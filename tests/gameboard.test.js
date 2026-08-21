import Gameboard from "../src/model/gameboard.js"

describe("constructor", () => {
    test("Every cell in the board is water initially", () => {
        const row = ['WA', 'WA', 'WA', 'WA', 'WA', 'WA', 'WA', 'WA', 'WA', 'WA'];
        const gameboard = new Gameboard();

        for (const row of gameboard.board) {
            expect(row).toEqual(row);
        }
    });
});

describe("placeShip", () => {
    test("Place a ship in a specific and valid location in the board", () => {
        const gameboard = new Gameboard();
        const place = gameboard.placeShip("destroyer", "horizontal", "right", 0, 0);

        expect(place).toBe(true);
        expect(gameboard.board[0][0]).toBe("DE");
        expect(gameboard.board[0][1]).toBe("DE");
        expect(gameboard.board[0][2]).toBe("WA");
    });

    test("Try to place ship in a taken spot", () => {
        const gameboard = new Gameboard();
        gameboard.placeShip("destroyer", "horizontal", "right", 0, 0);
        
        const place = gameboard.placeShip("carrier", "horizontal", "right", 0, 1);

        expect(place).toBe(false);
        expect(gameboard.board[0][0]).toBe("DE");
        expect(gameboard.board[0][1]).toBe("DE");
        expect(gameboard.board[0][2]).toBe("WA");
    });
});

describe("receiveAttack", () => {
    test("Attack hit a ship on the board", () => {
        const gameboard = new Gameboard();
        gameboard.placeShip("destroyer", "horizontal", "right", 0, 0);

        let numTimesHit = gameboard.numTimesShipHit("destroyer");
        expect(numTimesHit).toBe(0);

        gameboard.receiveAttack(0, 0);
        numTimesHit = gameboard.numTimesShipHit("destroyer");
        expect(numTimesHit).toBe(1);

        gameboard.receiveAttack(0, 1);
        numTimesHit = gameboard.numTimesShipHit("destroyer");
        expect(numTimesHit).toBe(2);
    });

    test("The missed attack gets recorded", () => {
        const gameboard = new Gameboard();
        gameboard.placeShip("destroyer", "horizontal", "right", 0, 0);

        gameboard.receiveAttack(0, 2);
        expect(gameboard.missedAttacks).toEqual(new Set(['(0, 2)']));

        gameboard.receiveAttack(6, 4);
        expect(gameboard.missedAttacks).toEqual(new Set(['(0, 2)', '(6, 4)']));
    });
});

describe("allShipsSunk", () => {
    test("All ships sunk", () => {
        const gameboard = new Gameboard();
        gameboard.placeShip("destroyer", "horizontal", "right", 0, 0);
        gameboard.placeShip("submarine", "horizontal", "right", 1, 0);
        gameboard.placeShip("cruiser", "horizontal", "right", 2, 0);
        gameboard.placeShip("battleship", "horizontal", "right", 3, 0);
        gameboard.placeShip("carrier", "horizontal", "right", 4, 0);

        // Sink destroyer
        gameboard.receiveAttack(0, 0);
        gameboard.receiveAttack(0, 1);
        expect(gameboard.allShipsSunk).toBe(false);

        // Sink submarine
        gameboard.receiveAttack(1, 0);
        gameboard.receiveAttack(1, 1);
        gameboard.receiveAttack(1, 2);
        expect(gameboard.allShipsSunk).toBe(false);

        // Sink cruiser
        gameboard.receiveAttack(2, 0);
        gameboard.receiveAttack(2, 1);
        gameboard.receiveAttack(2, 2);
        expect(gameboard.allShipsSunk).toBe(false);

        // Sink battleship
        gameboard.receiveAttack(3, 0);
        gameboard.receiveAttack(3, 1);
        gameboard.receiveAttack(3, 2);
        gameboard.receiveAttack(3, 3);
        expect(gameboard.allShipsSunk).toBe(false);

        // Sink carrier
        gameboard.receiveAttack(4, 0);
        gameboard.receiveAttack(4, 1);
        gameboard.receiveAttack(4, 2);
        gameboard.receiveAttack(4, 3);
        gameboard.receiveAttack(4, 4);
        expect(gameboard.allShipsSunk).toBe(true);
    });
});
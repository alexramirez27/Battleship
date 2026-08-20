import Ship from "../src/model/ship.js";

describe("constructor", () => {
    test("Ship length in range", () => {
        const ship2 = new Ship(2);
        expect(ship2.length).toBe(2);

        const ship3 = new Ship(3);
        expect(ship3.length).toBe(3);

        const ship4 = new Ship(4);
        expect(ship4.length).toBe(4);

        const ship5 = new Ship(5);
        expect(ship5.length).toBe(5);
    });

    test("Ship length out of range", () => {
        expect(() => new Ship(1)).toThrow(RangeError);
        expect(() => new Ship(6)).toThrow(RangeError);
    });

    test("Ship types", () => {
        const ship2 = new Ship(2);
        expect(ship2.shipType).toBe("Destroyer");

        const ship3 = new Ship(3);
        expect(ship3.shipType).toBe("Cruiser");

        const ship3Sub = new Ship(3, true);
        expect(ship3Sub.shipType).toBe("Submarine");

        const ship4 = new Ship(4);
        expect(ship4.shipType).toBe("Battleship");

        const ship5 = new Ship(5);
        expect(ship5.shipType).toBe("Carrier");
    });
});

describe("hit and isSunk", () => {
    test("Ship hit multiple times", () => {
        const ship = new Ship(5);
        ship.hit();
        expect(ship.isSunk()).toBe(false);

        ship.hit();
        expect(ship.isSunk()).toBe(false);

        ship.hit();
        expect(ship.isSunk()).toBe(false);

        ship.hit();
        expect(ship.isSunk()).toBe(false);

        ship.hit();
        expect(ship.isSunk()).toBe(true);
    })
});


import Player from "../src/model/player.js";

describe("constructor", () => {
    test("Invalid arguments passed into constructor", () => {
        expect(() => new Player(25)).toThrow(TypeError);
        expect(() => new Player("something")).toThrow(Error);
    });
});

describe("playerType", () => {
    test("playerType is real or computer", () => {
        const realPlayer = new Player("real");
        expect(realPlayer.playerType).toBe("real");
        
        const computerPlayer = new Player("computer");
        expect(computerPlayer.playerType).toBe("computer");
    });
});
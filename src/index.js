// index.js
import "./view/styles.css";

import Gameboard from "./model/gameboard.js";

import Controller from "./controller/controller.js";

const controller = new Controller();
controller.controllerInit();




// const gameboard = new Gameboard();

// gameboard.randomlyPlaceShips();
// gameboard.prettyPrint();
// gameboard.printMap();
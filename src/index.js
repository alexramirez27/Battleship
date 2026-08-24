// index.js
import "./view/styles.css";
import { greeting } from "./greeting.js";

import Gameboard from "./model/gameboard.js";

import Controller from "./controller/controller.js";

const controller = new Controller();
controller.controllerInit();

console.log(greeting);

const gameboard = new Gameboard();

// gameboard.randomlyPlaceShips();
gameboard.prettyPrint();
gameboard.printMap();
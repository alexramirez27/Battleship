// index.js
import "./view/styles.css";
import { greeting } from "./greeting.js";

import Gameboard from "./model/gameboard.js";

console.log(greeting);

const gameboard = new Gameboard();

gameboard.randomlyPlaceShips();
gameboard.prettyPrint();
gameboard.printMap();
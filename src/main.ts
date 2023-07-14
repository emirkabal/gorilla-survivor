import Game from "./classes/Game";
import "./style.css";

document.addEventListener("contextmenu", (e) => e.preventDefault());

const game = new Game();
game.start();

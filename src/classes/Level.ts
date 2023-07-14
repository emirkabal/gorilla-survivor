import { Application } from "pixi.js";
import Character from "./Character";

export default class Level {
  app: Application;
  name: string;
  characters: Character[];
  constructor(app: Application, name: string, characters: Character[]) {
    this.app = app;
    this.name = name;
    this.characters = characters;
    console.log("Level created: " + this.name);
    this.app.stage.addChild(...this.characters);

    // this.app.ticker.maxFPS = 60;
    this.app.ticker.add(this.onTick.bind(this));
  }

  async start() {}

  async onTick() {
    console.log("Level ticked: " + this.name);
  }
}

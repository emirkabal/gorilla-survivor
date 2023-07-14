import { Application, Text } from "pixi.js";
import TextureLoader from "./TextureLoader";
import LevelBanana from "./levels/LevelBanana";
import Memory from "./Memory";
import TexturesData from "../utils/textures";

export default class Game {
  app: Application;

  constructor() {
    this.app = new Application({
      background: "#1099bb",
      width: window.innerWidth - 21,
      height: window.innerHeight - 21,
    });
    // @ts-ignore
    document.querySelector("#app").appendChild(this.app.view);
    Memory.set("app", this.app);
  }

  async loadTextures() {
    const loadingText = new Text("Loading... 0%");
    loadingText.y = this.app.screen.height - 50;
    loadingText.x = this.app.screen.width - (loadingText.width + 80);
    this.app.stage.addChild(loadingText);
    const textures = new TextureLoader(TexturesData);
    let interval = setInterval(() => {
      loadingText.text = "Loading: " + textures.progress * 100 + "%";
      if (textures.progress === 1) {
        clearInterval(interval);
      }
    }, 1);
    await textures.start();
    this.app.stage.removeChild(loadingText);
  }

  async fpsIndicator() {
    const fps = new Text("FPS: " + this.app.ticker.FPS.toFixed(2));
    fps.x = this.app.screen.width - fps.width * 0.4;
    fps.y = 0;
    fps.scale.x = 0.4;
    fps.scale.y = 0.4;
    fps.style.fill = 0x00ff00;
    setInterval(() => {
      fps.text = "FPS: " + this.app.ticker.FPS.toFixed(2);
      this.app.stage.addChildAt(fps, 0);
    }, 60);
  }

  async start() {
    await this.loadTextures();
    this.fpsIndicator();

    const level = new LevelBanana(this.app);
    level.start();
  }
}

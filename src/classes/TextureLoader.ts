import { Assets, AssetsClass } from "pixi.js";
import Memory from "./Memory";

export default class TextureLoader {
  loader: AssetsClass;
  assets: string[][];
  progress: number;
  constructor(assets: string[][]) {
    this.loader = Assets;
    this.assets = assets;
    this.progress = 0;
  }

  async start() {
    await this.addAssets();
    await this.loadAssets();
  }

  async addAssets() {
    this.assets.forEach((asset) => {
      this.loader.add(asset[0], asset[1]);
    });
  }

  async loadAssets() {
    const list: string[] = [];
    this.assets.forEach((asset) => {
      list.push(asset[0]);
    });

    const textures = await this.loader.load(list, (progress) => {
      console.log("Loading assets... " + progress * 100 + "%");
      this.progress = progress;
    });

    Memory.set("textures", textures);
  }
}

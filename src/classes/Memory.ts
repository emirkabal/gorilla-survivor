import { Application, Resource, Texture } from "pixi.js";

class Memory {
  data: {
    app: Application;
    textures: {
      [key: string]: Texture<Resource>;
    };
    [key: string]: any;
  };
  constructor() {
    this.data = {
      app: new Application(),
      textures: {},
    };
  }
  getAll() {
    return this.data;
  }
  set(key: string, value: any) {
    this.data[key] = value;
  }
  get(key: string) {
    return this.data[key];
  }
  delete(key: string) {
    delete this.data[key];
  }
  clear() {
    this.data = {
      app: new Application(),
      textures: {},
    };
  }
}

export default new Memory();

import { Resource, Sprite, Texture } from "pixi.js";
import Memory from "./Memory";

export default class LevelItem extends Sprite {
  name: string;
  animation: boolean;
  settings: { [key: string]: any } = {};
  animationFunction?: () => void;
  constructor({
    name,
    animation = false,
    texture,
    intitalScale: { x: scaleX, y: scaleY },
    intitalAnchor: { x: anchorX, y: anchorY },
    animationFunction,
  }: {
    name: string;
    animation?: boolean;
    texture: Texture<Resource>;
    intitalScale: { x: number; y: number };
    intitalAnchor: { x: number; y: number };
    animationFunction?: () => void;
  }) {
    super(texture);
    this.name = name;
    this.animation = animation;
    this.x = Memory.get("app").renderer.width / 2;
    this.y = Memory.get("app").renderer.height / 2;
    this.scale.x = scaleX;
    this.scale.y = scaleY;
    this.anchor.x = anchorX;
    this.anchor.y = anchorY;
    if (this.animation) {
      Memory.data.app.ticker.add(this.onTick.bind(this));
      this.animationFunction = animationFunction;
    }
  }

  async onTick() {
    if (this.animationFunction) {
      this.animationFunction();
    }
  }
}

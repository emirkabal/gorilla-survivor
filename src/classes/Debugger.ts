import { Graphics } from "pixi.js";
import Memory from "./Memory";

export default class Debugger {
  active: boolean = true;
  debugList: any[] = [];
  max: number = 100;

  constructor(max?: number) {
    if (max) this.max = max;
  }

  draw(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number = 0xff0000,
    lineWidth: number = 5,
    id: number | string = Math.floor(Math.random() * 1000000),
    rounded: boolean = false
  ) {
    if (!this.active) return;
    if (this.debugList.length >= this.max) {
      const item = this.debugList.shift();
      Memory.data.app.stage.removeChild(item);
    }
    this.debugList.forEach((item: any) => {
      if (item.id === id) {
        Memory.data.app.stage.removeChild(item);
      }
    });
    const graphics = new Graphics();
    graphics.lineStyle(lineWidth, color);
    if (rounded) {
      graphics.drawCircle(x, y, 5);
    } else {
      graphics.drawRect(x, y, width, height);
    }
    const added = Memory.data.app.stage.addChild(graphics);
    // @ts-ignore
    added.id = id;
    this.debugList.push(added);
  }

  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: number = 0xff0000,
    lineWidth: number = 5,
    id: number | string = Math.floor(Math.random() * 1000000)
  ) {
    if (!this.active) return;
    if (this.debugList.length >= this.max) {
      const item = this.debugList.shift();
      Memory.data.app.stage.removeChild(item);
    }
    this.debugList.forEach((item: any) => {
      if (item.id === id) {
        Memory.data.app.stage.removeChild(item);
      } else if (typeof item.id === "string" && item.id.startsWith("line-")) {
        Memory.data.app.stage.removeChild(item);
      }
    });
    const graphics = new Graphics();
    graphics.lineStyle(lineWidth, color);
    graphics.moveTo(x1, y1);
    graphics.lineTo(x2, y2);
    const added = Memory.data.app.stage.addChild(graphics);
    // @ts-ignore
    added.id = id;
    this.debugList.push(added);
  }
}

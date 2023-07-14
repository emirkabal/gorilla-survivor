import { AnimatedSprite, Resource, Texture } from "pixi.js";
import Memory from "./Memory";
import Movement from "./Movement";
import Debugger from "./Debugger";

export default class Character extends AnimatedSprite {
  name: string = "noname";
  controlling: boolean = false;
  walkSpeed: number = 0.55;
  movement: Movement = new Movement();
  debugger: Debugger = new Debugger(500);
  debug: boolean = false;
  lastX: number = 0;
  lastY: number = 0;
  ai: any[] = [];
  isDead: boolean = false;
  constructor({
    name,
    textures,
    debug = false,
    controlling = false,
    intitalScale,
    intitalAnchor,
    walkSpeed = 0.55,
  }: {
    name: string;
    debug?: boolean;
    controlling?: boolean;
    textures: Texture<Resource>[];
    intitalScale: number;
    intitalAnchor: number;
    walkSpeed?: number;
  }) {
    super(textures);
    this.play();
    this.animationSpeed = 0.1;
    this.name = name;
    this.controlling = controlling;
    this.x = Memory.get("app").renderer.width / 2;
    this.y = Memory.get("app").renderer.height / 2;
    this.anchor.set(intitalAnchor);
    this.scale.set(intitalScale);
    this.walkSpeed = walkSpeed;
    this.debug = debug;
    if (this.controlling) {
      Memory.data.app.renderer.events.domElement.addEventListener(
        "touchstart",
        (e: TouchEvent) => {
          const x = e.touches[0].clientX;
          const y = e.touches[0].clientY;
          this.simulateMove(x, y);
        }
      );
    }
    Memory.data.app.ticker.add(this.onTick.bind(this));
  }

  setScale(scale: number) {
    this.scale.x = scale;
    this.scale.y = scale;
  }

  addScale(scale: number) {
    if (this.scale.x < 0) {
      this.scale.x -= scale;
    } else {
      this.scale.x += scale;
    }

    if (this.scale.y < 0) {
      this.scale.y -= scale;
    } else {
      this.scale.y += scale;
    }
  }

  get actualScale() {
    if (this.scale.x < 0) {
      return -this.scale.x;
    }
    return this.scale.x;
  }

  get flipped() {
    return this.scale.x < 0;
  }

  get isMoving() {
    return (
      this.movement.keys.includes("up") ||
      this.movement.keys.includes("down") ||
      this.movement.keys.includes("left") ||
      this.movement.keys.includes("right") ||
      this.ai.length > 0
    );
  }

  setFlip(flip: boolean) {
    if (flip) {
      this.scale.x = -Math.abs(this.scale.x);
    } else {
      this.scale.x = Math.abs(this.scale.x);
    }
  }

  moveTo(x: number, y: number) {
    if (this.isDead) return;
    const destination = this.replaceMoveableLocation(x, y);
    this.x = destination.x;
    this.y = destination.y;
  }

  async simulateMove(x: number, y: number) {
    if (this.isDead) return;
    this.clearAI();
    const destination = this.replaceMoveableLocation(x, y);
    const targetX = destination.x;
    const targetY = destination.y;
    const distanceThreshold = 1.95897;

    if (
      (this.x === x && this.y === y) ||
      (distanceThreshold > Math.abs(this.x - targetX) &&
        distanceThreshold > Math.abs(this.y - targetY))
    )
      return;

    const id = Math.floor(Math.random() * 1000000) + 1;
    this.ai.push(id);

    if (this.debug) {
      this.debugger.drawLine(
        this.x,
        this.y,
        targetX,
        targetY,
        0x0000ff,
        1,
        `line-${id}`
      );
    }

    const update = () => {
      if (this.isDead) {
        Memory.data.app.ticker.remove(update);
        return;
      }

      if (this.ai.includes(id)) {
        const deltaX = targetX - this.x;
        const deltaY = targetY - this.y;
        const angle = Math.atan2(deltaY, deltaX);
        const velocityX = Math.cos(angle) * this.walkSpeed;
        const velocityY = Math.sin(angle) * this.walkSpeed;

        this.x += velocityX;
        this.y += velocityY;

        this.checkMovement();

        if (
          Math.abs(this.x - targetX) < distanceThreshold &&
          Math.abs(this.y - targetY) < distanceThreshold
        ) {
          this.x = targetX;
          this.y = targetY;
          Memory.data.app.ticker.remove(update);
          this.ai.splice(this.ai.indexOf(id), 1);
        }
      } else {
        Memory.data.app.ticker.remove(update);
        return;
      }
    };

    Memory.data.app.ticker.add(update);
  }

  clearAI() {
    this.ai = [];
  }

  checkMovement() {
    const actualCharacterWidth = this.width * this.anchor.x;
    const actualCharacterHeight = this.height * this.anchor.y;

    if (this.x < actualCharacterWidth) this.x = actualCharacterWidth;
    if (this.x > Memory.data.app.screen.width - actualCharacterWidth)
      this.x = Memory.data.app.screen.width - actualCharacterWidth;

    if (this.y < actualCharacterHeight) this.y = actualCharacterHeight;
    if (this.y > Memory.data.app.screen.height - actualCharacterHeight)
      this.y = Memory.data.app.screen.height - actualCharacterHeight;

    this.setFlip(this.x < this.lastX);
  }

  replaceMoveableLocation(x: number, y: number) {
    const actualCharacterWidth = this.width * this.anchor.x;
    const actualCharacterHeight = this.height * this.anchor.y;

    if (x < actualCharacterWidth) x = actualCharacterWidth;
    if (x > Memory.data.app.screen.width - actualCharacterWidth)
      x = Memory.data.app.screen.width - actualCharacterWidth;

    if (y < actualCharacterHeight) y = actualCharacterHeight;

    return { x, y };
  }

  async onTick() {
    if (this.isDead) {
      this.alpha = 0;
      return;
    } else if (this.alpha === 0 && !this.isDead) {
      this.alpha = 1;
    }

    this.lastX = this.x;
    this.lastY = this.y;

    const actualCharacterWidth = this.width * this.anchor.x;
    const actualCharacterHeight = this.height * this.anchor.y;

    if (this.debug) {
      this.debugger.draw(
        this.x - actualCharacterWidth,
        this.y - actualCharacterHeight,
        this.width,
        this.height,
        0xff0000,
        1,
        this.name + "-character-hitbox"
      );
    }

    if (this.controlling && !this.isDead) {
      this.movement.keys.forEach((key) => {
        switch (key) {
          case "up":
            this.clearAI();
            this.y -= this.walkSpeed;
            break;
          case "down":
            this.clearAI();
            this.y += this.walkSpeed;
            break;
          case "left":
            this.clearAI();
            this.x -= this.walkSpeed;
            break;
          case "right":
            this.clearAI();
            this.x += this.walkSpeed;
            break;
          case "r":
            console.log(this.x, this.y);
            break;
          case "f":
            this.moveTo(15.25, 310);
            this.simulateMove(784.75, 310);
            break;
        }
      });
    }

    this.checkMovement();
  }
}

const movementKeys = {
  up: ["w", "ArrowUp"],
  down: ["s", "ArrowDown"],
  left: ["a", "ArrowLeft"],
  right: ["d", "ArrowRight"],
};
export default class Movement {
  pressing: boolean;
  keys: string[];
  constructor() {
    this.pressing = false;
    this.keys = [];
    this.start();
  }

  async start() {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      this.pressing = true;
      if (movementKeys.up.includes(e.key) && !this.keys.includes("up"))
        this.keys.push("up");
      else if (movementKeys.down.includes(e.key) && !this.keys.includes("down"))
        this.keys.push("down");
      else if (movementKeys.left.includes(e.key) && !this.keys.includes("left"))
        this.keys.push("left");
      else if (
        movementKeys.right.includes(e.key) &&
        !this.keys.includes("right")
      )
        this.keys.push("right");
      else if (!this.keys.includes(e.key)) this.keys.push(e.key);
    });
    document.addEventListener("keyup", (e: KeyboardEvent) => {
      this.pressing = false;

      if (movementKeys.up.includes(e.key))
        this.keys.splice(this.keys.indexOf("up"), 1);
      else if (movementKeys.down.includes(e.key))
        this.keys.splice(this.keys.indexOf("down"), 1);
      else if (movementKeys.left.includes(e.key))
        this.keys.splice(this.keys.indexOf("left"), 1);
      else if (movementKeys.right.includes(e.key))
        this.keys.splice(this.keys.indexOf("right"), 1);
      else this.keys.splice(this.keys.indexOf(e.key), 1);
    });
  }
}

import { Application, Text } from "pixi.js";
import Level from "../Level";
import CharacterGorilla from "../characters/CharacterGorilla";
import LevelItem from "../LevelItem";
import Memory from "../Memory";
import CharacterBunny from "../characters/CharacterBunny";
import Debugger from "../Debugger";
import Character from "../Character";

export default class LevelBanana extends Level {
  lastBananaSpawn: number = 0;
  bananas: LevelItem[] = [];
  collectedBananas: number = 0;
  helloGorillaMultiplier: number = 25;
  text = new Text("Muzları Topla!");
  text2 = new Text("Sonraki seviye: 25 muz");
  debugger = new Debugger();
  ai: boolean = false;
  constructor(app: Application) {
    super(app, "LevelBanana", [new CharacterGorilla(), new CharacterBunny()]);
    this.debugger.active = false;
  }

  async start() {
    this.text.x = 15;
    this.text.y = 15;
    this.text.style.fontSize = 18;
    this.text.style.fill = 0xffff00;

    this.text2.x = 15;
    this.text2.y = 35;
    this.text2.style.fill = 0xffff00;
    this.text2.style.fontSize = 14;

    this.app.stage.addChildAt(this.text, 0);
    this.app.stage.addChildAt(this.text2, 0);
    this.characters[1].isDead = true;
  }

  async onTick() {
    this.spawnBanana();

    // bunny pet

    this.bananas.forEach((banana, index) => {
      this.debugger.draw(
        banana.x - banana.width * banana.anchor.x,
        banana.y - banana.height * banana.anchor.y,
        1,
        1,
        0xffff00,
        1
      );
      this.characters.forEach((character) => {
        if (
          banana.x + banana.width > character.x &&
          banana.x < character.x + character.width &&
          banana.y + banana.height > character.y &&
          banana.y < character.y + character.height &&
          banana.settings.spawned
        ) {
          this.app.stage.removeChild(banana);
          this.bananas.splice(index, 1);
          this.collectedBananas++;
          this.text.text = "Toplanan: " + this.collectedBananas + " muz";

          if (this.collectedBananas % this.helloGorillaMultiplier === 0) {
            this.helloGorillaMultiplier = this.collectedBananas * 2;
            const helloGorilla = new LevelItem({
              name: "helloGorilla",
              texture: Memory.data.textures.gorilla2,
              intitalAnchor: { x: 0.5, y: 0.5 },
              intitalScale: { x: 0.15, y: 0.15 },
            });

            helloGorilla.x = helloGorilla.width * 0.5;
            helloGorilla.y = this.app.screen.height - helloGorilla.height * 0.5;
            this.app.stage.addChild(helloGorilla);
            setTimeout(() => {
              this.app.stage.removeChild(helloGorilla);
            }, 1000);
          } else if (this.collectedBananas === 25) {
            this.text2.text = "";
            this.characters[1].isDead = false;
            this.characters[1].x =
              this.characters[0].x + this.characters[0].width;
            this.characters[1].y =
              this.characters[0].y + this.characters[0].height;
          }
        }
      });
    });

    if (this.characters[0].isMoving && !this.characters[1].isDead) {
      this.characters[1].simulateMove(
        this.characters[0].x + Math.abs(this.characters[0].width * 0.9),
        this.characters[0].y + Math.abs(this.characters[0].width * 0.9)
      );
    }
  }

  getBestBananaLocation(character: Character) {
    let bestBanana: LevelItem | undefined;
    let bestDistance: number = this.app.screen.width + this.app.screen.height;
    this.bananas
      .filter((banana) => banana.settings.spawned)
      .forEach((banana) => {
        const distance =
          Math.abs(character.x - banana.x) + Math.abs(character.y - banana.y);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestBanana = banana;
        }
      });
    if (bestBanana) {
      return {
        x: bestBanana.x,
        y: bestBanana.y,
      };
    } else {
      return {
        x: 0,
        y: 0,
      };
    }
  }

  getBananaSpawnLocation() {
    let x = Math.random() * (this.app.screen.width - 100) + 50;
    let y = Math.random() * (this.app.screen.height - 100) + 50;
    let isGood = false;
    let tries = 0;
    while (!isGood) {
      tries++;
      isGood = true;
      this.bananas.forEach((banana) => {
        let radius = 100;
        if (
          (x + radius > banana.x - banana.width * banana.anchor.x &&
            x - radius < banana.x + banana.width * banana.anchor.x &&
            y + radius > banana.y - banana.height * banana.anchor.y &&
            y - radius < banana.y + banana.height * banana.anchor.y) ||
          (x + radius >
            this.characters[0].x -
              this.characters[0].width * this.characters[0].anchor.x &&
            x - radius <
              this.characters[0].x +
                this.characters[0].width * this.characters[0].anchor.x &&
            y + radius >
              this.characters[0].y -
                this.characters[0].height * this.characters[0].anchor.y &&
            y - radius <
              this.characters[0].y +
                this.characters[0].height * this.characters[0].anchor.y)
        ) {
          x = Math.random() * (this.app.screen.width - 100) + 50;
          y = Math.random() * (this.app.screen.height - 100) + 50;
          isGood = false;
        }
      });
      if (tries > 100) {
        isGood = true;
      }
    }
    return {
      x,
      y,
      tries,
    };
  }

  get maxBananaCount() {
    return Math.floor((this.app.screen.width * this.app.screen.height) / 20000);
  }

  get bestSpawnTime() {
    return 1000 - this.collectedBananas * 1;
  }

  async spawnBanana() {
    if (
      this.lastBananaSpawn + this.bestSpawnTime > Date.now() ||
      this.bananas.length >= this.maxBananaCount
    )
      return;
    this.lastBananaSpawn = Date.now();
    const banana = new LevelItem({
      name: "banana",
      animation: true,
      texture: Memory.data.textures.banana,
      intitalAnchor: { x: 0.5, y: 0.5 },
      intitalScale: { x: 0, y: 0 },
      animationFunction: () => {
        banana.settings.spawned = true;
        let up = true;
        if (banana.scale.x > 0.1) {
          up = false;
          // banana.settings.spawned = true;
        }
        if (banana.scale.x < 0.01) up = true;
        if (up) {
          banana.scale.x += 0.001;
          banana.scale.y += 0.001;
        } else {
          banana.scale.x -= 0.001;
          banana.scale.y -= 0.001;
        }
      },
    });
    const { x, y, tries } = this.getBananaSpawnLocation();
    if (tries > 100) return;
    banana.x = x;
    banana.y = y;
    this.app.stage.addChildAt(banana, 0);
    this.bananas.push(banana);
  }
}

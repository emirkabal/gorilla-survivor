import Character from "../Character";
import Memory from "../Memory";

export default class CharacterGorilla extends Character {
  constructor(debug?: boolean) {
    super({
      name: "gorilla",
      debug,
      controlling: true,
      textures: [Memory.get("textures").gorilla],
      intitalScale: 0.5,
      intitalAnchor: 0.5,
      walkSpeed: 3.6,
    });
  }
}

import Character from "../Character";
import Memory from "../Memory";

export default class CharacterBunny extends Character {
  constructor(debug?: boolean) {
    super({
      name: "bunny",
      debug,
      controlling: false,
      textures: [Memory.get("textures").bunny],
      intitalScale: 0.3,
      intitalAnchor: 0.5,
      walkSpeed: 0.945,
    });
  }
}

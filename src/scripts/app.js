"use strict"
import { game } from "../scripts/components/game"
import { menu } from "../scripts/components/menu"
import * as PIXI from "pixi.js"

PIXI.Loader.shared
  .add("./assets/images/player/playerState.json")
  .add("./assets/images/player/playerState2.json")
  .add("./assets/images/platforme/plateformeJump.json")
  .add("./assets/images/platforme/plateform_start.json")
  .add("./assets/images/monstre/monstreState.json")
  .add("./assets/images/relique/relique.json")
  .add("./assets/images/montagne.json")
  .add("./assets/images/UI/ui.json")
  .add("./assets/images/portail/portail.json")
  .add("./assets/images/Menu/menu.json")
  .load(e => {})
  .onComplete.add(e => {
    menu()
    game()
  })

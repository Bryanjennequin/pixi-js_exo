/* eslint-disable quote-props */
"use strict"
import * as PIXI from "pixi.js"
import * as Bump from "bump.js"
import { keyboard } from "./components/keyFunction"
const bump = new Bump(PIXI)

const canvas = document.getElementById("canvas")
const _width = window.innerWidth
const _height = window.innerHeight

const game = new PIXI.Application({
  view: canvas,
  width: _width,
  height: _height,
  backgroundColor: 0xffffff

})
const gameScene = new PIXI.Container()
game.stage.addChild(gameScene)

function setLevel (sheet) {
  const fanal = setFanal(sheet)
  const plateform = setPlateform(sheet)
  const player = setPlayer(sheet, plateform)
}

function setPlayer (sheet, plateform) {
  const playerSprite = new PIXI.Sprite(sheet.textures["perso_2.png"])
  const player = new Player(playerSprite, plateform)
  player.animate()
  player.display()
  player.control()
  return player
}
function setPlateform (sheet) {
  const allPlateform = []
  const platformSprite = new PIXI.Sprite(sheet.textures["plateform.png"])

  for (let i = 0; i < 6; i++) {
    const plateform = new Plateform(platformSprite, _width / 2, 100 * i)
    allPlateform.push(plateform)
  }
  for (let y = 0; y < allPlateform.length; y++) {
    allPlateform[y].display()
  }

  return {
    allPlateform
  }
}
function setFanal (sheet) {
  const fanalSprite = new PIXI.Sprite(sheet.textures["fanal.png"])
  const fanal = new Fanal(fanalSprite, _width / 2, _height / 2)
  fanal.display()
  return {
    fanal
  }
}

PIXI.Loader.shared
  .add("assets/images/spriteSheet.json")
  .add("assets/images/plateform.png")
  .load(e => {
    const sheet = PIXI.Loader.shared.resources["assets/images/spriteSheet.json"].spritesheet
    setLevel(sheet)
  })
class Fanal {
  constructor (sprite, xPos, yPos) {
    this.sprite = sprite
    this.anchor = 0.5
    this.x = xPos
    this.y = yPos
  }

  display () {
    this.sprite.anchor.set(this.anchor)
    this.sprite.x = this.x
    this.sprite.y = this.y
    gameScene.addChild(this.sprite)
  }
}
class Player {
  constructor (sprite, plateform) {
    this.sprite = sprite
    this.x = game.renderer.width / 2 - this.sprite.width / 2
    this.y = 0
    this.vx = 0
    this.vy = 0
    this.gravity = 0
    this.left = keyboard("q")
    this.right = keyboard("d")
    this.up = keyboard("z")
    this.plateformArray = plateform
    this.plateforms = []
  }

  display () {
    for (let i = 0; i < this.plateformArray.allPlateform.length; i++) {
      this.plateforms.push(this.plateformArray.allPlateform[i].sprite)
    }
    console.log(this.plateforms)

    this.sprite.x = this.x
    this.sprite.y = this.y
    gameScene.addChild(this.sprite)
  }

  control () {
    this.left.press = (e) => {
      this.vx += -10
    }
    this.right.press = (e) => {
      this.vx = +10
    }
    this.up.press = (e) => {
      this.vy += -10
    }
    this.left.release = (e) => {
      this.vx = 0
    }
    this.right.release = (e) => {
      this.vx = 0
    }
    this.up.release = (e) => {
      this.vy = 0
      this.gravity = 0
    }
  }

  animate () {
    game.ticker.add(e => {
      const colision = bump.hit(this.sprite, this.plateforms)
      this.sprite.x += this.vx
      this.sprite.y += this.vy + this.gravity

      if (colision) {
        this.gravity = 0
      } else {
        this.gravity += 0.6
      }
    })
  }
}
class Plateform {
  constructor (sprite, xPos, yPos) {
    this.sprite = sprite
    this.anchor = 0.5
    this.x = xPos - this.sprite.width / 2
    this.y = yPos - this.sprite.height / 2
  }

  display () {
    this.sprite.x = this.x
    this.sprite.y = this.y
    console.log(this.y)

    gameScene.addChild(this.sprite)
  }
}

/* eslint-disable quote-props */
"use strict"
import * as PIXI from "pixi.js"
import * as Bump from "bump.js"
import { Viewport } from "pixi-viewport"
import { keyboard } from "./components/keyFunction"
import { collideTest } from "./components/collideTest"
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
const viewport = new Viewport({
  width: _width,
  height: _height
})

const gameScene = new PIXI.Container()

game.stage.addChild(gameScene)
gameScene.addChild(viewport)

function setLevel (sheet) {
//   const fanal = setFanal(sheet)
//   const plateform = setPlateform(sheet, player)
//   const player = setPlayer(sheet, plateform)
  const allPlateform = []
  const allFanal = []
  const player = new Player(sheet, allPlateform)

  player.display()
  player.animate()
  player.control()

  for (let i = 0; i < 20; i++) {
    const plateform = new Plateform(sheet, (200 * i) + _width / 2 * (i + 1), _height / 2)

    allPlateform.push(plateform)
  }
  for (let i = 0; i < 5; i++) {
    const fanal = new Fanal(sheet, _width / 2 * (i + 1), _height / 2 - 100)
    allFanal.push(fanal)
  }
  for (let y = 0; y < allFanal.length; y++) {
    allFanal[y].display()
    allFanal[y].check(player)
  }
  for (let y = 0; y < allPlateform.length; y++) {
    allPlateform[y].display()
    allPlateform[y].check(player)
  }
}

// function setPlayer (sheet, plateform) {

// }
// function setPlateform (sheet, player) {
//   return {
//     allPlateform
//   }
// }
// function setFanal (sheet) {
//   return {
//     fanal
//   }
// }

PIXI.Loader.shared
  .add("assets/images/spriteSheet.json")
  .add("assets/images/plateform.png")
  .load(e => {
    const sheet = PIXI.Loader.shared.resources["assets/images/spriteSheet.json"].spritesheet
    setLevel(sheet)
  })
class Fanal {
  constructor (sheet, xPos, yPos) {
    this.sprite = new PIXI.Sprite(sheet.textures["fanal.png"])
    this.anchor = 0.5
    this.x = xPos
    this.y = yPos
    this.activate = keyboard("e")
  }

  display () {
    this.sprite.anchor.set(this.anchor)
    this.sprite.x = this.x
    this.sprite.y = this.y
    gameScene.addChild(this.sprite)
  }

  check (player) {
    game.ticker.add(e => {
      this.colision = collideTest(this.sprite, player.sprite)
      this.activate.press = (e) => {
        if (this.colision) {
          console.log("bien ouej")
        }
      }
    })
  }
}
class Player {
  constructor (sheet, plateform) {
    this.sprite = new PIXI.Sprite(sheet.textures["perso_2.png"])
    this.x = _width / 2 - this.sprite.width / 2
    this.y = 0
    this.vx = 0
    this.vy = 0
    this.gravity = 0
    this.left = keyboard("q")
    this.right = keyboard("d")
    this.up = keyboard("z")
    this.down = keyboard("s")
    this.space = keyboard(" ")
    this.plateformArray = plateform
    this.plateforms = []
    this.hit = false
    this.stageVx = 0
    this.dash = 0
    this.dashed = false
    this.dashTimer = 0
  }

  display () {
    for (let i = 0; i < this.plateformArray.length; i++) {
      this.plateforms.push(this.plateformArray[i].sprite)
    }

    this.sprite.x = this.x
    this.sprite.y = this.y
    gameScene.addChild(this.sprite)
  }

  control () {
    this.left.press = (e) => {
      this.vx = -15
      this.stageVx = -15
    }
    this.right.press = (e) => {
      this.vx = 15
      this.stageVx = 15
    }
    this.up.press = (e) => {
      this.vy = -15
    }
    this.left.release = (e) => {
      this.vx = 0
      this.stageVx = 0
    }
    this.right.release = (e) => {
      this.vx = 0
      this.stageVx = 0
    }

    // this.space.press = (e) => {
    //   if (this.right.isDown && !this.dashed && this.dashTimer < 1) {
    //     this.dash = 50
    //     this.dashed = true
    //   }
    //   if (this.left.isDown && !this.dashed) {
    //     this.dash = -50
    //     this.dashed = true
    //   }
    // }
    this.space.release = (e) => {
      this.dash = 0
    }
  }

  animate () {
    game.ticker.add(e => {
      console.log(this.dashed)

      if (this.right.isDown && this.left.isDown) {
        this.vx = 0
        this.stageVx = 0
      }

      gameScene.pivot.x += this.vx + this.dash

      this.gravity += 0.6
      //   this.colision = bump.hit(this.sprite, this.plateforms)
      //   for (let i = 0; i < this.plateformArray.length; i++) {
      //     if (this.plateformArray[i].check(this.sprite)) {
      //       this.hit = this.plateformArray[i].colision
      //     } else {
      //       this.hit = this.plateformArray[i].colision
      //     }
      //   }

      this.sprite.x += this.vx + this.dash
      this.sprite.y += this.vy + this.gravity
    })
  }
}
class Plateform {
  constructor (sheet, xPos, yPos) {
    this.sprite = new PIXI.Sprite(sheet.textures["plateform.png"])
    this.x = xPos - this.sprite.width / 2
    this.y = yPos - this.sprite.height / 2
  }

  display () {
    this.sprite.x = this.x
    this.sprite.y = this.y
    gameScene.addChild(this.sprite)
  }

  check (player) {
    game.ticker.add(e => {
      this.colisionPlayer = collideTest(this.sprite, player.sprite)

      if (this.colisionPlayer) {
        player.gravity = -0.6
        player.vy = 0
        player.dashed = false
      }
    })
  }
}

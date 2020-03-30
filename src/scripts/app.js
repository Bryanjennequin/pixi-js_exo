/* eslint-disable quote-props */
"use strict"
import * as PIXI from "pixi.js"

import { keyboard } from "./components/keyFunction"
import { collideTest } from "./components/collideTest"

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
  const allPlateform = []
  const platInfo = [
    { x: _width / 2, y: _height / 2, moveX: false, moveY: false },
    { x: _width, y: _height / 2 - 200, moveX: false, moveY: false },
    { x: _width, y: _height / 2 + 200, moveX: false, moveY: false },
    { x: _width * 1.5, y: _height - 200, moveX: false, moveY: true },
    { x: _width * 2, y: _height / 2, moveX: true, moveY: false },
    { x: 2000000, y: _height - 200, moveX: false, moveY: false },
    { x: 2000000, y: _height - 200, moveX: false, moveY: false },
    { x: 2000000, y: _height - 200, moveX: false, moveY: false },
    { x: 2000000, y: _height - 200, moveX: false, moveY: false },
    { x: 2000000, y: _height - 200, moveX: false, moveY: false }
  ]

  const allFanal = []
  const player = new Player(sheet)

  player.display()
  player.animate()
  player.control()

  for (let i = 0; i < platInfo.length; i++) {
    const plateform = new Plateform(sheet, platInfo[i])

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
    allPlateform[y].animate()
    allPlateform[y].check(player)
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
  constructor (sheet, xPos, yPos) {
    this.sprite = new PIXI.Sprite(sheet.textures["fanal.png"])
    this.x = xPos - this.sprite.width / 4
    this.y = yPos - this.sprite.height / 4
    this.activate = keyboard("e")
  }

  display () {
    this.sprite.width = this.sprite.width / 2
    this.sprite.height = this.sprite.height / 2

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
  constructor (sheet) {
    this.sprite = new PIXI.Sprite(sheet.textures["perso_2.png"])
    this.x = _width / 2
    this.y = _height / 2 - this.sprite.height
    this.vx = 0
    this.vy = 0
    this.speed = 7.5
    this.gravity = 0
    this.left = keyboard("q")
    this.right = keyboard("d")
    this.up = keyboard("z")
    this.down = keyboard("s")
    this.space = keyboard(" ")
    this.hit = false
    this.stageVx = 0
    this.dash = 0
    this.updash = 0
    this.dashed = false
    this.updashed = false
    this.test = 0.5
    this.test2 = false
  }

  display () {
    this.sprite.width = this.sprite.width / 2
    this.sprite.height = this.sprite.height / 2
    this.sprite.x = this.x
    this.sprite.y = this.y
    gameScene.addChild(this.sprite)
  }

  control () {
    this.left.press = (e) => {
      this.vx = -this.speed
      this.stageVx = -this.speed
    }
    this.right.press = (e) => {
      this.vx = this.speed
      this.stageVx = this.speed
    }
    this.up.press = (e) => {
      this.vy = -15
      this.jumped = true
    }
    this.left.release = (e) => {
      this.vx = 0
      this.stageVx = 0
    }
    this.right.release = (e) => {
      this.vx = 0
      this.stageVx = 0
    }

    this.space.press = (e) => {

    }
    this.space.release = (e) => {
      if (this.right.isDown && !this.left.isDown && this.dashed === false) {
        this.dash = 50
        this.dashed = true
        setTimeout((e) => {
          this.dash = 0
        }, 50)
        setTimeout((e) => {
          this.dashed = false
        }, 2000)
      }
      if (this.left.isDown && !this.right.isDown && this.dashed === false) {
        this.dash = -50
        this.dashed = true
        setTimeout((e) => {
          this.dash = 0
        }, 50)
        setTimeout((e) => {
          this.dashed = false
        }, 2000)
      }
      if (this.up.isDown && this.updashed === false) {
        this.updash += -15
        this.gravity = 0
        this.updashed = true
        setTimeout((e) => {
          this.updash = 0
        }, 50)

        setTimeout((e) => {
          this.updashed = false
        }, 5000)
      }
    }
  }

  animate () {
    game.ticker.add(e => {
      if (this.right.isDown && this.left.isDown) {
        this.vx = 0
        this.stageVx = 0
      }

      gameScene.pivot.x += this.vx + this.dash

      this.gravity += this.test

      // console.log(this.gravity)

      this.sprite.x += this.vx + this.dash
      this.sprite.y += this.vy + this.updash + this.gravity
    })
  }
}
class Plateform {
  constructor (sheet, platInfo) {
    this.sprite = new PIXI.Sprite(sheet.textures["plateform.png"])
    this.x = platInfo.x - this.sprite.width / 4
    this.y = platInfo.y - this.sprite.height / 4
    this.platInfo = platInfo
    this.vx = 0

    this.vy = 5
  }

  display () {
    this.sprite.width = this.sprite.width / 2
    this.sprite.height = this.sprite.height / 2
    this.sprite.x = this.x
    this.sprite.y = this.y
    gameScene.addChild(this.sprite)
  }

  animate () {
    if (this.platInfo.moveY) {
      game.ticker.add(e => {
        if (this.sprite.y < -300) {
          this.sprite.y = _height + 300
        }

        this.sprite.y += -this.vy
      })
    }
    if (this.platInfo.moveX) {

    }
  }

  check (player) {
    game.ticker.add(e => {
      this.colisionPlayer = collideTest(this.sprite, player.sprite)
      console.log(player.test2)
      //   console.log(`${player.sprite.y + player.sprite.height}////${this.sprite.y - this.sprite.height / 2}`)
      if (this.colisionPlayer) {
        if (player.sprite.y + player.sprite.height > this.sprite.y - this.sprite.height / 2 && player.sprite.y + player.sprite.height < this.sprite.y + this.sprite.height / 2) {
          player.test = 0
          player.test2 = true
          player.gravity = -0
          player.vy = 0
          player.jumped = false
        }
        if (this.platInfo.moveY) {
          player.vy = -this.vy
        }
      }
    })
  }
}

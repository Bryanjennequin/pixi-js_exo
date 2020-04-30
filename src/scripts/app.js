/* eslint-disable quote-props */
"use strict"

// import * as intersects from "intersects"

import * as PIXI from "pixi.js"
import "pixi-plugin-bump"
import { keyboard } from "./components/keyFunction"
// import { collideTest } from "./components/collideTest"

// console.log(intersects)

const canvas = document.getElementById("canvas")
const _width = window.innerWidth
const _height = window.innerHeight
let score = 0
const game = new PIXI.Application({
  view: canvas,
  width: _width,
  height: _height,
  backgroundColor: 0x77B5FE

})
const b = new PIXI.extra.Bump()
const gameScene = new PIXI.Container()
game.stage.sortableChildren = true
gameScene.sortableChildren = true
game.ticker.maxFPS = 60
game.stage.addChild(gameScene)
function start () {
  const start = keyboard("Enter")
  const title = new PIXI.Text("Gravity Rush")
  const sentence = new PIXI.Text("appuye sur ' entrer ' pour commencer ")
  const touches = new PIXI.Text("avance avec ' d ', recule avec ' s ', saute avec ' z ', dash avec ' espace ' + direction voulue ")
  const action = new PIXI.Text("Allume TOUT les braseros pour finir, appuye sur ' e ' à leur contact")
  title.anchor.set(0.5)
  title.x = _width / 2
  title.y = _height / 2 - 100
  title.style.fill = "white"
  sentence.anchor.set(0.5)
  sentence.x = _width / 2
  sentence.y = _height / 2 - 50
  sentence.style.fill = "white"
  touches.anchor.set(0.5)
  touches.x = _width / 2
  touches.y = _height / 2
  touches.style.fill = "white"
  action.anchor.set(0.5)
  action.x = _width / 2
  action.y = _height / 2 + 50
  action.style.fill = "white"
  game.stage.addChild(title)
  game.stage.addChild(sentence)
  game.stage.addChild(touches)
  game.stage.addChild(action)

  start.press = (e) => {
    game.stage.removeChild(title)
    game.stage.removeChild(sentence)
    game.stage.removeChild(touches)
    game.stage.removeChild(action)
    PIXI.Loader.shared
      .add("./assets/images/spriteSheet.json")
      .load(e => {})
      .onComplete.add((e) => {
        const sheet = PIXI.Loader.shared.resources["./assets/images/spriteSheet.json"].spritesheet
        setLevel(sheet)
      })
  }
}
function gameOver () {
  const restart = keyboard("r")
  const title = new PIXI.Text("Game Over")
  const sentence = new PIXI.Text("appuye sur ' r ' pour recommencer ")
  title.anchor.set(0.5)
  title.x = _width / 2
  title.y = _height / 2
  title.style.fill = "white"
  sentence.anchor.set(0.5)
  sentence.x = _width / 2
  sentence.y = _height / 2 + 50
  sentence.style.fill = "white"
  game.stage.addChild(title)
  game.stage.addChild(sentence)

  game.ticker.stop()
  restart.press = (e) => {
    game.stage.removeChild(title)
    game.stage.removeChild(sentence)
    document.location.reload(false)
  }
}
function gameEnd () {
  const restart = keyboard("r")
  const title = new PIXI.Text("Merci d'avoir joué")
  const sentence = new PIXI.Text("appuye sur ' r ' pour recommencer ")
  const scoreEnd = new PIXI.Text(`tu as allumé ${score} brasero(s)`)
  title.anchor.set(0.5)
  title.x = _width / 2
  title.y = _height / 2
  title.style.fill = "white"
  sentence.anchor.set(0.5)
  sentence.x = _width / 2
  sentence.y = _height / 2 + 50
  sentence.style.fill = "white"
  scoreEnd.anchor.set(0.5)
  scoreEnd.x = _width / 2
  scoreEnd.y = _height / 2 + 100
  scoreEnd.style.fill = "white"

  game.stage.addChild(title)
  game.stage.addChild(sentence)
  game.stage.addChild(scoreEnd)

  game.ticker.stop()
  restart.press = (e) => {
    document.location.reload(false)
  }
}

function setLevel (sheet) {
  // const bg = new PIXI.Sprite(sheet.textures["background.png"])
  // bg.width = _width
  // bg.y = -_height / 4
  // bg.zIndex = -2
  // game.stage.addChild(bg)
  const allPlateform = []
  const platInfo = [
    { x: 1440 / 2, y: _height / 2, moveX: false, moveY: false, falling: false },
    { x: 1440, y: _height / 2 - 200, moveX: false, moveY: false, falling: false },
    { x: 1440, y: _height / 2 + 200, moveX: false, moveY: false, falling: false },
    { x: 1440 * 1.5, y: _height - 200, moveX: false, moveY: true, falling: false },
    { x: 1440 * 2, y: _height / 2, moveX: false, moveY: false, falling: false },
    { x: 1440 * 2.5, y: _height / 2, moveX: true, moveY: false, falling: false },
    { x: 1440 * 3, y: _height / 2, moveX: false, moveY: true, falling: false },
    { x: 1440 * 3.5, y: _height / 2 + 200, moveX: false, moveY: false, falling: false },
    { x: 1440 * 4, y: _height / 2, moveX: false, moveY: false, falling: false },
    { x: 1440 * 4.5, y: _height / 2 - 200, moveX: false, moveY: false, falling: false },
    { x: 1440 * 5, y: _height / 2, moveX: false, moveY: false, falling: true },
    { x: 1440 * 5.5, y: _height / 2, moveX: false, moveY: false, falling: true },
    { x: 1440 * 6, y: _height / 2, moveX: false, moveY: false, falling: true },
    { x: 1440 * 6.5, y: _height / 2, moveX: false, moveY: false, falling: false }
  ]
  const fanalInfo = [
    { x: 1440, y: _height / 2 - 200 },
    { x: 1440 * 2, y: _height / 2 },
    { x: 1440 * 6.5, y: _height / 2 }
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

  for (let i = 0; i < fanalInfo.length; i++) {
    const fanal = new Fanal(sheet, fanalInfo[i])
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

  const scoreText = new PIXI.Text(`brasero(s) allumé : ${score}`)
  game.stage.addChild(scoreText)
  game.ticker.add(e => {
    scoreText.text = `brasero(s) allumé : ${score}`
    if (score === fanalInfo.length) {
      gameEnd()
    }
  })
  setInterval(e => {
    const cloud = new Cloud(sheet)
    cloud.display()
    cloud.animate()
  }, 3000)
}
start()

class Cloud {
  constructor (sheet, playerPos) {
    this.playerPos = gameScene.pivot.x
    this.x = this.playerPos + _width
    this.y = Math.random() * _height / 2
    this.sheet = sheet
    this.sprite = new PIXI.Sprite(this.sheet.textures["cloud_1.png"])
    this.vx = Math.random() * 5 + 2
  }

  display () {
    if (Math.random() > 0.5) {
      this.sprite.texture = this.sheet.textures["cloud_2.png"]
    }
    if (Math.random() > 0.1) {
      this.sprite.zIndex = -3
    } else {
      this.sprite.zIndex = 1
    }
    this.sprite.x = this.x
    this.sprite.y = this.y

    gameScene.addChild(this.sprite)
  }

  animate () {
    game.ticker.add(e => {
      this.sprite.x += -this.vx
      // console.log(`${this.sprite.x} /// ${gameScene.pivot.x}`)
      if (this.sprite.x < gameScene.pivot.x - this.sprite.width) {
        gameScene.removeChild(this.sprite)
      }
    })
  }
}
class Fanal {
  constructor (sheet, fanalInfo) {
    this.sheet = sheet
    this.sprite = new PIXI.Sprite(this.sheet.textures["fanal_noFire.png"])
    this.x = fanalInfo.x
    this.y = fanalInfo.y - this.sprite.height / 3
    this.activate = keyboard("e")
  }

  display () {
    this.sprite.anchor.set(0)
    this.sprite.width = this.sprite.width / 2
    this.sprite.height = this.sprite.height / 2
    this.fired = false
    this.sprite.x = this.x
    this.sprite.y = this.y
    gameScene.addChild(this.sprite)
  }

  check (player) {
    game.ticker.add(e => {
      this.colision = collideTest(this.sprite, player.sprite)
      this.activate.press = (e) => {
        if (this.colision && !this.fired) {
          this.fired = true
          score++
          console.log(score)
          this.sprite.texture = this.sheet.textures["fanal.png"]
        }
      }
    })
  }
}
class Player {
  constructor (sheet) {
    this.sprite = new PIXI.Sprite(sheet.textures["perso.png"])
    this.x = 720
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
  }

  display () {
    this.sprite.zIndex = 100
    this.sprite.anchor.set(0)
    this.sprite.width = 50
    this.sprite.height = 85
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
      if (this.jumped) {
        if (this.gravity < 25) {
          this.gravity += 0.5
        }
      } else {
        if (this.gravity < 10) {
          this.gravity += 0.5
        }
      }
      if (this.sprite.y > _height + 300) {
        gameOver()
      }
      // console.log(this.gravity)

      this.sprite.x += this.vx + this.dash
      this.sprite.y += this.vy + this.updash + this.gravity
    })
  }
}
class Plateform {
  constructor (sheet, platInfo) {
    this.sheet = sheet
    this.sprite = new PIXI.Sprite(this.sheet.textures["plateform.png"])
    this.x = platInfo.x
    this.y = platInfo.y
    this.width = 200
    this.height = 70
    this.platInfo = platInfo
    this.xSpeed = 5
    this.vx = this.xSpeed
    this.vy = 5
    this.gravity = 0
    this.initialX = this.x
    this.willFall = false
  }

  display () {
    if (Math.random() > 0.5) {
      this.sprite.texture = this.sheet.textures["plateform_2.png"]
    }
    this.sprite.anchor.set(0)
    this.sprite.scale.x = 0.3
    this.sprite.scale.y = 0.3
    // this.sprite.width = this.width
    // this.sprite.height = this.height
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
    // this.vx = -this.vx
    if (this.platInfo.moveX) {
      game.ticker.add(e => {
        // console.log(`${this.sprite.x}/// ${this.initialX}`)

        if (this.sprite.x > this.initialX + 500) {
          this.vx = -this.xSpeed
        }
        if (this.sprite.x <= this.initialX) {
          this.vx = this.xSpeed
        }
        this.sprite.x += this.vx
      })
    }
    if (this.platInfo.falling) {
      game.ticker.add(e => {
        if (this.willFall) {
          this.gravity += 0.5
          this.sprite.y += this.gravity
        }
      })
    }
  }

  check (player) {
    // this.colisionPlayer = new intersects.Rectangle(this.sprite.x, this.sprite.x, this.sprite.width, this.sprite.height, player.sprite.x, player.sprite.y, player.sprite.width, player.sprite.height)
    // console.log(this.colisionPlayer)
    game.ticker.add(e => {
      // this.colisionPlayer = collideTest(this.sprite, player.sprite)
      this.colisionPlayer = b.hitTestRectangle(this.sprite, player.sprite)

      //   console.log(`${player.sprite.y + player.sprite.height}////${this.sprite.y - this.sprite.height / 2}`)

      if (this.colisionPlayer) {
        // if (player.sprite.y + player.sprite.height > this.sprite.y - this.sprite.height / 2 && player.sprite.y + player.sprite.height < this.sprite.y + this.sprite.height / 2) {
        player.gravity = -0.5
        player.vy = 0
        player.jumped = false
        // }
        if (this.platInfo.moveX) {
          player.sprite.x += this.vx
          gameScene.pivot.x += this.vx
        }
        if (this.platInfo.moveY) {
          player.sprite.y += -this.vy
        }
        if (this.platInfo.falling) {
          this.sprite.y += 2
          setTimeout(e => {
            this.willFall = true
          }, 500)
        }
      }
    })
  }
}

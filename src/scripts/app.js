/* eslint-disable quote-props */
"use strict"
import * as PIXI from "pixi.js"
import * as MATTER from "matter-js"
import { keyboard } from "./components/keyFunction"
import { collideTest } from "./components/collideTest"
const canvas = document.getElementById("canvas")
const _width = window.innerWidth
const _height = window.innerHeight
const score = 0
const gameScene = new PIXI.Container()
let engine

const Engine = MATTER.Engine
const World = MATTER.World
const Bodies = MATTER.Bodies
const game = new PIXI.Application({
  view: canvas,
  width: _width,
  height: _height,
  backgroundColor: 0x77B5FE

})

game.stage.sortableChildren = true
gameScene.sortableChildren = true
game.ticker.maxFPS = 60
game.stage.addChild(gameScene)
function start () {
  engine = Engine.create()
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
      .add("./assets/images/player/playerState.json")
      .add("./assets/images/platforme/plateformeJump.json")
      .add("./assets/images/platforme/plateform_start.json")
      .add("./assets/images/platforme/plateform_pause2.json")
      .add("./assets/images/monstre/monstreState.json")
      .add("./assets/images/relique/relique.json")
      .load(e => {})
      .onComplete.add((e) => {
        const sprites = {
          "player": PIXI.Loader.shared.resources["./assets/images/player/playerState.json"].spritesheet,
          "plateformeJump": PIXI.Loader.shared.resources["./assets/images/platforme/plateformeJump.json"].spritesheet,
          "plateformeStart": PIXI.Loader.shared.resources["./assets/images/platforme/plateform_start.json"].spritesheet,
          "plateformePause2": PIXI.Loader.shared.resources["./assets/images/platforme/plateform_pause2.json"].spritesheet,
          "monstre": PIXI.Loader.shared.resources["./assets/images/monstre/monstreState.json"].spritesheet,
          "relique": PIXI.Loader.shared.resources["./assets/images/relique/relique.json"].spritesheet

        }
        setLevel(sprites)
      })
  }
  game.ticker.add(e => {
    Engine.update(engine)
  })
  // Engine.run(engine)
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

function setLevel (sprites) {
  const allPlateform = []
  const allPlateformSpecial = []
  const platInfo =
    {
      special: [
        { x: 0, y: _height / 2, model: "start" },
        { x: 1440 * 2.5, y: _height / 2, model: "pause0" }
        // { x: 1440, y: _height / 2, model: "pause1" }
      ],
      classique: [
        { x: 1440 / 2, y: _height / 2, size: "longue", moveX: false, moveY: false, falling: false },
        { x: 1440 - 300, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440 + 300, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440 + 900, y: _height / 2, size: "longue", moveX: false, moveY: false, falling: false },
        { x: 1440 * 2.5 + 600, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440 * 2.5 + 900, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440 * 2.5 + 1200, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440 * 2.5 + 1500, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440 * 4, y: _height / 2, size: "longue", moveX: false, moveY: false, falling: false },
        { x: 1440 * 5.5, y: _height / 2, size: "longue", moveX: false, moveY: false, falling: false },
        { x: 1440 * 6, y: _height / 2, size: "longue", moveX: false, moveY: false, falling: false },
        { x: 1440 * 6.5, y: _height / 2, size: "longue", moveX: false, moveY: false, falling: false }
      ]
    }

  const player = new Player(sprites.player)
  player.display()
  player.animate()
  player.control()

  for (let i = 0; i < platInfo.classique.length; i++) {
    const plateform = new Plateform(sprites.plateformeJump, platInfo.classique[i])
    allPlateform.push(plateform)
  }
  for (let i = 0; i < platInfo.special.length; i++) {
    // (platInfo.special[i].model === "start")
    //   ? console.log("true") : (platInfo.special[i].model === "pause0")
    //     ? console.log("true") : (platInfo.special[i].model === "pause1")
    //       ? console.log("true") : console.log("false")

    const plateform = new CheckPointPlateform(sprites, platInfo.special[i])
    allPlateformSpecial.push(plateform)

    // if (platInfo.special[i].model === "pause0") {
    //   const plateform = new CheckPointPlateform(sprites.plateformeJump, platInfo.special[i])
    //   allPlateformSpecial.push(plateform)
    // }
    // if (platInfo.special[i].model === "pause1") {
    //   const plateform = new CheckPointPlateform(sprites.plateformPause2, platInfo.special[i])
    //   allPlateformSpecial.push(plateform)
    // }
  }
  for (let i = 0; i < allPlateformSpecial.length; i++) {
    allPlateformSpecial[i].display()
  }
  for (let i = 0; i < allPlateform.length; i++) {
    allPlateform[i].display()
    allPlateform[i].animate()
    allPlateform[i].check(player)
  }
}

start()

// class Cloud {
//   constructor (sheet, playerPos) {
//     this.playerPos = gameScene.pivot.x
//     this.x = this.playerPos + _width
//     this.y = Math.random() * _height / 2
//     this.sheet = sheet
//     this.sprite = new PIXI.Sprite(this.sheet.textures["cloud_1.png"])
//     this.vx = Math.random() * 5 + 2
//   }

//   display () {
//     if (Math.random() > 0.5) {
//       this.sprite.texture = this.sheet.textures["cloud_2.png"]
//     }
//     if (Math.random() > 0.1) {
//       this.sprite.zIndex = -3
//     } else {
//       this.sprite.zIndex = 1
//     }
//     this.sprite.x = this.x
//     this.sprite.y = this.y

//     gameScene.addChild(this.sprite)
//   }

//   animate () {
//     game.ticker.add(e => {
//       this.sprite.x += -this.vx
//       // console.log(`${this.sprite.x} /// ${gameScene.pivot.x}`)
//       if (this.sprite.x < gameScene.pivot.x - this.sprite.width) {
//         gameScene.removeChild(this.sprite)
//       }
//     })
//   }
// }
// class Fanal {
//   constructor (sheet, fanalInfo) {
//     this.sheet = sheet
//     this.sprite = new PIXI.Sprite(this.sheet.textures["fanal_noFire.png"])
//     this.x = fanalInfo.x
//     this.y = fanalInfo.y - this.sprite.height / 3
//     this.activate = keyboard("e")
//   }

//   display () {
//     this.sprite.anchor.set(0)
//     this.sprite.width = this.sprite.width / 2
//     this.sprite.height = this.sprite.height / 2
//     this.fired = false
//     this.sprite.x = this.x
//     this.sprite.y = this.y
//     gameScene.addChild(this.sprite)
//   }

//   check (player) {
//     game.ticker.add(e => {
//       this.colision = collideTest(this.sprite, player.sprite)
//       this.activate.press = (e) => {
//         if (this.colision && !this.fired) {
//           this.fired = true
//           score++
//           console.log(score)
//           this.sprite.texture = this.sheet.textures["fanal.png"]
//         }
//       }
//     })
//   }
// }
class Player {
  constructor (sheet) {
    this.sheet = sheet
    // this.sprite = new PIXI.Sprite(this.sheet.textures["player_stop.png"])
    this.sprite = new PIXI.AnimatedSprite(this.sheet.animations.perso_anim)
    this.x = 720
    this.y = _height / 2 - this.sprite.height
    this.vx = 0
    this.vy = 0
    this.speed = 7.5
    this.gravity = 0
    this.left = keyboard("q")
    this.right = keyboard("d")
    this.up = keyboard(" ")
    this.down = keyboard("s")
    this.hit = false
    this.stageVx = 0
    this.dash = 0
    this.updash = 0
    this.dashed = false
    this.updashed = false
    this.jumped = 0
  }

  display () {
    this.sprite.texture = this.sheet.textures["player_stop.png"]
    this.sprite.zIndex = 100
    this.sprite.anchor.set(0.5, 0.5)
    this.body = Bodies.rectangle(this.x, this.y, this.sprite.width / 4, this.sprite.height)
    this.body.mass = 1
    this.body.frictionAir = 1
    this.body.frictionStatic = 1
    this.body.friction = 1
    MATTER.Body.setInertia(this.body, Infinity)
    World.add(engine.world, this.body)
    gameScene.addChild(this.sprite)
    console.log(this.body.collisionFilter)
  }

  control () {
    this.left.press = (e) => {
      this.force = -0.05 * this.body.mass
      // this.stageVx = -this.speed
    }
    this.right.press = (e) => {
      this.sprite.animationSpeed = 0.167
      this.sprite.play()
      this.force = 0.05 * this.body.mass
    }
    this.up.press = (e) => {
      if (this.jumped <= 1) {
        this.forceJump = -0.035 * this.body.mass
        MATTER.Body.applyForce(this.body, this.body.position, { x: 0, y: this.forceJump })
        this.jumped++
      }
    }
    this.left.release = (e) => {
      this.force = 0
    }
    this.right.release = (e) => {
      this.force = 0
      this.sprite.stop()
      this.sprite.texture = this.sheet.textures["player_stop.png"]
    }

    this.up.release = (e) => {
      this.body.force.y = 0
    }
  }

  animate () {
    game.ticker.add(e => {
      if (this.right.isDown && this.left.isDown) {
        this.sprite.texture = this.sheet.textures["player_stop.png"]
        this.force = 0
      }

      if (this.right.isDown || this.left.isDown) {
        MATTER.Body.applyForce(this.body, this.body.position, { x: this.force, y: 0 })
      }

      gameScene.pivot.x = this.body.position.x - window.innerWidth / 2
      if (this.sprite.y > _height + 300) {
        gameOver()
      }
      // MATTER.Body.translate(this.body, { x: this.vx, y: this.vy })
      // this.body.position.x += this.vx
      // this.body.position.y += this.vy
      this.sprite.x = this.body.position.x
      this.sprite.y = this.body.position.y
    })
  }
}
class Plateform {
  constructor (sheet, platInfo) {
    this.sheet = sheet
    this.sprite = new PIXI.Sprite(this.sheet.textures[`plateform_${platInfo.size}.png`])
    this.x = platInfo.x
    this.y = platInfo.y
    this.platInfo = platInfo
    this.xSpeed = 5
    this.vx = this.xSpeed
    this.vy = 5
    this.gravity = 0
    this.initialX = this.x
    this.willFall = false
    this.option = {
      isStatic: true
    }
  }

  display () {
    this.sprite.anchor.set(0.5)
    this.sprite.x = this.x
    this.sprite.y = this.y
    this.body = Bodies.rectangle(this.x, this.y, this.sprite.width, this.sprite.height, this.option)
    this.body.friction = 1
    World.add(engine.world, this.body)
    gameScene.addChild(this.sprite)
  }

  animate () {
    if (this.platInfo.moveY) {
      game.ticker.add(e => {
        if (this.sprite.y < -300) {
          this.body.position.y = _height + 300
          this.sprite.y = this.body.position.y
        }
        this.body.position.y += -this.vy
        this.sprite.y = this.body.position.y
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
    game.ticker.add(e => {
      // console.log(MATTER.Detector.canCollide(this.body.collisionFilter, player.body.collisionFilter))
    })

    // this.colisionPlayer = new intersects.Rectangle(this.sprite.x, this.sprite.x, this.sprite.width, this.sprite.height, player.sprite.x, player.sprite.y, player.sprite.width, player.sprite.height)
    // console.log(this.colisionPlayer)
    game.ticker.add(e => {
      this.colisionPlayer = collideTest(this.sprite, player.sprite)
      // this.colisionPlayer = b.hitTestRectangle(this.sprite, player.sprite)

      //   console.log(`${player.sprite.y + player.sprite.height}////${this.sprite.y - this.sprite.height / 2}`)

      if (this.colisionPlayer) {
        console.log(`${this.sprite} collide`)
        player.jumped = 0
        // if (this.platInfo.moveX) {
        //   player.sprite.x += this.vx
        //   gameScene.pivot.x += this.vx
        // }
        // if (this.platInfo.moveY) {
        //   player.sprite.y += -this.vy
        // }
        // if (this.platInfo.falling) {
        //   this.sprite.y += 2
        //   setTimeout(e => {
        //     this.willFall = true
        //   }, 500)
        // }
      }
    })
  }
}

class CheckPointPlateform {
  constructor (sheet, platInfo) {
    this.sheet = sheet
    this.platInfo = platInfo
    this.x = this.platInfo.x
    this.y = this.platInfo.y
    this.option = {
      isStatic: true
    }
  }

  display () {
    if (this.platInfo.model === "start") {
      this.sheet = this.sheet.plateformeStart
      this.sprite = new PIXI.AnimatedSprite(this.sheet.animations.plateform_start)
      this.sprite.animationSpeed = 0.167
      this.sprite.play()
    } else if (this.platInfo.model === "pause0") {
      this.sheet = this.sheet.plateformeJump
      this.sprite = new PIXI.Sprite(this.sheet.textures["plateform_pause.png"])
    } else if (this.platInfo.model === "pause1") {
      this.sheet = this.sheet.plateformePause2
      this.sprite = new PIXI.AnimatedSprite(this.sheet.animations.plateform_pause2_anim)
      this.sprite.animationSpeed = 0.167
      this.sprite.play()
    }
    this.sprite.anchor.set(0.5)
    this.sprite.width = this.sprite.width / 2.5
    this.sprite.height = this.sprite.height / 2.5
    this.sprite.x = this.x + this.sprite.width / 2
    this.sprite.y = this.y + this.sprite.height / 2
    this.body = Bodies.rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height, this.option)
    World.add(engine.world, this.body)

    gameScene.addChild(this.sprite)
  }
}

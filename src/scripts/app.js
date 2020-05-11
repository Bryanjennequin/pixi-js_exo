/* eslint-disable quote-props */
"use strict"
import * as PIXI from "pixi.js"
import * as MATTER from "matter-js"
import * as GSAP from "gsap"
import { keyboard } from "./components/keyFunction"
import { collideTest } from "./components/collideTest"

const canvas = document.getElementById("canvas")
const _width = window.innerWidth
const _height = window.innerHeight

const gameScene = new PIXI.Container()
const gameBg = new PIXI.Container()
const gameFg = new PIXI.Container()
let engine

const Engine = MATTER.Engine
const World = MATTER.World
const Bodies = MATTER.Bodies
const game = new PIXI.Application({
  view: canvas,
  width: _width,
  height: _height,

  backgroundColor: 0x0C0C0C

})
game.stage.sortableChildren = true
gameScene.sortableChildren = true
game.ticker.maxFPS = 60
gameFg.zIndex = Infinity
game.stage.addChild(gameScene, gameBg, gameFg)

function start () {
  PIXI.Loader.shared
    .add("./assets/images/player/playerState.json")
    .add("./assets/images/platforme/plateformeJump.json")
    .add("./assets/images/platforme/plateform_start.json")
    .add("./assets/images/platforme/plateform_pause2.json")
    .add("./assets/images/monstre/monstreState.json")
    .add("./assets/images/relique/relique.json")
    .add("./assets/images/background.png")
    .add("./assets/images/cloud/cloud.json")
    .add("./assets/images/UI/ui.json")
    .load(e => {})
    .onComplete.add((e) => {
      const sprites = {
        "player": PIXI.Loader.shared.resources["./assets/images/player/playerState.json"].spritesheet,
        "plateformeJump": PIXI.Loader.shared.resources["./assets/images/platforme/plateformeJump.json"].spritesheet,
        "plateformeStart": PIXI.Loader.shared.resources["./assets/images/platforme/plateform_start.json"].spritesheet,
        "plateformePause2": PIXI.Loader.shared.resources["./assets/images/platforme/plateform_pause2.json"].spritesheet,
        "monstre": PIXI.Loader.shared.resources["./assets/images/monstre/monstreState.json"].spritesheet,
        "relique": PIXI.Loader.shared.resources["./assets/images/relique/relique.json"].spritesheet,
        "background": PIXI.Loader.shared.resources["./assets/images/background.png"],
        "cloud": PIXI.Loader.shared.resources["./assets/images/cloud/cloud.json"].spritesheet,
        "ui": PIXI.Loader.shared.resources["./assets/images/UI/ui.json"].spritesheet

      }
      setLevel(sprites)
      UI(sprites.ui)
    })
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
let sanity = 100
let stamina = 100
let staminaAnim = 100

function UI (sprite) {
  const type = ["sanity", "stamina"]
  for (let i = 0; i < type.length; i++) {
    const hud = new UiBar(sprite, type[i], i)
    hud.display()
    hud.animate()
  }
}
function setLevel (sprites) {
  engine = Engine.create()
  game.ticker.add(e => {
    Engine.update(engine)
  })

  const platInfo =
    {
      special: [
        { x: 0, y: _height / 2, model: "start" },
        { x: 1440 * 2.5, y: _height / 2, model: "pause0" },
        { x: 1440 + 3000, y: _height / 2, model: "pause1" }
      ],
      classique: [
        { x: 1440 / 2, y: _height / 2, size: "longue", moveX: false, moveY: false, falling: false },
        { x: 1440 / 2, y: _height / 2 - 200, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440 + 300, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440 + 900, y: _height / 2, size: "longue", moveX: false, moveY: false, falling: false },
        { x: 1440 + 1200, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440 + 1500, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440 + 1800, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440 + 2100, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false },
        { x: 1440 + 4000, y: _height / 2, size: "longue", moveX: false, moveY: false, falling: false },
        { x: 1440 * 5.5, y: _height / 2, size: "longue", moveX: false, moveY: false, falling: false },
        { x: 1440 * 6, y: _height / 2, size: "longue", moveX: false, moveY: false, falling: false },
        { x: 1440 * 6.5, y: _height / 2, size: "longue", moveX: false, moveY: false, falling: false }
      ]
    }

  const player = new Player(sprites.player)
  player.display()
  player.animate()
  player.control()

  const relique = new Relique(sprites.relique)
  relique.display()
  relique.animate()
  relique.control()

  for (let i = 0; i < platInfo.classique.length; i++) {
    const plateform = new Plateform(sprites.plateformeJump, platInfo.classique[i], player)
    plateform.display()
    plateform.animate()
    plateform.check()
  }
  for (let i = 0; i < platInfo.special.length; i++) {
    const plateform = new CheckPointPlateform(sprites, platInfo.special[i])
    plateform.display()
    plateform.check(player)
  }

  setInterval(e => {
    const monstre = new Monstre(sprites.monstre, player, relique)
    monstre.display()
    monstre.animate()
    monstre.check()
  }, 5000)
  game.ticker.add(e => {

  })
  setInterval(e => {
    const cloud = new Cloud(sprites.cloud)
    cloud.display()
    cloud.animate()
  }, 2000)
  const bg = PIXI.Sprite.from("./assets/images/background.png")
  const sky = new PIXI.Graphics()
  sky.beginFill(0x77B5FE)
  sky.drawRect(0, 0, gameScene.width, gameScene.height)
  sky.endFill()
  // gameFg.addChild(rect)
  bg.anchor.set(0, 1)
  bg.x = 0
  bg.y = _height + 300
  gameBg.zIndex = -1

  gameBg.addChild(sky, bg)
  game.ticker.add(e => {
    if (sanity <= 0) {
      gameOver()
    }
  })
}

start()
class UiBar {
  constructor (sprite, type, i) {
    this.sheet = sprite
    this.type = type
    this.deco = new PIXI.Sprite(this.sheet.textures["decoBar.png"])
    this.bar = new PIXI.Sprite(this.sheet.textures[`${this.type}Bar.png`])
    this.x = 100 + 150 * i
    this.y = _height - 100
  }

  display () {
    // this.bar.anchor.set(0.5)
    this.bar.scale.set(0.1)
    this.deco.scale.set(0.3)
    this.deco.anchor.set(0.5)
    this.deco.x = this.x
    this.deco.y = this.y
    this.bar.x = this.x + 17
    this.bar.y = this.y + 1
    this.deco.zIndex = 10

    this.deco.zIndex = 100
    game.stage.addChild(this.bar, this.deco)
    console.log(this.bar)
  }

  animate () {
    game.ticker.add(e => {
      this.bar.
    })
  }
}
class Cloud {
  constructor (sheet) {
    this.playerPos = gameScene.pivot.x
    this.x = this.playerPos + _width
    this.y = Math.random() * _height / 2
    this.sheet = sheet
    this.sprite = new PIXI.Sprite(this.sheet.textures["cloud_1.png"])
    this.vx = Math.random() * 2 + 0.1
  }

  display () {
    if (Math.random() > 0.5) {
      this.sprite.texture = this.sheet.textures["cloud_2.png"]
    }
    if (Math.random() > 0.333) {
      this.sprite.zIndex = -3
    } else {
      this.sprite.zIndex = 1000
    }
    this.sprite.scale.set(0.3)
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

class Player {
  constructor (sheet) {
    this.sheet = sheet
    // this.sprite = new PIXI.Sprite(this.sheet.textures["player_stop.png"])
    this.sprite = new PIXI.AnimatedSprite(this.sheet.animations.perso_anim)
    this.x = 200
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
    this.sprite.animationSpeed = 0.167
    this.sprite.zIndex = 100
    this.sprite.anchor.set(0.5, 0.5)
    this.body = Bodies.rectangle(this.x, this.y, this.sprite.width / 4, this.sprite.height)
    this.body.mass = 1
    this.friction = 1
    this.frictionStatic = 1
    MATTER.Body.setInertia(this.body, Infinity)
    World.add(engine.world, this.body)
    gameFg.addChild(this.sprite)
    console.log(this.sprite)
  }

  control () {
    this.left.press = (e) => {
      this.force = -7.5
      this.sprite.scale.x = -1

      this.sprite.play()
      // this.stageVx = -this.speed
    }
    this.right.press = (e) => {
      this.sprite.scale.x = 1
      this.sprite.animationSpeed = 0.167
      this.sprite.play()
      this.force = 7.5
    }
    this.up.press = (e) => {
      if (stamina > 0) {
        stamina += -50

        this.forceJump = -0.03 * this.body.mass
        MATTER.Body.applyForce(this.body, this.body.position, { x: 0, y: this.forceJump })
        this.jumped++
      }
    }
    this.left.release = (e) => {
      this.force = 0
      this.sprite.stop()
      this.sprite.texture = this.sheet.textures["player_stop.png"]
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
        MATTER.Body.translate(this.body, { x: this.force, y: 0 })
        gameBg.pivot.x += this.force / 10
      }

      gameScene.pivot.x = this.body.position.x - window.innerWidth / 2
      gameFg.pivot.x = this.body.position.x - window.innerWidth / 2

      if (this.sprite.y > _height + 300) {
        gameOver()
      }
      this.sprite.x = this.body.position.x
      this.sprite.y = this.body.position.y
    })
  }
}
class Relique {
  constructor (sheet) {
    this.sheet = sheet
    this.sprite = new PIXI.AnimatedSprite(this.sheet.animations.relique)
    this.left = keyboard("ArrowLeft")
    this.right = keyboard("ArrowRight")
    this.up = keyboard("ArrowUp")
    this.down = keyboard("ArrowDown")
    this.test = keyboard("z")
    this.vx = 0
    this.vy = 0
  }

  display () {
    this.sprite.x = 200
    this.sprite.y = _height / 2
    this.sprite.animationSpeed = 0.167
    this.sprite.zIndex = 101
    this.sprite.play()
    this.sprite.anchor.set(0.5)
    this.circle = new PIXI.Graphics()
    this.circle.beginFill(0x00000)
    this.circle.drawCircle(this.sprite.x, this.sprite.y, 100)
    this.circle.endFill()
    gameScene.addChild(this.circle, this.sprite)
    gameScene.mask = this.circle
    gameBg.mask = this.circle
    console.log(this.circle)
  }

  control () {
    this.left.press = e => {
      this.vx = -7.5
    }
    this.left.release = e => {
      this.vx = 0
    }
    this.right.press = e => {
      this.vx = 7.5
    }
    this.right.release = e => {
      this.vx = 0
    }
    this.up.press = e => {
      this.vy = -7.5
    }
    this.up.release = e => {
      this.vy = 0
    }
    this.down.press = e => {
      this.vy = 7.5
    }
    this.down.release = e => {
      this.vy = 0
    }
  }

  animate () {
    game.ticker.add(e => {
      this.circle.position.x += this.vx
      this.circle.position.y += this.vy

      this.sprite.x += this.vx
      this.sprite.y += this.vy

      // this.circle.position.x = this.sprite.x
      // this.circle.position.y = this.sprite.y
    })
  }
}
class Monstre {
  constructor (sheet, player, relique) {
    this.sheet = sheet
    this.player = player
    this.relique = relique
    this.sprite = new PIXI.AnimatedSprite(this.sheet.animations.monstre)
    this.gameFgPos = gameFg.pivot.x
    this.x = [this.gameFgPos + _width, this.gameFgPos, Math.floor(Math.random() * _width)]
    this.y = [-100, _height + 100, Math.random() * _height]
    this.random = Math.floor(Math.random() * 3)
  }

  display () {
    if (this.random === this.x.length - 1) {
      this.sprite.x = this.x[this.random]
      this.sprite.y = this.y[Math.floor(Math.random() * 2)]
    } else {
      this.sprite.x = this.x[Math.floor(Math.random() * 2)]
      this.sprite.y = this.y[this.y.length - 1]
    }

    this.sprite.anchor.set(0.5)
    this.sprite.animationSpeed = 0.167
    this.sprite.play()
    gameFg.addChild(this.sprite)
  }

  animate () {
    GSAP.gsap.to(this.sprite, { x: this.player.sprite.x, y: this.player.sprite.y, duration: 5 })
  }

  check () {
    game.ticker.add(e => {
      if (this.sprite.visible === true) {
        const dx = this.relique.sprite.x - this.sprite.x
        const dy = this.relique.sprite.y - this.sprite.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < this.relique.circle.width / 2 + this.sprite.width / 2) {
          this.sprite.visible = false
        }
        if (collideTest(this.sprite, this.player.sprite)) {
          this.sprite.visible = false
          sanity += -50
        }
      }
    })
  }
}
class Plateform {
  constructor (sheet, platInfo, player) {
    this.player = player
    this.bPlayer = this.player.body
    this.sPlayer = this.player.sprite
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
  }

  display () {
    this.sprite.anchor.set(0.5)
    if (this.platInfo.falling) {
      this.body = Bodies.rectangle(this.x, this.y, this.sprite.width, this.sprite.height, { isSleeping: true })
    } else {
      this.body = Bodies.rectangle(this.x, this.y, this.sprite.width, this.sprite.height, { isStatic: true })
    }

    this.body.friction = 1
    this.body.frictionStatic = 1
    this.sprite.x = this.body.position.x
    this.sprite.y = this.body.position.y
    World.add(engine.world, this.body)
    gameScene.addChild(this.sprite)
  }

  animate () {
    game.ticker.add(e => {
      if (this.platInfo.moveY) {
        if (this.sprite.y < -300 || this.sprite.y > _height + 300) {
          this.vy *= -1
        }

        MATTER.Body.translate(this.body, { x: 0, y: this.vy })
      }

      if (this.platInfo.moveX) {
        // console.log(`${this.sprite.x}/// ${this.initialX}`)

        if (this.sprite.x > this.initialX + 500) {
          this.vx = -this.xSpeed
        }
        if (this.sprite.x <= this.initialX) {
          this.vx = this.xSpeed
        }
        // MATTER.Body.applyForce(this.body, this.body.position, {x : this.vx, y:0})
        // MATTER.Body.setVelocity(this.body, { x: this.vx, y: 0 })
        MATTER.Body.translate(this.body, { x: this.vx, y: 0 })
      }
      this.sprite.y = this.body.position.y
      this.sprite.x = this.body.position.x
    // if (this.platInfo.falling) {
    //   game.ticker.add(e => {
    //     if (this.willFall) {
    //       this.gravity += 0.5
    //       this.sprite.y += this.gravity
    //     }
    //   })
    // }
    })
  }

  check () {
    game.ticker.add(e => {
      this.colisionPlayer = collideTest(this.sprite, this.sPlayer)
      if (this.colisionPlayer) {
        this.player.jumped = 0
        stamina = 100
        staminaAnim = 100
        if (this.platInfo.moveX) {
          // MATTER.Body.setVelocity(this.player.body, { x: this.vx, y: 0 })
          MATTER.Body.translate(this.bPlayer, { x: this.vx, y: 0 })
          this.sPlayer.x = this.bPlayer.position.x
        }
        if (this.platInfo.falling) {
          setTimeout(e => {
            MATTER.Sleeping.set(this.body, false)
          }, 5000)
        }
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

  check (player) {
    game.ticker.add(e => {
      this.colisionPlayer = collideTest(this.sprite, player.sprite)
      if (this.colisionPlayer) {
        player.jumped = 0
        stamina = 100
        staminaAnim = 100
      }
    })
  }
}

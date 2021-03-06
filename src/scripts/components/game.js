/* eslint-disable quote-props */
"use strict"

import * as PIXI from "pixi.js"
import sound from "pixi-sound"
import * as MATTER from "matter-js"
import * as GSAP from "gsap"
import { keyboard } from "../components/keyFunction"
import { collideTest } from "../components/collideTest"
import { platInfo, _height, _width } from "./info"
PIXI.utils.skipHello()

GSAP.gsap.ticker.fps(60)
export function game () {
  let monsterInterval,
    cloudInterval,
    monsterFunc,
    cloudFunc,
    sentence,
    player,
    sprites,
    relique,
    sanity,
    stamina,
    currentLevel,
    montagne,
    divPause,
    divMute

  let timer = 0
  let started = false
  let paused = false
  let clouds = []
  let monstersObj = []
  let platObj = []
  let platSpeObj = []
  let allAnim = []
  const canvasGame = document.getElementById("canvasGame")
  const gameScene = new PIXI.Container()
  const gameBgFirst = new PIXI.Container()
  const gameBgSecond = new PIXI.Container()
  const gameBgThird = new PIXI.Container()
  const gameFg = new PIXI.Container()
  const BgPlan = [gameBgFirst, gameBgSecond, gameBgThird]
  const Engine = MATTER.Engine
  const World = MATTER.World
  const Bodies = MATTER.Bodies
  const engine = Engine.create()
  const game = new PIXI.Application({
    view: canvasGame,
    width: _width,
    height: _height,
    backgroundColor: 0x0C0C0C

  })
  const type = ["vie", "stamina"]
  const huds = []

  const localStorage = window.localStorage
  if (localStorage.getItem("currentLevel") === null) {
    localStorage.setItem("currentLevel", JSON.stringify(0))
  }

  currentLevel = JSON.parse(localStorage.getItem("currentLevel"))
  game.stage.sortableChildren = true
  gameScene.sortableChildren = true
  game.ticker.maxFPS = 60
  gameFg.zIndex = Infinity
  gameBgFirst.zIndex = -3
  gameBgSecond.zIndex = -2
  gameBgThird.zIndex = -1
  game.stage.addChild(gameScene, gameFg)

  function start () {
    const start = keyboard("Enter")
    const canvasGame = document.querySelector("#canvasGame")
    const menu = document.getElementById("menu")
    const levelListEl = document.querySelectorAll(".level-list__el")
    const startButton = document.querySelector("#startButton")
    startButton.addEventListener("click", e => {
      menu.style.display = "none"
      canvasGame.style.display = "flex"
      setup(currentLevel)
      started = true
    })
    start.press = e => {
      if (started === false) {
        menu.style.display = "none"
        canvasGame.style.display = "flex"
        setup(currentLevel)
        started = true
      }
    }
    for (let i = 0; i < levelListEl.length; i++) {
      levelListEl[i].addEventListener("click", (e) => {
        menu.style.display = "none"
        canvasGame.style.display = "flex"
        setup(i)
        localStorage.setItem("currentLevel", JSON.stringify(i))
        started = true
      })
    }
  }

  start()

  function setup (level) {
    sprites = {
      player: {
        "player": PIXI.Loader.shared.resources["./assets/images/player/playerState.json"].spritesheet,
        "player2": PIXI.Loader.shared.resources["./assets/images/player/playerState2.json"].spritesheet
      },
      "plateformeJump": PIXI.Loader.shared.resources["./assets/images/platforme/plateformeJump.json"].spritesheet,
      "plateformeStart": PIXI.Loader.shared.resources["./assets/images/platforme/plateform_start.json"].spritesheet,
      "plateformePause": PIXI.Loader.shared.resources["./assets/images/platforme/plateform_pause.json"].spritesheet,
      "monstre": PIXI.Loader.shared.resources["./assets/images/monstre/monstreState.json"].spritesheet,
      "relique": PIXI.Loader.shared.resources["./assets/images/relique/relique.json"].spritesheet,
      "background": PIXI.Loader.shared.resources["./assets/images/montagne.json"].spritesheet,
      "ui": PIXI.Loader.shared.resources["./assets/images/UI/ui.json"].spritesheet,
      "portail": PIXI.Loader.shared.resources["./assets/images/portail/portail.json"].spritesheet,
      "portailText": PIXI.Loader.shared.resources["./assets/images/portailCommand.png"]
    }
    currentLevel = level
    ui(sprites)
    setLevel(sprites, currentLevel)
  }
  function pauseGame () {
    if (started === true) {

    }
    const pauseScreen = document.querySelector("#pause")
    const pause = keyboard("p")

    pause.press = e => {
      if (paused === false && started === true) {
        pauseScreen.style.display = "flex"
        game.ticker.stop()
        divPause.classList.toggle("gameui-pause--paused")
        clearInterval(monsterInterval)
        clearInterval(cloudInterval)
        for (let i = 0; i < allAnim.length; i++) {
          allAnim[i].pause()
        }
        sound.togglePauseAll()
        paused = true
      } else if (paused === true && started === true) {
        pauseScreen.style.display = "none"
        divPause.classList.toggle("gameui-pause--paused")
        game.ticker.start()
        monsterInterval = setInterval(monsterFunc, 5000)
        cloudInterval = setInterval(cloudFunc, 5000)
        for (let i = 0; i < allAnim.length; i++) {
          allAnim[i].play()
        }
        sound.togglePauseAll()
        paused = false
      }
    }
  }
  const restart = keyboard("Enter")
  function gameOver (dieMethod) {
    const gameOver = document.querySelector("#gameOver")
    const deathSentence = document.querySelector("#deathSentence")
    gameOver.style.display = "flex"
    deathSentence.innerHTML = dieMethod
    deathSentence.classList.add("para--gameOver")
    restart.press = (e) => {
      reset()
      gameOver.style.display = "none"
      setLevel(sprites, currentLevel)
    }
  }
  function gameEnd () {
    const paraEnd = document.querySelector("#paraEnd")
    const gameEnds = document.querySelector("#gameEnd")
    gameEnds.style.display = "flex"
    localStorage.setItem("currentLevel", JSON.stringify(currentLevel))

    if (currentLevel < platInfo.length) {
      paraEnd.innerHTML = "Appuye sur entrée pour passé au niveau suivant."
      restart.press = (e) => {
        reset()
        gameEnds.style.display = "none"
        setLevel(sprites, currentLevel)
      }
    } else {
      paraEnd.innerHTML = "Tu as terminer tout les niveaux disponible, appuye sur entrée pour revenir au menu principal. "
      restart.press = (e) => {
        reset()
        localStorage.clear()
        document.location.reload()
      }
    }
  }
  function reset () {
    restart.press = null
    sound.removeAll()
    game.ticker.remove(addTickersFunc)
    clearInterval(monsterInterval)
    clearInterval(cloudInterval)
    gameScene.pivot.x = 0
    gameFg.pivot.x = 0
    World.clear(engine.world)
    Engine.clear(engine)
    gameScene.children = []
    gameFg.children = []
    gameBgFirst.children = []
    gameBgSecond.children = []
    gameBgThird.children = []
    for (let i = 0; i < monstersObj.length; i++) {
      monstersObj[i].display = null
      monstersObj[i].animate = null
      monstersObj[i].check = null
      monstersObj[i] = null
    }
    for (let i = 0; i < platSpeObj.length; i++) {
      platSpeObj[i].action.press = null
      platSpeObj[i].display = null
      platSpeObj[i].check = null
      platSpeObj[i] = null
    }
    for (let i = 0; i < platObj.length; i++) {
      platObj[i].display = null
      platObj[i].check = null
      platObj[i].animate = null
      platObj[i] = null
    }
    for (let i = 0; i < clouds.length; i++) {
      clouds[i].display = null
      clouds[i].animate = null
      clouds[i] = null
    }
    for (let i = 0; i < allAnim.length; i++) {
      allAnim[i].kill()
    }
    allAnim = []
    clouds = []
    player.display = null
    player.animate = null
    player.control = null
    player.left.press = null
    player.right.press = null
    player.up.press = null
    player = null
    relique.display = null
    relique.animate = null
    relique.control = null
    relique.left.press = null
    relique.right.press = null
    relique.up.press = null
    relique.down.press = null
    relique = null
    platObj = []
    platSpeObj = []
    monstersObj = []
  }
  function ui (sprites) {
    divPause = document.createElement("div")
    divPause.classList.add("gameui")
    divPause.classList.add("gameui-pause")
    divMute = document.createElement("div")
    divMute.classList.add("gameui")
    divMute.classList.add("gameui-mute")
    document.body.appendChild(divMute)
    document.body.appendChild(divPause)
    for (let i = 0; i < type.length; i++) {
      const hud = new UiBar(sprites.ui, type[i], i)
      hud.display()
      huds.push(hud)
    }
  }
  pauseGame()
  const mute = keyboard("m")
  mute.press = e => {
    sound.toggleMuteAll()
    divMute.classList.toggle("gameui-mute--muted")
  }
  function setLevel (sprites, level) {
    const wind = sound.add("wind", {
      url: "assets/sound/Wind.mp3",
      loop: true,
      volume: 0.05

    })
    const music = sound.add("music", {
      url: "assets/sound/Zander Noriega - Perpetual Tension.mp3",
      loop: true,
      volume: 0.01

    })
    wind.play()
    music.play()
    gameScene.addChild(gameBgFirst, gameBgSecond, gameBgThird)
    sanity = 100
    stamina = 100

    player = new Player(sprites.player)
    player.display()
    player.control()

    relique = new Relique(sprites.relique)
    relique.display()
    relique.control()
    /// ////////

    for (let i = 0; i < platInfo[level].classique.length; i++) {
      const plateform = new Plateform(sprites.plateformeJump, platInfo[level].classique, player, i)
      plateform.display()
      plateform.check()
      platObj.push(plateform)
    }

    for (let i = 0; i < platInfo[level].special.length; i++) {
      const plateform = new CheckPointPlateform(sprites, platInfo[level].special[i])
      plateform.display()
      plateform.check(player)
      platSpeObj.push(plateform)
    }
    monsterFunc = function createMonster () {
      const monstre = new Monstre(sprites.monstre, player, relique)
      monstre.display()

      monstersObj.push(monstre)
    }

    monsterInterval = setInterval(monsterFunc, 3000)
    const sky = new PIXI.Graphics()
    const filter = new PIXI.Graphics()
    filter.beginFill(0x4F1342, 0.1)
    filter.drawRect(0, 0, gameScene.width * 20, gameScene.height)
    filter.endFill()
    const filter2 = new PIXI.Graphics()
    filter2.beginFill(0x4F1342, 0.05)
    filter2.drawRect(0, 0, gameScene.width * 20, gameScene.height)
    filter2.endFill()
    sky.beginFill(0xbde1f8, 1)
    sky.drawRect(0, 0, gameScene.width * 20, gameScene.height)
    sky.endFill()
    gameBgFirst.addChild(sky)
    montagne = new Montagne(sprites.background)
    montagne.display()
    gameFg.addChild(filter2)
    gameBgThird.addChild(filter)
    game.ticker.add(addTickersFunc)
  }
  function addTickersFunc (e) {
    Engine.update(engine)
    player.animate()
    relique.animate()
    for (let i = 0; i < huds.length; i++) {
      huds[i].animate()
    }
    for (let i = 0; i < monstersObj.length; i++) {
      monstersObj[i].animate()
      monstersObj[i].check()
    }
    for (let i = 0; i < platSpeObj.length; i++) {
      platSpeObj[i].check(player)
    }
    for (let i = 0; i < platObj.length; i++) {
      platObj[i].animate()
      platObj[i].check(player)
    }
    if (sanity <= 0) {
      sentence = "Tu es devenue folle."
      gameOver(sentence)
    }
  }

  class UiBar {
    constructor (sprite, type, i) {
      this.sheet = sprite
      this.type = type
      this.deco = new PIXI.Sprite(this.sheet.textures[`${this.type}Icon.png`])
      this.bar = new PIXI.Sprite(this.sheet.textures[`${this.type}.png`])
      this.x = 100
      this.y = 50 + 50 * i
    }

    display () {
      // this.bar.anchor.set(0.5)
      this.bar.scale.set(0.2)
      this.deco.anchor.set(0.5)
      this.deco.x = this.x
      this.deco.y = this.y
      this.deco.width = 30
      this.deco.height = this.deco.width / 1.2
      this.bar.width = 100
      this.bar.height = 30
      this.bar.x = this.x + 20
      this.bar.y = this.y - this.deco.height / 2
      this.deco.zIndex = 100
      game.stage.addChild(this.bar, this.deco)
    }

    animate () {
      if (this.type === "stamina") {
        this.anim = GSAP.gsap.to(this.bar, { width: stamina, duration: 0.3 })
        allAnim.push(this.anim)
      } else {
        this.anim = GSAP.gsap.to(this.bar, { width: sanity, duration: 0.3 })
        allAnim.push(this.anim)
      }
    }
  }

  class Montagne {
    constructor (sheet) {
      this.sheet = sheet
      this.x = 0
      this.y = 0
      this.allSprite = []
    }

    display () {
      for (let i = 0; i < 20; i++) {
        for (let y = 0; y < 3; y++) {
          this.sprite = new PIXI.Sprite(this.sheet.textures[`montagne_${3 - y}.png`])
          this.sprite.scale.set(0.7)
          this.sprite.anchor.set(0, 1)
          this.sprite.x = this.sprite.width * i
          this.allSprite.push(this.sprite)
          if (_height > 700) {
            this.sprite.y = _height + 100
          } else {
            this.sprite.y = _height
          }
          BgPlan[y].addChild(this.sprite)
        }
      }
    }
  }
  class Player {
    constructor (sheet) {
      this.sheet = sheet
      this.sprite = new PIXI.AnimatedSprite(this.sheet.player.animations.perso)
      this.x = 200
      this.y = _height / 2
      this.vx = 0
      this.vy = 0
      this.speed = 7.5
      this.gravity = 0
      this.left = keyboard("q")
      this.right = keyboard("d")
      this.up = keyboard(" ")
      this.jumped = 0
      this.footstepSound = sound.add("footstep", {
        url: "assets/sound/footstep.mp3",
        loop: true,
        speed: 1.1,
        volume: 0.3
      })
      this.jumpSound = sound.add("jump", {
        url: "assets/sound/sfx_jump.mp3",
        speed: 1.5,
        volume: 0.1
      })
      this.landingSound = sound.add("jump", {
        url: "assets/sound/jumpland44100.mp3",
        speed: 1.5,
        volume: 0.02
      })
    }

    display () {
      this.sprite.textures = this.sheet.player2.animations.perso_stop
      this.sprite.animationSpeed = 0.05
      this.sprite.zIndex = 100
      this.sprite.anchor.set(0.5, 0.5)
      this.sprite.scale.set(0.3)
      this.body = Bodies.rectangle(this.x, this.y, this.sprite.width / 4, this.sprite.height)
      this.sprite.play()
      MATTER.Body.setInertia(this.body, Infinity)
      World.add(engine.world, this.body)
      gameFg.addChild(this.sprite)
    }

    control () {
      this.left.press = (e) => {
        this.sprite.textures = this.sheet.player.animations.perso
        this.sprite.animationSpeed = 0.27
        this.force = -10
        this.sprite.scale.x = -0.3
        this.sprite.play()
        this.footstepSound.play()
      }
      this.right.press = (e) => {
        this.sprite.textures = this.sheet.player.animations.perso
        this.sprite.scale.x = 0.3
        this.sprite.animationSpeed = 0.27
        this.sprite.play()
        this.force = 10

        this.footstepSound.play()
      }
      this.up.press = (e) => {
        if (stamina >= 50) {
          stamina += -50
          this.forceJump = -0.03 * this.body.mass
          MATTER.Body.applyForce(this.body, this.body.position, { x: 0, y: this.forceJump })
          this.jumped++
          timer = 0
          this.footstepSound.stop()
          this.jumpSound.play()
        }
      }
      this.left.release = (e) => {
        this.force = 0
        this.sprite.textures = this.sheet.player2.animations.perso_stop
        this.sprite.animationSpeed = 0.05

        this.sprite.play()
        this.footstepSound.stop()
      }
      this.right.release = (e) => {
        this.force = 0
        this.sprite.textures = this.sheet.player2.animations.perso_stop
        this.sprite.animationSpeed = 0.05
        this.sprite.play()
        this.footstepSound.stop()
      }

      this.up.release = (e) => {
        this.forceJump = 0
      }
    }

    animate () {
      if (this.right.isDown && this.left.isDown) {
        this.sprite.textures = this.sheet.player.animations.perso
        this.force = 0
        this.footstepSound.stop()
      }

      // if (this.body.position.y > this.body.positionPrev.y) {
      //   this.footstepSound.stop()
      // }
      if (this.right.isDown || this.left.isDown) {
        MATTER.Body.translate(this.body, { x: this.force, y: 0 })
      }

      if (this.sprite.x >= _width / 2 && this.sprite.x < gameScene.width - _width / 2) {
        gameScene.pivot.x = this.body.position.x - _width / 2
        gameFg.pivot.x = this.body.position.x - _width / 2
        gameBgFirst.pivot.x = gameScene.pivot.x / 15
        gameBgSecond.pivot.x = gameScene.pivot.x / 10
        gameBgThird.pivot.x = gameScene.pivot.x / 5
      }
      if (this.jumped > 0) {
        this.sprite.textures = this.sheet.player2.animations.perso_saut
      }
      if (this.sprite.y > _height + 300) {
        sentence = "Tu es tombée dans l'oubli."
        gameOver(sentence)
      }
      this.sprite.x = this.body.position.x
      this.sprite.y = this.body.position.y
    }
  }
  class Relique {
    constructor (sheet) {
      this.sheet = sheet
      this.sprite = new PIXI.AnimatedSprite(this.sheet.animations.allier)
      this.left = keyboard("ArrowLeft")
      this.right = keyboard("ArrowRight")
      this.up = keyboard("ArrowUp")
      this.down = keyboard("ArrowDown")
      this.vx = 0
      this.vy = 0
    }

    display () {
      this.sprite.x = 350
      this.sprite.y = _height / 2
      this.sprite.animationSpeed = 0.167
      this.sprite.zIndex = 101
      this.sprite.play()
      this.sprite.anchor.set(0.5)
      this.sprite.scale.set(0.4)
      this.circle = new PIXI.Graphics()
      this.circle.beginFill(0xFF0000)
      this.circle.drawCircle(this.sprite.x, this.sprite.y, 300)
      this.circle.endFill()
      this.circle.filters = [new PIXI.filters.BlurFilter(10)]
      const bounds = new PIXI.Rectangle(0, 0, _width, _height)
      this.texture = game.renderer.generateTexture(this.circle, PIXI.SCALE_MODES.NEAREST, window.devicePixelRatio, bounds)
      this.focus = new PIXI.Sprite(this.texture)
      gameScene.addChild(this.focus, this.sprite)
      gameScene.mask = this.focus
    }

    control () {
      this.left.press = e => {
        this.vx = -25
        this.sprite.angle = 90
      }
      this.left.release = e => {
        this.vx = 0
        this.sprite.angle = 0
      }
      this.right.press = e => {
        this.vx = 25
        this.sprite.angle = -90
      }
      this.right.release = e => {
        this.vx = 0
        this.sprite.angle = 0
      }
      this.up.press = e => {
        this.vy = -15
        this.sprite.angle = 180
      }
      this.up.release = e => {
        this.vy = 0
        this.sprite.angle = 0
      }
      this.down.press = e => {
        this.vy = 15
        this.sprite.angle = 0
      }
      this.down.release = e => {
        this.vy = 0
        this.sprite.angle = 0
      }
    }

    animate () {
      if (this.up.isDown) {
        if (this.right.isDown) {
          this.sprite.angle = -115
        } else if (this.left.isDown) {
          this.sprite.angle = 115
        } else {
          this.sprite.angle = 180
        }
      }
      if (this.down.isDown) {
        if (this.right.isDown) {
          this.sprite.angle = -45
        } else if (this.left.isDown) {
          this.sprite.angle = 45
        } else {
          this.sprite.angle = 0
        }
      }
      if (this.up.isDown && this.down.isDown) {
        this.vy = 0
      } else if (this.left.isDown && this.right.isDown) {
        this.vx = 0
        this.sprite.angle = 0
      }
      this.focus.position.x += this.vx
      this.focus.position.y += this.vy
      this.sprite.x += this.vx
      this.sprite.y += this.vy
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
      this.sprite.scale.set(0.2)
      if (this.sprite.x < _width / 2) {
        this.sprite.scale.x = -0.2
      }

      this.sprite.anchor.set(0.5)

      this.sprite.animationSpeed = 0.167
      this.sprite.play()
      gameFg.addChild(this.sprite)
    }

    animate () {
      this.birdAnim = GSAP.gsap.to(this.sprite, { x: this.player.sprite.x, y: this.player.sprite.y, duration: 2, ease: "none" })
      allAnim.push(this.birdAnim)
    }

    check () {
      if (this.sprite.alpha === 1 && this.sprite.visible === true) {
        const dx = this.relique.sprite.x - this.sprite.x
        const dy = this.relique.sprite.y - this.sprite.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < this.relique.circle.width / 2 + this.sprite.width / 2) {
          GSAP.gsap.to(this.sprite, { alpha: 0, duration: 0.5 })
            .then(e => {
              this.sprite.visible = false
              gameFg.removeChild(this.sprite)
            })
        }
        if (this.sprite.x < gameFg.pivot.x) {
          this.sprite.visible = false
          gameFg.removeChild(this.sprite)
        }
        if (collideTest(this.sprite, this.player.sprite)) {
          sanity += -50
          this.sprite.visible = false
          gameFg.removeChild(this.sprite)
        }
      }
    }
  }
  class Plateform {
    constructor (sheet, platInfo, player, i) {
      this.currenPlat = i
      this.player = player
      this.bPlayer = this.player.body
      this.sPlayer = this.player.sprite
      this.sheet = sheet
      this.sprite = new PIXI.Sprite(this.sheet.textures[`plateforme_${platInfo[this.currenPlat].model}.png`])
      this.x = platInfo[this.currenPlat].x
      this.y = platInfo[this.currenPlat].y
      this.platInfo = platInfo[this.currenPlat]
      this.xSpeed = 5
      this.vx = this.xSpeed
      this.vy = 6
      this.gravity = 0
      this.initialX = this.x
      this.willFall = false
      this.timer = platInfo[this.currenPlat].delay
    }

    display () {
      this.sprite.anchor.set(0.5)
      this.sprite.scale.set(0.5)

      if (this.platInfo.falling) {
        this.spriteLeft = new PIXI.Sprite(this.sheet.textures["part_left.png"])
        this.spriteLeft.anchor.set(0.5)
        this.spriteLeft.x = -305
        this.spriteLeft.y = 53
        this.spriteLeftCenter = new PIXI.Sprite(this.sheet.textures["part_leftCenter.png"])
        this.spriteLeftCenter.anchor.set(0.5)
        this.spriteLeftCenter.x = -161.8
        this.spriteLeftCenter.y = 41.7
        this.spriteCenter = new PIXI.Sprite(this.sheet.textures["part_center.png"])
        this.spriteCenter.anchor.set(0.5)
        this.spriteCenter.x = -4
        this.spriteCenter.y = 94
        this.body = Bodies.rectangle(this.x, this.y, this.sprite.width, this.sprite.height, { isSleeping: true })
        this.sprite.addChild(this.spriteLeft, this.spriteLeftCenter, this.spriteCenter)
      } else {
        this.body = Bodies.rectangle(this.x, this.y, this.sprite.width, this.sprite.height, { isStatic: true })
      }
      this.body.friction = 0
      this.body.frictionStatic = 0
      this.sprite.x = this.body.position.x
      this.sprite.y = this.body.position.y
      World.add(engine.world, this.body)
      gameScene.addChild(this.sprite)
      if (this.platInfo.falling) {
        game.ticker.add(e => {
          if (this.willFall) {
            setTimeout(e => {
              this.spriteLeft.y += 10
              this.spriteLeft.rotation += 0.01
            }, 0)
            setTimeout(e => {
              this.spriteCenter.y += 10
              this.spriteCenter.rotation += -0.01
            }, 1000)
            setTimeout(e => {
              this.spriteLeftCenter.y += 10
              this.spriteLeftCenter.rotation += 0.01
            }, 2000)
          }
        })
      }
    }

    animate () {
      if (this.platInfo.moveY) {
        if (this.sprite.y < 0 || this.sprite.y > _height) {
          this.vy *= -1
        }
        MATTER.Body.translate(this.body, { x: 0, y: this.vy })
      }

      if (this.platInfo.moveX) {
        if (this.sprite.x > this.initialX + 500) {
          this.vx = -this.xSpeed
        }
        if (this.sprite.x <= this.initialX) {
          this.vx = this.xSpeed
        }
        MATTER.Body.translate(this.body, { x: this.vx, y: 0 })
      }
      this.sprite.y = this.body.position.y
      this.sprite.x = this.body.position.x
    }

    check () {
      this.colisionPlayer = collideTest(this.sprite, this.sPlayer)
      if (this.colisionPlayer) {
        timer += 1
        const timerJump = timer % 61
        if (timerJump >= 60) {
          stamina = 100
        }
        if (this.player.jumped > 0) {
          if (this.player.left.isDown || this.player.right.isDown) {
            this.player.sprite.textures = this.player.sheet.player.animations.perso
          } else {
            this.player.sprite.textures = this.player.sheet.player2.animations.perso_stop
          }
          this.player.jumped = 0
          this.player.sprite.play()
          this.player.landingSound.play()
          if (player.right.isDown || player.left.isDown) {
            player.footstepSound.play()
          }
        }

        if (this.platInfo.moveX) {
          MATTER.Body.translate(this.bPlayer, { x: this.vx, y: 0 })
          gameBgThird.pivot.x += this.vx / 6
          gameBgSecond.pivot.x += this.vx / 10
          gameBgFirst.pivot.x += this.vx / 15
          this.sPlayer.x = this.bPlayer.position.x
        }
        if (this.platInfo.falling) {
          this.willFall = true

          setTimeout(e => {
            MATTER.Sleeping.set(this.body, false)
          }, 3000)
        }
      }
    }
  }

  class CheckPointPlateform {
    constructor (sheet, platInfo) {
      this.sheet = sheet
      this.platInfo = platInfo
      this.x = this.platInfo.x
      this.y = this.platInfo.y
      this.text = new PIXI.Sprite.from("./assets/images/portailCommand.png")
      this.action = keyboard("e")
      this.option = {
        isStatic: true
      }
    }

    display () {
      gameFg.addChild(this.text)
      this.text.anchor.set(0.5)
      this.text.scale.set(0.3)
      this.text.visible = false
      this.text.texture.mipmap = PIXI.MIPMAP_MODES.ON
      if (this.platInfo.model === "start") {
        this.sprite = new PIXI.AnimatedSprite(this.sheet.plateformeStart.animations.plateforme_start)
        this.sprite.width = _width - 200
        this.sprite.height = this.sprite.width * (1250 / 2500)
        this.sprite.animationSpeed = 0.157
        this.sprite.play()
      } else if (this.platInfo.model === "pause1") {
        this.sprite = new PIXI.AnimatedSprite(this.sheet.plateformePause.animations.plateforme_pause1)
        this.sprite.animationSpeed = 0.167
        this.sprite.play()
        this.sprite.width = _width
        this.sprite.height = this.sprite.width * (720 / 2560)
      } else if (this.platInfo.model === "pause2") {
        this.sprite = new PIXI.Sprite(this.sheet.plateformePause.textures["plateforme_pause2.png"])
        this.sprite.width = _width
        this.sprite.height = this.sprite.width * (720 / 2560)
      }
      this.sprite.anchor.set(0.5)
      this.sprite.x = this.x + this.sprite.width / 2
      this.sprite.y = this.y + this.sprite.height / 2
      this.body = Bodies.rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height, this.option)
      if (this.platInfo.portail.isHere) {
        this.spritePortail = new PIXI.Sprite(this.sheet.portail.textures[`portail_${this.platInfo.portail.state}.png`])
        this.spritePortail.anchor.set(0.5, 1)
        this.spritePortail.scale.set(0.6)
        this.spritePortail.y = _height / 2
        if (this.platInfo.portail.where === "start") {
          this.spritePortail.x = this.platInfo.portail.pos + this.spritePortail.width / 2
        } else {
          this.spritePortail.x = this.platInfo.portail.pos - this.spritePortail.width / 2 + this.sprite.width
        }
        gameScene.addChild(this.spritePortail)
      }
      this.body.friction = 0
      this.body.frictionStatic = 0
      World.add(engine.world, this.body)
      gameScene.addChild(this.sprite)
    }

    check (player) {
      this.colisionPlayer = collideTest(this.sprite, player.sprite)
      if (this.platInfo.portail.isHere) {
        this.colisionPlayerPortail = collideTest(this.spritePortail, player.sprite)
        this.action.press = e => {
          if (this.colisionPlayerPortail && this.platInfo.portail.state === "open") {
            currentLevel += 1
            gameEnd()
          }
        }
      }
      if (this.colisionPlayerPortail && this.platInfo.portail.state === "open") {
        this.text.x = this.spritePortail.x
        this.text.y = this.spritePortail.y + this.spritePortail.height / 4
        this.text.visible = true
      } else {
        this.text.visible = false
      }
      if (this.colisionPlayer) {
        timer += 1
        const timerJump = timer % 31
        if (timerJump >= 30) {
          stamina = 100
        }
        if (player.jumped > 0) {
          if (player.left.isDown || player.right.isDown) {
            player.sprite.textures = player.sheet.player.animations.perso
          } else {
            player.sprite.textures = player.sheet.player2.animations.perso_stop
          }
          player.jumped = 0
          player.sprite.play()
          player.landingSound.play()
          if (player.right.isDown || player.left.isDown) {
            player.footstepSound.play()
          }
        }
      }
    }
  }
}

"use strict"
import * as PIXI from "pixi.js"
import * as GSAP from "gsap"
export function menu () {
  const _width = window.innerWidth
  const _height = window.innerHeight
  const navMenu = document.querySelector(".nav")
  const navEl = document.querySelectorAll(".nav__el")

  const menu = {
    mainMenu: document.querySelector("#mainMenu"),
    story: document.querySelector("#story"),
    control: document.querySelector("#control"),
    level: document.querySelector("#level")
  }

  for (let i = 0; i < navEl.length; i++) {
    navEl[i].addEventListener("click", (e) => {
      const test = i
      e.target.classList.add("nav__el--actif")
      const name = e.target.getAttribute("data-name")
      for (let i = 0; i < Object.keys(menu).length; i++) {
        Object.values(menu)[i].style.display = "none"
        navEl[i].classList.remove("nav__el--actif")
      }
      menu[name].style.display = "block"
      navEl[test].classList.add("nav__el--actif")
    })
  }

  const bgCont = new PIXI.Container()
  const bg = PIXI.Sprite.from("./assets/images/background.png")
  const sky = new PIXI.Graphics()
  const canvasStart = new PIXI.Application({
    view: document.getElementById("canvasStart"),
    width: _width,
    height: _height,
    backgroundColor: 0x0a0a0a

  })

  canvasStart.stage.addChild(bgCont)
  sky.beginFill(0x77B5FE)
  sky.drawRect(0, 0, _width, _height)
  sky.endFill()
  // gameFg.addChild(rect)
  bg.anchor.set(0, 1)
  bg.x = 0
  bg.y = _height + 300
  bgCont.addChild(sky, bg)
  class Circles {
    constructor () {
      this.x = 0
      this.y = 0
      this.size = 100
    }

    display () {
      this.circle = new PIXI.Graphics()
      this.circle.beginFill(0x00000)
      this.circle.drawCircle(this.x, this.y, this.size)
      this.circle.endFill()
      bgCont.addChild(this.circle)
      bgCont.mask = this.circle
    }

    animate () {
      const mousePos = canvasStart.renderer.plugins.interaction.mouse.global
      navMenu.addEventListener("mouseover", (e) => {
        GSAP.gsap.to(this.circle, { width: 400, height: 400, ease: " power4.out" })
      })
      navMenu.addEventListener("mouseout", (e) => {
        GSAP.gsap.to(this.circle, { width: 200, height: 200, ease: " power4.out" })
      })
      canvasStart.ticker.add((e) => {
        this.circle.x = mousePos.x
        this.circle.y = mousePos.y
      })
    }
  }
  const circle = new Circles()
  circle.display()
  circle.animate()

  setInterval(createCloud, 3000)

  function createCloud () {
    const cloud = new Cloud()
    cloud.display()
    cloud.animate()
  }

  class Cloud {
    constructor () {
      this.sprites = PIXI.Loader.shared.resources["./assets/images/cloud/cloud.json"].spritesheet
      this.x = 100 + _width
      this.y = (Math.random() * _height / 2 + 200) - 100
      this.sprite = new PIXI.Sprite(this.sprites.textures["cloud_1.png"])
      this.vx = Math.random() * 2 + 0.1
    }

    display () {
      if (Math.random() > 0.5) {
        this.sprite.texture = this.sprites.textures["cloud_2.png"]
      }
      if (Math.random() > 0.333) {
        this.sprite.zIndex = -3
      } else {
        this.sprite.zIndex = 1000
      }
      this.sprite.scale.set(0.3)
      this.sprite.x = this.x
      this.sprite.y = this.y

      bgCont.addChild(this.sprite)
    }

    animate () {
      canvasStart.ticker.add(e => {
        this.sprite.x += -this.vx
        // console.log(`${this.sprite.x} /// ${gameScene.pivot.x}`)
        if (this.sprite.x < 0) {
          bgCont.removeChild(this.sprite)
        }
      })
    }
  }
}

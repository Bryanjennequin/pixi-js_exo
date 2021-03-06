"use strict"
import * as PIXI from "pixi.js"
import { platInfo, _width, _height } from "./info"
export function menu () {
  class Montagne {
    constructor () {
      this.sheet = PIXI.Loader.shared.resources["./assets/images/montagne.json"].spritesheet
      this.x = 0
      this.y = 0
      this.allSprite = []
    }

    display () {
      for (let i = 0; i < 5; i++) {
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
          bgCont.addChild(this.sprite)
        }
      }
    }
  }
  class Monstre {
    constructor () {
      this.sheet = PIXI.Loader.shared.resources["./assets/images/monstre/monstreState.json"].spritesheet
      this.sprite = new PIXI.AnimatedSprite(this.sheet.animations.monstre)
      this.x = _width + 100
      this.y = (Math.random() * (_height - 100)) + 100
    }

    display () {
      this.sprite.x = this.x
      this.sprite.y = this.y
      this.sprite.anchor.set(0.5)
      this.sprite.scale.set(0.2)
      this.sprite.animationSpeed = 0.167
      this.sprite.play()
      bgCont.addChild(this.sprite)
    }

    animate () {
      canvasStart.ticker.add(e => {
        this.sprite.x += -5
        if (this.sprite.x < -(this.sprite.width)) {
          this.sprite.y = (Math.random() * (_height - 250)) + 250
          this.sprite.x = this.x
        }
      })
    }
  }
  const navEl = document.querySelectorAll(".nav__el button")
  const bgCont = new PIXI.Container()
  const sky = new PIXI.Graphics()
  const filter = new PIXI.Graphics()
  bgCont.sortableChildren = true
  const canvasStart = new PIXI.Application({
    autoResize: true,
    view: document.getElementById("canvasStart"),
    width: _width,
    height: _height,
    backgroundColor: 0x0a0a0a

  })
  const menu = {
    canvasGame: document.querySelector("#canvasGame"),
    mainMenu: document.querySelector("#mainMenu"),
    control: document.querySelector("#control"),
    level: document.querySelector("#level")
  }
  const levelList = document.querySelector(".level-list")
  for (let i = 0; i < platInfo.length; i++) {
    const li = document.createElement("li")
    li.classList.add("level-list__el")
    li.innerHTML = `
    <button>Niveau ${i + 1}</button>
    `
    li.addEventListener("click", e => {
      destroy()
    })
    levelList.appendChild(li)
  }
  for (let i = 0; i < navEl.length; i++) {
    navEl[i].addEventListener("click", (e) => {
      const currentEl = i
      e.target.parentNode.classList.add("nav__el--actif")
      const name = e.target.getAttribute("data-name")
      for (let i = 0; i < Object.values(menu).length; i++) {
        Object.values(menu)[i].style.display = "none"
        navEl[i].parentNode.classList.remove("nav__el--actif")
      }
      menu[name].style.display = "flex"
      navEl[currentEl].parentNode.classList.add("nav__el--actif")
      if (name === "canvasGame") {
        destroy()
      }
    })
  }
  function destroy () {
    canvasStart.destroy()
    montagne.display = null
    montagne = null
    monstre.display = null
    monstre.animate = null
    monstre = null
  }
  canvasStart.stage.addChild(bgCont)

  filter.beginFill(0x4F1342, 0.2)
  filter.drawRect(0, 0, _width, _height)
  filter.endFill()
  filter.zIndex = 10
  sky.beginFill(0xbde1f8, 1)
  sky.drawRect(0, 0, _width, _height)
  sky.endFill()

  bgCont.addChild(sky, filter)
  const menuBg = PIXI.Loader.shared.resources["./assets/images/Menu/menu.json"].spritesheet
  const SpriteMenu = new PIXI.AnimatedSprite(menuBg.animations.bgMenu)

  let montagne = new Montagne()
  montagne.display()
  bgCont.addChild(SpriteMenu)
  SpriteMenu.anchor.set(0.5)
  SpriteMenu.x = (_width / 2) + (SpriteMenu.width / 2) - 80
  SpriteMenu.y = _height / 2
  SpriteMenu.animationSpeed = 0.160
  SpriteMenu.play()
  let monstre = new Monstre()
  monstre.display()
  monstre.animate()
}

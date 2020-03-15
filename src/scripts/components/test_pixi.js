import * as PIXI from "pixi.js"

export function test () {
  let type = "WebGL"
  if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
  }
  PIXI.utils.sayHello(type)
}

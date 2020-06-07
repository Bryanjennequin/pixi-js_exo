export const _width = window.innerWidth
export const _height = window.innerHeight
export const scaleRatio = _width / (_width / 1.5)

export const platInfo = [
  {
    special: [
      {
        x: -10,
        y: _height / 2,
        model: "start",
        portail: {
          isHere: true,
          state: "close",
          model: "start"
        }
      }
    ],
    classique: [
      { x: _width + 300, y: _height / 2, model: "fall", moveX: false, moveY: false, falling: true, delay: 0 },
      { x: _width + 1000, y: _height / 2, model: "moyenne", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 1500, y: _height / 2 + 200, model: "petite", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 2000, y: _height / 2, model: "grande", moveX: false, moveY: true, falling: false, delay: 0 },
      { x: _width + 3000, y: _height / 2 + 400, model: "grande", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 3500, y: _height / 2 + 200, model: "moyenne", moveX: true, moveY: false, falling: false, delay: 0 },
      { x: _width + 4500, y: _height / 2, model: "petite", moveX: false, moveY: true, falling: false, delay: 0 },
      { x: _width + 5000, y: _height / 2, model: "petite", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 5500, y: _height / 2, model: "petite", moveX: false, moveY: true, falling: false, delay: 2000 }
    ]
  }
]

// if (this.currenPlat === 0) {
//   if (this.platInfo[this.currenPlat].falling) {
//     this.body = Bodies.rectangle(this.x, this.y, this.sprite.width, this.sprite.height, { isSleeping: true })
//   } else {
//     this.body = Bodies.rectangle(this.x, this.y, this.sprite.width, this.sprite.height, { isStatic: true })
//   }
// } else {
//   if (this.platInfo[this.currenPlat].falling) {
//     this.body = Bodies.rectangle(this.x + this.platInfo[this.currenPlat - 1].x, this.y, this.sprite.width, this.sprite.height, { isSleeping: true })
//   } else {
//     this.body = Bodies.rectangle(this.x + this.platInfo[this.currenPlat - 1].x, this.y, this.sprite.width, this.sprite.height, { isStatic: true })
//   }
// }

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
          pos: 0,
          where: "start"
        }
      },
      {
        x: _width + 6000,
        y: _height / 2,
        model: "pause1",
        portail: {
          isHere: false,
          state: "none",
          pos: "none",
          where: "end"
        }
      },
      {
        x: _width * 2 + 13500,
        y: _height / 2,
        model: "pause2",
        portail: {
          isHere: true,
          state: "open",
          pos: _width * 2 + 13500,
          where: "end"
        }
      }
    ],
    classique: [
      { x: _width + 300, y: _height / 2, model: "grande", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 1000, y: _height / 2, model: "moyenne", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 1500, y: _height / 2 + 200, model: "petite", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 2000, y: _height / 2, model: "grande", moveX: false, moveY: true, falling: false, delay: 0 },
      { x: _width + 3000, y: _height / 2 + 400, model: "grande", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 3500, y: _height / 2 + 200, model: "moyenne", moveX: true, moveY: false, falling: false, delay: 0 },
      { x: _width + 4500, y: _height / 2, model: "petite", moveX: false, moveY: true, falling: false, delay: 0 },
      { x: _width + 5000, y: _height / 2, model: "petite", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 5500, y: _height / 2, model: "petite", moveX: false, moveY: true, falling: false, delay: 0 },
      { x: _width * 2 + 6500, y: _height / 2, model: "fall", moveX: false, moveY: false, falling: true, delay: 0 },
      { x: _width * 2 + 7500, y: _height / 2, model: "fall", moveX: false, moveY: false, falling: true, delay: 0 },
      { x: _width * 2 + 8500, y: _height / 2, model: "fall", moveX: false, moveY: false, falling: true, delay: 0 },
      { x: _width * 2 + 9000, y: _height / 2, model: "moyenne", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width * 2 + 10000, y: _height / 2 + 400, model: "grande", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width * 2 + 11000, y: _height / 2 + 200, model: "grande", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width * 2 + 12000, y: _height / 2, model: "grande", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width * 2 + 13000, y: _height / 2 - 200, model: "grande", moveX: false, moveY: false, falling: false, delay: 0 }
    ]
  },
  {
    special: [
      {
        x: -10,
        y: _height / 2,
        model: "pause2",
        portail: {
          isHere: true,
          state: "close",
          pos: 0,
          where: "start"
        }
      },
      {
        x: _width + 6000,
        y: _height / 2,
        model: "start",
        portail: {
          isHere: false,
          state: "none",
          pos: "none",
          where: "end"
        }
      },
      {
        x: _width * 2 + 11000,
        y: _height / 2,
        model: "pause1",
        portail: {
          isHere: true,
          state: "open",
          pos: _width * 2 + 11000,
          where: "end"
        }
      }
    ],
    classique: [
      { x: _width + 300, y: _height / 2, model: "grande", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 1000, y: _height / 2, model: "fall", moveX: false, moveY: false, falling: true, delay: 0 },
      { x: _width + 1500, y: _height / 2 + 200, model: "fall", moveX: false, moveY: false, falling: true, delay: 0 },
      { x: _width + 2000, y: _height / 2 + 300, model: "fall", moveX: false, moveY: false, falling: true, delay: 0 },
      { x: _width + 2500, y: _height / 2 + 200, model: "petite", moveX: true, moveY: false, falling: false, delay: 0 },
      { x: _width + 3500, y: _height / 2, model: "fall", moveX: false, moveY: false, falling: true, delay: 0 },
      { x: _width + 4000, y: _height / 2, model: "moyenne", moveX: true, moveY: false, falling: false, delay: 0 },
      { x: _width + 5000, y: _height / 2, model: "moyenne", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 5500, y: _height / 2, model: "grande", moveX: false, moveY: true, falling: false, delay: 0 },
      { x: _width * 2 + 6000, y: _height / 2 - 200, model: "petite", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width * 2 + 6500, y: _height / 2 - 300, model: "petite", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width * 2 + 7000, y: _height / 2 - 200, model: "petite", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width * 2 + 7500, y: _height / 2, model: "moyenne", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width * 2 + 8000, y: _height / 2 + 400, model: "grande", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width * 2 + 9000, y: _height / 2 + 200, model: "grande", moveX: false, moveY: true, falling: false, delay: 0 },
      { x: _width * 2 + 9500, y: _height / 2, model: "grande", moveX: true, moveY: false, falling: false, delay: 0 },
      { x: _width * 2 + 10500, y: _height / 2 - 200, model: "fall", moveX: false, moveY: false, falling: true, delay: 0 }
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

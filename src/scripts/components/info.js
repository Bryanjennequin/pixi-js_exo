export const _width = window.innerWidth
export const _height = window.innerHeight
export const scaleRatio = _width / (_width / 1.5)
export const platInfo = [
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
  },
  {
    special: [
      { x: 0, y: _height / 2, model: "start" },
      { x: 1440 * 2.5, y: _height / 2, model: "pause0" },
      { x: 1440 + 3000, y: _height / 2, model: "pause1" }
    ],
    classique: [
      { x: 1440 / 1.6, y: _height / 2, size: "longue", moveX: false, moveY: false, falling: false }
    ]
  }

]

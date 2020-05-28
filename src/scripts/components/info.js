export const _width = window.innerWidth
export const _height = window.innerHeight
export const scaleRatio = _width / (_width / 1.5)
const platSize = {
  small: (398 / 4) * scaleRatio,
  medium: (398 / 2) * scaleRatio,
  big: (398) * scaleRatio

}
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
      { x: _width + 300, y: _height / 2, size: "grande", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 1000, y: _height / 2, size: "moyenne", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 1500, y: _height / 2 + 200, size: "petite", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: _width + 2000, y: _height / 2, size: "grande", moveX: false, moveY: true, falling: false, delay: 0 },
      { x: _width + 3000, y: _height / 2 - 200, size: "grande", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: 1500 + platSize.big + platSize.big + platSize.big + 200 + platSize.big + 200 + platSize.medium + 200, y: _height / 2, size: "moyenne", moveX: true, moveY: false, falling: false, delay: 0 },
      { x: 1500 + platSize.big + platSize.big + platSize.big + 200 + platSize.big + 200 + platSize.medium + 200 + platSize.small + 2000, y: _height / 2, size: "petite", moveX: false, moveY: true, falling: false, delay: 0 },
      { x: 1500 + platSize.big + platSize.big + platSize.big + 200 + platSize.big + 200 + platSize.medium + 200 + platSize.small + 2000 + platSize.small + 500, y: _height / 2, size: "petite", moveX: false, moveY: false, falling: false, delay: 0 },
      { x: 1500 + platSize.big + platSize.big + platSize.big + 200 + platSize.big + 200 + platSize.medium + 200 + platSize.small + 2000 + platSize.small + 500 + platSize.small + 450, y: _height / 2, size: "petite", moveX: false, moveY: true, falling: false, delay: 2000 }
    ]
  }
]

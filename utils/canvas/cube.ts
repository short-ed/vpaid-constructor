const canvas: HTMLCanvasElement = document.getElementById('myCanvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')
if (!ctx)
  throw new Error('Canvas context is null')
// Размеры холста
canvas.width = 800
canvas.height = 600

// Параметры перспективы и угла поворота
const perspective = 400
const angleX = 0
const angleY = 0
const angleZ = 0

// Переменная для вертикального смещения
const offsetY = 0
const offsetX = 0
const offsetZ = 0
// const direction = 1 // Направление движения: 1 вверх, -1 вниз

// Функция для поворота точки вокруг оси Y
function rotateY(x: number, y: number, z: number, angle: number) {
  const radians = (Math.PI / 180) * angle
  const cosTheta = Math.cos(radians)
  const sinTheta = Math.sin(radians)
  return {
    x: cosTheta * x + sinTheta * z,
    y,
    z: -sinTheta * x + cosTheta * z,
  }
}

// Функция для поворота точки вокруг оси X
function rotateX(x: number, y: number, z: number, angle: number) {
  const radians = (Math.PI / 180) * angle
  const cosTheta = Math.cos(radians)
  const sinTheta = Math.sin(radians)
  return {
    x,
    y: cosTheta * y - sinTheta * z,
    z: sinTheta * y + cosTheta * z,
  }
}

// Функция для поворота точки вокруг оси Z
function rotateZ(x: number, y: number, z: number, angle: number) {
  const radians = (Math.PI / 180) * angle
  const cosTheta = Math.cos(radians)
  const sinTheta = Math.sin(radians)
  return {
    x: cosTheta * x - sinTheta * y,
    y: sinTheta * x + cosTheta * y,
    z,
  }
}

// Функция для проецирования 3D точки на 2D плоскость
function project(x: number, y: number, z: number) {
  return {
    x: (x * perspective) / (z + perspective),
    y: (y * perspective) / (z + perspective),
    z: (z * perspective) / (z + perspective),
  }
}

// Вершины куба
interface CubeVertex {
  x: number
  y: number
  z: number
}
const cubeVertices: CubeVertex[] = [
  { x: -50, y: -50, z: -50 },
  { x: 50, y: -50, z: -50 },
  { x: 50, y: 50, z: -50 },
  { x: -50, y: 50, z: -50 },
  { x: -50, y: -50, z: 50 },
  { x: 50, y: -50, z: 50 },
  { x: 50, y: 50, z: 50 },
  { x: -50, y: 50, z: 50 },
]

// Рёбра куба
const cubeEdges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
]

const cubeFaces = [
  [0, 1, 2, 3], // передняя
  [4, 5, 6, 7], // задняя
  [0, 1, 5, 4], // нижняя
  [2, 3, 7, 6], // верхняя
  [0, 3, 7, 4], // левая
  [1, 2, 6, 5], // правая
]

// Функция для рисования и заливки грани
type CanvasColor = string | CanvasGradient | CanvasPattern
function drawFace(ctx: CanvasRenderingContext2D, vertices: CubeVertex[], color: CanvasColor) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(vertices[0].x, vertices[0].y)
  for (let i = 1; i < vertices.length; i++)
    ctx.lineTo(vertices[i].x, vertices[i].y)

  ctx.closePath()
  ctx.fill()
}

// Функция анимации
function animate(ctx: CanvasRenderingContext2D) {
  // Очистка холста
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Перемещение начала координат в центр холста
  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2)

  // Применение поворота и проекции к вершинам
  const transformedVertices = cubeVertices.map((vertex) => {
    // Добавляем вертикальное смещение к координате Y каждой вершины
    const translateY = vertex.y + offsetY
    const translateX = vertex.x + offsetX
    const translateZ = vertex.z + offsetZ

    let rotated = rotateY(translateX, translateY, translateZ, angleY)
    rotated = rotateX(rotated.x, rotated.y, rotated.z, angleX)
    rotated = rotateZ(rotated.x, rotated.y, rotated.z, angleZ)
    return project(rotated.x, rotated.y, rotated.z)

    // return project(translateX, translateY, translateZ)
  })

  // Рисование и заливка граней
  cubeFaces.forEach((face, index) => {
    const faceVertices = face.map(
      vertexIndex => transformedVertices[vertexIndex],
    )
    const color = `hsl(${index * 60}, 100%, 50%)` // Для наглядности используем разные цвета
    drawFace(ctx, faceVertices, color)
  })

  // Рисование рёбер куба
  ctx.beginPath()
  cubeEdges.forEach(([start, end]) => {
    const startX = transformedVertices[start].x
    const startY = transformedVertices[start].y
    const endX = transformedVertices[end].x
    const endY = transformedVertices[end].y
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
  })
  ctx.stroke()

  // Восстановление стандартных параметров холста
  ctx.restore()

  // Инкремент угла для следующего кадра
  // angle += 1

  // Изменяем вертикальное смещение
  // offsetY += 2 * direction

  // Изменяем направление при достижении определенных пределов
  // if (offsetY > 100 || offsetY < -100)
  //   direction *= -1

  // Изменяем вертикальное смещение
  // offsetX += 2 * direction

  // Изменяем направление при достижении определенных пределов
  // if (offsetX > 100 || offsetX < -100)
  //   direction *= -1

  // Изменяем вертикальное смещение
  // offsetZ += 2 * direction

  // Изменяем направление при достижении определенных пределов
  // if (offsetZ > 100 || offsetZ < -100)
  //   direction *= -1

  // Следующий кадр
  requestAnimationFrame(() => animate(ctx))
}

// Запуск анимации
animate(ctx)

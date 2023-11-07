Для построения куба в перспективе и его анимации вокруг своей оси вы можете использовать формулы 3D-трансформаций. Эти формулы позволяют применить пространственные повороты, переносы и масштабирование к точкам в трехмерном пространстве.

### Основные формулы для поворота вокруг осей:

1. **Вокруг оси X:**
   \[
   x' = x
   \]
   \[
   y' = y \cos(\theta) - z \sin(\theta)
   \]
   \[
   z' = y \sin(\theta) + z \cos(\theta)
   \]

2. **Вокруг оси Y:**
   \[
   x' = x \cos(\theta) + z \sin(\theta)
   \]
   \[
   y' = y
   \]
   \[
   z' = -x \sin(\theta) + z \cos(\theta)
   \]

3. **Вокруг оси Z:**
   \[
   x' = x \cos(\theta) - y \sin(\theta)
   \]
   \[
   y' = x \sin(\theta) + y \cos(\theta)
   \]
   \[
   z' = z
   \]

### Пример на JavaScript:

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Размеры холста
canvas.width = 800;
canvas.height = 600;

// Параметры перспективы и угла поворота
const perspective = 400;
let angle = 0;

// Переменная для вертикального смещения
let offsetY = 0;
let direction = 1; // Направление движения: 1 вверх, -1 вниз

// Функция для поворота точки вокруг оси Y
function rotateY(x, y, z, angle) {
  const radians = (Math.PI / 180) * angle;
  const cosTheta = Math.cos(radians);
  const sinTheta = Math.sin(radians);
  return {
    x: cosTheta * x + sinTheta * z,
    y: y,
    z: -sinTheta * x + cosTheta * z,
  };
}

// Функция для проецирования 3D точки на 2D плоскость
function project(x, y, z) {
  return {
    x: (x * perspective) / (z + perspective),
    y: (y * perspective) / (z + perspective),
  };
}

// Вершины куба
const cubeVertices = [
  { x: -50, y: -50, z: -50 },
  { x: 50, y: -50, z: -50 },
  { x: 50, y: 50, z: -50 },
  { x: -50, y: 50, z: -50 },
  { x: -50, y: -50, z: 50 },
  { x: 50, y: -50, z: 50 },
  { x: 50, y: 50, z: 50 },
  { x: -50, y: 50, z: 50 },
];

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
];

const cubeFaces = [
  [0, 1, 2, 3], // передняя
  [4, 5, 6, 7], // задняя
  [0, 1, 5, 4], // нижняя
  [2, 3, 7, 6], // верхняя
  [0, 3, 7, 4], // левая
  [1, 2, 6, 5], // правая
];

// Функция для рисования и заливки грани
function drawFace(ctx, vertices, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(vertices[i].x, vertices[i].y);
  }
  ctx.closePath();
  ctx.fill();
}

// Функция анимации
function animate() {
  // Очистка холста
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Перемещение начала координат в центр холста
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  // Применение поворота и проекции к вершинам
  const transformedVertices = cubeVertices.map((vertex) => {
    // Добавляем вертикальное смещение к координате Y каждой вершины
    const translateY = vertex.y + offsetY;

    const rotated = rotateY(vertex.x, translateY, vertex.z, angle);
    return project(rotated.x, rotated.y, rotated.z);
  });

  // Рисование и заливка граней
  cubeFaces.forEach((face, index) => {
    const faceVertices = face.map(
      (vertexIndex) => transformedVertices[vertexIndex]
    );
    const color = `hsl(${index * 60}, 100%, 50%)`; // Для наглядности используем разные цвета
    drawFace(ctx, faceVertices, color);
  });

  // Рисование рёбер куба
  ctx.beginPath();
  cubeEdges.forEach(([start, end]) => {
    const startX = transformedVertices[start].x;
    const startY = transformedVertices[start].y;
    const endX = transformedVertices[end].x;
    const endY = transformedVertices[end].y;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
  });
  ctx.stroke();

  // Восстановление стандартных параметров холста
  ctx.restore();

  // Инкремент угла для следующего кадра
  angle += 1;

  // Изменяем вертикальное смещение
  offsetY += 2 * direction;

  // Изменяем направление при достижении определенных пределов
  if (offsetY > 100 || offsetY < -100) {
    direction *= -1;
  }

  // Следующий кадр
  requestAnimationFrame(animate);
}

// Запуск анимации
animate();
```

Этот код можно адаптировать для работы с SVG или любым другим графическим API. При каждом кадре анимации функция `animate` будет поворачивать куб, обновляя его вершины.

Простая перспектива применена в функции `project`. Вы можете использовать более сложные методы перспективной проекции, если это необходимо для вашего проекта.
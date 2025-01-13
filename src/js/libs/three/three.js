import * as CANNON from 'cannon-es'
import * as THREE from 'three'

// Устанавливаем количество кубов на экране
const totalCubes = 8 // Общее количество кубов в сцене
const cubes = [] // Массив для хранения кубов

export function three() {
  // Шаг 1: Создайте сцену, камеру и рендерер
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ alpha: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true // Включаем карты теней

  // Устанавливаем цвет фона
  scene.background = new THREE.Color(0x555555)
  document.querySelector('.three-test-content').appendChild(renderer.domElement)

  // Шаг 2: Создайте свет
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75)
  scene.add(ambientLight)

  // Создаем точечный свет
  const pointLight = new THREE.PointLight(0xff0000, 1, 5) // 5 - максимальная дистанция освещения
  scene.add(pointLight)
  pointLight.position.set(0.05, 0, 1.25)

  // Настройка источника света
  // const light = new THREE.DirectionalLight(0xff0000, 1)
  const light = new THREE.DirectionalLight(0x888888, 1)
  light.position.set(5, 15, 5)
  light.castShadow = true // Включить тени от источника света
  scene.add(light)

  // Настройка параметров теней
  light.shadow.mapSize.width = 1024
  light.shadow.mapSize.height = 1024
  light.shadow.camera.near = 0.1
  light.shadow.camera.far = 50
  light.shadow.camera.left = -10
  light.shadow.camera.right = 10
  light.shadow.camera.top = 10
  light.shadow.camera.bottom = -10

  scene.add(light)

  // Создаем большую плоскость для подложки
  const planeGeometry = new THREE.PlaneGeometry(100, 100)
  const planeMaterial = new THREE.MeshStandardMaterial({
    // color: 0x555555,
    color: 0x111111,
    roughness: 0.5,
    metalness: 0.3
  }) // Используем MeshStandardMaterial
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)

  plane.rotation.x = -Math.PI / 2 // Поворачиваем плоскость, чтобы она была горизонтальной
  plane.receiveShadow = true // Плоскость будет принимать тени
  scene.add(plane)

  // Размер куба и отступ
  const cubeSize = 1 // Размер куба
  const gap = 0.2 // Отступ между кубами

  // Количество колонок
  const columns = 15 // Количество колонок
  // Вычисляем количество рядов, основываясь на высоте окна
  const rows = Math.ceil(window.innerHeight / (cubeSize * 100 + gap * 100) + 15) // 100 - для преобразования в пиксели

  // Смещение для центрирования по оси X
  const offsetX = (columns * (cubeSize + gap)) / 2 // Смещение по оси X
  // Смещение для центрирования по оси Z
  const offsetZ = (rows * (cubeSize + gap)) / 2 // Половина высоты всех рядов

  for (let x = 0; x < columns; x++) {
    for (let z = 0; z < rows; z++) {
      const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
      const material = new THREE.MeshStandardMaterial({
        // color: Math.random() * 0xffffff,
        color: 0x333333,
        roughness: 0.5,
        metalness: 0.8
      })

      const cube = new THREE.Mesh(geometry, material)

      // Вычисляем позиции кубов с учетом отступов
      cube.position.x = x * (cubeSize + gap) - offsetX // Плотность по оси X
      cube.position.y = 0 // Положение по оси Y
      cube.position.z = z * (cubeSize + gap) - offsetZ // Плотность по оси Z

      // Включаем тени
      cube.castShadow = true
      cube.receiveShadow = true

      cubes.push(cube) // Добавляем куб в массив
      // Добавляем куб в сцену
      scene.add(cube)
    }
  }

  //   Шар для курсора
  const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32)
  const ballMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    metalness: 0.8,
    roughness: 0.2
  })

  const ball = new THREE.Mesh(ballGeometry, ballMaterial)
  ball.position.set(0, 1.0, 0)
  ball.castShadow = true // Шар будет кастить тени
  scene.add(ball)

  let ballTargetPosition = new THREE.Vector3(0, 1.0, 0) // Задаем целевую позицию шара

  // Шар для прокрутки
  const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32)
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    metalness: 0.8,
    roughness: 0.5
  })

  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(-2, 1.0, -2)
  sphere.castShadow = true // Шар будет кастить тени
  scene.add(sphere)

  let sphereTargetPosition = new THREE.Vector3(-2, 1.0, -2) // Задаем целевую позицию шара

  // Шаг 3: Обработка прокрутки
  window.addEventListener('wheel', event => {
    sphereTargetPosition.x += event.deltaY * 0.01 // Изменение по X
    sphereTargetPosition.z += event.deltaY * 0.01 // Изменение по Z
  })

  // Устанавливаем камеру
  camera.position.set(0, 11, 0)
  camera.lookAt(0, 0, 0) // Смотрим на центр сцены

  // Шаг 4: Обработка движения мыши
  document.addEventListener('mousemove', event => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1

    // Обновляем позицию света в зависимости от позиции курсора
    light.position.x = mouseX * 10
    light.position.z = -mouseY * 10
    light.position.y = 10
    // light.position.y = -1

    // // Также обновляем положение камеры
    // camera.position.x = mouseX * 2
    // camera.position.z = mouseY * 2

    // Также обновляем положение камеры
    camera.position.x = mouseX / 2
    //camera.position.z = mouseY / 2
    camera.position.z = mouseY / 5

    ballTargetPosition.x = mouseX * 5
    ballTargetPosition.z = -mouseY * 1.5
  })

  // Добавляем шум через шейдер
  let u_time = 0 // Переменная времени
  const noiseGeometry = new THREE.PlaneGeometry(100, 100)

  // Вершинный шейдер
  const noiseVertexShader = `
      varying vec2 v_uv;

      void main() {
        v_uv = uv; // Передаем UV-координаты во фрагментный шейдер
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

  // Фрагментный шейдер
  const noiseFragmentShader = `
      uniform float u_time;
      varying vec2 v_uv;

      void main() {
        float noise = fract(sin(dot(v_uv * 10.0 + u_time * 0.5, vec2(12.9898, 78.233))) * 43758.5453);
        gl_FragColor = vec4(vec3(noise), 0.075); // Уровень прозрачности шума
      }
    `

  const noiseMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      u_time: { value: u_time } // Передаем u_time
    },
    vertexShader: noiseVertexShader,
    fragmentShader: noiseFragmentShader
  })

  const noiseMesh = new THREE.Mesh(noiseGeometry, noiseMaterial)
  noiseMesh.rotation.x = -Math.PI / 2 // Поворачиваем плоскость шума
  noiseMesh.position.z = 0 // Позиционируем перед камерой
  noiseMesh.position.y = 3 // Позиционируем перед камерой
  scene.add(noiseMesh)

  // Устанавливаем позицию камеры ближе к кубам
  camera.position.y = 4 // Уменьшаем y, чтобы смотреть вниз на кубы
  //   camera.position.z = 4 // Приближаем камеру

  // Шаг 5: Анимация
  function animate() {
    requestAnimationFrame(animate)
    sphere.position.lerp(sphereTargetPosition, 0.003)
    ball.position.lerp(ballTargetPosition, 0.01)

    // Обновляем значение времени
    u_time += 0.1 // Увеличиваем время для анимации

    // Обновляем значение uniform в материале
    noiseMaterial.uniforms.u_time.value = u_time

    // Перемещение кубов вперед вдоль оси Z
    cubes.forEach(cube => {
      cube.position.z -= 0.0125 // Скорость перемещения вперед

      // Если куб выходит за заднюю границу (например, Z < -10), перемещаем его обратно с новым цветом
      if (cube.position.z < -5) {
        cube.position.z += totalCubes * (cubeSize + gap) // ставим его в конец
        // cube.material.color.set(Math.random() * 0xffffff) // Меняем цвет
      }
    })

    renderer.render(scene, camera)
  }

  animate()

  // Обработка изменения размера окна
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}

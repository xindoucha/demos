// Texture Demo
class TextureDemo extends WebglProgram {
  constructor(dimen, canvasSize) {
    super(dimen, canvasSize);
    document.body.appendChild(this.canvas);
  }
  async init(matrixA) {
    await super.init("texture_v_shader.c", "texture_f_shader.c");
    this.initTexture(0, "samplerA", matrixA);
  }
}

async function ShowTextureDemo() {
  const colorMap = [
    // 红、绿、蓝
    [0xff0000ff, 0x00ff00ff, 0x0000ffff],
    [0xffff00ff, 0xff00ffff, 0x00ffffff],
    [0x000000ff, 0xffffffff, 0xf0f0f0ff],
  ];

  const randomMatrix = createMatrix(colorMap.length, (x, y) => colorMap[x][y]);
  const randomMatrixU8 = new Uint8Array(randomMatrix.buffer);
  const demoShowTexture = new TextureDemo(colorMap.length, 200);
  await demoShowTexture.init(randomMatrixU8);
  demoShowTexture.render();
  return demoShowTexture.read();
}

// ShowTextureDemo()

// matrix demo
class MatrixTexture extends WebglProgram {
  async init(matrixA, matrixB) {
    await super.init("matrix_v_shader.c", "matrix_f_shader.c");
    this.initTexture(0, "samplerA", matrixA);
    this.initTexture(1, "samplerB", matrixB);
  }
}

async function timeCost(dimensions) {
  console.log("dimensions", dimensions);
  const randomMatrix = createMatrix(dimensions, () =>
    Math.floor(Math.random() * 1000)
  );
  const randomMatrixU8 = new Uint8Array(randomMatrix.buffer);
  console.time("WebGL 计算");
  const showMatrixTexture = new MatrixTexture(dimensions);
  await showMatrixTexture.init(randomMatrixU8, randomMatrixU8);
  showMatrixTexture.render();
  const webgl_result = showMatrixTexture.read();
  console.log("WebGL 计算结果:", webgl_result);
  console.timeEnd("WebGL 计算");

  // 计算矩阵的平方
  console.time("CPU 计算");
  const cpu_result = matrixMultiply(dimensions, randomMatrix, randomMatrix);
  console.log("CPU 计算结果:", cpu_result);
  console.timeEnd("CPU 计算");
}

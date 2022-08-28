// demo1
// set output by distance of (0, 0)
class Demo1 extends WebglProgram {
  constructor(dimen, canvasSize) {
    super(dimen, canvasSize);
    document.body.appendChild(this.canvas);
  }
  async init() {
    await super.init("demo1_v_shader.c", "demo1_f_shader.c");
  }
}

async function showDemo1() {
  const demo1 = (window.demo1 = new Demo1(3, 200));
  await demo1.init();
  demo1.render();
  return demo1.read();
}

// showDemo1();

// demo2
class TextureDemo extends WebglProgram {
  constructor(dimen, canvasSize) {
    super(dimen, canvasSize);
    document.body.appendChild(this.canvas);
  }
  async init(matrixA) {
    await super.init("demo2_v_shader.c", "demo2_f_shader.c");
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
  // changeBufferToGRBA(randomMatrixU8);
  await demoShowTexture.init(randomMatrixU8);
  demoShowTexture.render();
  return demoShowTexture.read();
}

ShowTextureDemo().then((data) => {
  console.log(data);
});

// matrix
class MatrixTexture extends WebglProgram {
  async init(matrixA, matrixB) {
    await super.init("matrix_v_shader.c", "matrix_f_shader.c");
    this.initTexture(0, "samplerA", matrixA);
    this.initTexture(1, "samplerB", matrixB);
  }
}

async function ShowMatrixCompute(dimensions) {
  console.log("dimensions", dimensions);
  let result = null;
  const randomMatrix = createMatrix(dimensions, () =>
    Math.floor(Math.random() * 1000)
  );
  const randomMatrixU8 = new Uint8Array(randomMatrix.buffer);
  console.time("MatrixCompute");
  const showMatrixTexture = (window.showMatrixTexture = new MatrixTexture(
    dimensions
  ));
  await showMatrixTexture.init(randomMatrixU8, randomMatrixU8);
  showMatrixTexture.render();
  result = showMatrixTexture.read();
  console.timeEnd("MatrixCompute");
}
ShowMatrixCompute(300)

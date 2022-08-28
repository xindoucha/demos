/**
* 创建矩阵，以一维数组代替
* @param {矩阵维数} dims 
* @param {矩阵中每一项生成的规则} fn 
* @returns 
*/
function createMatrix(dims, fn) {
  let matrix = new Uint32Array(dims * dims);
  for (let i = 0; i < dims; i++) {
    for (let j = 0; j < dims; j++) {
      matrix[i * dims + j] = fn(i, j);
    }
  }
  return matrix;
}


// 矩阵相乘
const matrixMultiply = function(dimensions,ma, mb) {
  return createMatrix(dimensions, function(x, y) {
    let sum = 0;
    for (let i = 0; i < dimensions; i++) {
      sum += ma[x * dimensions + i] * mb[i * dimensions + y];
    }
    return sum;
  });
}


function matrixMultiplyCPU(dimensions) {
  // 随机生成 n 维的矩阵
  const randomMatrix = createMatrix(dimensions, () => Math.floor(Math.random() * 1000));
  // 计算矩阵的平方
  console.time("matrixMultiplyCPU");
  result = matrixMultiply(dimensions,randomMatrix, randomMatrix);
  console.timeEnd("matrixMultiplyCPU");
}


// matrixMultiplyCPU(800)  // matrixMultiplyCPU: 62.09ms


function changeBufferToGRBA(buffer) {
  for (let i = 0; i < buffer.length; i=i+4) {
    const element = buffer.slice(i,i+4);
    createBlock(element)
  }
}

function createBlock(value) {
  let ele = document.createElement('div');
  let box = document.getElementsByClassName('box')[0]
  ele.className = 'element'
  ele.style.backgroundColor = `rgba(${value})`
  ele.innerText = `[${value}]`
  box.appendChild(ele);
}
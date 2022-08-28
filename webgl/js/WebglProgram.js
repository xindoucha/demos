class WebglProgram {
  constructor(dimen, canvasSize) {
    this.dimen = dimen;
    this.canvas = document.createElement("canvas");
    this.canvas.width = canvasSize || dimen;
    this.canvas.height = canvasSize || dimen;
    this.gl = this.canvas.getContext("webgl2");
    this.program = this.gl.createProgram();
  }

  /**
   * 程序初始化
   * @param {*} vertexShader
   * @param {*} fragmentShader
   */
  async init(vertexShader, fragmentShader) {
    const vshaderCode = await this.loadRes(vertexShader);
    let fshaderCode = await this.loadRes(fragmentShader);
    fshaderCode = fshaderCode.replace(/CANVAS_SIZE/g, this.dimen);

    this.initShader(vshaderCode, this.gl.VERTEX_SHADER);
    this.initShader(fshaderCode, this.gl.FRAGMENT_SHADER);

    this.gl.linkProgram(this.program);
    this.gl.useProgram(this.program);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    let vecPosXArr = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vecPosXArr, this.gl.STATIC_DRAW);

    let posAtrLoc = this.getAttribLoc("g_pos");
    this.gl.enableVertexAttribArray(posAtrLoc);
    this.gl.vertexAttribPointer(posAtrLoc, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.clearColor(0.0, 0.0, 0.0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  /**
   * 创建着色器
   * @param {着色器代码} code
   * @param {着色器类型} type
   */
  initShader(code, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, code);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
      throw new Error("compile: " + this.gl.getShaderInfoLog(shader));
    this.gl.attachShader(this.program, shader);
  }

  /**
   * 创建纹理
   * @param {纹理索引} index
   * @param {*} tSampler
   * @param {纹理数据} pixels
   */
  initTexture(index, tSampler, pixels) {
    const texture = this.gl.createTexture();
    this.gl.activeTexture(this.gl[`TEXTURE${index}`]);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    );

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.dimen,
      this.dimen,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      pixels,
      0
    );
    this.gl.uniform1i(this.getUniformLoc(tSampler), index);
  }

  /**
   * 给 Uniform 变量赋值
   * @param {*} tUniform
   * @param {*} value
   */
  initUniform(tUniform, value) {
    const uniLoc = this.getUniformLoc(tUniform);
    this.gl.uniform1fv(uniLoc, value);
  }

  /**
   * 获取属性变量
   * @param {*} name
   * @returns
   */
  getAttribLoc(name) {
    let loc = this.gl.getAttribLocation(this.program, name);
    if (loc == -1) throw `getAttribLoc  ${name} error`;
    return loc;
  }

  /**
   * 获取 Uniform 变量
   * @param {*} name
   * @returns
   */
  getUniformLoc(name) {
    let loc = this.gl.getUniformLocation(this.program, name);
    if (loc == null) throw `getUniformLoc ${name} err`;
    return loc;
  }

  /**
   * 获取着色器文本
   * @param {*} file
   * @returns
   */
  async loadRes(file) {
    const resp = await fetch(file);
    return resp.text();
  }

  /**
   * 图形绘制
   */
  render() {
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  /**
   * canvas 读取像素数据
   * @returns
   */
  read() {
    let picBuf = new ArrayBuffer(this.canvas.width * this.canvas.height * 4);
    let picU8 = new Uint8Array(picBuf);
    let picU32 = new Uint32Array(picBuf);
    this.gl.readPixels(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      picU8
    );
    return picU32;
  }
}
export default class BaseCanvas {
  #canvas;
  #ctx;
  #pixelRatio;
  #stageWidth;
  #stageHeight;

  constructor() {
    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    this.#pixelRatio = 1; //window.devicePixelRatio > 1 ? 2 : 1;
  }

  destroy() {
    this.clearCanvas();
    document.body.removeChild(this.#canvas);
  }

  resize() {
    this.#stageWidth = document.body.clientWidth;
    this.#stageHeight = document.body.clientHeight;

    this.#canvas.width = this.#stageWidth * this.#pixelRatio;
    this.#canvas.height = this.#stageHeight * this.#pixelRatio;
    this.#ctx.scale(this.#pixelRatio, this.#pixelRatio);
  }

  clearCanvas() {
    this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
  }

  saveCanvas() {
    this.#ctx.save();
  }

  restoreCanvas() {
    this.#ctx.restore();
  }

  addEventToCanvas(type, listener) {
    this.#canvas.addEventListener(type, listener);
  }

  removeEventToCanvas(type, listener) {
    this.#canvas.removeEventListener(type, listener);
  }

  get ctx() {
    return this.#ctx;
  }

  get stageWidth() {
    return this.#stageWidth;
  }

  get stageHeight() {
    return this.#stageHeight;
  }
}

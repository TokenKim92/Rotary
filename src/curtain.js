export default class Curtain {
  static FPS = 30;
  static FPS_TIME = 1000 / Curtain.FPS;

  #canvas;
  #ctx;
  #stageWidth;
  #stageHeight;
  #filledWidth;
  #fillSpeed;

  constructor() {
    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    this.#ctx.fillStyle = 'black';
  }

  resize = (stageWidth, stageHeight) => {
    this.#stageWidth = stageWidth;
    this.#stageHeight = stageHeight;

    this.#canvas.width = this.#stageWidth;
    this.#canvas.height = this.#stageHeight;

    this.#filledWidth = 0;
    this.#fillSpeed = this.#stageWidth / Curtain.FPS_TIME;
  };

  on() {
    this.#filledWidth += this.#fillSpeed;
    this.#ctx.fillRect(0, 0, this.#filledWidth, this.#stageHeight);

    return this.#filledWidth >= this.#stageWidth ? true : false;
  }

  off() {
    this.#filledWidth -= this.#fillSpeed;
    this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
    this.#ctx.fillRect(0, 0, this.#filledWidth, this.#stageHeight);

    return this.#filledWidth <= 0 ? true : false;
  }
}

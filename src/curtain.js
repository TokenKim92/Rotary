import BaseCanvas from '../lib/baseCanvas.js';

export default class Curtain extends BaseCanvas {
  static FPS = 30;
  static FPS_TIME = 1000 / Curtain.FPS;

  #filledWidth;
  #fillSpeed;

  constructor() {
    super(true);
  }

  resize() {
    super.resize();

    this.#filledWidth = 0;
    this.#fillSpeed = this.stageWidth / Curtain.FPS_TIME;
  }

  on() {
    this.ctx.save();
    this.ctx.fillStyle = 'black';
    this.#filledWidth += this.#fillSpeed;
    this.ctx.fillRect(0, 0, this.#filledWidth, this.stageHeight);
    this.ctx.restore();

    return this.#filledWidth >= this.stageWidth ? true : false;
  }

  off() {
    this.#filledWidth -= this.#fillSpeed;
    this.clearCanvas();
    this.ctx.fillRect(0, 0, this.#filledWidth, this.stageHeight);

    return this.#filledWidth <= 0 ? true : false;
  }
}

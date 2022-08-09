import { DONE, isDone } from './utils.js';
import PortfolioCover from './portfolioCover.js';
import BaseCanvas from '../lib/baseCanvas.js';

export default class DetailCover extends BaseCanvas {
  static ANIMATION_DURATION = 20; // ms
  static DISAPPEAR_VELOCITY = 1.1;

  #cover;
  #rotationPos = {
    x: 0,
    y: 0,
  };
  #targetRatio;
  #currentRatio = 1;
  #scalingSpeed;
  #targetPosX = 0;
  #disappearSpeed = 1;

  constructor() {
    super();
  }

  resize() {
    super.resize();
  }

  init(cover, rotationPos) {
    this.#cover = cover;
    this.#rotationPos = { ...rotationPos };
    this.#targetPosX = this.#rotationPos.x;
  }

  animate() {
    isDone(this.#scaleStatus) || this.#onScale();
    isDone(this.#disappearStatus) || this.#onDisappear();

    return {
      scaleStatus: this.#scaleStatus,
      disappearStatus: this.#disappearStatus,
    };
  }

  #onScale() {
    this.#drawCover();

    this.#currentRatio += this.#scalingSpeed;
  }

  #onDisappear() {
    this.#drawCover();

    this.#disappearSpeed *= DetailCover.DISAPPEAR_VELOCITY;
    this.#rotationPos.x -= this.#disappearSpeed;
  }

  #drawCover(x, y) {
    this.saveCanvas();

    this.clearCanvas();
    this.ctx.translate(this.#rotationPos.x, this.#rotationPos.y);
    this.ctx.scale(this.#currentRatio, this.#currentRatio);
    this.#cover.animate(this.ctx);

    this.restoreCanvas();
  }

  get #scaleStatus() {
    const status = !(
      (this.#scalingSpeed >= 0 && this.#currentRatio <= this.#targetRatio) ||
      (this.#scalingSpeed < 0 && this.#currentRatio > this.#targetRatio)
    );

    return status ? DONE : !DONE;
  }

  get #disappearStatus() {
    const status = this.#rotationPos.x <= this.#targetPosX;
    return status ? DONE : !DONE;
  }

  setTargetRatio(startRatio, targetRatio) {
    this.#currentRatio = startRatio;
    this.#targetRatio = targetRatio;
    this.#scalingSpeed =
      (this.#targetRatio - this.#currentRatio) / DetailCover.ANIMATION_DURATION;
  }

  disappearToLeft() {
    this.#targetPosX = PortfolioCover.COVER_RECT.w * this.#targetRatio * -1;
    this.#disappearSpeed = 1;
  }
}

import { DONE, isDone, SMALL_MODE_RATIO } from './utils.js';
import PortfolioCover from './portfolioCover.js';
import BaseCanvas from '../lib/baseCanvas.js';

export default class DetailCover extends BaseCanvas {
  static ANIMATION_DURATION = 20; // ms
  static DISAPPEAR_VELOCITY = 1.1;

  #cover;
  #targetRatio;
  #currentRatio = 1;
  #scalingSpeed;
  #targetPosX = 0;
  #disappearSpeed = 1;
  #pos = {
    x: 0,
    y: 0,
  };
  #prevDisappearStatus = DONE;
  #onDisappearedHandler;

  constructor() {
    super(true);
  }

  init(cover) {
    this.#cover = cover;
    this.#targetPosX = this.stageWidth / 2;
    this.#pos = {
      x: this.stageWidth / 2,
      y: this.stageHeight / 2,
    };
  }

  animate() {
    isDone(this.#scaleStatus) || this.#onScale();
    isDone(this.#disappearStatus) || this.#onDisappear();

    if (isDone(this.#disappearStatus) && !isDone(this.#prevDisappearStatus)) {
      this.#onDisappearedHandler && this.#onDisappearedHandler();
    }

    this.#prevDisappearStatus = this.#disappearStatus;
  }

  #onScale() {
    this.#drawCover();

    this.#currentRatio += this.#scalingSpeed;
  }

  #onDisappear() {
    this.#drawCover();

    this.#disappearSpeed *= DetailCover.DISAPPEAR_VELOCITY;
    this.#pos.x -= this.#disappearSpeed;
  }

  set onDisappearedHandler(handler) {
    this.#onDisappearedHandler = handler;
  }

  #drawCover() {
    this.ctx.save();

    this.clearCanvas();
    this.ctx.translate(this.#pos.x, this.#pos.y);
    this.isMatchMedia && this.ctx.scale(SMALL_MODE_RATIO, SMALL_MODE_RATIO);
    this.ctx.scale(this.#currentRatio, this.#currentRatio);
    this.#cover && this.#cover.animate(this.ctx);

    this.ctx.restore();
  }

  get #scaleStatus() {
    const status =
      (this.#scalingSpeed >= 0 && this.#currentRatio >= this.#targetRatio) ||
      (this.#scalingSpeed < 0 && this.#currentRatio <= this.#targetRatio);

    return status ? DONE : !DONE;
  }

  get #disappearStatus() {
    const status = this.#pos.x <= this.#targetPosX;
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

  reset() {
    this.#currentRatio = this.#targetRatio;
    this.clearCanvas();
  }
}

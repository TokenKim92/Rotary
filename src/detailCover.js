import PortfolioCover from './portfolioCover.js';

export default class DetailCover {
  static ANIMATION_DURATION = 20; // ms
  static DISAPPEAR_VELOCITY = 1.1;

  #canvas;
  #ctx;
  #pixelRatio;
  #stageWidth;
  #stageHeight;
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
    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    this.#pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
  }

  resize = (stageWidth, stageHeight) => {
    this.#stageWidth = stageWidth;
    this.#stageHeight = stageHeight;

    this.#canvas.width = this.#stageWidth * this.#pixelRatio;
    this.#canvas.height = this.#stageHeight * this.#pixelRatio;
  };

  clear() {
    this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
  }

  init(cover, rotationPos) {
    this.#cover = cover;
    this.#rotationPos = { ...rotationPos };
    this.#targetPosX = this.#rotationPos.x;
  }

  animate() {
    this.#toBeScaled() && this.#onScale();
    this.#toBeDisappear() && this.#onDisappear();
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
    this.#ctx.save();

    this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
    this.#ctx.translate(this.#rotationPos.x, this.#rotationPos.y);
    this.#ctx.scale(this.#currentRatio, this.#currentRatio);
    this.#cover.animate(this.#ctx);

    this.#ctx.restore();
  }

  #toBeScaled() {
    return (
      (this.#scalingSpeed >= 0 && this.#currentRatio <= this.#targetRatio) ||
      (this.#scalingSpeed < 0 && this.#currentRatio > this.#targetRatio)
    );
  }

  #toBeDisappear() {
    return this.#rotationPos.x > this.#targetPosX;
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

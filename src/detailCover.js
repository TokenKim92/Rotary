export default class DetailCover {
  static ANIMATION_DURATION = 20; // ms

  #canvas;
  #ctx;
  #pixelRatio;
  #stageWidth;
  #stageHeight;
  #cover;
  #rotationPos;
  #targetRatio;
  #currentRatio = 1;
  #speed;

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

  init(cover, rotationPos, startRatio, targetRatio) {
    this.#cover = cover;
    this.#rotationPos = rotationPos;
    this.#currentRatio = startRatio;
    this.setTargetRatio(targetRatio);
  }

  animate() {
    if (this.#toBeAnimated()) {
      this.#ctx.save();

      this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
      this.#ctx.translate(this.#rotationPos.x, this.#rotationPos.y);
      this.#ctx.scale(this.#currentRatio, this.#currentRatio);
      this.#cover.animate(this.#ctx);

      this.#ctx.restore();

      this.#currentRatio += this.#speed;
    }
  }

  #toBeAnimated() {
    if (
      (this.#speed >= 0 && this.#currentRatio <= this.#targetRatio) ||
      (this.#speed < 0 && this.#currentRatio > this.#targetRatio)
    ) {
      return true;
    }

    return false;
  }

  setTargetRatio(ratio) {
    this.#targetRatio = ratio;
    this.#speed =
      (this.#targetRatio - this.#currentRatio) / DetailCover.ANIMATION_DURATION;
  }
}

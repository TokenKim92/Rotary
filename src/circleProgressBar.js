import { PI, PI2 } from './utils.js';

export default class CircleProgressBar {
  static START_DEGREE = 90;
  static START_RADIAN = (-CircleProgressBar.START_DEGREE * PI) / 180;
  static FPS = 60;
  static FPS_TIME = 1000 / CircleProgressBar.FPS;
  static INIT_PROGRESS = 0;
  static TOTAL_PROGRESS_LENGTH = 360;
  static INIT_LINE_WIDTH = 5;
  static ALPHA_INCREASING_SPEED = 0.03;

  #canvas;
  #ctx;
  #centerPos;
  #radius;
  #stageLength;
  #lineWidth;
  #colorBackground;
  #colorProgressBar;
  #progressSpeed;
  #progress = CircleProgressBar.TOTAL_PROGRESS_LENGTH + 1;
  #prevTime;
  #progressFinished = true;
  #isPreparing = false;
  #alpha = 0;

  constructor(length, color, targetSecond) {
    this.#initCanvas(length);

    this.#centerPos = {
      x: length / 2,
      y: length / 2,
    };
    this.#lineWidth = CircleProgressBar.INIT_LINE_WIDTH;
    this.#radius = length / 2 - this.#lineWidth / 2 - 2;
    this.#stageLength = length;
    this.#colorBackground = this.#colorToRGB(color.background);
    this.#colorProgressBar = color.progressBar;
    this.#progressSpeed =
      (CircleProgressBar.TOTAL_PROGRESS_LENGTH * CircleProgressBar.FPS_TIME) /
      (targetSecond * 1000);
  }

  #initCanvas(length) {
    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    this.#canvas.width = length;
    this.#canvas.height = length;
  }

  #colorToRGB(color) {
    const colorName = color.toLowerCase();

    if (colorName.includes('rgb')) {
      const openBracketIndex = colorName.indexOf('(');
      const closeBracketIndex = colorName.indexOf(')');

      const colorList = colorName
        .substring(openBracketIndex + 1, closeBracketIndex)
        .split(', ');

      return {
        r: colorList[0],
        g: colorList[1],
        b: colorList[2],
      };
    }
  }

  animate(curTime) {
    this.#isPreparing && this.#onPrepare();

    if (!this.#prevTime) {
      this.#prevTime = curTime;
      return this.#progressFinished;
    }

    if (CircleProgressBar.FPS_TIME < curTime - this.#prevTime) {
      this.#onFPSTime();
    }
    return this.#progressFinished;
  }

  clear() {
    this.#ctx.clearRect(0, 0, this.#stageLength, this.#stageLength);
  }

  #onFPSTime() {
    if (this.#progress > CircleProgressBar.TOTAL_PROGRESS_LENGTH) {
      this.#progressFinished || (this.#progressFinished = true);
      return;
    }

    this.clear();
    this.#drawBackground();
    this.#drawProgressBar();

    this.#progressFinished && (this.#progressFinished = false);
  }

  #onPrepare() {
    this.#alpha += CircleProgressBar.ALPHA_INCREASING_SPEED;
    this.clear();
    this.#drawBackground();

    if (this.#alpha >= 1) {
      this.#isPreparing = false;
      this.#progress = CircleProgressBar.INIT_PROGRESS;
    }
  }

  #drawProgressBar() {
    this.#ctx.save();

    this.#ctx.strokeStyle = this.#colorProgressBar;
    this.#ctx.lineWidth = this.#lineWidth;
    const radian =
      ((this.#progress - CircleProgressBar.START_DEGREE) * PI) / 180;

    this.#ctx.beginPath();
    this.#ctx.arc(
      this.#centerPos.x,
      this.#centerPos.y,
      this.#radius,
      CircleProgressBar.START_RADIAN,
      radian
    );
    this.#ctx.stroke();

    this.#ctx.restore();
    this.#progress += this.#progressSpeed;
  }

  #drawBackground() {
    this.#ctx.save();

    this.#ctx.strokeStyle = `rgba(${this.#colorBackground.r}, ${this.#colorBackground.g}, ${this.#colorBackground.b}, ${this.#alpha})`; // prettier-ignore
    this.#ctx.lineWidth = this.#lineWidth - 1;

    this.#ctx.beginPath();
    this.#ctx.arc(this.#centerPos.x, this.#centerPos.y, this.#radius, 0, PI2);
    this.#ctx.stroke();

    this.#ctx.restore();
  }

  start() {
    this.#isPreparing = true;
    this.#alpha = 0;
  }

  stop() {
    this.#progress = CircleProgressBar.TOTAL_PROGRESS_LENGTH + 1;
  }

  reset() {
    this.#drawBackground();
    this.#progress = CircleProgressBar.TOTAL_PROGRESS_LENGTH + 1;
  }

  set lineWidth(lineWidth) {
    this.#lineWidth = lineWidth;
    this.#radius = this.#stageLength / 2 - this.#lineWidth / 2 - 2;
  }

  setPosition(x, y) {
    this.#canvas.style.left = `${x}px`;
    this.#canvas.style.top = `${y}px`;
  }
}

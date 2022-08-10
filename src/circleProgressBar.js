import { PI, PI2, DONE, colorToRGB } from './utils.js';
import BaseCanvas from '../lib/baseCanvas.js';

export default class CircleProgressBar extends BaseCanvas {
  static START_DEGREE = 90;
  static START_RADIAN = (-CircleProgressBar.START_DEGREE * PI) / 180;
  static FPS = 60;
  static FPS_TIME = 1000 / CircleProgressBar.FPS;
  static INIT_PROGRESS = 0;
  static TOTAL_PROGRESS_LENGTH = 360;
  static INIT_LINE_WIDTH = 5;
  static ALPHA_INCREASING_SPEED = 0.03;

  #centerPos;
  #radius;
  #lineWidth;
  #colorBackground;
  #colorProgressBar;
  #progressSpeed;
  #progress = CircleProgressBar.TOTAL_PROGRESS_LENGTH + 1;
  #prevTime;
  #progressStatus = DONE;
  #isPreparing = false;
  #alpha = 0;

  constructor(length, color, targetSecond) {
    super();
    super.resize(length, length);

    this.#centerPos = {
      x: length / 2,
      y: length / 2,
    };
    this.#lineWidth = CircleProgressBar.INIT_LINE_WIDTH;
    this.#radius = length / 2 - this.#lineWidth / 2 - 2;
    this.#colorBackground = colorToRGB(color.background);
    this.#colorProgressBar = color.progressBar;
    this.#progressSpeed =
      (CircleProgressBar.TOTAL_PROGRESS_LENGTH * CircleProgressBar.FPS_TIME) /
      (targetSecond * 1000);
  }

  animate(curTime) {
    this.#isPreparing && this.#onPrepare();

    if (!this.#prevTime) {
      this.#prevTime = curTime;
      return this.#progressStatus;
    }

    const isOnFPSTime = CircleProgressBar.FPS_TIME < curTime - this.#prevTime;
    if (isOnFPSTime) {
      this.#drawProgress();
      this.#prevTime = curTime;
    }

    return this.#progressStatus;
  }

  #drawProgress() {
    if (this.#progress > CircleProgressBar.TOTAL_PROGRESS_LENGTH) {
      this.#progressStatus || (this.#progressStatus = DONE);
      return;
    }

    this.clearCanvas();
    this.#drawBackground();
    this.#drawProgressBar();

    this.#progressStatus && (this.#progressStatus = !DONE);
  }

  #onPrepare() {
    this.#alpha += CircleProgressBar.ALPHA_INCREASING_SPEED;
    this.clearCanvas();
    this.#drawBackground();

    if (this.#alpha >= 1) {
      this.#isPreparing = false;
      this.#progress = CircleProgressBar.INIT_PROGRESS;
    }
  }

  #drawProgressBar() {
    const radian = ((this.#progress - CircleProgressBar.START_DEGREE) * PI) / 180; // prettier-ignore
    this.#drawCircle(this.#colorProgressBar, this.#lineWidth, CircleProgressBar.START_RADIAN, radian); // prettier-ignore

    this.#progress += this.#progressSpeed;
  }

  #drawBackground() {
    const backgroundColor = `rgba(
      ${this.#colorBackground.r}, 
      ${this.#colorBackground.g}, 
      ${this.#colorBackground.b}, 
      ${this.#alpha})`;

    this.#drawCircle(backgroundColor, this.#lineWidth - 1, 0, PI2);
  }

  #drawCircle(color, lineWidth, startAngle, endAngle) {
    this.saveCanvas();

    this.setStrokeStyle(color);
    this.setLineWidth(lineWidth);

    this.beginPath();
    this.arc(this.#centerPos.x, this.#centerPos.y, this.#radius, startAngle, endAngle); // prettier-ignore
    this.stroke();

    this.restoreCanvas();
  }

  start() {
    this.#isPreparing = true;
    this.#alpha = 0;
  }

  stop() {
    this.clearCanvas();

    this.#isPreparing = false;
    this.#alpha = 1;
    this.#progress = CircleProgressBar.TOTAL_PROGRESS_LENGTH + 1;
  }
}

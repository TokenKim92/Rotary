import { posInRect } from './utils.js';

export default class RotationProjectCover {
  static DEGREE_INTERVAL = 10;
  static FPS = 60;
  static FPS_TIME = 1000 / RotationProjectCover.FPS;
  static WHEEL_UP = -1;
  static WHEEL_DOWN = 1;
  static INIT_ROTATE_SPEED = 1;
  static MAX_ROTATE_SPEED_RATIO = 3;
  static CLICK_AREA_SIZE = 100;
  static CLICK_AREA_HALF_SIZE = RotationProjectCover.CLICK_AREA_SIZE / 2;

  #canvas;
  #ctx;
  #stageWidth;
  #stageHeight;
  #rotationAxisRadius;
  #rotationAxisPos;
  #projectCovers = [];
  #currentDegree = 0;
  #targetDegree = this.#currentDegree;
  #maxDegree;
  #rotateDirection = 0;
  #rotateSpeed = RotationProjectCover.INIT_ROTATE_SPEED;
  #prevTime = 0;
  #prevSelectedIndex;
  #coverRects = [];

  #filledBackgroundWidth = 0;
  #fillBackgroundSpeed;
  #fullscreenBtn;

  constructor(projectCovers) {
    this.#fullscreenBtn = document.querySelector('.fullscreen');
    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    window.addEventListener('resize', this.resize);
    window.addEventListener('wheel', this.setTargetPerWheel);
    window.addEventListener('click', this.onClickCoverItem);

    this.onWebFontLoad(projectCovers);
  }

  onWebFontLoad = (projectCovers) => {
    WebFont.load({
      google: {
        families: ['Abril Fatface'],
      },
      fontactive: () => {
        this.onInit(projectCovers);
      },
    });
  };

  onInit = (projectCovers) => {
    this.#projectCovers = projectCovers;

    const coverCount = this.#projectCovers.length;
    this.#prevSelectedIndex = Math.floor(coverCount / 2);
    this.#currentDegree = this.#prevSelectedIndex * RotationProjectCover.DEGREE_INTERVAL; // prettier-ignore
    this.#maxDegree = coverCount * RotationProjectCover.DEGREE_INTERVAL;

    this.resize();
  };

  resize = () => {
    this.#stageWidth = document.body.clientWidth;
    this.#stageHeight = document.body.clientHeight;

    this.#canvas.width = this.#stageWidth;
    this.#canvas.height = this.#stageHeight;

    this.#fillBackgroundSpeed =
      this.#stageHeight / RotationProjectCover.FPS_TIME;

    this.#rotationAxisRadius = this.#stageHeight;
    this.#rotationAxisPos = {
      x: this.#stageWidth / 2,
      y: (this.#stageHeight / 2) * 3,
    };

    this.drawCoverItems();

    window.requestAnimationFrame(this.animate);
  };

  onClickCoverItem = (clickEvent) => {
    const pos = { x: clickEvent.offsetX, y: clickEvent.offsetY };

    this.#coverRects.forEach((rect, index) => {
      if (posInRect(pos, rect)) {
        this.setTargetPerClick(index);
        return;
      }
    });
  };

  setTargetPerClick = (index) => {
    this.#rotateSpeed = RotationProjectCover.INIT_ROTATE_SPEED;
    this.#rotateDirection = this.#prevSelectedIndex > index
                              ? RotationProjectCover.WHEEL_UP
                              : RotationProjectCover.WHEEL_DOWN; // prettier-ignore
    this.#targetDegree = index * RotationProjectCover.DEGREE_INTERVAL;
    this.#prevSelectedIndex = index;
  };

  // TODO:: fix this one!
  setTargetPerWheel = (wheelEvent) => {
    const direction = wheelEvent.deltaY > 0 
                        ? RotationProjectCover.WHEEL_DOWN
                        : RotationProjectCover.WHEEL_UP; // prettier-ignore

    if (this.#rotateDirection == direction) {
      let temp =
        (this.#targetDegree +
          RotationProjectCover.DEGREE_INTERVAL * direction) %
        361;

      if (0 <= temp && temp < this.#maxDegree) {
        this.#targetDegree = temp;
      }

      if (
        this.#rotateSpeed <
        RotationProjectCover.INIT_ROTATE_SPEED *
          RotationProjectCover.MAX_ROTATE_SPEED_RATIO
      ) {
        this.#rotateSpeed *= 1.2;
      }

      return;
    }

    this.#rotateSpeed = RotationProjectCover.INIT_ROTATE_SPEED;
    this.#rotateDirection = direction;
    this.#targetDegree = Math.round(this.#currentDegree / 10 + direction) * 10;
  };

  drawCoverItems() {
    this.#coverRects = [];
    this.#currentDegree =
      (this.#currentDegree + this.#rotateSpeed * this.#rotateDirection) % 361;

    this.#projectCovers.forEach((cover, index) => {
      const degree =
        RotationProjectCover.DEGREE_INTERVAL * index - this.#currentDegree;
      const radian = (degree * Math.PI) / 180;

      const rotationPos = {
        x: this.#rotationAxisPos.x + this.#rotationAxisRadius * Math.sin(radian),
        y: this.#rotationAxisPos.y - this.#rotationAxisRadius * Math.cos(radian)  
      } // prettier-ignore

      this.drawCover(cover, rotationPos, radian);
      this.drawTitle(cover, rotationPos, radian);
      this.setNewClickAreas(rotationPos);
    });
  }

  setNewClickAreas(rotationPos) {
    this.#coverRects.push({
      x: rotationPos.x - RotationProjectCover.CLICK_AREA_HALF_SIZE,
      y: rotationPos.y - RotationProjectCover.CLICK_AREA_HALF_SIZE,
      w: RotationProjectCover.CLICK_AREA_SIZE,
      h: RotationProjectCover.CLICK_AREA_SIZE,
    });
  }

  drawCover(cover, rotationPos, radian = 0) {
    this.#ctx.save();

    this.#ctx.translate(rotationPos.x, rotationPos.y);
    this.#ctx.rotate(radian);
    cover.animate(this.#ctx);

    this.#ctx.restore();
  }

  drawTitle(cover, rotationPos, radian = 0) {
    this.#ctx.save();

    const textRadian = (270 * Math.PI) / 180;
    this.#ctx.translate(rotationPos.x, rotationPos.y);
    this.#ctx.rotate(radian + textRadian);

    // TODO:: use static variable!
    this.#ctx.font = '10 20px Arial';
    this.#ctx.textAlign = 'left';
    this.#ctx.fillStyle = '#BEBCBE';
    this.#ctx.fillText(cover.title, 200, 0);

    this.#ctx.fillStyle = '#D0CED0';
    this.#ctx.fillText(`${cover.createdDate.month}, 11`, 200, 20);

    this.#ctx.restore();
  }

  animate = (curTime) => {
    this.#checkFPSTime(curTime);

    window.requestAnimationFrame(this.animate);
  };

  #checkFPSTime(curTime) {
    if (!this.#prevTime) {
      this.#prevTime = curTime;
    }

    if (curTime - this.#prevTime > RotationProjectCover.FPS_TIME) {
      this.#prevTime = curTime;

      this.#onFPSTime();
    }
  }

  #onFPSTime() {
    if (this.#isRotating()) {
      this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
      this.drawCoverItems();
    }
  }

  #isRotating() {
    if (
      (this.#rotateDirection == RotationProjectCover.WHEEL_DOWN &&
        this.#currentDegree <= this.#targetDegree) ||
      (this.#rotateDirection == RotationProjectCover.WHEEL_UP &&
        this.#currentDegree >= this.#targetDegree)
    ) {
      return true;
    }

    return false;
  }
}

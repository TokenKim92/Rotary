import { posInRect } from './utils.js';

export default class RotationProjectCover {
  static DEGREE_INTERVAL = 10;
  static FPS = 30;
  static FPS_TIME = 1000 / RotationProjectCover.FPS;
  static TURN_LEFT = -1;
  static TURN_RIGHT = 1;
  static INIT_ROTATE_SPEED = 1;
  static CLICK_AREA_SIZE = 100;
  static CLICK_AREA_HALF_SIZE = RotationProjectCover.CLICK_AREA_SIZE / 2;

  #canvas;
  #ctx;
  #canvasForMainCover;
  #ctxForMainCover;
  #stageWidth;
  #stageHeight;
  #rotationAxisRadius;
  #rotationAxisPos;
  #projectCovers = [];
  #currentDegree = 0;
  #targetDegree = this.#currentDegree;
  #rotateDirection = 0;
  #rotateSpeed = RotationProjectCover.INIT_ROTATE_SPEED;
  #prevSelectedIndex;
  #coverRects = [];
  #prevRotateState = false;

  #filledBackgroundWidth = 0;
  #fillBackgroundSpeed;
  #fullscreenBtn;
  #returnBtn;
  #toBeFilled = false;

  constructor(projectCovers) {
    this.#fullscreenBtn = document.querySelector('.fullscreen');
    this.#returnBtn = document.querySelector('.return');

    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    this.#canvasForMainCover = document.createElement('canvas');
    this.#ctxForMainCover = this.#canvasForMainCover.getContext('2d');
    document.body.append(this.#canvasForMainCover);

    window.addEventListener('resize', this.resize);
    window.addEventListener('click', this.onClickCoverItem);
    this.#fullscreenBtn.addEventListener('click', () => (this.#toBeFilled = true)); // prettier-ignore
    this.#returnBtn.addEventListener('click', this.returnToMainStage);

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

    this.resize();
  };

  returnToMainStage = () => {
    this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
    this.drawCoverItems();
    this.#scaleSelectedCover({ x: 1.1, y: 1.1 });
    this.#returnBtn.style.display = 'none';
  };

  resize = () => {
    this.#stageWidth = document.body.clientWidth;
    this.#stageHeight = document.body.clientHeight;

    this.#canvas.width = this.#stageWidth;
    this.#canvas.height = this.#stageHeight;

    this.#canvasForMainCover.width = this.#stageWidth;
    this.#canvasForMainCover.height = this.#stageHeight;

    this.#fillBackgroundSpeed =
      this.#stageHeight / RotationProjectCover.FPS_TIME;

    this.#rotationAxisRadius = this.#stageHeight;
    this.#rotationAxisPos = {
      x: this.#stageWidth / 2,
      y: (this.#stageHeight / 2) * 3,
    };

    this.drawCoverItems();
    this.#scaleSelectedCover({ x: 1.1, y: 1.1 });

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
                              ? RotationProjectCover.TURN_LEFT
                              : RotationProjectCover.TURN_RIGHT; // prettier-ignore
    this.#targetDegree = index * RotationProjectCover.DEGREE_INTERVAL;
    this.#prevSelectedIndex = index;
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

  drawCover(cover, rotationPos, radian) {
    this.#ctx.save();

    this.#ctx.translate(rotationPos.x, rotationPos.y);
    this.#ctx.rotate(radian);
    cover.animate(this.#ctx);

    this.#ctx.restore();
  }

  drawTitle(cover, rotationPos, radian) {
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
    if (this.#isRotating()) {
      this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
      this.drawCoverItems();

      if (!this.#prevRotateState) {
        this.#ctxForMainCover.clearRect(0, 0, this.#stageWidth, this.#stageHeight); // prettier-ignore

        this.#prevRotateState = true;
      }
    } else {
      if (this.#prevRotateState) {
        this.#scaleSelectedCover({ x: 1.1, y: 1.1 });

        this.#prevRotateState = false;
      }
    }

    this.#toBeFilled && this.#fillBackground();

    window.requestAnimationFrame(this.animate);
  };

  #scaleSelectedCover(ratio) {
    const degree =
      RotationProjectCover.DEGREE_INTERVAL * this.#prevSelectedIndex -
      this.#currentDegree;
    const radian = (degree * Math.PI) / 180;

    const rotationPos = {
    x: this.#rotationAxisPos.x + this.#rotationAxisRadius * Math.sin(radian),
    y: this.#rotationAxisPos.y - this.#rotationAxisRadius * Math.cos(radian)  
  } // prettier-ignore

    this.#ctxForMainCover.save();

    this.#ctxForMainCover.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
    this.#ctxForMainCover.translate(rotationPos.x, rotationPos.y);
    this.#ctxForMainCover.scale(ratio.x, ratio.y);
    this.#projectCovers[this.#prevSelectedIndex].animate(this.#ctxForMainCover);

    this.#ctxForMainCover.restore();
  }

  #isRotating() {
    if (
      (this.#rotateDirection == RotationProjectCover.TURN_RIGHT &&
        this.#currentDegree <= this.#targetDegree) ||
      (this.#rotateDirection == RotationProjectCover.TURN_LEFT &&
        this.#currentDegree >= this.#targetDegree)
    ) {
      return true;
    }

    return false;
  }

  #fillBackground() {
    this.#filledBackgroundWidth += this.#fillBackgroundSpeed;

    this.#ctx.fillStyle = 'black';
    this.#ctx.fillRect(0, 0, this.#filledBackgroundWidth, this.#stageHeight);

    if (this.#filledBackgroundWidth >= this.#stageWidth) {
      this.#scaleSelectedCover({ x: 2, y: 2 });
      this.#returnBtn.style.display = 'block';
      this.#filledBackgroundWidth = 0;
      this.#toBeFilled = false;
    }
  }
}

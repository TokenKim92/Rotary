import { posInRect } from './utils.js';

export default class RotaryCover {
  static DEGREE_INTERVAL = 10;
  static FPS = 30;
  static FPS_TIME = 1000 / RotaryCover.FPS;
  static TURN_LEFT = -1;
  static TURN_RIGHT = 1;
  static INIT_ROTARY_SPEED = 1;
  static CLICK_FIELD_SIZE = 100;
  static CLICK_FIELD_HALF_SIZE = RotaryCover.CLICK_FIELD_SIZE / 2;

  #canvas;
  #ctx;
  #canvasForMainCover;
  #ctxForMainCover;
  #stageWidth;
  #stageHeight;
  #rotationRadius;
  #rotationAxis;
  #covers = [];
  #currentDegree = 0;
  #targetDegree = this.#currentDegree;
  #rotaryDirection = 0;
  #rotarySpeed = RotaryCover.INIT_ROTARY_SPEED;
  #prevSelectedIndex;
  #clickFields = [];
  #prevRotaryState = false;
  #body;

  #filledBackgroundWidth = 0;
  #fillBackgroundSpeed;
  #fullscreenBtn;
  #returnBtn;
  #toBeFilled = false;

  constructor(covers) {
    this.#fullscreenBtn = document.querySelector('.fullscreen');
    this.#returnBtn = document.querySelector('.return');
    this.#body = document.querySelector('body');

    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    this.#canvasForMainCover = document.createElement('canvas');
    this.#ctxForMainCover = this.#canvasForMainCover.getContext('2d');
    document.body.append(this.#canvasForMainCover);

    window.addEventListener('resize', this.resize);
    window.addEventListener('click', this.#onClickCover);
    window.addEventListener('mousemove', this.#changeCursorShape);
    this.#fullscreenBtn.addEventListener('click', () => (this.#toBeFilled = true)); // prettier-ignore
    this.#returnBtn.addEventListener('click', this.#returnToMainStage);

    this.onWebFontLoad(covers);
  }

  onWebFontLoad = (covers) => {
    WebFont.load({
      google: {
        families: ['Abril Fatface'],
      },
      fontactive: () => {
        this.#onInit(covers);
      },
    });
  };

  #onInit = (covers) => {
    this.#covers = covers;

    const coverCount = this.#covers.length;
    this.#prevSelectedIndex = Math.floor(coverCount / 2);
    this.#currentDegree = this.#prevSelectedIndex * RotaryCover.DEGREE_INTERVAL;

    this.resize();
  };

  #returnToMainStage = () => {
    this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
    this.#drawCoverItems();
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

    this.#fillBackgroundSpeed = this.#stageHeight / RotaryCover.FPS_TIME;

    this.#rotationRadius = this.#stageHeight;
    this.#rotationAxis = {
      x: this.#stageWidth / 2,
      y: (this.#stageHeight / 2) * 3,
    };

    this.#drawCoverItems();
    this.#scaleSelectedCover({ x: 1.1, y: 1.1 });

    window.requestAnimationFrame(this.animate);
  };

  #onClickCover = (clickEvent) => {
    const pos = { x: clickEvent.clientX, y: clickEvent.clientY };

    this.#clickFields.forEach((field, index) => {
      if (posInRect(pos, field)) {
        this.#setTarget(index);
        return;
      }
    });
  };

  #changeCursorShape = (mousemoveEvent) => {
    if (this.#body.style.cursor === 'pointer') {
      this.#body.style.cursor = 'default';
    }

    const pos = { x: mousemoveEvent.clientX, y: mousemoveEvent.clientY };

    this.#clickFields.forEach((field, index) => {
      if (posInRect(pos, field)) {
        this.#body.style.cursor = 'pointer';
        return;
      }
    });
  };

  #setTarget = (index) => {
    this.#rotarySpeed = RotaryCover.INIT_ROTARY_SPEED;
    this.#rotaryDirection = this.#prevSelectedIndex > index
                              ? RotaryCover.TURN_LEFT
                              : RotaryCover.TURN_RIGHT; // prettier-ignore
    this.#targetDegree = index * RotaryCover.DEGREE_INTERVAL;
    this.#prevSelectedIndex = index;
  };

  #drawCoverItems() {
    this.#clickFields = [];
    this.#currentDegree =
      (this.#currentDegree + this.#rotarySpeed * this.#rotaryDirection) % 361;

    this.#covers.forEach((cover, index) => {
      const degree = RotaryCover.DEGREE_INTERVAL * index - this.#currentDegree;
      const radian = (degree * Math.PI) / 180;

      const rotationPos = {
        x: this.#rotationAxis.x + this.#rotationRadius * Math.sin(radian),
        y: this.#rotationAxis.y - this.#rotationRadius * Math.cos(radian)  
      } // prettier-ignore

      this.#drawCover(cover, rotationPos, radian);
      this.#drawTitle(cover, rotationPos, radian);
      this.#initClickFields(rotationPos);
    });
  }

  #initClickFields(rotationPos) {
    this.#clickFields.push({
      x: rotationPos.x - RotaryCover.CLICK_FIELD_HALF_SIZE,
      y: rotationPos.y - RotaryCover.CLICK_FIELD_HALF_SIZE,
      w: RotaryCover.CLICK_FIELD_SIZE,
      h: RotaryCover.CLICK_FIELD_SIZE,
    });
  }

  #drawCover(cover, rotationPos, radian) {
    this.#ctx.save();

    this.#ctx.translate(rotationPos.x, rotationPos.y);
    this.#ctx.rotate(radian);
    cover.animate(this.#ctx);

    this.#ctx.restore();
  }

  #drawTitle(cover, rotationPos, radian) {
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
    // TODO:: day should be a variable in the class PortpolioCover
    this.#ctx.fillText(`${cover.createdDate.month}, 11`, 200, 20);

    this.#ctx.restore();
  }

  animate = (curTime) => {
    if (this.#isRotating()) {
      this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
      this.#drawCoverItems();

      if (!this.#prevRotaryState) {
        this.#ctxForMainCover.clearRect(0, 0, this.#stageWidth, this.#stageHeight); // prettier-ignore
        this.#prevRotaryState = true;
      }
    } else {
      if (this.#prevRotaryState) {
        this.#scaleSelectedCover({ x: 1.1, y: 1.1 });
        this.#prevRotaryState = false;
      }
    }

    this.#toBeFilled && this.#fillBackground();

    window.requestAnimationFrame(this.animate);
  };

  #scaleSelectedCover(ratio) {
    const degree =
      RotaryCover.DEGREE_INTERVAL * this.#prevSelectedIndex -
      this.#currentDegree;
    const radian = (degree * Math.PI) / 180;

    const rotationPos = {
    x: this.#rotationAxis.x + this.#rotationRadius * Math.sin(radian),
    y: this.#rotationAxis.y - this.#rotationRadius * Math.cos(radian)  
  } // prettier-ignore

    this.#ctxForMainCover.save();

    this.#ctxForMainCover.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
    this.#ctxForMainCover.translate(rotationPos.x, rotationPos.y);
    this.#ctxForMainCover.scale(ratio.x, ratio.y);
    this.#covers[this.#prevSelectedIndex].animate(this.#ctxForMainCover);

    this.#ctxForMainCover.restore();
  }

  #isRotating() {
    if (
      (this.#rotaryDirection == RotaryCover.TURN_RIGHT &&
        this.#currentDegree <= this.#targetDegree) ||
      (this.#rotaryDirection == RotaryCover.TURN_LEFT &&
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

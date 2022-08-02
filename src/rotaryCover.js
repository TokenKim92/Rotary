import { posInRect } from './utils.js';
import DetailCover from './detailCover.js';
import Curtain from './curtain.js';

export default class RotaryCover {
  static DEGREE_INTERVAL = 10;
  static TURN_LEFT = -1;
  static TURN_RIGHT = 1;
  static INIT_ROTARY_SPEED = 1;
  static CLICK_FIELD_SIZE = 100;
  static CLICK_FIELD_HALF_SIZE = RotaryCover.CLICK_FIELD_SIZE / 2;
  static INIT_RATIO = 1;
  static SELECTED_MODE_RATIO = 1.1;
  static DETAIL_MODE_RATIO = 2;

  #canvas;
  #ctx;
  #detailCover;
  #backgroundCurtain;
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

  #fullscreenBtn;
  #returnBtn;
  #toBeOpenedBackground = false;
  #toBeClosedBackground = false;

  constructor(covers) {
    this.#fullscreenBtn = document.querySelector('.fullscreen');
    this.#returnBtn = document.querySelector('.return');
    this.#body = document.querySelector('body');

    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    this.#backgroundCurtain = new Curtain();
    this.#detailCover = new DetailCover();

    window.addEventListener('resize', this.resize);
    window.addEventListener('click', (e) => this.#onMouseInClickField(e, this.#setTarget)); // prettier-ignore
    window.addEventListener('mousemove', this.#changeCursorShape);
    this.#fullscreenBtn.addEventListener('click', () => (this.#toBeOpenedBackground = true)); // prettier-ignore
    this.#returnBtn.addEventListener('click', () => (this.#toBeClosedBackground = true)); // prettier-ignore

    this.#onWebFontLoad(covers);
  }

  resize = () => {
    this.#stageWidth = document.body.clientWidth;
    this.#stageHeight = document.body.clientHeight;

    this.#canvas.width = this.#stageWidth;
    this.#canvas.height = this.#stageHeight;

    this.#rotationRadius = this.#stageHeight;
    this.#rotationAxis = {
      x: this.#stageWidth / 2,
      y: (this.#stageHeight / 2) * 3,
    };

    this.#backgroundCurtain.resize(this.#stageWidth, this.#stageHeight);
    this.#detailCover.resize(this.#stageWidth, this.#stageHeight);
    this.#drawCoverItems();
    this.#scaleSelectedCover(
      RotaryCover.INIT_RATIO,
      RotaryCover.SELECTED_MODE_RATIO
    );

    window.requestAnimationFrame(this.animate);
  };

  #onWebFontLoad = (covers) => {
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

  #changeCursorShape = (mousemoveEvent) => {
    if (this.#body.style.cursor === 'pointer') {
      this.#body.style.cursor = 'default';
    }

    this.#onMouseInClickField(
      mousemoveEvent,
      () => (this.#body.style.cursor = 'pointer')
    );
  };

  #onMouseInClickField = (event, handler) => {
    const pos = { x: event.clientX, y: event.clientY };

    this.#clickFields.forEach((rect, index) => {
      if (posInRect(pos, rect)) {
        handler(index);
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

  animate = () => {
    this.#isRotating() ? this.#onRotation() : this.#onNotRotation();

    this.#toBeOpenedBackground && this.#onOpenCurtain();
    this.#toBeClosedBackground && this.#onCloseCurtain();

    this.#detailCover.animate();

    window.requestAnimationFrame(this.animate);
  };

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

  #onRotation() {
    this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
    this.#drawCoverItems();

    if (!this.#prevRotaryState) {
      this.#detailCover.clear();
      this.#prevRotaryState = true;
    }
  }

  #onNotRotation() {
    if (this.#prevRotaryState) {
      this.#scaleSelectedCover(
        RotaryCover.INIT_RATIO,
        RotaryCover.SELECTED_MODE_RATIO
      );
      this.#prevRotaryState = false;
    }
  }

  #onOpenCurtain() {
    if (this.#backgroundCurtain.on()) {
      this.#scaleSelectedCover(
        RotaryCover.SELECTED_MODE_RATIO,
        RotaryCover.DETAIL_MODE_RATIO
      );
      this.#returnBtn.style.display = 'block';
      this.#toBeOpenedBackground = false;
    }
  }

  #onCloseCurtain() {
    if (this.#backgroundCurtain.off()) {
      this.#detailCover.setTargetRatio(1.1);
      this.#returnBtn.style.display = 'none';
      this.#toBeClosedBackground = false;
    }
  }

  #scaleSelectedCover(startRatio, targetRatio) {
    const degree =
      RotaryCover.DEGREE_INTERVAL * this.#prevSelectedIndex -
      this.#currentDegree;
    const radian = (degree * Math.PI) / 180;

    const rotationPos = {
      x: this.#rotationAxis.x + this.#rotationRadius * Math.sin(radian),
      y: this.#rotationAxis.y - this.#rotationRadius * Math.cos(radian)  
    } // prettier-ignore

    const cover = this.#covers[this.#prevSelectedIndex];
    this.#detailCover.init(cover, rotationPos, startRatio, targetRatio);
  }
}

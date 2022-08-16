import { PI, INVALID_ID, DONE, posInRect, isDone, isInvalidID } from './utils.js'; // prettier-ignore
import DetailCover from './detailCover.js';
import Curtain from './curtain.js';
import CircleProgressBar from './circleProgressBar.js';
import BaseCanvas from '../lib/baseCanvas.js';

export default class RotaryCover extends BaseCanvas {
  static DEGREE_INTERVAL = 10;
  static MEDIA_DEGREE_INTERVAL = RotaryCover.DEGREE_INTERVAL / 2;
  static TURN_LEFT = -1;
  static TURN_RIGHT = 1;
  static INIT_ROTARY_SPEED = 1;
  static CLICK_FIELD_SIZE = 100;
  static CLICK_FIELD_HALF_SIZE = RotaryCover.CLICK_FIELD_SIZE / 2;
  static INIT_RATIO = 1;
  static SELECTED_MODE_RATIO = 1.1;
  static DETAIL_MODE_RATIO = 2;
  static BUTTON_APPEAR_DURATION = 800;

  #detailCover;
  #backgroundCurtain;
  #progressBar = null;
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

  #leftButtons;
  #bottomButtons;
  #returnBtn;
  #fullscreenBtn;
  #toBeOpenedCurtain = false;
  #toBeClosedCurtain = false;

  #prevProgressStatus = DONE;
  #progressTimerID = INVALID_ID;
  #progressCanceled = false;
  #isCoverDisappeared = false;

  #loadedProject = null;
  #prevDisappearStatus = DONE;
  #loadProjectTimerID = INVALID_ID;

  #instances = [];

  constructor(covers, instances) {
    super(true);

    this.#leftButtons = document.querySelector('.left-buttons');
    this.#bottomButtons = document.querySelector('.bottom-buttons');
    this.#returnBtn = document.querySelector('.return');
    this.#fullscreenBtn = document.querySelector('.fullscreen');
    this.#body = document.querySelector('body');

    this.#backgroundCurtain = new Curtain();
    this.#detailCover = new DetailCover();
    this.#initProgressBar('rgb(200, 200, 200)', '#6d6d6d', 1);

    window.addEventListener('resize', this.resize);
    window.addEventListener('click', this.#moveToSelectedCover); // prettier-ignore
    window.addEventListener('mousemove', this.#changeCursorShape);
    this.#fullscreenBtn.addEventListener('click', this.#setFullscreenMode); // prettier-ignore
    this.#returnBtn.addEventListener('click', this.#setSelectMode);

    this.#onWebFontLoad(covers);

    this.#instances = instances;
    this.#instances.forEach((instance) => instance.removeFromStage());
  }

  resize = () => {
    super.resize();

    this.#rotationRadius = this.stageHeight;
    this.#rotationAxis = {
      x: this.stageWidth / 2,
      y: (this.stageHeight / 2) * 3,
    };

    this.#setSelectMode(true);

    this.#backgroundCurtain.resize();
    this.#detailCover.resize();
    this.#initProgressBar('rgb(200, 200, 200)', '#6d6d6d', 1);
    this.#drawCoverItems();
    this.#setTargetPosAndRatio(
      RotaryCover.INIT_RATIO,
      RotaryCover.SELECTED_MODE_RATIO
    );

    this.#loadedProject && this.#loadedProject.resize();
  };

  #initProgressBar(colorBackground, colorProgressBar, targetTime) {
    if (this.#progressBar) {
      this.#progressBar.clearCanvas();
      this.#progressBar = null;
    }

    const rect = this.#returnBtn.getBoundingClientRect();
    const padding = 10 * this.pixelRatio;
    const lengthByPixelRatio =
      rect.width / this.pixelRatio + padding * (2 / this.pixelRatio);

    this.#progressBar = new CircleProgressBar(
      lengthByPixelRatio,
      { background: colorBackground, progressBar: colorProgressBar },
      targetTime
    );

    this.#progressBar.setPosition(
      rect.x - rect.width * 2 - padding,
      rect.y - padding
    );
  }

  #setFullscreenMode = () => {
    window.removeEventListener('click', this.#moveToSelectedCover);
    window.removeEventListener('mousemove', this.#changeCursorShape);
    this.#bottomButtons.style.display = 'none';
    this.#toBeOpenedCurtain = true;
  };

  #setSelectMode = (toBeDirect = false) => {
    isInvalidID(this.#loadProjectTimerID) || this.#killLoadProjectTimer();
    this.#loadedProject && this.#removeLoadedProject();

    this.#isCoverDisappeared = isDone(this.#prevProgressStatus);

    if (!isInvalidID(this.#progressTimerID)) {
      this.#killProgressTimer();
      this.#isCoverDisappeared = false;
    }

    this.#progressBar.stop();
    this.#progressBar.clearCanvas();
    this.#progressCanceled = true;

    this.#leftButtons.classList.remove('left-button-on');
    this.#returnBtn.classList.remove('right-button-on');
    this.#setCloseCurtainTimer(toBeDirect);
  };

  #setCloseCurtainTimer(toBeDirect) {
    toBeDirect ? (this.#toBeClosedCurtain = true)
               : setTimeout(() => (this.#toBeClosedCurtain = true), RotaryCover.BUTTON_APPEAR_DURATION); // prettier-ignore
  }

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
    const degreeInterval = this.isMatchMedia ? RotaryCover.MEDIA_DEGREE_INTERVAL
                                             : RotaryCover.DEGREE_INTERVAL; // prettier-ignore
    this.#currentDegree = this.#prevSelectedIndex * degreeInterval;

    this.resize();
  };

  #moveToSelectedCover = (clickEvent) => {
    this.#onMouseInClickField(clickEvent, this.#setTarget);
  };

  #changeCursorShape = (mousemoveEvent) => {
    if (this.#body.style.cursor === 'pointer') {
      this.#body.style.cursor = 'default';
    }

    this.#onMouseInClickField(mousemoveEvent, () => (this.#body.style.cursor = 'pointer')); // prettier-ignore
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
    this.#rotaryDirection = this.#prevSelectedIndex > index ? RotaryCover.TURN_LEFT
                                                            : RotaryCover.TURN_RIGHT; // prettier-ignore
    const degreeInterval = this.isMatchMedia ? RotaryCover.MEDIA_DEGREE_INTERVAL
                                             : RotaryCover.DEGREE_INTERVAL; // prettier-ignore
    this.#targetDegree = index * degreeInterval;
    this.#prevSelectedIndex = index;
  };

  #drawCoverItems() {
    this.#clickFields = [];
    this.#currentDegree =
      (this.#currentDegree + this.#rotarySpeed * this.#rotaryDirection) % 361;

    this.#covers.forEach((cover, index) => {
      const degreeInterval = this.isMatchMedia ? RotaryCover.MEDIA_DEGREE_INTERVAL
                                               : RotaryCover.DEGREE_INTERVAL; // prettier-ignore
      const degree = degreeInterval * index - this.#currentDegree;
      const radian = (degree * PI) / 180;

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
    this.saveCanvas();

    this.translate(rotationPos.x, rotationPos.y);
    this.rotate(radian);
    this.isMatchMedia && this.scale(0.7, 0.7);
    this.animateTarget(cover.animate);

    this.restoreCanvas();
  }

  #drawTitle(cover, rotationPos, radian) {
    this.saveCanvas();

    const textRadian = (270 * PI) / 180;
    const posY = this.isMatchMedia ? rotationPos.y * 1.15 : rotationPos.y;
    this.translate(rotationPos.x, posY);
    this.rotate(radian + textRadian);

    const fontSize = this.isMatchMedia ? 18 : 20;
    this.setFont(`10 ${fontSize}px Arial`);
    this.setTextAlign('left');
    this.setFillStyle('#BEBCBE');
    this.fillText(cover.title, 200, 0);

    this.setFillStyle('#D0CED0');
    // TODO:: day should be a variable in the class PortpolioCover
    this.fillText(`${cover.createdDate.month}, 11`, 200, 20);

    this.restoreCanvas();
  }

  animate(curTime) {
    this.#isRotating() ? this.#onRotation() : this.#onNotRotation();

    this.#toBeOpenedCurtain && this.#onOpenCurtain();
    this.#toBeClosedCurtain && this.#onCloseCurtain();

    const animationStatus = this.#detailCover.animate();
    this.#onDisappearFinished(animationStatus.disappearStatus);

    const progressStatus = this.#progressBar.animate(curTime);
    this.#onProgressFinished(progressStatus);

    this.#loadedProject && this.#loadedProject.animate(curTime);
  }

  #isRotating() {
    return (
      (this.#rotaryDirection == RotaryCover.TURN_RIGHT && this.#currentDegree <= this.#targetDegree) ||
      (this.#rotaryDirection == RotaryCover.TURN_LEFT && this.#currentDegree >= this.#targetDegree)
    ); // prettier-ignore
  }

  #onRotation() {
    this.clearCanvas();
    this.#drawCoverItems();

    if (!this.#prevRotaryState) {
      this.#detailCover.clearCanvas();
      this.#prevRotaryState = true;
    }
  }

  #onNotRotation() {
    if (this.#prevRotaryState) {
      this.#setTargetPosAndRatio(RotaryCover.INIT_RATIO, RotaryCover.SELECTED_MODE_RATIO); // prettier-ignore
      this.#prevRotaryState = false;
    }
  }

  #onOpenCurtain() {
    if (this.#backgroundCurtain.on()) {
      this.#toBeOpenedCurtain = false;
      this.#setTargetPosAndRatio(RotaryCover.SELECTED_MODE_RATIO, RotaryCover.DETAIL_MODE_RATIO); // prettier-ignore

      this.#setShowButtonTimer();
    }
  }

  #setShowButtonTimer() {
    setTimeout(() => {
      this.#leftButtons.classList.add('left-button-on');
      this.#returnBtn.classList.add('right-button-on');

      this.#setProgressTimer();
    }, RotaryCover.BUTTON_APPEAR_DURATION);
  }

  #setProgressTimer() {
    this.#progressTimerID = setTimeout(() => {
      this.#progressBar.start();
      this.#progressTimerID = INVALID_ID;
    }, RotaryCover.BUTTON_APPEAR_DURATION);
  }

  #killProgressTimer() {
    clearTimeout(this.#progressTimerID);
    this.#progressTimerID = INVALID_ID;
  }

  #onCloseCurtain() {
    if (this.#backgroundCurtain.off()) {
      this.#progressCanceled = false;
      this.#toBeClosedCurtain = false;
      this.#bottomButtons.style.display = 'flex';

      window.addEventListener('click', this.#moveToSelectedCover);
      window.addEventListener('mousemove', this.#changeCursorShape);

      this.#isCoverDisappeared ? this.#setTargetPosAndRatio(RotaryCover.INIT_RATIO, RotaryCover.SELECTED_MODE_RATIO)
                               : this.#detailCover.setTargetRatio(RotaryCover.DETAIL_MODE_RATIO,RotaryCover.SELECTED_MODE_RATIO); // prettier-ignore
    }
  }

  #setTargetPosAndRatio(startRatio, targetRatio) {
    const degreeInterval = this.isMatchMedia ? RotaryCover.MEDIA_DEGREE_INTERVAL
                                             : RotaryCover.DEGREE_INTERVAL; // prettier-ignore
    const degree =
      degreeInterval * this.#prevSelectedIndex - this.#currentDegree;
    const radian = (degree * PI) / 180;

    const rotationPos = {
      x: this.#rotationAxis.x + this.#rotationRadius * Math.sin(radian),
      y: this.#rotationAxis.y - this.#rotationRadius * Math.cos(radian)  
    } // prettier-ignore

    const cover = this.#covers[this.#prevSelectedIndex];

    this.#detailCover.init(cover, rotationPos);
    this.#detailCover.setTargetRatio(startRatio, targetRatio);
  }

  #onProgressFinished(curStatus) {
    if (!isDone(this.#prevProgressStatus) && isDone(curStatus)) {
      this.#progressBar.clearCanvas();
      this.#progressCanceled || this.#detailCover.disappearToLeft();
    }

    this.#prevProgressStatus = curStatus;
  }

  #onDisappearFinished(curStatus) {
    if (!isDone(this.#prevDisappearStatus) && isDone(curStatus)) {
      this.#startLoadProjectTimer();
    }
    this.#prevDisappearStatus = curStatus;
  }

  #startLoadProjectTimer() {
    this.#loadProjectTimerID = setTimeout(() => {
      this.#LoadProject();
      this.#loadProjectTimerID = INVALID_ID;
    }, RotaryCover.BUTTON_APPEAR_DURATION);
  }

  #killLoadProjectTimer() {
    clearTimeout(this.#loadProjectTimerID);
    this.#loadProjectTimerID = INVALID_ID;
  }

  #LoadProject() {
    this.#loadedProject = this.#instances[this.#prevSelectedIndex];
    this.#loadedProject.bringToStage();
    this.#loadedProject.resize();
  }

  #removeLoadedProject() {
    if (this.#loadedProject) {
      this.#loadedProject.clearCanvas();
      this.#loadedProject.removeFromStage();
      this.#loadedProject = null;
    }
  }
}

import { PI, INVALID_ID, DONE, posInRect, isDone, isInvalidID, SMALL_MODE_RATIO } from './utils.js'; // prettier-ignore
import DetailCover from './detailCover.js';
import Curtain from './curtain.js';
import CircleProgressBar from './circleProgressBar.js';
import BaseCanvas from '../lib/baseCanvas.js';
import PortfolioCover from './portfolioCover.js';

export default class RotaryCover extends BaseCanvas {
  static INIT_RATIO = 1;
  static SELECTED_MODE_RATIO = 1.1;
  static DETAIL_MODE_RATIO = 2;
  static DEGREE_INTERVAL = 10;
  static MEDIA_DEGREE_INTERVAL = RotaryCover.DEGREE_INTERVAL * SMALL_MODE_RATIO; // prettier-ignore
  static TURN_LEFT = -1;
  static TURN_RIGHT = 1;
  static INIT_ROTARY_SPEED = 1;
  static BUTTON_APPEAR_DURATION = 800;
  static PROGRESS_BAR_PADDING = 10;

  #detailCover;
  #backgroundCurtain;
  #progressBar;
  #rotationRadius;
  #rotationAxis;
  #projectCovers = [];
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
  #openCoverBtn;
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
  #gitBtn;
  #touchedPosX = 0;
  #isWheelActive = false;

  constructor(projectCovers, instances) {
    super(true);

    this.#leftButtons = document.querySelector('.left-buttons');
    this.#bottomButtons = document.querySelector('.bottom-buttons');
    this.#returnBtn = document.querySelector('.return');
    this.#openCoverBtn = document.querySelector('.open-cover');
    this.#gitBtn = document.querySelector('.git');
    this.#body = document.querySelector('body');

    this.#backgroundCurtain = new Curtain();
    this.#detailCover = new DetailCover();
    this.#createProgressBar('rgb(200, 200, 200)', '#6d6d6d', 1);

    window.addEventListener('resize', this.resize);
    this.#openCoverBtn.addEventListener('click', this.#setFullscreenMode);
    this.#returnBtn.addEventListener('click', this.#setSelectMode);
    this.#addEvent();

    this.#onWebFontLoad(projectCovers);

    this.#instances = instances;
    this.#instances.forEach((instance) => instance.removeFromStage());
  }

  #addEvent() {
    window.addEventListener('touchstart', (e) => (this.#touchedPosX = e.touches[0].clientX)); // prettier-ignore
    window.addEventListener('touchend', this.#setSelectedIndexOnTouch);
    window.addEventListener('mousedown', (e) => (this.#touchedPosX = e.clientX)); // prettier-ignore
    window.addEventListener('mouseup', this.#setSelectedIndexOnClick);
    window.addEventListener('mousemove', this.#changeCursorShape);
    window.addEventListener('wheel', this.#setSelectedIndexOnWheel);
  }

  #removeEvent() {
    window.removeEventListener('touchstart', (e) => (this.#touchedPosX = e.touches[0].clientX)); // prettier-ignore
    window.removeEventListener('touchend', this.#setSelectedIndexOnTouch);
    window.removeEventListener('mousedown', (e) => (this.#touchedPosX = e.clientX)); // prettier-ignore
    window.removeEventListener('mouseup', this.#setSelectedIndexOnClick);
    window.removeEventListener('mousemove', this.#changeCursorShape);
    window.removeEventListener('wheel', this.#setSelectedIndexOnWheel);
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
    this.#drawCoverItems();
    this.#setTargetPosAndRatio(
      RotaryCover.INIT_RATIO,
      RotaryCover.SELECTED_MODE_RATIO
    );
    this.#rotarySpeed = RotaryCover.INIT_ROTARY_SPEED * this.#ratioPerWidth;

    this.#instances.forEach((instance) => instance.resize());
    const coverHalfHeight = this.isMatchMedia
      ? (PortfolioCover.COVER_RECT.h / 2) * SMALL_MODE_RATIO + 15
      : PortfolioCover.COVER_RECT.h / 2 + 30;
    this.#openCoverBtn.style.top = 
      `${this.#rotationAxis.y - this.#rotationRadius +  coverHalfHeight}px`; //prettier-ignore
  };

  #createProgressBar(colorBackground, colorProgressBar, targetTime) {
    const width = this.#returnBtn.getBoundingClientRect().width;
    this.#progressBar = new CircleProgressBar(
      width + RotaryCover.PROGRESS_BAR_PADDING * 2,
      { background: colorBackground, progressBar: colorProgressBar },
      targetTime
    );
  }

  #setFullscreenMode = () => {
    this.#removeEvent();
    this.#bottomButtons.style.display = 'none';
    this.#openCoverBtn.style.display = 'none';
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

    this.#leftButtons.style.transform = `translate(-100%, -50%)`;
    this.#returnBtn.style.transform = `translate(100%, -50%)`;
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

  #onInit = (projectCovers) => {
    this.#projectCovers = projectCovers;

    const coverCount = this.#projectCovers.length;
    this.#prevSelectedIndex = Math.floor(coverCount / 2);
    const degreeInterval = this.isMatchMedia ? RotaryCover.MEDIA_DEGREE_INTERVAL
                                             : RotaryCover.DEGREE_INTERVAL; // prettier-ignore
    this.#currentDegree = this.#prevSelectedIndex * degreeInterval;

    this.resize();
  };

  #setSelectedIndexOnClick = (clickEvent) => {
    const pos = { x: clickEvent.clientX, y: clickEvent.clientY };

    for (let i = 0; i < this.#clickFields.length; i++) {
      if (posInRect(pos, this.#clickFields[i])) {
        this.#setTarget(i);
        return;
      }
    }

    const deltaX = clickEvent.clientX - this.#touchedPosX;
    if (!deltaX) {
      return;
    }

    const index = this.#calculateSelectedIndex(deltaX > 0); // prettier-ignore
    this.#setTarget(index);
  };

  #setSelectedIndexOnTouch = (touchEvent) => {
    const deltaX = touchEvent.changedTouches[0].clientX - this.#touchedPosX;
    if (!deltaX) {
      return;
    }

    const index = this.#calculateSelectedIndex(deltaX > 0); // prettier-ignore
    this.#setTarget(index);
  };

  #setSelectedIndexOnWheel = (wheelEvent) => {
    if (this.#isWheelActive) {
      return;
    }

    const index = this.#calculateSelectedIndex(wheelEvent.deltaY > 0);
    this.#setTarget(index);
    this.#isWheelActive = true;
  };

  #calculateSelectedIndex(isRightSwipe) {
    const wasLastIndex = this.#prevSelectedIndex === this.#projectCovers.length - 1; // prettier-ignore
    const wasZero = this.#prevSelectedIndex === 0;
    if (isRightSwipe) {
      return wasLastIndex
        ? this.#prevSelectedIndex
        : this.#prevSelectedIndex + 1;
    }

    return wasZero ? 0 : this.#prevSelectedIndex - 1;
  }

  #changeCursorShape = (mousemoveEvent) => {
    if (this.#body.style.cursor === 'pointer') {
      this.#body.style.cursor = 'default';
    }

    const pos = { x: mousemoveEvent.clientX, y: mousemoveEvent.clientY };

    this.#clickFields.forEach((rect, index) => {
      if (posInRect(pos, rect)) {
        this.#body.style.cursor = 'pointer';
        return;
      }
    });
  };

  #setTarget = (index) => {
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

    this.#projectCovers.forEach((projectCover, index) => {
      const degreeInterval = this.isMatchMedia ? RotaryCover.MEDIA_DEGREE_INTERVAL
                                               : RotaryCover.DEGREE_INTERVAL; // prettier-ignore
      const degree = degreeInterval * index - this.#currentDegree;
      const radian = (degree * PI) / 180;

      const rotationPos = {
        x: this.#rotationAxis.x + this.#rotationRadius * Math.sin(radian),
        y: this.#rotationAxis.y - this.#rotationRadius * Math.cos(radian)  
      } // prettier-ignore

      this.#drawCover(projectCover.cover, rotationPos, radian);
      this.#drawTitle(projectCover.cover, rotationPos, radian);
      this.#initClickFields(rotationPos);
    });
  }

  #initClickFields(rotationPos) {
    const width = PortfolioCover.COVER_RECT.w * this.#ratioPerWidth;
    const height = PortfolioCover.COVER_RECT.h * this.#ratioPerWidth;
    this.#clickFields.push({
      x: rotationPos.x - width / 2,
      y: rotationPos.y - height / 2,
      w: width,
      h: height,
    });
  }

  get #ratioPerWidth() {
    switch (this.sizeMode) {
      case BaseCanvas.SMALL_MODE:
        return SMALL_MODE_RATIO;
      default:
        return 1;
    }
  }

  #drawCover(cover, rotationPos, radian) {
    this.ctx.save();

    this.ctx.translate(rotationPos.x, rotationPos.y);
    this.ctx.rotate(radian);
    this.isMatchMedia && this.ctx.scale(SMALL_MODE_RATIO, SMALL_MODE_RATIO); // prettier-ignore
    cover.animate(this.ctx);

    this.ctx.restore();
  }

  #drawTitle(cover, rotationPos, radian) {
    this.ctx.save();

    const textRadian = (270 * PI) / 180;
    const posY = this.isMatchMedia ? rotationPos.y * 1.15 : rotationPos.y;
    this.ctx.translate(rotationPos.x, posY);
    this.ctx.rotate(radian + textRadian);

    const fontSize = this.isMatchMedia ? 18 : 20;
    this.ctx.font = `10 ${fontSize}px Arial`;
    this.ctx.textAlign = 'left';
    this.ctx.illStyle = '#BEBCBE';
    this.ctx.fillText(cover.title, 200, 0);

    this.ctx.fillStyle = '#D0CED0';
    // TODO:: day should be a variable in the class PortpolioCover
    this.ctx.fillText(`${cover.createdDate.month}, 11`, 200, 20);

    this.ctx.restore();
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

    if (this.#isWheelActive) {
      this.#isWheelActive = false;
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
      const btnVisiblePosX = this.isMatchMedia ? 20 : 100;
      this.#leftButtons.style.transform = `translate(${btnVisiblePosX}%, -50%)`;
      this.#returnBtn.style.transform = `translate(-${btnVisiblePosX}%, -50%)`;

      const rect = this.#returnBtn.getBoundingClientRect();
      const ratio = 1 + btnVisiblePosX / 100;
      this.#progressBar.setPosition(
        rect.x - rect.width * ratio - RotaryCover.PROGRESS_BAR_PADDING,
        rect.y - RotaryCover.PROGRESS_BAR_PADDING
      );
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
      this.#openCoverBtn.style.display = 'block';

      this.#addEvent();

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

    const cover = this.#projectCovers[this.#prevSelectedIndex].cover;

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

    this.#gitBtn.innerHTML = `
    <a href='${this.#projectCovers[this.#prevSelectedIndex].url}' target='blank'>
      <i class="fa-brands fa-github"></i>
    </a>`; //prettier-ignore
  }

  #removeLoadedProject() {
    if (this.#loadedProject) {
      this.#loadedProject.clearCanvas();
      this.#loadedProject.removeFromStage();
      this.#loadedProject = null;
    }
  }
}

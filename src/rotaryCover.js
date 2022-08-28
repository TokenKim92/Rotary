import { 
  PI, INVALID_ID, DONE, posInRect, isDone, isInvalidID, 
  SMALL_MODE_RATIO, LARGE_MODE_RATIO,
} from './utils.js'; // prettier-ignore
import DetailCover from './detailCover.js';
import Curtain from './curtain.js';
import CircleProgressBar from './circleProgressBar.js';
import BaseCanvas from '../lib/baseCanvas.js';
import PortfolioCover from './portfolioCover.js';
import TypingBanner from './typingBanner.js';

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
  #closeCoverButton;
  #gitButton;
  #aboutMeButton;
  #toBeOpenedCurtain = false;
  #toBeClosedCurtain = false;

  #prevProgressStatus = DONE;
  #progressTimerID = INVALID_ID;
  #progressCanceled = false;
  #isCoverDisappeared = false;

  #loadedProject = null;
  #prevDisappearStatus = DONE;
  #loadProjectTimerID = INVALID_ID;

  #projects = [];
  #touchedPosX = 0;
  #isWheelActive = false;
  #introductionBanner;

  constructor(projectCovers, projects) {
    super(true);

    this.#projectCovers = projectCovers;
    this.#prevSelectedIndex = Math.floor(this.#projectCovers.length / 2);
    this.#currentDegree = this.#prevSelectedIndex * this.#degreeInterval;

    this.#projects = projects;
    this.#projects.forEach((project) => project.removeFromStage());

    this.#leftButtons = document.querySelector('.left-buttons');
    this.#bottomButtons = document.querySelector('.bottom-buttons');
    this.#closeCoverButton = document.querySelector('.close-cover');
    this.#gitButton = document.querySelector('.git');
    this.#aboutMeButton = document.querySelector('.about-me');
    this.#body = document.querySelector('body');

    this.#backgroundCurtain = new Curtain();
    this.#detailCover = new DetailCover();
    this.#progressBar = new CircleProgressBar(
      this.#closeCoverButton.getBoundingClientRect().width + RotaryCover.PROGRESS_BAR_PADDING * 2,
      { background: 'rgb(200, 200, 200)', progressBar: '#6d6d6d' },
      1); // prettier-ignore
    this.#introductionBanner = new TypingBanner('Fjalla One', 30);

    window.addEventListener('resize', this.resize);
    this.#closeCoverButton.addEventListener('click', this.#closeCover);
    this.#aboutMeButton.addEventListener('click', () =>{
      
      this.#introductionBanner.initTyping();
      this.#introductionBanner.setMessage();
      this.#introductionBanner.show(300)
    }); //prettier-ignore
    this.#addEventToSelectCover();

    this.resize();
    this.#introductionBanner.show(300);
  }

  #addEventToSelectCover() {
    window.addEventListener('touchstart', (e) => {
      this.#touchedPosX = e.touches[0].clientX;
    });
    window.addEventListener('touchend', this.#setSelectedIndexOnTouch);
    window.addEventListener('mousedown', (e) => {
      this.#touchedPosX = e.clientX;
      this.#introductionBanner.hide();
    });
    window.addEventListener('mouseup', this.#setSelectedIndexOnClick);
    window.addEventListener('mousemove', this.#changeCursorShape);
    window.addEventListener('wheel', this.#setSelectedIndexOnWheel);
  }

  #removeEventFromSelectCover() {
    window.removeEventListener('touchstart', (e) => (this.#touchedPosX = e.touches[0].clientX)); // prettier-ignore
    window.removeEventListener('touchend', this.#setSelectedIndexOnTouch);
    window.removeEventListener('mousedown', (e) => (this.#touchedPosX = e.clientX)); // prettier-ignore
    window.removeEventListener('mouseup', this.#setSelectedIndexOnClick);
    window.removeEventListener('mousemove', this.#changeCursorShape);
    window.removeEventListener('wheel', this.#setSelectedIndexOnWheel);
  }

  resize = () => {
    super.resize();
    this.#backgroundCurtain.resize();
    this.#detailCover.resize();
    this.#introductionBanner.resize();

    this.#rotarySpeed = RotaryCover.INIT_ROTARY_SPEED * this.#ratioPerWidth;
    this.#rotationRadius = this.stageHeight;
    this.#rotationAxis = {
      x: this.stageWidth / 2,
      y: (this.stageHeight / 2) * 3,
    };
    this.#currentDegree = this.#prevSelectedIndex * this.#degreeInterval;
    //this.#closeCover(true); //TODO:: It is important, but because of this events are added double.
    this.#drawCovers();
    this.#setDetailCoverRatio(
      RotaryCover.INIT_RATIO,
      RotaryCover.SELECTED_MODE_RATIO
    );

    this.#projects.forEach((project) => project.resize());
    this.#introductionBanner.resize();
    this.#introductionBanner.show(300);
  };

  #openCover() {
    this.#removeEventFromSelectCover();
    this.#bottomButtons.style.display = 'none';
    this.#toBeOpenedCurtain = true;
  }

  #closeCover = (toBeDirect = false) => {
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
    this.#closeCoverButton.style.transform = `translate(100%, -50%)`;
    toBeDirect
      ? (this.#toBeClosedCurtain = true)
      : this.#setCloseCurtainTimer();
  };

  #setCloseCurtainTimer() {
    setTimeout(
      () => (this.#toBeClosedCurtain = true),
      RotaryCover.BUTTON_APPEAR_DURATION
    );
  }

  #setSelectedIndexOnClick = (clickEvent) => {
    const pos = { x: clickEvent.clientX, y: clickEvent.clientY };

    for (let i = 0; i < this.#clickFields.length; i++) {
      if (posInRect(pos, this.#clickFields[i])) {
        if (i === this.#prevSelectedIndex) {
          this.#openCover();
          this.#body.style.cursor = 'default';
          return;
        }

        this.#setTargetCover(i);
        return;
      }
    }

    const deltaX = clickEvent.clientX - this.#touchedPosX;
    if (deltaX) {
      const index = this.#calculateSelectedIndex(deltaX > 0); // prettier-ignore
      index === this.#prevSelectedIndex || this.#setTargetCover(index);
    }
  };

  #setSelectedIndexOnTouch = (touchEvent) => {
    const deltaX = touchEvent.changedTouches[0].clientX - this.#touchedPosX;
    const tolerant = 5;
    if (Math.abs(deltaX) > tolerant) {
      const index = this.#calculateSelectedIndex(deltaX < 0); // prettier-ignore
      index === this.#prevSelectedIndex || this.#setTargetCover(index);
    }
  };

  #setSelectedIndexOnWheel = (wheelEvent) => {
    if (!this.#isWheelActive) {
      const index = this.#calculateSelectedIndex(wheelEvent.deltaY > 0);
      index === this.#prevSelectedIndex || this.#setTargetCover(index);
      this.#isWheelActive = true;
    }
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
    const pos = { x: mousemoveEvent.clientX, y: mousemoveEvent.clientY };
    for (let i = 0; i < this.#clickFields.length; i++) {
      if (posInRect(pos, this.#clickFields[i])) {
        this.#body.style.cursor !== 'pointer' && (this.#body.style.cursor = 'pointer'); //prettier-ignore
        return;
      }
    }

    this.#body.style.cursor !== 'default' && (this.#body.style.cursor = 'default'); //prettier-ignore
  };

  #setTargetCover = (index) => {
    this.#rotaryDirection = this.#prevSelectedIndex > index ? RotaryCover.TURN_LEFT
                                                            : RotaryCover.TURN_RIGHT; // prettier-ignore
    this.#targetDegree = index * this.#degreeInterval;
    this.#prevSelectedIndex = index;
  };

  #drawCovers() {
    this.#clickFields = [];

    this.#projectCovers.forEach((projectCover, index) => {
      const degree = this.#degreeInterval * index - this.#currentDegree;
      const radian = (degree * PI) / 180;

      const rotationPos = {
        x: this.#rotationAxis.x + this.#rotationRadius * Math.sin(radian),
        y: this.#rotationAxis.y - this.#rotationRadius * Math.cos(radian)  
      } // prettier-ignore

      this.#drawCover(projectCover.cover, rotationPos, radian);
      this.#drawTitle(projectCover.cover, rotationPos, radian);
      this.#calculateClickFields(rotationPos);
    });
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
    const posX = this.isMatchMedia ? 170 : 200;
    this.ctx.illStyle = '#BEBCBE';
    this.ctx.fillText(cover.title, posX, 0);

    this.ctx.fillStyle = '#D0CED0';
    this.ctx.fillText(
      `${cover.createdDate.month}, ${cover.createdDate.day}`,
      posX,
      30
    );

    this.ctx.restore();
  }

  #calculateClickFields(rotationPos) {
    const width = PortfolioCover.COVER_RECT.w * this.#ratioPerWidth;
    const height = PortfolioCover.COVER_RECT.h * this.#ratioPerWidth;
    this.#clickFields.push({
      x: rotationPos.x - width / 2,
      y: rotationPos.y - height / 2,
      w: width,
      h: height,
    });
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
    this.#introductionBanner.animate(curTime);
  }

  #isRotating() {
    return (
      (this.#rotaryDirection == RotaryCover.TURN_RIGHT && this.#currentDegree < this.#targetDegree) ||
      (this.#rotaryDirection == RotaryCover.TURN_LEFT && this.#currentDegree > this.#targetDegree)
    ); // prettier-ignore
  }

  #onRotation() {
    this.clearCanvas();

    this.#currentDegree = (this.#currentDegree + this.#rotarySpeed * this.#rotaryDirection) % 361; // prettier-ignore
    this.#currentDegree = this.#currentDegree < 0 ? 0 : this.#currentDegree;
    this.#drawCovers();

    if (!this.#prevRotaryState) {
      this.#detailCover.reset();
      this.#prevRotaryState = true;
    }
  }

  #onNotRotation() {
    if (this.#prevRotaryState) {
      this.#setDetailCoverRatio(RotaryCover.INIT_RATIO, RotaryCover.SELECTED_MODE_RATIO); // prettier-ignore
      this.#prevRotaryState = false;
    }

    if (this.#isWheelActive) {
      this.#isWheelActive = false;
    }
  }

  #onOpenCurtain() {
    if (this.#backgroundCurtain.on()) {
      this.#toBeOpenedCurtain = false;
      this.#setDetailCoverRatio(RotaryCover.SELECTED_MODE_RATIO, RotaryCover.DETAIL_MODE_RATIO); // prettier-ignore

      this.#setShowButtonTimer();
    }
  }

  #setShowButtonTimer() {
    setTimeout(() => {
      const btnVisiblePosX = this.isMatchMedia ? 20 : 100;
      this.#leftButtons.style.transform = `translate(${btnVisiblePosX}%, -50%)`;
      this.#closeCoverButton.style.transform = `translate(-${btnVisiblePosX}%, -50%)`;

      const rect = this.#closeCoverButton.getBoundingClientRect();
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

      this.#addEventToSelectCover();

      this.#isCoverDisappeared ? this.#setDetailCoverRatio(RotaryCover.INIT_RATIO, RotaryCover.SELECTED_MODE_RATIO)
                               : this.#detailCover.setTargetRatio(RotaryCover.DETAIL_MODE_RATIO,RotaryCover.SELECTED_MODE_RATIO); // prettier-ignore
    }
  }

  #setDetailCoverRatio(startRatio, targetRatio) {
    const cover = this.#projectCovers[this.#prevSelectedIndex].cover;
    this.#detailCover.init(cover);
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
      this.#setLoadProjectTimer();
    }
    this.#prevDisappearStatus = curStatus;
  }

  #setLoadProjectTimer() {
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
    this.#loadedProject = this.#projects[this.#prevSelectedIndex];
    this.#loadedProject.bringToStage();
    this.#loadedProject.resize();

    this.#gitButton.innerHTML = `
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

  get #ratioPerWidth() {
    switch (this.sizeMode) {
      case BaseCanvas.SMALL_MODE:
        return SMALL_MODE_RATIO;
      case BaseCanvas.LARGE_MODE:
        return LARGE_MODE_RATIO;
      default:
        return 1;
    }
  }

  get #degreeInterval() {
    return this.isMatchMedia
      ? RotaryCover.MEDIA_DEGREE_INTERVAL
      : RotaryCover.DEGREE_INTERVAL;
  }
}
